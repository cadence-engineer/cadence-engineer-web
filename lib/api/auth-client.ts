import { fetchBff } from "@/lib/api/client";

type CurrentSession = {
  isSignedIn: boolean;
  displayName: string;
};

type CurrentSessionPayload = {
  name: string;
};

function isCurrentSessionPayload(value: unknown): value is CurrentSessionPayload {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const maybePayload = value as Record<string, unknown>;
  return typeof maybePayload.name === "string";
}

export async function fetchCurrentSession(): Promise<CurrentSession> {
  const response = await fetchBff("/api/auth/me", {
    method: "GET",
    cache: "no-store",
  });

  if (response.status === 401 || response.status === 403) {
    return {
      isSignedIn: false,
      displayName: "",
    };
  }

  if (!response.ok) {
    throw new Error(`Session lookup failed with status ${response.status}`);
  }

  const payload = (await response.json()) as unknown;

  if (!isCurrentSessionPayload(payload)) {
    throw new Error("Session lookup returned an invalid payload");
  }

  return {
    isSignedIn: true,
    displayName: payload.name,
  };
}

export async function logoutCurrentSession(): Promise<void> {
  const response = await fetchBff("/api/auth/logout", { method: "POST" });

  if (response.status === 401 || response.status === 204) {
    return;
  }

  if (!response.ok) {
    throw new Error(`Logout failed with status ${response.status}`);
  }
}
