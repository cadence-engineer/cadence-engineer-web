import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-100 px-6 py-4">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 text-sm text-slate-600">
        <p>© {new Date().getFullYear()} Cadence Engineer</p>
        <Link href="/cookies" className="font-medium text-slate-700 hover:text-slate-900">
          Cookies
        </Link>
      </div>
    </footer>
  );
}
