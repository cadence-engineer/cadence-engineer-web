import type { Daily } from "@/lib/daily/types";

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
const MAX_MISSING_DAILY_AGE_DAYS = 7;

function startOfUtcDay(value: Date): Date {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
}

function formatUtcDay(value: Date): string {
  return value.toISOString().slice(0, 10);
}

export function getMissingDailyDays(
  dailies: Pick<Daily, "day">[],
  referenceDate: Date = new Date(),
): string[] {
  const existingDays = new Set(dailies.map((daily) => daily.day));
  const today = startOfUtcDay(referenceDate);
  const missingDays: string[] = [];

  for (let offset = 1; offset <= MAX_MISSING_DAILY_AGE_DAYS; offset += 1) {
    const day = formatUtcDay(new Date(today.getTime() - offset * MILLISECONDS_PER_DAY));
    if (!existingDays.has(day)) {
      missingDays.push(day);
    }
  }

  return missingDays;
}

export function toDailyCreationTimestamp(day: string): string {
  return `${day}T00:00:00Z`;
}
