import Link from "next/link";

export default function Home() {
  return (
    <main className="flex h-full items-center justify-center bg-slate-100 px-6 py-10">
      <section className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-12">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Cadence Engineer
        </p>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900">
          AI engineering workspace for teams shipping fast.
        </h1>
        <p className="mb-8 max-w-2xl text-lg leading-8 text-slate-600">
          Connect your workflow, coordinate automation, and stay aligned with
          your backend services in one place.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Sign in
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Go to dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
