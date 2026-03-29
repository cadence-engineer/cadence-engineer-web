import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { fetchCadenceApi } from "@/lib/server/cadence-api";
import { AUTH_COOKIE_NAMES } from "@/lib/server/auth-cookies";
import { UserMenu } from "./user-menu";

type UserNameResponse = {
  name: string;
};

function isUserNameResponse(value: unknown): value is UserNameResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const maybeUserName = value as Record<string, unknown>;
  return typeof maybeUserName.name === "string";
}

type HeaderSessionIdentity = {
  isSignedIn: boolean;
  displayName: string;
};

async function getSessionIdentity(accessToken: string): Promise<HeaderSessionIdentity> {
  try {
    const response = await fetchCadenceApi("/v1/user/name", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (response.status === 401 || response.status === 403) {
      return {
        isSignedIn: false,
        displayName: "",
      };
    }

    if (!response.ok) {
      console.error("Failed to fetch user name for header", {
        status: response.status,
      });
      return {
        isSignedIn: true,
        displayName: "Account",
      };
    }

    const payload = (await response.json()) as unknown;
    if (!isUserNameResponse(payload)) {
      console.error("Invalid user name payload shape for header", payload);
      return {
        isSignedIn: true,
        displayName: "Account",
      };
    }

    const normalizedName = payload.name.trim();
    return {
      isSignedIn: true,
      displayName: normalizedName.length > 0 ? normalizedName : "Account",
    };
  } catch (error) {
    console.error("Failed to fetch user name for header", error);
    return {
      isSignedIn: true,
      displayName: "Account",
    };
  }
}

export async function Header() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_COOKIE_NAMES.access)?.value;
  const sessionIdentity = accessToken
    ? await getSessionIdentity(accessToken)
    : { isSignedIn: false, displayName: "" };
  const { isSignedIn, displayName } = sessionIdentity;

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
          <UserMenu displayName={displayName} />
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
