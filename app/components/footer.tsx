import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-transparent px-6 py-4 md:px-8">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 text-sm text-black">
        <p className="text-[#FF2D55]">© {new Date().getFullYear()} Cadence Engineer</p>
        <div className="flex items-center gap-4">
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
