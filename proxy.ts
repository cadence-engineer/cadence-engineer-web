import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isSignedIn = request.cookies.get("cadence_session")?.value === "github";

  const isLandingPage = pathname === "/";
  const isSignInPage = pathname === "/sign-in";
  const isDashboardRoute = pathname.startsWith("/dashboard");

  if (!isSignedIn && isDashboardRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isSignedIn && (isLandingPage || isSignInPage)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/sign-in", "/dashboard/:path*"],
};
