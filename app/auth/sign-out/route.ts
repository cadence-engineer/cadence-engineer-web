import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAMES, getIsSecureCookie } from "@/lib/server/auth-cookies";

async function clearSessionAndRedirect(request: NextRequest) {
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

export async function GET(request: NextRequest) {
  return clearSessionAndRedirect(request);
}

export async function POST(request: NextRequest) {
  return clearSessionAndRedirect(request);
}
