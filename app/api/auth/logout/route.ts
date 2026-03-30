import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAMES, getIsSecureCookie } from "@/lib/server/auth-cookies";

export async function POST() {
  const response = new NextResponse(null, { status: 204 });
  response.cookies.set(AUTH_COOKIE_NAMES.access, "", {
    httpOnly: true,
    secure: getIsSecureCookie(),
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
