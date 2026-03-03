import { NextRequest, NextResponse } from "next/server";
import {
  exchangeGitHubCodeForToken,
  fetchGitHubUser,
  getGitHubOAuthClientSecret,
} from "@/lib/api/github-auth";

function getSignInErrorUrl(request: NextRequest, error: string): URL {
  const url = new URL("/sign-in", request.url);
  url.searchParams.set("error", error);
  return url;
}

function redirectToSignInWithError(request: NextRequest, error: string): NextResponse {
  const response = NextResponse.redirect(getSignInErrorUrl(request, error));
  response.cookies.delete("cadence_oauth_state");
  return response;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const oauthError = request.nextUrl.searchParams.get("error");
  const storedState = request.cookies.get("cadence_oauth_state")?.value;

  if (oauthError) {
    return redirectToSignInWithError(request, oauthError);
  }

  if (!code || !state || !storedState || state !== storedState) {
    return redirectToSignInWithError(request, "invalid_state");
  }

  if (!getGitHubOAuthClientSecret()) {
    return redirectToSignInWithError(request, "github_not_configured");
  }

  try {
    const redirectUri = new URL("/auth/github/callback", request.url).toString();
    const accessToken = await exchangeGitHubCodeForToken({ code, redirectUri });
    const user = await fetchGitHubUser(accessToken);

    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    response.cookies.delete("cadence_oauth_state");
    response.cookies.set("cadence_session", "github", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    response.cookies.set("cadence_github_login", user.login, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("GitHub OAuth callback failed", error);
    return redirectToSignInWithError(request, "oauth_failed");
  }
}
