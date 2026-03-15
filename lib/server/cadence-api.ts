import type { NextRequest } from "next/server";

function stripTrailingSlashes(value: string): string {
  return value.replace(/\/+$/, "");
}

export function getCadenceApiBaseUrl(): string {
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? process.env.PROD_API_URL
      : process.env.DEV_API_URL ?? process.env.PROD_API_URL;

  if (!baseUrl) {
    throw new Error("Missing API base URL. Set DEV_API_URL and PROD_API_URL.");
  }

  return stripTrailingSlashes(baseUrl);
}

export async function fetchCadenceApi(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${getCadenceApiBaseUrl()}${normalizedPath}`;

  return fetch(url, {
    ...init,
    cache: "no-store",
  });
}

type CadenceRedirectDetails = {
  status: number;
  upstreamLocation: string | null;
  reauthUrl: string | null;
};

const CADENCE_GITHUB_AUTH_PATH = "/auth/github";
const BFF_GITHUB_AUTH_START_PATH = "/auth/github/start";

export function getCadenceRedirectDetails(
  request: NextRequest,
  response: Response,
): CadenceRedirectDetails {
  const upstreamLocation = response.headers.get("location");

  let reauthUrl: string | null = null;

  if (upstreamLocation) {
    try {
      const upstreamUrl = new URL(upstreamLocation, getCadenceApiBaseUrl());
      if (upstreamUrl.pathname === CADENCE_GITHUB_AUTH_PATH) {
        reauthUrl = new URL(BFF_GITHUB_AUTH_START_PATH, request.url).pathname;
      }
    } catch (error) {
      console.error("Failed to parse upstream redirect location", {
        upstreamLocation,
        error,
      });
    }
  }

  return {
    status: response.status,
    upstreamLocation,
    reauthUrl,
  };
}
