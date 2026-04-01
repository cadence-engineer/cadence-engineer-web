import { cookies } from "next/headers";
import { AUTH_COOKIE_NAMES } from "./auth-cookies";
import { getValidAccessToken } from "./access-token";

export async function getValidAccessTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  return getValidAccessToken(cookieStore.get(AUTH_COOKIE_NAMES.access)?.value);
}
