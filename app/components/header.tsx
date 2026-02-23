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
      </div>
    </header>
  );
}
