import Link from "next/link";

export default function Home() {
  return (
    <main className="flex h-full items-center justify-center bg-white px-6 py-10">
      <section className="w-full max-w-3xl rounded-2xl bg-white p-8 shadow-[0_14px_40px_rgba(0,0,0,0.18)] md:p-12">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-black">
          AI engineering workspace for teams shipping fast.
        </h1>
        <p className="mb-8 max-w-2xl text-lg leading-8 text-black">
          Connect your workflow, coordinate automation, and stay aligned with
          your backend services in one place.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center rounded-lg bg-[#FF2D55] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#E60045]"
          >
            Sign in
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-lg bg-[#FFD6E0] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#FFB3C4]"
          >
            Go to dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
