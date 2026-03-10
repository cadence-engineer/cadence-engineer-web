import { NextRequest, NextResponse } from "next/server";
import { fetchCadenceApi } from "@/lib/server/cadence-api";
import { AUTH_COOKIE_NAMES } from "@/lib/server/auth-cookies";

type Organization = {
  id: number;
  name: string;
  url: string;
};

type OrganizationsResponse = {
  organizations: Organization[];
};

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get(AUTH_COOKIE_NAMES.access)?.value;

  if (!accessToken) {
    return NextResponse.json({ reason: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetchCadenceApi("/v1/organizations", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      redirect: "manual",
    });

    if (response.status >= 300 && response.status < 400) {
      return NextResponse.json({ organizations: [] satisfies Organization[] });
    }

    if (!response.ok) {
      let backendError = "<failed to read backend error>";
      try {
        backendError = await response.text();
      } catch (error) {
        console.error("Failed reading organizations error body", error);
      }

      console.error("BFF organizations request failed", {
        status: response.status,
        backendError,
      });

      return NextResponse.json(
        { reason: "Failed to fetch organizations" },
        { status: response.status },
      );
    }

    const payload = (await response.json()) as OrganizationsResponse;
    const organizations = Array.isArray(payload.organizations)
      ? payload.organizations
          .filter((organization) => {
            if (!organization || typeof organization !== "object") {
              return false;
            }

            return (
              typeof organization.id === "number" &&
              typeof organization.name === "string" &&
              typeof organization.url === "string"
            );
          })
          .map((organization) => ({
            id: organization.id,
            name: organization.name,
            url: organization.url,
          }))
      : [];

    return NextResponse.json({ organizations });
  } catch (error) {
    console.error("BFF organizations request crashed", error);
    return NextResponse.json(
      { reason: "Failed to fetch organizations" },
      { status: 502 },
    );
  }
}
