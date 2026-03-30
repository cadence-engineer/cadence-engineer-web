"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchCurrentSession } from "@/lib/api/auth-client";
import { UserMenu } from "./user-menu";

type HeaderSessionState = {
  isSignedIn: boolean;
  displayName: string;
};

type HeaderSessionProps = {
  initialSession: HeaderSessionState;
};

export function HeaderSession({ initialSession }: HeaderSessionProps) {
  const pathname = usePathname();
  const [session, setSession] = useState(initialSession);

  useEffect(() => {
    let isCancelled = false;

    async function syncSession() {
      try {
        const nextSession = await fetchCurrentSession();

        if (!isCancelled) {
          setSession(nextSession);
        }
      } catch (error) {
        console.error("Failed to sync header session", error);

        if (!isCancelled) {
          setSession({
            isSignedIn: false,
            displayName: "",
          });
        }
      }
    }

    void syncSession();

    return () => {
      isCancelled = true;
    };
  }, [pathname]);

  if (session.isSignedIn) {
    return <UserMenu displayName={session.displayName} />;
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
