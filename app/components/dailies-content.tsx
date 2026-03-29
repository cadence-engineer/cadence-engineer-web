import Link from "next/link";
import type { CSSProperties } from "react";
import { isEmptyDaily, isPendingDaily } from "@/lib/daily/types";
import { fetchServerDailies } from "@/lib/server/dailies";
import { InfoCard, PageHeader, PageShell, PageSurface } from "./page-shell";

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

type DailiesContentProps = {
  title?: string;
};

export async function DailiesContent({
  title = "Dailies",
}: DailiesContentProps) {
  const dailies = await fetchServerDailies();

  return (
    <PageShell>
      <PageSurface className="space-y-6">
        <PageHeader title={title} />

        {dailies.length === 0 ? (
          <InfoCard className="border-dashed" tone="tinted">
            <h2 className="text-lg font-bold text-black">No dailies yet</h2>
            <p className="mt-2 text-sm leading-6 text-black/70">
              No daily summaries are available for the selected organization.
            </p>
          </InfoCard>
        ) : (
          <div className="grid gap-4">
            {dailies.map((daily) => (
              <DailyListItem key={daily.id} daily={daily} />
            ))}
          </div>
        )}
      </PageSurface>
    </PageShell>
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
  const confidenceText = pending
    ? "Pending"
    : empty
      ? "Empty"
      : confidenceLabel ?? "No confidence";
  const content = (
    <div className="flex h-[8.5rem] flex-col justify-between gap-3 overflow-hidden">
      <div className="min-w-0 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 text-xs font-semibold uppercase tracking-[0.24em] text-[#FF2D55]">
            {formatDailyDate(daily.day)}
          </p>
          <span
            className="inline-flex w-fit shrink-0 items-center gap-2 self-start rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
            style={getConfidencePillStyles(confidenceLabel, disabled)}
          >
            {pending ? <LoadingIcon /> : null}
            {confidenceText}
          </span>
        </div>
        <h2
          className={`line-clamp-2 text-xl font-bold ${
            disabled
              ? "text-black/55"
              : "text-black transition group-hover:text-[#C61A44]"
          }`}
        >
          {daily.title}
        </h2>
        <p
          className={`line-clamp-1 max-w-3xl text-sm leading-6 ${
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
    </div>
  );

  if (disabled) {
    return (
      <InfoCard className="cursor-not-allowed opacity-80" tone="muted">
        {content}
      </InfoCard>
    );
  }

  return (
    <Link
      href={`/dailies/${daily.id}`}
      className="group block rounded-xl border border-black/10 bg-[#FFF7F9] p-5 transition hover:border-[#FF2D55]/30 hover:bg-white hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
    >
      {content}
    </Link>
  );
}
