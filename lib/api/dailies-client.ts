import { fetchBff } from "@/lib/api/client";
import { toDailyCreationTimestamp } from "@/lib/daily/missing-days";
import type { Daily } from "@/lib/daily/types";
import {
  isApiRequestError,
  isReauthRequiredError,
  isUnauthorizedError,
  ApiRequestError,
  ReauthRequiredError,
  UnauthorizedError,
} from "@/lib/api/organizations-client";

type DailiesResponse = {
  dailies: Daily[];
};

type DailyResponse = {
  daily: Daily;
};

type ErrorResponse = {
  reason?: string;
};

async function readErrorReason(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as ErrorResponse;
    if (typeof payload.reason === "string" && payload.reason.length > 0) {
      return payload.reason;
    }
  } catch {
    // Ignore parse errors and fall back to a generic message.
  }

  return `Request failed with status ${response.status}`;
}

async function throwIfUnauthorized(response: Response): Promise<void> {
  if (response.status === 401 || response.status === 403) {
    throw new UnauthorizedError();
  }
}

async function throwIfReauthRequired(response: Response): Promise<void> {
  if (response.status !== 409) {
    return;
  }

  try {
    const payload = (await response.clone().json()) as { code?: string; reauthUrl?: string };
    if (
      payload.code === "reauth_required" &&
      typeof payload.reauthUrl === "string" &&
      payload.reauthUrl.length > 0
    ) {
      throw new ReauthRequiredError(payload.reauthUrl);
    }
  } catch (error) {
    if (isReauthRequiredError(error)) {
      throw error;
    }
  }
}

async function assertOk(response: Response): Promise<void> {
  await throwIfUnauthorized(response);
  await throwIfReauthRequired(response);

  if (!response.ok) {
    throw new ApiRequestError(await readErrorReason(response), response.status);
  }
}

export async function fetchDailies(): Promise<Daily[]> {
  const response = await fetchBff("/api/dailies", { method: "GET" });
  await assertOk(response);

  const payload = (await response.json()) as DailiesResponse;
  return Array.isArray(payload.dailies) ? payload.dailies : [];
}

export async function fetchDaily(id: string): Promise<Daily> {
  const response = await fetchBff(`/api/dailies/${id}`, { method: "GET" });
  await assertOk(response);

  const payload = (await response.json()) as DailyResponse;
  return payload.daily;
}

export async function createDaily(day: string): Promise<void> {
  const response = await fetchBff("/api/dailies", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ day: toDailyCreationTimestamp(day) }),
  });

  if (response.status === 202) {
    return;
  }

  await assertOk(response);

  throw new ApiRequestError("Daily creation returned an unexpected response", response.status);
}

export async function retryDaily(id: string): Promise<void> {
  const response = await fetchBff(`/api/dailies/${id}/retry`, {
    method: "POST",
  });

  if (response.status === 202) {
    return;
  }

  await assertOk(response);

  throw new ApiRequestError("Daily retry returned an unexpected response", response.status);
}

export {
  ApiRequestError,
  isApiRequestError,
  isReauthRequiredError,
  isUnauthorizedError,
  ReauthRequiredError,
  UnauthorizedError,
};
