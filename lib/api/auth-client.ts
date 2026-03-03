import { fetchCadenceApi } from "@/lib/api/client";

export type AuthUser = {
  id?: string;
  githubId?: number;
  login?: string;
  username?: string;
  name?: string | null;
  email?: string | null;
};

function normalizeUser(payload: unknown): AuthUser | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidate = payload as Record<string, unknown>;
  return {
    id: typeof candidate.id === "string" ? candidate.id : undefined,
    githubId: typeof candidate.githubId === "number" ? candidate.githubId : undefined,
    login: typeof candidate.login === "string" ? candidate.login : undefined,
    username: typeof candidate.username === "string" ? candidate.username : undefined,
    name: typeof candidate.name === "string" ? candidate.name : null,
    email: typeof candidate.email === "string" ? candidate.email : null,
  };
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  const response = await fetchCadenceApi("/v1/auth/me", { method: "GET" });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Auth check failed with status ${response.status}`);
  }

  const payload = (await response.json()) as unknown;
  const wrappedUser =
    payload && typeof payload === "object" && "user" in payload
      ? (payload as { user?: unknown }).user
      : payload;

  return normalizeUser(wrappedUser);
}

export async function logoutCurrentSession(): Promise<void> {
  const response = await fetchCadenceApi("/v1/auth/logout", { method: "POST" });

  if (response.status === 401 || response.status === 204) {
    return;
  }

  if (!response.ok) {
    throw new Error(`Logout failed with status ${response.status}`);
  }
}
