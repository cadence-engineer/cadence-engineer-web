import { NextRequest, NextResponse } from "next/server";
import {
  fetchCadenceApi,
  getCadenceRedirectDetails,
} from "@/lib/server/cadence-api";
import {
  AUTH_COOKIE_NAMES,
  createUnauthorizedResponse,
} from "@/lib/server/auth-cookies";

type Organization = {
  login: string;
};

function isOrganization(value: unknown): value is Organization {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const maybeOrganization = value as Record<string, unknown>;
  return typeof maybeOrganization.login === "string";
}

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get(AUTH_COOKIE_NAMES.access)?.value;

  if (!accessToken) {
    return createUnauthorizedResponse();
  }

  try {
    const response = await fetchCadenceApi("/v1/available-organizations", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      redirect: "manual",
    });

    if (response.status >= 300 && response.status < 400) {
      const redirectDetails = getCadenceRedirectDetails(request, response);

      return NextResponse.json(
        {
          reason: "Reauthentication required",
          code: redirectDetails.reauthUrl ? "reauth_required" : "upstream_redirect",
          reauthUrl: redirectDetails.reauthUrl,
          upstreamLocation: redirectDetails.upstreamLocation,
          redirectStatus: redirectDetails.status,
        },
        { status: 409 },
      );
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

      if (response.status === 401 || response.status === 403) {
        return createUnauthorizedResponse("Unauthorized", response.status);
      }

      return NextResponse.json(
        { reason: "Failed to fetch organizations" },
        { status: response.status },
      );
    }

    const payload = (await response.json()) as unknown;
    const organizations = Array.isArray(payload)
      ? payload
          .filter(isOrganization)
          .map((organization) => ({
            login: organization.login,
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
