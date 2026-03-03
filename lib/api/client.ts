function stripTrailingSlashes(value: string): string {
  return value.replace(/\/+$/, "");
}

export function getCadenceApiBaseUrl(): string {
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? process.env.PROD_API_URL
      : process.env.DEV_API_URL ?? process.env.PROD_API_URL;

  if (!baseUrl) {
    throw new Error(
      "Missing API base URL. Set DEV_API_URL (local) and PROD_API_URL (production).",
    );
  }

  return stripTrailingSlashes(baseUrl);
}

export function getGitHubAuthStartUrl(): string {
  return `${getCadenceApiBaseUrl()}/v1/auth/github/start`;
}

export async function fetchCadenceApi(path: string, init?: RequestInit): Promise<Response> {
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  const url = `${getCadenceApiBaseUrl()}/${normalizedPath}`;

  return fetch(url, {
    credentials: "include",
    ...init,
    cache: "no-store",
  });
}
