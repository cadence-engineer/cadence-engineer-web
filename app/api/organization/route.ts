import { NextRequest, NextResponse } from "next/server";
import {
  fetchCadenceApi,
  getCadenceRedirectDetails,
} from "@/lib/server/cadence-api";
import {
  AUTH_COOKIE_NAMES,
  createUnauthorizedResponse,
} from "@/lib/server/auth-cookies";

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

function createRedirectErrorResponse(
  request: NextRequest,
  response: Response,
  reason: string,
) {
  const redirectDetails = getCadenceRedirectDetails(request, response);

  return NextResponse.json(
    {
      reason,
      code: redirectDetails.reauthUrl ? "reauth_required" : "upstream_redirect",
      reauthUrl: redirectDetails.reauthUrl,
      upstreamLocation: redirectDetails.upstreamLocation,
      redirectStatus: redirectDetails.status,
    },
    { status: 409 },
  );
}

export async function GET(request: NextRequest) {
  const accessToken = getAccessToken(request);

  if (!accessToken) {
    return createUnauthorizedResponse();
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
      return createRedirectErrorResponse(
        request,
        response,
        "Reauthentication required",
      );
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

      if (response.status === 401 || response.status === 403) {
        return createUnauthorizedResponse("Unauthorized", response.status);
      }

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

export async function PUT() {
  return NextResponse.json(
    { reason: "Use POST /api/setup to assign and initialize an organization." },
    { status: 405 },
  );
}
