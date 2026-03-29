import Link from "next/link";
import type { CSSProperties } from "react";
import { isEmptyDaily, isPendingDaily } from "@/lib/daily/types";
import { fetchServerDailies } from "@/lib/server/dailies";

function formatDailyDate(day: string): string {
  const value = new Date(`${day}T00:00:00`);

  if (Number.isNaN(value.getTime())) {
    return day;
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(value);
}

type DailiesContentProps = {
  title?: string;
};

export async function DailiesContent({
  title = "Dailies",
}: DailiesContentProps) {
  const dailies = await fetchServerDailies();

  return (
    <main className="h-full bg-transparent px-6 py-8 md:px-8 md:py-10">
      <section className="mx-auto w-full max-w-5xl space-y-6 rounded-2xl bg-white p-8 shadow-[0_14px_40px_rgba(0,0,0,0.18)] md:p-10">
        <h1 className="text-3xl font-bold tracking-tight text-black">{title}</h1>

        {dailies.length === 0 ? (
          <article className="rounded-xl border border-dashed border-black/15 bg-[#FFF7F9] p-6">
            <h2 className="text-lg font-bold text-black">No dailies yet</h2>
            <p className="mt-2 text-sm leading-6 text-black/70">
              No daily summaries are available for the selected organization.
            </p>
          </article>
        ) : (
          <div className="grid gap-4">
            {dailies.map((daily) => (
              <DailyListItem key={daily.id} daily={daily} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

type DailyListItemProps = {
  daily: Awaited<ReturnType<typeof fetchServerDailies>>[number];
};

function LoadingIcon() {
  return (
    <span
      aria-hidden="true"
      className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-[#FF2D55]"
    />
  );
}

function getConfidencePillStyles(
  level: string | null,
  disabled: boolean
): CSSProperties {
  if (disabled) {
    return {
      backgroundColor: "rgba(0, 0, 0, 0.05)",
      color: "rgba(0, 0, 0, 0.45)",
    };
  }

  switch (level?.toLowerCase()) {
    case "high":
      return {
        backgroundColor: "#E8FFEF",
        color: "#146B2E",
      };
    case "medium":
      return {
        backgroundColor: "#FCE7C8",
        color: "#8A4B08",
      };
    case "low":
      return {
        backgroundColor: "#FFE3E8",
        color: "#B42318",
      };
    default:
      return {
        backgroundColor: "#FFFFFF",
        color: "rgba(0, 0, 0, 0.7)",
      };
  }
}

function DailyListItem({ daily }: DailyListItemProps) {
  const pending = isPendingDaily(daily);
  const empty = isEmptyDaily(daily);
  const disabled = pending || empty;
  const confidenceLabel = daily.confidence?.level?.trim() || null;
  const content = (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#FF2D55]">
          {formatDailyDate(daily.day)}
        </p>
        <h2
          className={`text-xl font-bold ${
            disabled
              ? "text-black/55"
              : "text-black transition group-hover:text-[#C61A44]"
          }`}
        >
          {daily.title}
        </h2>
        <p
          className={`max-w-3xl text-sm leading-6 ${
            disabled ? "text-black/45" : "text-black/75"
          }`}
        >
          {pending
            ? "Daily generation is still in progress."
            : empty
              ? "No daily summary content was generated for this day."
              : daily.text?.trim() || "Open this daily to see the full summary."}
        </p>
      </div>
      <span
        className="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
        style={getConfidencePillStyles(confidenceLabel, disabled)}
      >
        {pending ? <LoadingIcon /> : null}
        {pending ? "Pending" : empty ? "Empty" : confidenceLabel ?? "No confidence"}
      </span>
    </div>
  );

  if (disabled) {
    return (
      <article className="cursor-not-allowed rounded-xl border border-black/8 bg-[#F6F3F4] p-5 opacity-80">
        {content}
      </article>
    );
  }

  return (
    <Link
      href={`/dailies/${daily.id}`}
      className="group rounded-xl border border-black/10 bg-[#FFF7F9] p-5 transition hover:border-[#FF2D55]/30 hover:bg-white hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
    >
      {content}
    </Link>
  );
}
