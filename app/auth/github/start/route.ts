import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAMES, getIsSecureCookie } from "@/lib/server/auth-cookies";

const SEE_OTHER_REDIRECT_STATUS = 303;

function getSignInErrorUrl(request: NextRequest, error: string): URL {
  const url = new URL("/sign-in", request.url);
  url.searchParams.set("error", error);
  return url;
}

function createGitHubAuthorizationResponse(request: NextRequest): NextResponse {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return NextResponse.redirect(
      getSignInErrorUrl(request, "github_not_configured"),
      SEE_OTHER_REDIRECT_STATUS,
    );
  }

  const state = crypto.randomUUID();
  const redirectUri = new URL("/auth/github/callback", request.url).toString();

  const githubAuthorizeUrl = new URL("https://github.com/login/oauth/authorize");
  githubAuthorizeUrl.searchParams.set("client_id", clientId);
  githubAuthorizeUrl.searchParams.set("redirect_uri", redirectUri);
  githubAuthorizeUrl.searchParams.set("state", state);
  githubAuthorizeUrl.searchParams.set("scope", "read:user user:email");

  const response = NextResponse.redirect(githubAuthorizeUrl, SEE_OTHER_REDIRECT_STATUS);
  response.cookies.set(AUTH_COOKIE_NAMES.oauthState, state, {
    httpOnly: true,
    secure: getIsSecureCookie(),
    sameSite: "lax",
    path: "/auth/github/callback",
    maxAge: 60 * 10,
  });

  return response;
}

export async function GET(request: NextRequest) {
  return NextResponse.redirect(
    getSignInErrorUrl(request, "legal_consent_required"),
    SEE_OTHER_REDIRECT_STATUS,
  );
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const acceptedLegal = formData.get("acceptLegal");

  if (acceptedLegal !== "accepted") {
    return NextResponse.redirect(
      getSignInErrorUrl(request, "legal_consent_required"),
      SEE_OTHER_REDIRECT_STATUS,
    );
  }

  return createGitHubAuthorizationResponse(request);
}
