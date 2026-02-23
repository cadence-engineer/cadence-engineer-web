import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="bg-white px-6 py-4">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center"
          aria-label="Cadence Engineer home"
        >
          <Image
            src="/cadence-banner.svg"
            alt="Cadence Engineer"
            width={146}
            height={36}
            priority
          />
        </Link>
        <nav className="flex items-center gap-6 text-sm font-semibold">
          <Link href="/pricing" className="text-[#FF2D55] hover:text-[#E60045]">
            Pricing
          </Link>
          <Link href="/sign-in" className="text-[#FF2D55] hover:text-[#E60045]">
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}
