import { NextRequest, NextResponse } from "next/server";
import {
  fetchCadenceApi,
  getCadenceRedirectDetails,
} from "@/lib/server/cadence-api";
import { createUnauthorizedResponse } from "@/lib/server/auth-cookies";
import { getValidAccessTokenFromRequest } from "@/lib/server/access-token";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

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

async function readBackendReason(response: Response, fallbackReason: string): Promise<string> {
  try {
    const payload = (await response.json()) as unknown;
    if (typeof payload === "object" && payload !== null) {
      const maybePayload = payload as Record<string, unknown>;
      if (typeof maybePayload.reason === "string" && maybePayload.reason.length > 0) {
        return maybePayload.reason;
      }
    }
  } catch (error) {
    console.error("Failed reading daily retry error payload", error);
  }

  return fallbackReason;
}

export async function POST(request: NextRequest, context: RouteContext) {
  const accessToken = getValidAccessTokenFromRequest(request);

  if (!accessToken) {
    return createUnauthorizedResponse();
  }

  const { id } = await context.params;

  try {
    const response = await fetchCadenceApi(`/v1/dailies/${id}/retry`, {
      method: "POST",
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
      const backendReason = await readBackendReason(response, "Failed to retry daily");
      console.error("BFF daily retry failed", {
        id,
        status: response.status,
        backendReason,
      });

      if (response.status === 401 || response.status === 403) {
        return createUnauthorizedResponse("Unauthorized", response.status);
      }

      return NextResponse.json({ reason: backendReason }, { status: response.status });
    }

    return new NextResponse(null, { status: 202 });
  } catch (error) {
    console.error("BFF daily retry crashed", { id, error });
    return NextResponse.json({ reason: "Failed to retry daily" }, { status: 502 });
  }
}
