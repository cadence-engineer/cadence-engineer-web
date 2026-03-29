import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getDailySectionItemText } from "@/lib/daily/types";
import { DailyServerError, fetchServerDaily } from "@/lib/server/dailies";

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
    <article className="rounded-xl border border-black/10 bg-white p-6">
      <h2 className="mb-3 text-lg font-bold text-black">{title}</h2>
      <ul className="space-y-2 text-sm leading-6 text-black/80">
        {items.map((item) => (
          <li key={getDailySectionItemText(item)} className="rounded-lg bg-[#FFF7F9] px-3 py-2">
            {getDailySectionItemText(item)}
          </li>
        ))}
      </ul>
    </article>
  );
}

export default async function DailyDetailPage({ params }: DailyDetailPageProps) {
  const { id } = await params;

  try {
    const daily = await fetchServerDaily(id);

    return (
      <main className="h-full bg-transparent px-6 py-8 md:px-8 md:py-10">
        <section className="mx-auto w-full max-w-5xl space-y-6 rounded-2xl bg-white p-8 shadow-[0_14px_40px_rgba(0,0,0,0.18)] md:p-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#FF2D55]">
                {formatDailyDate(daily.day)}
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-black">{daily.title}</h1>
            </div>
            <Link
              href="/"
              className="inline-flex w-fit rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-black/85"
            >
              Back to dailies
            </Link>
          </div>

          <article className="rounded-xl bg-[#FFF2F6] p-5">
            <h2 className="mb-2 text-lg font-bold text-black">Summary</h2>
            <p className="text-base leading-7 text-black">
              {daily.text?.trim() || "No summary text was provided for this daily."}
            </p>
          </article>

          {daily.confidence ? (
            <article className="rounded-xl border border-black/10 bg-white p-6">
              <h2 className="mb-2 text-lg font-bold text-black">Confidence</h2>
              <p className="mb-2 inline-flex rounded-full bg-[#E8FFEF] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#146B2E]">
                {daily.confidence.level}
              </p>
              <p className="text-sm text-black/80">{daily.confidence.rationale}</p>
            </article>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            {renderListSection("Changes", daily.changes)}
            {renderListSection("Intents", daily.intents)}
            {renderListSection("Areas", daily.areas)}
            {renderListSection("Impacts", daily.impacts)}
            {renderListSection("Risks", daily.risks)}
            {renderListSection("Implications", daily.implications)}
          </div>
        </section>
      </main>
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
