"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { LogoGithub } from "geist/icons";

function getErrorMessage(error: string | null): string | null {
  switch (error) {
    case "access_denied":
      return "GitHub access was denied. Please approve access to continue.";
    case "auth_unavailable":
      return "Authentication service is currently unavailable. Please try again.";
    case "invalid_state":
      return "Authentication state is invalid or expired. Please try again.";
    case "oauth_failed":
      return "GitHub login could not be completed. Please try again.";
    case "github_not_configured":
      return "GitHub login is not configured on the web server.";
    default:
      return null;
  }
}

export default function SignInPage() {
  const query = useSearchParams();

  const errorMessage = useMemo(() => getErrorMessage(query.get("error")), [query]);
  const authUrl = "/auth/github/start";

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
        <a
          href={authUrl}
          className="inline-flex w-full items-center justify-center gap-3 rounded-lg bg-[#FF2D55] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#E60045]"
        >
          <LogoGithub className="h-5 w-5" />
          Sign in with GitHub
        </a>
      </section>
    </main>
  );
}
