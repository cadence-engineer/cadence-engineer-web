import { NextRequest, NextResponse } from "next/server";
import {
  fetchCadenceApi,
  getCadenceRedirectDetails,
} from "@/lib/server/cadence-api";
import { AUTH_COOKIE_NAMES } from "@/lib/server/auth-cookies";
import { isDaily } from "@/lib/daily/types";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

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

export async function GET(request: NextRequest, context: RouteContext) {
  const accessToken = getAccessToken(request);

  if (!accessToken) {
    return NextResponse.json({ reason: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const response = await fetchCadenceApi(`/v1/dailies/${id}`, {
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
        console.error("Failed reading daily error body", error);
      }

      console.error("BFF daily request failed", {
        id,
        status: response.status,
        backendError,
      });

      return NextResponse.json(
        { reason: response.status === 404 ? "Daily not found" : "Failed to fetch daily" },
        { status: response.status },
      );
    }

    const payload = (await response.json()) as unknown;
    if (!isDaily(payload)) {
      console.error("Daily payload has invalid shape", payload);
      return NextResponse.json({ reason: "Failed to fetch daily" }, { status: 502 });
    }

    return NextResponse.json({ daily: payload });
  } catch (error) {
    console.error("BFF daily request crashed", { id, error });
    return NextResponse.json({ reason: "Failed to fetch daily" }, { status: 502 });
  }
}
