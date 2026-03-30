import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAMES, clearAuthCookies } from "@/lib/server/auth-cookies";
import { getAccessTokenState } from "@/lib/server/access-token";

function isProtectedPath(pathname: string): boolean {
  return (
    pathname === "/dashboard" ||
    pathname === "/setup" ||
    pathname === "/dailies" ||
    pathname.startsWith("/dailies/")
  );
}

export function proxy(request: NextRequest) {
  const accessToken = request.cookies.get(AUTH_COOKIE_NAMES.access)?.value;
  const accessTokenState = accessToken ? getAccessTokenState(accessToken) : null;

  if (!accessToken || accessTokenState === "valid") {
    return NextResponse.next();
  }

  if (isProtectedPath(request.nextUrl.pathname)) {
    const response = NextResponse.redirect(new URL("/", request.url));
    return clearAuthCookies(response);
  }

  return clearAuthCookies(NextResponse.next());
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|cadence-icon.svg|robots.txt|sitemap.xml).*)",
  ],
};
