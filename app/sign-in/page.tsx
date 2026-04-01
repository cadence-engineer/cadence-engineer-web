"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { LogoGithub } from "geist/icons";
import { PageHeader, PageShell, PageSurface } from "@/app/components/page-shell";

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

function SignInContent() {
  const query = useSearchParams();

  const errorMessage = useMemo(() => getErrorMessage(query.get("error")), [query]);
  const authUrl = "/auth/github/start";

  return (
    <PageShell className="flex items-center justify-center">
      <PageSurface className="space-y-6" width="narrow">
        <PageHeader
          title="Sign in"
          description="Continue to your Cadence Engineer dashboard."
          divider={false}
        />
        {errorMessage ? (
          <p className="rounded-md bg-[#FFE8EE] px-3 py-2 text-sm text-[#8A1230]">
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
      </PageSurface>
    </PageShell>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <PageShell className="flex items-center justify-center">
          {null}
        </PageShell>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
