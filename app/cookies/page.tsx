import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookies | Cadence Engineer",
  description: "Information about cookie usage in Cadence Engineer",
};

export default function CookiesPage() {
  return (
    <main className="h-full bg-white px-6 py-8 md:px-8 md:py-10">
      <section className="mx-auto w-full max-w-4xl rounded-2xl bg-white p-8 shadow-[0_14px_40px_rgba(0,0,0,0.18)] md:p-10">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-black">
          Cookie Information
        </h1>
        <p className="mb-4 text-black">
          We only use cookies that are needed to run this service. They keep you signed in and help keep your
          account secure while you use the app.
        </p>
        <p className="mb-4 text-black">
          We do not use cookies for ads, analytics, or tracking you across other websites.
        </p>
        <p className="text-black">
          We also do not collect personal profile information through cookies.
        </p>
      </section>
    </main>
  );
}
