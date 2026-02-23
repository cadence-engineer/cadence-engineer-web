import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white px-6 py-4">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 text-sm text-black">
        <p className="text-[#FF2D55]">© {new Date().getFullYear()} Cadence Engineer</p>
        <Link href="/cookies" className="font-medium text-[#FF2D55] hover:text-[#E60045]">
          Cookies
        </Link>
      </div>
    </footer>
  );
}
