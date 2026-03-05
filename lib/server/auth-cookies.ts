export const AUTH_COOKIE_NAMES = {
  access: "cadence_access",
  oauthState: "cadence_oauth_state",
} as const;

export function getIsSecureCookie(): boolean {
  return process.env.NODE_ENV === "production";
}
