export type DailyConfidence = {
  level: string;
  rationale: string;
};

export type DailySectionItem = string | Record<string, unknown>;

export type Daily = {
  id: string;
  day: string;
  title: string;
  status?: string;
  text: string | null;
  changes: DailySectionItem[] | null;
  intents: DailySectionItem[] | null;
  areas: DailySectionItem[] | null;
  impacts: DailySectionItem[] | null;
  risks: DailySectionItem[] | null;
  implications: DailySectionItem[] | null;
  confidence: DailyConfidence | null;
};

function isDailySectionItem(value: unknown): value is DailySectionItem {
  return typeof value === "string" || (typeof value === "object" && value !== null);
}

export function isDailySectionArrayOrNull(value: unknown): value is DailySectionItem[] | null {
  return (
    value === null ||
    (Array.isArray(value) && value.every(isDailySectionItem))
  );
}

export function isDailyConfidence(value: unknown): value is DailyConfidence | null {
  if (value === null) {
    return true;
  }

  if (typeof value !== "object" || value === null) {
    return false;
  }

  const maybeConfidence = value as Record<string, unknown>;
  return (
    typeof maybeConfidence.level === "string" &&
    typeof maybeConfidence.rationale === "string"
  );
}

export function isDaily(value: unknown): value is Daily {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const maybeDaily = value as Record<string, unknown>;
  return (
    typeof maybeDaily.id === "string" &&
    typeof maybeDaily.day === "string" &&
    typeof maybeDaily.title === "string" &&
    (typeof maybeDaily.status === "string" || typeof maybeDaily.status === "undefined") &&
    (typeof maybeDaily.text === "string" || maybeDaily.text === null) &&
    isDailySectionArrayOrNull(maybeDaily.changes) &&
    isDailySectionArrayOrNull(maybeDaily.intents) &&
    isDailySectionArrayOrNull(maybeDaily.areas) &&
    isDailySectionArrayOrNull(maybeDaily.impacts) &&
    isDailySectionArrayOrNull(maybeDaily.risks) &&
    isDailySectionArrayOrNull(maybeDaily.implications) &&
    isDailyConfidence(maybeDaily.confidence)
  );
}

function hasItems(items: DailySectionItem[] | null): boolean {
  return Array.isArray(items) && items.length > 0;
}

export function isPendingDaily(daily: Daily): boolean {
  if (daily.status === "pending" || daily.status === "processing") {
    return true;
  }

  if (daily.status === "empty") {
    return false;
  }

  return (
    daily.text === null &&
    !hasItems(daily.changes) &&
    !hasItems(daily.intents) &&
    !hasItems(daily.areas) &&
    !hasItems(daily.impacts) &&
    !hasItems(daily.risks) &&
    !hasItems(daily.implications) &&
    daily.confidence === null
  );
}

export function isEmptyDaily(daily: Daily): boolean {
  return daily.status === "empty";
}

export function getDailySectionItemText(item: DailySectionItem): string {
  if (typeof item === "string") {
    return item;
  }

  const candidates = [
    item.text,
    item.statement,
    item.title,
    item.summary,
    item.basis,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate;
    }
  }

  return JSON.stringify(item);
}
