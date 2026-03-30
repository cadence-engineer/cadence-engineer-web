import Image from "next/image";
import Link from "next/link";
import { fetchCadenceApi } from "@/lib/server/cadence-api";
import { getValidAccessTokenFromCookies } from "@/lib/server/auth-session";
import { HeaderSession } from "./header-session";

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

async function getHeaderDisplayName(accessToken: string): Promise<string> {
  try {
    const response = await fetchCadenceApi("/v1/user/name", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch user name for header", {
        status: response.status,
      });
      return "Account";
    }

    const payload = (await response.json()) as unknown;
    if (!isUserNameResponse(payload)) {
      console.error("Invalid user name payload shape for header", payload);
      return "Account";
    }

    const normalizedName = payload.name.trim();
    return normalizedName.length > 0 ? normalizedName : "Account";
  } catch (error) {
    console.error("Failed to fetch user name for header", error);
    return "Account";
  }
}

export async function Header() {
  const accessToken = await getValidAccessTokenFromCookies();
  const displayName = accessToken
    ? await getHeaderDisplayName(accessToken)
    : "";

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
        <HeaderSession
          initialSession={{
            isSignedIn: Boolean(accessToken),
            displayName,
          }}
        />
      </div>
    </header>
  );
}
