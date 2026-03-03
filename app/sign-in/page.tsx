"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogoGithub } from "geist/icons";
import { fetchCurrentUser } from "@/lib/api/auth-client";
import { getGitHubAuthStartUrl } from "@/lib/api/client";

function getErrorMessage(error: string | null): string | null {
  switch (error) {
    case "access_denied":
      return "GitHub access was denied. Please approve access to continue.";
    case "auth_unavailable":
      return "Authentication service is currently unavailable. Please try again.";
    default:
      return null;
  }
}

export default function SignInPage() {
  const router = useRouter();
  const query = useSearchParams();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetchCurrentUser()
      .then((user) => {
        if (mounted && user) {
          router.replace("/dashboard");
        }
      })
      .catch((error) => {
        console.error("Auth check failed on sign-in page", error);
      })
      .finally(() => {
        if (mounted) {
          setIsCheckingAuth(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [router]);

  const errorMessage = useMemo(() => getErrorMessage(query.get("error")), [query]);
  const authUrl = useMemo(() => {
    try {
      return getGitHubAuthStartUrl();
    } catch {
      return null;
    }
  }, []);
  const authUrlMissingMessage = "Authentication URL is not configured. Set DEV_API_URL and PROD_API_URL.";

  return (
    <main className="flex h-full items-center justify-center bg-transparent px-6 py-8 md:px-8 md:py-10">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_14px_40px_rgba(0,0,0,0.18)] md:p-10">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-black">
          Sign in
        </h1>
        <p className="mb-6 text-black">
          Continue to your Cadence Engineer dashboard.
        </p>
        {errorMessage ? (
          <p className="mb-4 rounded-md bg-[#FFE8EE] px-3 py-2 text-sm text-[#8A1230]">
            {errorMessage}
          </p>
        ) : null}
        {isCheckingAuth ? (
          <p className="mb-4 rounded-md bg-[#FFF3F7] px-3 py-2 text-sm text-[#8A1230]">
            Checking your session...
          </p>
        ) : null}
        {authUrl ? (
          <a
            href={authUrl}
            className={`inline-flex w-full items-center justify-center gap-3 rounded-lg bg-[#FF2D55] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#E60045] ${isCheckingAuth ? "pointer-events-none opacity-70" : ""}`}
            aria-disabled={isCheckingAuth}
          >
            <LogoGithub className="h-5 w-5" />
            Sign in with GitHub
          </a>
        ) : (
          <p className="rounded-md bg-[#FFE8EE] px-3 py-2 text-sm text-[#8A1230]">
            {authUrlMissingMessage}
          </p>
        )}
      </section>
    </main>
  );
}
