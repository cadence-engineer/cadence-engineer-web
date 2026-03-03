const DEFAULT_GITHUB_CLIENT_ID = "Iv23lijjDVweMxra8ZGz";

type GitHubAccessTokenSuccess = {
  access_token: string;
  scope: string;
  token_type: string;
};

type GitHubAccessTokenError = {
  error: string;
  error_description?: string;
};

type GitHubAccessTokenResponse = GitHubAccessTokenSuccess | GitHubAccessTokenError;

export type GitHubUser = {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
};

export function getGitHubOAuthClientId(): string {
  return process.env.GITHUB_CLIENT_ID ?? DEFAULT_GITHUB_CLIENT_ID;
}

export function getGitHubOAuthClientSecret(): string | undefined {
  return process.env.GITHUB_CLIENT_SECRET;
}

export async function exchangeGitHubCodeForToken(params: {
  code: string;
  redirectUri: string;
}): Promise<string> {
  const clientId = getGitHubOAuthClientId();
  const clientSecret = getGitHubOAuthClientSecret();

  if (!clientSecret) {
    throw new Error("Missing GITHUB_CLIENT_SECRET");
  }

  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code: params.code,
      redirect_uri: params.redirectUri,
    }),
    cache: "no-store",
  });

  const payload = (await response.json()) as GitHubAccessTokenResponse;

  if (!response.ok || "error" in payload || !payload.access_token) {
    const errorText =
      "error" in payload
        ? `${payload.error}${payload.error_description ? `: ${payload.error_description}` : ""}`
        : `HTTP ${response.status}`;
    throw new Error(`GitHub token exchange failed (${errorText})`);
  }

  return payload.access_token;
}

export async function fetchGitHubUser(accessToken: string): Promise<GitHubUser> {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`GitHub user request failed (HTTP ${response.status})`);
  }

  const payload = (await response.json()) as Partial<GitHubUser>;
  if (typeof payload.login !== "string" || typeof payload.id !== "number") {
    throw new Error("GitHub user payload is missing required fields");
  }

  return {
    id: payload.id,
    login: payload.login,
    name: payload.name ?? null,
    avatar_url: payload.avatar_url ?? "",
  };
}
