"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, RefreshCw } from "@geist-ui/icons";
import { startTransition, useState } from "react";
import {
  createDaily,
  isApiRequestError,
  isReauthRequiredError,
  isUnauthorizedError,
} from "@/lib/api/dailies-client";
import { getConfidencePillStyles } from "@/lib/daily/confidence-pill";
import { getMissingDailyDays } from "@/lib/daily/missing-days";
import { isEmptyDaily, isPendingDaily, type Daily } from "@/lib/daily/types";
import { InfoCard } from "./page-shell";
import { PendingDailyLoading } from "./pending-daily-loading";

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

type DailiesListProps = {
  dailies: Daily[];
};

type DailyListEntry =
  | {
      type: "daily";
      day: string;
      daily: Daily;
      key: string;
    }
  | {
      type: "actionable";
      variant: "missing" | "no-confidence";
      day: string;
      key: string;
    };

function isNoConfidenceDaily(daily: Daily): boolean {
  return !isPendingDaily(daily) && !isEmptyDaily(daily) && daily.confidence === null;
}

export function DailiesList({ dailies }: DailiesListProps) {
  const router = useRouter();
  const [creatingDays, setCreatingDays] = useState<string[]>([]);
  const [createErrors, setCreateErrors] = useState<Record<string, string>>({});

  const items: DailyListEntry[] = [
    ...dailies.map((daily) =>
      isNoConfidenceDaily(daily)
        ? {
            type: "actionable" as const,
            variant: "no-confidence" as const,
            day: daily.day,
            key: daily.id,
          }
        : {
            type: "daily" as const,
            day: daily.day,
            daily,
            key: daily.id,
          },
    ),
    ...getMissingDailyDays(dailies).map((day) => ({
      type: "actionable" as const,
      variant: "missing" as const,
      day,
      key: `missing:${day}`,
    })),
  ].sort((left, right) => right.day.localeCompare(left.day));

  async function handleCreateDaily(day: string) {
    let shouldCreate = false;
    setCreatingDays((current) => {
      if (current.includes(day)) {
        return current;
      }

      shouldCreate = true;
      return [...current, day];
    });

    if (!shouldCreate) {
      return;
    }

    setCreateErrors((current) => {
      if (!(day in current)) {
        return current;
      }

      const next = { ...current };
      delete next[day];
      return next;
    });

    try {
      await createDaily(day);
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      if (isUnauthorizedError(error)) {
        router.replace("/sign-in");
        return;
      }

      if (isReauthRequiredError(error)) {
        router.replace(error.reauthUrl);
        return;
      }

      if (isApiRequestError(error) && error.status === 409) {
        startTransition(() => {
          router.refresh();
        });
        return;
      }

      console.error("Failed creating daily", { day, error });
      setCreateErrors((current) => ({
        ...current,
        [day]: isApiRequestError(error)
          ? error.message
          : "Could not create daily. Please try again.",
      }));
      setCreatingDays((current) => current.filter((value) => value !== day));
    }
  }

  if (items.length === 0) {
    return (
      <InfoCard className="border-dashed" tone="tinted">
        <h2 className="text-lg font-bold text-black">No dailies yet</h2>
        <p className="mt-2 text-sm leading-6 text-black/70">
          No daily summaries are available for the selected organization.
        </p>
      </InfoCard>
    );
  }

  return (
    <div className="grid gap-4">
      {items.map((item) =>
        item.type === "daily" ? (
          <DailyListItem key={item.key} daily={item.daily} />
        ) : (
          <ActionableDailyListItem
            key={item.key}
            day={item.day}
            variant={item.variant}
            errorMessage={createErrors[item.day] ?? null}
            isCreating={creatingDays.includes(item.day)}
            onCreate={() => void handleCreateDaily(item.day)}
          />
        ),
      )}
    </div>
  );
}

type DailyListItemProps = {
  daily: Daily;
};

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
    <div className="flex flex-col gap-3 overflow-hidden">
      <div className="min-w-0 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 text-xs font-semibold uppercase tracking-[0.24em] text-[#FF2D55]">
            {formatDailyDate(daily.day)}
          </p>
          <span
            className="inline-flex w-fit shrink-0 items-center gap-2 self-start rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
            style={getConfidencePillStyles(confidenceLabel, disabled)}
          >
            {confidenceText}
          </span>
        </div>
        {pending ? (
          <div className="flex min-h-28 items-center justify-center py-3">
            <PendingDailyLoading />
          </div>
        ) : (
          <>
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
              {empty
                ? "No daily summary content was generated for this day."
                : daily.text?.trim() || "Open this daily to see the full summary."}
            </p>
          </>
        )}
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
      prefetch={false}
      className="group block rounded-xl border border-black/10 bg-white p-5 transition hover:border-[#FF2D55]/30 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
    >
      {content}
    </Link>
  );
}

type ActionableDailyListItemProps = {
  day: string;
  variant: "missing" | "no-confidence";
  errorMessage: string | null;
  isCreating: boolean;
  onCreate: () => void;
};

function ActionableDailyListItem({
  day,
  variant,
  errorMessage,
  isCreating,
  onCreate,
}: ActionableDailyListItemProps) {
  const statusLabel = variant === "missing" ? "Missing" : "No confidence";

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onCreate}
        disabled={isCreating}
        className="group flex w-full flex-col gap-3 rounded-xl border border-dashed border-[#FF2D55]/35 bg-[#FFF7F9] p-5 text-left transition hover:border-[#FF2D55] hover:shadow-[0_10px_30px_rgba(255,45,85,0.12)] disabled:cursor-not-allowed disabled:opacity-80"
      >
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 text-xs font-semibold uppercase tracking-[0.24em] text-[#FF2D55]">
            {formatDailyDate(day)}
          </p>
          <span className="inline-flex shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#C61A44]">
            {statusLabel}
          </span>
        </div>

        <div className="flex min-h-28 items-center justify-center py-3">
          {isCreating ? (
            <PendingDailyLoading />
          ) : variant === "missing" ? (
            <Plus
              size={40}
              color="#FF2D55"
              className="transition group-hover:scale-105"
            />
          ) : (
            <RefreshCw
              size={40}
              color="#FF2D55"
              className="transition group-hover:scale-105"
            />
          )}
        </div>
      </button>

      {errorMessage ? (
        <p className="rounded-md bg-[#FFE8EE] px-3 py-2 text-sm text-[#8A1230]">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
