import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing | Cadence Engineer",
  description: "Cadence Engineer pricing plans",
};

export default function PricingPage() {
  return (
    <main className="h-full bg-white px-6 py-8 md:px-8 md:py-10">
      <section className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-[0_24px_60px_rgba(0,0,0,0.2)]">
        <div className="bg-[#FF2D55] px-8 py-8 md:px-10 md:py-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white">
            Simple, transparent pricing
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            One Plan. Everything You Need.
          </h1>
        </div>

        <div className="bg-white px-8 py-8 md:px-10 md:py-10">
          <article className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center">
            <div className="mb-5 flex items-end justify-center gap-2">
              <span className="text-7xl font-black leading-none text-black md:text-8xl">
                69
              </span>
              <span className="text-7xl font-black leading-none text-black md:text-8xl">
                €
              </span>
              <span className="pb-1 text-2xl font-bold leading-none text-black md:text-3xl">
                /month
              </span>
            </div>
            <Link
              href="/sign-in"
              className="inline-flex w-full items-center justify-center rounded-lg bg-[#FF2D55] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#E60045]"
            >
              Start with Standard
            </Link>
          </article>
        </div>
      </section>
    </main>
  );
}
