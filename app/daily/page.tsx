import Link from "next/link";
import { dailySummary } from "@/lib/daily/dummy-summary";

export default function DailyPage() {
  return (
    <main className="h-full bg-transparent px-6 py-8 md:px-8 md:py-10">
      <section className="mx-auto w-full max-w-5xl space-y-6 rounded-2xl bg-white p-8 shadow-[0_14px_40px_rgba(0,0,0,0.18)] md:p-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-black">Daily Summary</h1>
          <Link
            href="/"
            className="inline-flex w-fit rounded-lg bg-[#FF2D55] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#E60045]"
          >
            Back to dashboard
          </Link>
        </div>

        <article className="rounded-xl bg-[#FFF2F6] p-5">
          <h2 className="mb-2 text-lg font-bold text-black">Summary</h2>
          <p className="text-base leading-7 text-black">{dailySummary.summary}</p>
        </article>

        <article className="rounded-xl border border-black/10 bg-white p-6">
          <h2 className="mb-2 text-lg font-bold text-black">Confidence</h2>
          <p className="mb-2 inline-flex rounded-full bg-[#E8FFEF] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#146B2E]">
            {dailySummary.confidence.level}
          </p>
          <p className="text-sm text-black/80">{dailySummary.confidence.rationale}</p>
        </article>
      </section>
    </main>
  );
}
