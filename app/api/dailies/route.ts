import { NextRequest, NextResponse } from "next/server";
import {
  fetchCadenceApi,
  getCadenceRedirectDetails,
} from "@/lib/server/cadence-api";
import { AUTH_COOKIE_NAMES } from "@/lib/server/auth-cookies";
import { isDaily } from "@/lib/daily/types";

function getAccessToken(request: NextRequest): string | null {
  return request.cookies.get(AUTH_COOKIE_NAMES.access)?.value ?? null;
}

function createRedirectErrorResponse(request: NextRequest, response: Response) {
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

export async function GET(request: NextRequest) {
  const accessToken = getAccessToken(request);

  if (!accessToken) {
    return NextResponse.json({ reason: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetchCadenceApi("/v1/dailies", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      redirect: "manual",
    });

    if (response.status >= 300 && response.status < 400) {
      return createRedirectErrorResponse(request, response);
    }

    if (!response.ok) {
      let backendError = "<failed to read backend error>";
      try {
        backendError = await response.text();
      } catch (error) {
        console.error("Failed reading dailies error body", error);
      }

      console.error("BFF dailies request failed", {
        status: response.status,
        backendError,
      });

      return NextResponse.json(
        { reason: "Failed to fetch dailies" },
        { status: response.status },
      );
    }

    const payload = (await response.json()) as unknown;
    const dailies = Array.isArray(payload) ? payload.filter(isDaily) : [];

    return NextResponse.json({ dailies });
  } catch (error) {
    console.error("BFF dailies request crashed", error);
    return NextResponse.json({ reason: "Failed to fetch dailies" }, { status: 502 });
  }
}
