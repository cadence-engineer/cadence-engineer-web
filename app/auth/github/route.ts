import { NextRequest, NextResponse } from "next/server";
import { getGitHubOAuthClientId } from "@/lib/api/github-auth";

function getSignInErrorUrl(request: NextRequest, error: string): URL {
  const url = new URL("/sign-in", request.url);
  url.searchParams.set("error", error);
  return url;
}

export async function GET(request: NextRequest) {
  const clientId = getGitHubOAuthClientId();
  if (!clientId) {
    return NextResponse.redirect(getSignInErrorUrl(request, "github_not_configured"));
  }

  const state = crypto.randomUUID();
  const redirectUri = new URL("/auth/github/callback", request.url).toString();

  const githubAuthorizeUrl = new URL("https://github.com/login/oauth/authorize");
  githubAuthorizeUrl.searchParams.set("client_id", clientId);
  githubAuthorizeUrl.searchParams.set("redirect_uri", redirectUri);
  githubAuthorizeUrl.searchParams.set("scope", "read:user user:email");
  githubAuthorizeUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(githubAuthorizeUrl);
  response.cookies.set("cadence_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });

  return response;
}
