import { NextRequest, NextResponse } from "next/server";
import { fetchCadenceApi } from "@/lib/server/cadence-api";
import { createUnauthorizedResponse } from "@/lib/server/auth-cookies";
import { getValidAccessTokenFromRequest } from "@/lib/server/access-token";

type UserNameResponse = {
  name: string;
};

function isUserNameResponse(value: unknown): value is UserNameResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const maybeUserName = value as Record<string, unknown>;
  return typeof maybeUserName.name === "string";
}

export async function GET(request: NextRequest) {
  const accessToken = getValidAccessTokenFromRequest(request);

  if (!accessToken) {
    return createUnauthorizedResponse();
  }

  try {
    const response = await fetchCadenceApi("/v1/user/name", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      redirect: "manual",
    });

    if (response.status === 401 || response.status === 403) {
      return createUnauthorizedResponse("Unauthorized", response.status);
    }

    if (!response.ok) {
      console.error("BFF auth/me request failed", {
        status: response.status,
      });
      return NextResponse.json(
        { reason: "Failed to fetch current user" },
        { status: response.status },
      );
    }

    const payload = (await response.json()) as unknown;

    if (!isUserNameResponse(payload)) {
      console.error("Invalid user name payload shape for auth/me", payload);
      return NextResponse.json(
        { reason: "Invalid current user payload" },
        { status: 502 },
      );
    }

    const displayName = payload.name.trim();

    return NextResponse.json({
      name: displayName.length > 0 ? displayName : "Account",
    });
  } catch (error) {
    console.error("BFF auth/me request crashed", error);
    return NextResponse.json(
      { reason: "Failed to fetch current user" },
      { status: 502 },
    );
  }
}
