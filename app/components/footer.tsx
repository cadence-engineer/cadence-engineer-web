import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-transparent px-6 py-4 md:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 text-sm text-black sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[#FF2D55]">© {new Date().getFullYear()} Cadence Engineer</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link href="/terms" className="font-medium text-[#FF2D55] hover:text-[#E60045]">
            Terms
          </Link>
          <Link href="/privacy" className="font-medium text-[#FF2D55] hover:text-[#E60045]">
            Privacy
          </Link>
          <Link href="/contact" className="font-medium text-[#FF2D55] hover:text-[#E60045]">
            Contact
          </Link>
          <Link href="/cookies" className="font-medium text-[#FF2D55] hover:text-[#E60045]">
            Cookies
          </Link>
        </div>
      </div>
    </footer>
  );
}
