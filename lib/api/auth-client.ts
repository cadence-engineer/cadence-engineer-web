import { fetchBff } from "@/lib/api/client";

export async function logoutCurrentSession(): Promise<void> {
  const response = await fetchBff("/api/auth/logout", { method: "POST" });

  if (response.status === 401 || response.status === 204) {
    return;
  }

  if (!response.ok) {
    throw new Error(`Logout failed with status ${response.status}`);
  }
}
