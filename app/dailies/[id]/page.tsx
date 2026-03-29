import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getDailySectionItemText } from "@/lib/daily/types";
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
) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <InfoCard className="space-y-3">
      <h2 className="text-lg font-bold text-black">{title}</h2>
      <ul className="space-y-2 text-sm leading-6 text-black/80">
        {items.map((item) => (
          <li key={getDailySectionItemText(item)} className="rounded-lg bg-[#FFF7F9] px-3 py-2">
            {getDailySectionItemText(item)}
          </li>
        ))}
      </ul>
    </InfoCard>
  );
}

export default async function DailyDetailPage({ params }: DailyDetailPageProps) {
  const { id } = await params;

  try {
    const daily = await fetchServerDaily(id);

    return (
      <PageShell>
        <PageSurface className="space-y-6">
          <PageHeader
            title={daily.title}
            description={formatDailyDate(daily.day)}
            actions={
              <Link
                href="/"
                className="inline-flex w-fit rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-black/85"
              >
                Back to dailies
              </Link>
            }
          />

          <InfoCard className="space-y-2" tone="tinted">
            <h2 className="text-lg font-bold text-black">Summary</h2>
            <p className="text-base leading-7 text-black">
              {daily.text?.trim() || "No summary text was provided for this daily."}
            </p>
          </InfoCard>

          {daily.confidence ? (
            <InfoCard className="space-y-2">
              <h2 className="text-lg font-bold text-black">Confidence</h2>
              <p className="inline-flex rounded-full bg-[#E8FFEF] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#146B2E]">
                {daily.confidence.level}
              </p>
              <p className="text-sm text-black/80">{daily.confidence.rationale}</p>
            </InfoCard>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            {renderListSection("Changes", daily.changes)}
            {renderListSection("Intents", daily.intents)}
            {renderListSection("Areas", daily.areas)}
            {renderListSection("Impacts", daily.impacts)}
            {renderListSection("Risks", daily.risks)}
            {renderListSection("Implications", daily.implications)}
          </div>
        </PageSurface>
      </PageShell>
    );
  } catch (error) {
    if (error instanceof DailyServerError && error.status === 401) {
      redirect("/auth/sign-out");
    }

    if (error instanceof DailyServerError && error.status === 404) {
      notFound();
    }

    throw error;
  }
}
