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
  highlights: string[];
  changes: DailySectionItem[] | null;
  intents: DailySectionItem[] | null;
  areas: DailySectionItem[] | null;
  impacts: DailySectionItem[] | null;
  risks: DailySectionItem[] | null;
  implications: DailySectionItem[] | null;
  confidence: DailyConfidence | null;
};

function getFallbackTitle(day: string, status?: string): string {
  if (status === "empty") {
    return `Empty daily for ${day}`;
  }

  return `Daily for ${day}`;
}

function isDailySectionItem(value: unknown): value is DailySectionItem {
  return typeof value === "string" || (typeof value === "object" && value !== null);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
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

export function parseDaily(value: unknown): Daily | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const maybeDaily = value as Record<string, unknown>;
  if (typeof maybeDaily.id !== "string" || typeof maybeDaily.day !== "string") {
    return null;
  }

  if (
    typeof maybeDaily.status !== "string" &&
    typeof maybeDaily.status !== "undefined"
  ) {
    return null;
  }

  const status = maybeDaily.status;

  if (
    typeof maybeDaily.text !== "string" &&
    maybeDaily.text !== null &&
    typeof maybeDaily.text !== "undefined"
  ) {
    return null;
  }

  if (
    !isStringArray(maybeDaily.highlights ?? []) ||
    !isDailySectionArrayOrNull(maybeDaily.changes ?? null) ||
    !isDailySectionArrayOrNull(maybeDaily.intents ?? null) ||
    !isDailySectionArrayOrNull(maybeDaily.areas ?? null) ||
    !isDailySectionArrayOrNull(maybeDaily.impacts ?? null) ||
    !isDailySectionArrayOrNull(maybeDaily.risks ?? null) ||
    !isDailySectionArrayOrNull(maybeDaily.implications ?? null) ||
    !isDailyConfidence(maybeDaily.confidence ?? null)
  ) {
    return null;
  }

  const title =
    typeof maybeDaily.title === "string" && maybeDaily.title.trim().length > 0
      ? maybeDaily.title
      : getFallbackTitle(maybeDaily.day, status);

  return {
    id: maybeDaily.id,
    day: maybeDaily.day,
    title,
    status,
    text: typeof maybeDaily.text === "string" ? maybeDaily.text : null,
    highlights: (maybeDaily.highlights ?? []) as string[],
    changes: (maybeDaily.changes ?? null) as DailySectionItem[] | null,
    intents: (maybeDaily.intents ?? null) as DailySectionItem[] | null,
    areas: (maybeDaily.areas ?? null) as DailySectionItem[] | null,
    impacts: (maybeDaily.impacts ?? null) as DailySectionItem[] | null,
    risks: (maybeDaily.risks ?? null) as DailySectionItem[] | null,
    implications: (maybeDaily.implications ?? null) as DailySectionItem[] | null,
    confidence: (maybeDaily.confidence ?? null) as DailyConfidence | null,
  };
}

export function isDaily(value: unknown): value is Daily {
  return parseDaily(value) !== null;
}

function hasItems(items: DailySectionItem[] | null): boolean {
  return Array.isArray(items) && items.length > 0;
}

export function isPendingDaily(daily: Daily): boolean {
  if (typeof daily.status === "string") {
    return (
      daily.status === "pending" ||
      daily.status === "processing" ||
      daily.status === "summarizing"
    );
  }

  return (
    daily.text === null &&
    daily.highlights.length === 0 &&
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

export function getDailySectionItemKey(item: DailySectionItem, index: number): string {
  if (typeof item === "string") {
    return `text:${index}:${item}`;
  }

  if (typeof item.id === "string" && item.id.trim().length > 0) {
    return item.id;
  }

  return `item:${index}:${getDailySectionItemText(item)}`;
}
