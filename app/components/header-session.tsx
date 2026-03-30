"use client";

import Link from "next/link";
import { UserMenu } from "./user-menu";

type HeaderSessionState = {
  isSignedIn: boolean;
  displayName: string;
};

type HeaderSessionProps = {
  initialSession: HeaderSessionState;
};

export function HeaderSession({ initialSession }: HeaderSessionProps) {
  if (initialSession.isSignedIn) {
    return <UserMenu displayName={initialSession.displayName} />;
  }

  return (
    <nav className="flex items-center gap-6 text-sm font-semibold">
      <Link href="/pricing" className="text-[#FF2D55] hover:text-[#E60045]">
        Pricing
      </Link>
      <Link href="/sign-in" className="text-[#FF2D55] hover:text-[#E60045]">
        Sign in
      </Link>
    </nav>
  );
}
