import { NextRequest, NextResponse } from "next/server";
import { fetchCadenceApi } from "@/lib/server/cadence-api";
import { AUTH_COOKIE_NAMES, getIsSecureCookie } from "@/lib/server/auth-cookies";

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get(AUTH_COOKIE_NAMES.access)?.value;

  if (accessToken) {
    try {
      await fetchCadenceApi("/v1/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      });
    } catch (error) {
      console.error("Sign-out route failed to logout upstream", error);
    }
  }

  const response = NextResponse.redirect(new URL("/", request.url));
  response.cookies.set(AUTH_COOKIE_NAMES.access, "", {
    httpOnly: true,
    secure: getIsSecureCookie(),
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
