import { NextRequest, NextResponse } from "next/server";
import { fetchCadenceApi } from "@/lib/server/cadence-api";
import { AUTH_COOKIE_NAMES, getIsSecureCookie } from "@/lib/server/auth-cookies";

type ExchangeResponse = {
  accessToken: string;
};

function getSignInErrorUrl(request: NextRequest, error: string): URL {
  const url = new URL("/sign-in", request.url);
  url.searchParams.set("error", error);
  return url;
}

function redirectToSignInWithError(request: NextRequest, error: string): NextResponse {
  const response = NextResponse.redirect(getSignInErrorUrl(request, error));
  response.cookies.delete({
    name: AUTH_COOKIE_NAMES.oauthState,
    path: "/auth/github/callback",
  });
  return response;
}

export async function GET(request: NextRequest) {
  const oauthError = request.nextUrl.searchParams.get("error");
  if (oauthError === "access_denied") {
    return redirectToSignInWithError(request, "access_denied");
  }

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const expectedState = request.cookies.get(AUTH_COOKIE_NAMES.oauthState)?.value;

  if (!code || !state || !expectedState || state !== expectedState) {
    return redirectToSignInWithError(request, "invalid_state");
  }

  try {
    const exchangeResponse = await fetchCadenceApi("/v1/auth/github", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ code }),
    });

    if (!exchangeResponse.ok) {
      let exchangeErrorBody = "<failed to read error body>";
      try {
        exchangeErrorBody = await exchangeResponse.text();
      } catch (readError) {
        console.error("OAuth exchange failed to read error body", readError);
      }
      console.error("OAuth exchange failed", exchangeErrorBody);
      return redirectToSignInWithError(request, "oauth_failed");
    }

    const payload = (await exchangeResponse.json()) as ExchangeResponse;
    const { accessToken } = payload;

    if (typeof accessToken !== "string") {
      console.error("OAuth exchange payload missing required access token");
      return redirectToSignInWithError(request, "oauth_failed");
    }

    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete({
      name: AUTH_COOKIE_NAMES.oauthState,
      path: "/auth/github/callback",
    });
    response.cookies.set(AUTH_COOKIE_NAMES.access, accessToken, {
      httpOnly: true,
      secure: getIsSecureCookie(),
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });

    return response;
  } catch (error) {
    console.error("OAuth callback failed", error);
    return redirectToSignInWithError(request, "oauth_failed");
  }
}
