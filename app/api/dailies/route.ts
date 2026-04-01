import { NextRequest, NextResponse } from "next/server";
import {
  fetchCadenceApi,
  getCadenceRedirectDetails,
} from "@/lib/server/cadence-api";
import { createUnauthorizedResponse } from "@/lib/server/auth-cookies";
import { getValidAccessTokenFromRequest } from "@/lib/server/access-token";
import { parseDaily } from "@/lib/daily/types";

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
    console.error("Failed reading dailies error payload", error);
  }

  return fallbackReason;
}

export async function GET(request: NextRequest) {
  const accessToken = getValidAccessTokenFromRequest(request);

  if (!accessToken) {
    return createUnauthorizedResponse();
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

      if (response.status === 401 || response.status === 403) {
        return createUnauthorizedResponse("Unauthorized", response.status);
      }

      return NextResponse.json(
        { reason: "Failed to fetch dailies" },
        { status: response.status },
      );
    }

    const payload = (await response.json()) as unknown;
    const dailies = Array.isArray(payload)
      ? payload.flatMap((item) => {
          const daily = parseDaily(item);
          return daily ? [daily] : [];
        })
      : [];

    return NextResponse.json({ dailies });
  } catch (error) {
    console.error("BFF dailies request crashed", error);
    return NextResponse.json({ reason: "Failed to fetch dailies" }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  const accessToken = getValidAccessTokenFromRequest(request);

  if (!accessToken) {
    return createUnauthorizedResponse();
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ reason: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ reason: "Invalid daily day" }, { status: 400 });
  }

  const maybeBody = body as Record<string, unknown>;
  if (typeof maybeBody.day !== "string" || maybeBody.day.trim().length === 0) {
    return NextResponse.json({ reason: "Invalid daily day" }, { status: 400 });
  }

  try {
    const response = await fetchCadenceApi("/v1/dailies", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ day: maybeBody.day.trim() }),
      redirect: "manual",
    });

    if (response.status >= 300 && response.status < 400) {
      return createRedirectErrorResponse(request, response);
    }

    if (!response.ok) {
      const backendReason = await readBackendReason(response, "Failed to create daily");
      console.error("BFF daily creation failed", {
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
    console.error("BFF daily creation crashed", error);
    return NextResponse.json({ reason: "Failed to create daily" }, { status: 502 });
  }
}
