import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing | Cadence Engineer",
  description: "Cadence Engineer pricing plans",
};

export default function PricingPage() {
  return (
    <main className="h-full bg-transparent px-6 py-8 md:px-8 md:py-10">
      <section className="mx-auto w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-[0_14px_40px_rgba(0,0,0,0.18)]">
        <div className="bg-[#FF2D55] px-8 py-8 md:p-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white">
            Simple, transparent pricing
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            One Plan. Everything You Need.
          </h1>
        </div>

        <div className="bg-white px-8 py-8 md:p-10">
          <article className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center">
            <div className="mb-5 flex items-end justify-center gap-2">
              <span className="text-7xl font-black leading-none text-black md:text-8xl">
                ??
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
              Get started
            </Link>
          </article>
        </div>
      </section>
    </main>
  );
}
