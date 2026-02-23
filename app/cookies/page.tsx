import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookies | Cadence Engineer",
  description: "Information about cookie usage in Cadence Engineer",
};

export default function CookiesPage() {
  return (
    <main className="h-full bg-slate-100 px-6 py-10">
      <section className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-900">Cookie Information</h1>
        <p className="mb-4 text-slate-700">
          We only use cookies that are needed to run this service. They keep you signed in and help keep your
          account secure while you use the app.
        </p>
        <p className="mb-4 text-slate-700">
          We do not use cookies for ads, analytics, or tracking you across other websites.
        </p>
        <p className="text-slate-700">
          We also do not collect personal profile information through cookies.
        </p>
      </section>
    </main>
  );
}
