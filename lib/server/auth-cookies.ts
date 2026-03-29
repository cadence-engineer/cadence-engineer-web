import { NextResponse } from "next/server";

export const AUTH_COOKIE_NAMES = {
  access: "cadence_access",
  oauthState: "cadence_oauth_state",
} as const;

export function getIsSecureCookie(): boolean {
  return process.env.NODE_ENV === "production";
}

export function clearAuthCookies(response: NextResponse): NextResponse {
  response.cookies.delete(AUTH_COOKIE_NAMES.access);
  response.cookies.delete(AUTH_COOKIE_NAMES.oauthState);
  return response;
}

export function createUnauthorizedResponse(
  reason = "Unauthorized",
  status = 401,
): NextResponse {
  return clearAuthCookies(NextResponse.json({ reason }, { status }));
}
