import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAMES, clearAuthCookies } from "@/lib/server/auth-cookies";
import { getAccessTokenState } from "@/lib/server/access-token";

function shouldBypassAuthRedirect(pathname: string): boolean {
  return (
    pathname === "/auth/sign-out" ||
    pathname === "/auth/session-expired" ||
    pathname === "/auth/github/start" ||
    pathname === "/auth/github/callback"
  );
}

export function proxy(request: NextRequest) {
  if (shouldBypassAuthRedirect(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(AUTH_COOKIE_NAMES.access)?.value;
  const accessTokenState = accessToken ? getAccessTokenState(accessToken) : null;

  if (!accessToken || accessTokenState === "valid") {
    return NextResponse.next();
  }

  const response = NextResponse.redirect(new URL("/auth/session-expired", request.url));
  return clearAuthCookies(response);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|cadence-icon.svg|robots.txt|sitemap.xml).*)",
  ],
};
