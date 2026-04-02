"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
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
    case "legal_consent_required":
      return "Accept the Terms of Service and Privacy Policy before signing in.";
    default:
      return null;
  }
}

function SignInContent() {
  const query = useSearchParams();
  const [hasAcceptedLegal, setHasAcceptedLegal] = useState(false);

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
        <form action={authUrl} method="post" className="space-y-4">
          <label className="flex items-start gap-3 rounded-lg border border-black/10 bg-[#FFF7F9] px-4 py-3 text-sm text-black/80">
            <input
              type="checkbox"
              name="acceptLegal"
              value="accepted"
              checked={hasAcceptedLegal}
              onChange={(event) => setHasAcceptedLegal(event.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-black/20 text-[#FF2D55] accent-[#FF2D55]"
              required
            />
            <span className="leading-6">
              I agree to the{" "}
              <Link
                href="/terms"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-[#FF2D55] hover:text-[#E60045]"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-[#FF2D55] hover:text-[#E60045]"
              >
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          <button
            type="submit"
            disabled={!hasAcceptedLegal}
            className="inline-flex w-full items-center justify-center gap-3 rounded-lg px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-black/20 enabled:bg-[#FF2D55] enabled:hover:bg-[#E60045]"
          >
            <LogoGithub className="h-5 w-5" />
            Sign in with GitHub
          </button>
        </form>
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
