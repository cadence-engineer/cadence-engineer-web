import { redirect } from "next/navigation";
import { fetchCadenceApi } from "@/lib/server/cadence-api";
import { getValidAccessTokenFromCookies } from "@/lib/server/auth-session";
import { parseDaily, type Daily } from "@/lib/daily/types";

export class DailyServerError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "DailyServerError";
    this.status = status;
  }
}

export async function fetchServerDailies(): Promise<Daily[]> {
  const accessToken = await getValidAccessTokenFromCookies();

  if (!accessToken) {
    throw new DailyServerError("Unauthorized", 401);
  }

  const response = await fetchCadenceApi("/v1/dailies", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (response.status === 401 || response.status === 403) {
    redirect("/auth/sign-out");
  }

  if (!response.ok) {
    throw new DailyServerError("Failed to fetch dailies", response.status);
  }

  const payload = (await response.json()) as unknown;
  return Array.isArray(payload)
    ? payload.flatMap((item) => {
        const daily = parseDaily(item);
        return daily ? [daily] : [];
      })
    : [];
}

export async function fetchServerDaily(id: string): Promise<Daily> {
  const accessToken = await getValidAccessTokenFromCookies();

  if (!accessToken) {
    throw new DailyServerError("Unauthorized", 401);
  }

  const response = await fetchCadenceApi(`/v1/dailies/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (response.status === 401 || response.status === 403) {
    throw new DailyServerError("Unauthorized", response.status);
  }

  if (!response.ok) {
    throw new DailyServerError("Failed to fetch daily", response.status);
  }

  const payload = (await response.json()) as unknown;
  const daily = parseDaily(payload);
  if (!daily) {
    throw new DailyServerError("Invalid daily payload", 502);
  }

  return daily;
}
