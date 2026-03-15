import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAMES } from "@/lib/server/auth-cookies";

type JwtPayload = {
  name?: unknown;
  preferred_username?: unknown;
  login?: unknown;
  given_name?: unknown;
};

function decodeJwtPayload(token: string): JwtPayload | null {
  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }

  const payloadSegment = parts[1];
  const normalized = payloadSegment.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = (4 - (normalized.length % 4)) % 4;
  const padded = normalized.padEnd(normalized.length + padLength, "=");

  try {
    const json = Buffer.from(padded, "base64").toString("utf8");
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

function getDisplayName(accessToken: string): string {
  const payload = decodeJwtPayload(accessToken);
  const possibleName =
    payload?.name ??
    payload?.preferred_username ??
    payload?.login ??
    payload?.given_name;

  if (typeof possibleName !== "string") {
    return "Account";
  }

  const normalizedName = possibleName.trim();
  return normalizedName.length > 0 ? normalizedName : "Account";
}

export async function Header() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_COOKIE_NAMES.access)?.value;
  const isSignedIn = Boolean(accessToken);
  const displayName = accessToken ? getDisplayName(accessToken) : "";

  return (
    <header className="bg-transparent px-6 py-4 md:px-8">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center"
          aria-label="Cadence Engineer home"
        >
          <Image
            src="/cadence-icon.svg"
            alt="Cadence Engineer"
            width={36}
            height={36}
            priority
          />
        </Link>
        {isSignedIn ? (
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 shadow-sm">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#FF2D55]/10 text-[#FF2D55]">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M5 20a7 7 0 0 1 14 0" />
              </svg>
            </span>
            <span className="text-sm font-semibold text-black">{displayName}</span>
          </div>
        ) : (
          <nav className="flex items-center gap-6 text-sm font-semibold">
            <Link href="/pricing" className="text-[#FF2D55] hover:text-[#E60045]">
              Pricing
            </Link>
            <Link href="/sign-in" className="text-[#FF2D55] hover:text-[#E60045]">
              Sign in
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
