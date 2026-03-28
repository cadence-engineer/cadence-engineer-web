import { NextRequest, NextResponse } from "next/server";
import {
  fetchCadenceApi,
  getCadenceRedirectDetails,
} from "@/lib/server/cadence-api";
import { AUTH_COOKIE_NAMES } from "@/lib/server/auth-cookies";

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

async function readBackendReason(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as unknown;
    if (typeof payload === "object" && payload !== null) {
      const maybePayload = payload as Record<string, unknown>;
      if (typeof maybePayload.reason === "string" && maybePayload.reason.length > 0) {
        return maybePayload.reason;
      }
    }
  } catch (error) {
    console.error("Failed reading setup error payload", error);
  }

  return "Setup request failed";
}

export async function GET(request: NextRequest) {
  const accessToken = getAccessToken(request);

  if (!accessToken) {
    return NextResponse.json({ reason: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetchCadenceApi("/v1/setup", {
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
        const backendReason = await readBackendReason(response);
        return NextResponse.json({ reason: backendReason }, { status: 404 });
      }

      const backendReason = await readBackendReason(response);
      console.error("BFF setup request failed", {
        status: response.status,
        backendReason,
      });

      return NextResponse.json({ reason: backendReason }, { status: response.status });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("BFF setup request crashed", error);
    return NextResponse.json({ reason: "Failed to fetch setup" }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
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
    const response = await fetchCadenceApi("/v1/setup", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ login }),
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
      const backendReason = await readBackendReason(response);
      console.error("BFF setup start failed", {
        status: response.status,
        backendReason,
      });

      return NextResponse.json({ reason: backendReason }, { status: response.status });
    }

    return new NextResponse(null, { status: 202 });
  } catch (error) {
    console.error("BFF setup start crashed", error);
    return NextResponse.json({ reason: "Failed to start setup" }, { status: 502 });
  }
}
