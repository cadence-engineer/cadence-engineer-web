import Link from "next/link";
import { LogoGithub } from "geist/icons";

type SignInPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

function getErrorMessage(error?: string): string | null {
  switch (error) {
    case "invalid_state":
      return "Authentication failed. Please try signing in again.";
    case "access_denied":
      return "GitHub access was denied. Please approve access to continue.";
    case "github_not_configured":
      return "GitHub OAuth is not fully configured. Set GITHUB_CLIENT_SECRET and try again.";
    case "oauth_failed":
      return "We could not complete GitHub sign-in. Please try again.";
    default:
      return null;
  }
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { error } = await searchParams;
  const errorMessage = getErrorMessage(error);

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
        <Link
          href="/auth/github"
          className="inline-flex w-full items-center justify-center gap-3 rounded-lg bg-[#FF2D55] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#E60045]"
        >
          <LogoGithub className="h-5 w-5" />
          Sign in with GitHub
        </Link>
      </section>
    </main>
  );
}
