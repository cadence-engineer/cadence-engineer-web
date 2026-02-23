import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | Cadence Engineer",
  description: "Cadence Engineer pricing plans",
};

export default function PricingPage() {
  return (
    <main className="h-full bg-white px-6 py-10">
      <section className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-8 shadow-[0_14px_40px_rgba(0,0,0,0.18)] md:p-10">
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-black">
          Pricing
        </h1>
        <p className="mb-8 text-black">
          Simple pricing with one plan for teams using Cadence Engineer.
        </p>

        <article className="rounded-2xl bg-[#FFD6E0] p-6">
          <h2 className="mb-2 text-2xl font-bold text-black">Standard</h2>
          <p className="text-3xl font-bold text-[#E60045]">69 € / month</p>
        </article>
      </section>
    </main>
  );
}
