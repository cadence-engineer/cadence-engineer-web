import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getConfidencePillStyles } from "@/lib/daily/confidence-pill";
import { getDailySectionItemKey, getDailySectionItemText } from "@/lib/daily/types";
import { DailyServerError, fetchServerDaily } from "@/lib/server/dailies";
import { InfoCard, PageHeader, PageShell, PageSurface } from "@/app/components/page-shell";

type DailyDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDailyDate(day: string): string {
  const value = new Date(`${day}T00:00:00`);

  if (Number.isNaN(value.getTime())) {
    return day;
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(value);
}

function renderListSection(
  title: string,
  items: Awaited<ReturnType<typeof fetchServerDaily>>["changes"],
  key?: string,
) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <InfoCard key={key} className="space-y-3">
      <h2 className="text-lg font-bold text-black">{title}</h2>
      <ul className="space-y-2 text-sm leading-6 text-black/80">
        {items.map((item, index) => (
          <li key={getDailySectionItemKey(item, index)} className="rounded-lg bg-[#FFF7F9] px-3 py-2">
            {getDailySectionItemText(item)}
          </li>
        ))}
      </ul>
    </InfoCard>
  );
}

function getSupplementalSections(daily: Awaited<ReturnType<typeof fetchServerDaily>>) {
  return [
    { title: "Changes", items: daily.changes },
    { title: "Intents", items: daily.intents },
    { title: "Areas", items: daily.areas },
    { title: "Impacts", items: daily.impacts },
    { title: "Risks", items: daily.risks },
    { title: "Implications", items: daily.implications },
  ].filter((section) => (section.items?.length ?? 0) > 0);
}

export default async function DailyDetailPage({ params }: DailyDetailPageProps) {
  const { id } = await params;

  try {
    const daily = await fetchServerDaily(id);
    const highlights = daily.highlights.filter((highlight) => highlight.trim().length > 0);
    const supplementalSections = getSupplementalSections(daily);

    return (
      <PageShell>
        <PageSurface className="space-y-6">
          <PageHeader
            title={daily.title}
            description={formatDailyDate(daily.day)}
            actions={
              <Link
                href="/dailies"
                prefetch={false}
                className="inline-flex w-fit rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-black/85"
              >
                Back to dailies
              </Link>
            }
          />

          <p className="text-base leading-7 text-black">
            {daily.text?.trim() || "No summary text was provided for this daily."}
          </p>

          {highlights.length > 0 ? (
            <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-black/80">
              {highlights.map((highlight, index) => (
                <li key={`${daily.id}:highlight:${index}`}>{highlight}</li>
              ))}
            </ul>
          ) : null}

          {daily.confidence ? (
            <>
              <div aria-hidden="true" className="h-10" />
              <InfoCard className="space-y-2">
                <h2 className="text-lg font-bold text-black">Confidence</h2>
                <p
                  className="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
                  style={getConfidencePillStyles(daily.confidence.level)}
                >
                  {daily.confidence.level}
                </p>
                <p className="text-sm text-black/80">{daily.confidence.rationale}</p>
              </InfoCard>
            </>
          ) : null}

          {supplementalSections.length > 0 ? (
            <details className="border-t border-black/8 pt-4">
              <summary className="mb-4 inline-flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-[#FF2D55] underline decoration-[#FF2D55]/50 underline-offset-4 transition hover:text-[#C61A44] hover:decoration-[#C61A44] [&::-webkit-details-marker]:hidden">
                <span>Details</span>
              </summary>

              <div className="grid gap-4 md:grid-cols-2">
                {supplementalSections.map((section) =>
                  renderListSection(section.title, section.items, section.title),
                )}
              </div>
            </details>
          ) : null}
        </PageSurface>
      </PageShell>
    );
  } catch (error) {
    if (error instanceof DailyServerError && (error.status === 401 || error.status === 403)) {
      redirect("/auth/sign-out");
    }

    if (error instanceof DailyServerError && error.status === 404) {
      notFound();
    }

    throw error;
  }
}
