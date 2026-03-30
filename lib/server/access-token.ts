import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAMES } from "./auth-cookies";

type JwtPayload = {
  expiration?: number;
};

function decodeBase64Url(value: string): string | null {
  const normalizedValue = value.replace(/-/g, "+").replace(/_/g, "/");
  const paddingLength = (4 - (normalizedValue.length % 4)) % 4;
  const paddedValue = `${normalizedValue}${"=".repeat(paddingLength)}`;

  try {
    if (typeof atob === "function") {
      return atob(paddedValue);
    }

    if (typeof Buffer !== "undefined") {
      return Buffer.from(paddedValue, "base64").toString("utf8");
    }
  } catch {
    return null;
  }

  return null;
}

function decodeJwtPayload(token: string): JwtPayload | null {
  const [, payloadSegment] = token.split(".");

  if (!payloadSegment) {
    return null;
  }

  const decodedPayload = decodeBase64Url(payloadSegment);
  if (!decodedPayload) {
    return null;
  }

  try {
    return JSON.parse(decodedPayload) as JwtPayload;
  } catch {
    return null;
  }
}

export function isAccessTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);

  if (typeof payload?.expiration !== "number") {
    return false;
  }

  return payload.expiration <= Date.now() / 1000;
}

export function getValidAccessToken(token: string | null | undefined): string | null {
  if (!token || isAccessTokenExpired(token)) {
    return null;
  }

  return token;
}

export function getValidAccessTokenFromRequest(
  request: Pick<NextRequest, "cookies">,
): string | null {
  return getValidAccessToken(request.cookies.get(AUTH_COOKIE_NAMES.access)?.value);
}
