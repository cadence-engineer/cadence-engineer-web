import { NextRequest, NextResponse } from "next/server";
import { fetchCadenceApi } from "@/lib/server/cadence-api";
import { AUTH_COOKIE_NAMES } from "@/lib/server/auth-cookies";

type OrganizationResponse = {
  login: string;
};

function isOrganizationResponse(value: unknown): value is OrganizationResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const maybeOrganization = value as Record<string, unknown>;
  return typeof maybeOrganization.login === "string";
}

function getAccessToken(request: NextRequest): string | null {
  return request.cookies.get(AUTH_COOKIE_NAMES.access)?.value ?? null;
}

export async function GET(request: NextRequest) {
  const accessToken = getAccessToken(request);

  if (!accessToken) {
    return NextResponse.json({ reason: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetchCadenceApi("/v1/organization", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      redirect: "manual",
    });

    if (response.status >= 300 && response.status < 400) {
      return NextResponse.json({ login: null });
    }

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ login: null });
      }

      let backendError = "<failed to read backend error>";
      try {
        backendError = await response.text();
      } catch (error) {
        console.error("Failed reading organization error body", error);
      }

      console.error("BFF organization request failed", {
        status: response.status,
        backendError,
      });

      return NextResponse.json(
        { reason: "Failed to fetch organization" },
        { status: response.status },
      );
    }

    const payload = (await response.json()) as unknown;
    if (!isOrganizationResponse(payload)) {
      console.error("Organization payload has invalid shape", payload);
      return NextResponse.json(
        { reason: "Failed to fetch organization" },
        { status: 502 },
      );
    }

    return NextResponse.json({ login: payload.login });
  } catch (error) {
    console.error("BFF organization request crashed", error);
    return NextResponse.json(
      { reason: "Failed to fetch organization" },
      { status: 502 },
    );
  }
}

export async function PUT(request: NextRequest) {
  const accessToken = getAccessToken(request);

  if (!accessToken) {
    return NextResponse.json({ reason: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ reason: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ reason: "Invalid login" }, { status: 400 });
  }

  const maybeBody = body as Record<string, unknown>;
  if (
    typeof maybeBody.login !== "string" ||
    maybeBody.login.trim().length === 0
  ) {
    return NextResponse.json({ reason: "Invalid login" }, { status: 400 });
  }

  const login = maybeBody.login.trim();

  try {
    const response = await fetchCadenceApi("/v1/organization", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ login }),
      redirect: "manual",
    });

    if (response.status >= 300 && response.status < 400) {
      return NextResponse.json({ reason: "Failed to update organization" }, { status: 409 });
    }

    if (!response.ok) {
      let backendError = "<failed to read backend error>";
      try {
        backendError = await response.text();
      } catch (error) {
        console.error("Failed reading organization update error body", error);
      }

      console.error("BFF organization update failed", {
        status: response.status,
        backendError,
      });

      return NextResponse.json(
        { reason: "Failed to update organization" },
        { status: response.status },
      );
    }

    const payload = (await response.json()) as unknown;
    if (!isOrganizationResponse(payload)) {
      console.error("Organization update payload has invalid shape", payload);
      return NextResponse.json(
        { reason: "Failed to update organization" },
        { status: 502 },
      );
    }

    return NextResponse.json({ login: payload.login });
  } catch (error) {
    console.error("BFF organization update crashed", error);
    return NextResponse.json(
      { reason: "Failed to update organization" },
      { status: 502 },
    );
  }
}
