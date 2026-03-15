import Link from "next/link";
import { dailySummary, type ImpactItem, type SummaryItem } from "@/lib/daily/dummy-summary";

function SummaryList({
  title,
  items,
}: {
  title: string;
  items: SummaryItem[];
}) {
  return (
    <article className="rounded-xl border border-black/10 bg-white p-6 shadow-[0_10px_24px_rgba(0,0,0,0.08)]">
      <h2 className="mb-3 text-lg font-bold text-black">{title}</h2>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={`${title}-${item.text}`} className="rounded-lg bg-[#FFF2F6] p-3">
            <p className="text-sm text-black">{item.text}</p>
            {item.citations.length > 0 ? (
              <p className="mt-2 text-xs font-semibold text-[#B0173D]">
                Source: {item.citations.map((citation) => citation.id).join(", ")}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </article>
  );
}

function ImpactList({ title, items }: { title: string; items: ImpactItem[] }) {
  return (
    <article className="rounded-xl border border-black/10 bg-white p-6 shadow-[0_10px_24px_rgba(0,0,0,0.08)]">
      <h2 className="mb-3 text-lg font-bold text-black">{title}</h2>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={`${title}-${item.text}`} className="rounded-lg bg-[#F5F7FF] p-3">
            <p className="text-sm text-black">{item.text}</p>
            <p className="mt-2 text-xs text-black/70">Basis: {item.basis}</p>
          </li>
        ))}
      </ul>
    </article>
  );
}

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
          <p className="text-base leading-7 text-black">{dailySummary.summary}</p>
        </article>

        <section className="grid gap-6 md:grid-cols-2">
          <SummaryList title="Key Areas" items={dailySummary.areas} />
          <SummaryList title="Intent" items={dailySummary.intents} />
          <SummaryList title="Changes" items={dailySummary.changes} />
          <SummaryList title="Risks" items={dailySummary.risks.map((risk) => ({
            text: `${risk.statement} (${risk.severity} • ${risk.category})`,
            citations: risk.citations,
          }))} />
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <ImpactList title="Impacts" items={dailySummary.impacts} />
          <ImpactList title="Implications" items={dailySummary.implications} />
        </section>

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
