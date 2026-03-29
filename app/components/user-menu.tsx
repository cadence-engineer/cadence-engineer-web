"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { logoutCurrentSession } from "@/lib/api/auth-client";

type UserMenuProps = {
  displayName: string;
};

export function UserMenu({ displayName }: UserMenuProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      await logoutCurrentSession();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setIsOpen(false);
      router.replace("/");
      router.refresh();
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        style={{ cursor: "pointer" }}
        className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white/80 px-3 py-2 shadow-sm transition hover:bg-white"
      >
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
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className={`h-4 w-4 text-black/65 transition ${isOpen ? "rotate-180" : ""}`}
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.167l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen ? (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.14)]"
        >
          <Link
            href="/dashboard"
            role="menuitem"
            className="block px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#FFF2F5]"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/"
            role="menuitem"
            className="block px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#FFF2F5]"
            onClick={() => setIsOpen(false)}
          >
            Dailies
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="block w-full cursor-pointer px-4 py-3 text-left text-sm font-semibold text-[#FF2D55] transition hover:bg-[#FFF2F5] hover:text-[#E60045] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSigningOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
