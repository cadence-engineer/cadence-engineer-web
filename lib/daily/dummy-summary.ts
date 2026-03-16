export type Citation = {
  id: string;
  excerpt: string;
  location: string | null;
  kind: "pull_request";
};

export type SummaryItem = {
  text: string;
  citations: Citation[];
};

export type RiskItem = {
  statement: string;
  severity: "low" | "medium" | "high";
  category: "performance" | "infra" | "unknown";
  citations: Citation[];
};

export type Confidence = {
  rationale: string;
  level: "low" | "medium" | "high";
};

export type ImpactItem = SummaryItem & {
  basis: string;
};

export type DailySummary = {
  summary: string;
  areas: SummaryItem[];
  risks: RiskItem[];
  confidence: Confidence;
  intents: SummaryItem[];
  impacts: ImpactItem[];
  changes: SummaryItem[];
  implications: ImpactItem[];
};

export const dailySummary: DailySummary = {
  summary:
    "Today’s changes aggregate five pull requests across the cadence-engineer-api repo, delivering API pagination, enhanced request correlation, diff parsing optimizations, robust GitHub API retry behavior, and stricter openAI response validation. The API now supports cursor-based pagination on pull-request-summaries with next_cursor in the envelope, improving scalability for large histories. Request IDs are propagated through run metadata and error envelopes to aid incident triage. The patch parsing path is streamlined to reduce allocations for large diffs, and a bounded exponential backoff strategy is added to GitHub client calls to improve ingestion reliability. Finally, the response schema validation is tightened to normalize error envelopes and prevent malformed outputs. These changes collectively reduce latency spikes, improve observability, and promote predictable failure semantics for consumers and operators.",
  areas: [
    {
      citations: [
        {
          id: "PULL_REQUEST_9101",
          excerpt: "REST API pagination and response schema handling.",
          location: null,
          kind: "pull_request",
        },
      ],
      text: "REST API pagination and response schema handling.",
    },
    {
      citations: [
        {
          id: "PULL_REQUEST_9102",
          excerpt: "Request lifecycle middleware and structured error envelopes.",
          location: null,
          kind: "pull_request",
        },
      ],
      text: "Request lifecycle middleware and structured error envelopes.",
    },
    {
      citations: [
        {
          id: "PULL_REQUEST_9103",
          excerpt: "Diff parsing pipeline and file change artifact construction.",
          location: null,
          kind: "pull_request",
        },
      ],
      text: "Diff parsing pipeline and file change artifact construction.",
    },
    {
      citations: [
        {
          id: "PULL_REQUEST_9104",
          excerpt: "GitHub client networking and request execution strategy.",
          location: null,
          kind: "pull_request",
        },
      ],
      text: "GitHub client networking and request execution strategy.",
    },
    {
      citations: [
        {
          id: "PULL_REQUEST_9105",
          excerpt: "Language model response decoding and API error mapping.",
          location: null,
          kind: "pull_request",
        },
      ],
      text: "Language model response decoding and API error mapping.",
    },
  ],
  risks: [
    {
      statement:
        "Pagination state could drift if sort order is not stable across requests.",
      severity: "low",
      category: "performance",
      citations: [
        {
          excerpt:
            "Adds cursor-based pagination to `GET /v1/pull-request-summaries` and returns `next_cursor` in the response envelope.",
          kind: "pull_request",
          id: "PULL_REQUEST_9101",
          location: null,
        },
      ],
    },
    {
      statement:
        "Inconsistent request ID injection across middleware layers can lead to partial trace coverage.",
      severity: "low",
      category: "infra",
      citations: [
        {
          excerpt:
            "Wires request IDs into run metadata and ensures error responses include the same request correlation identifier.",
          kind: "pull_request",
          id: "PULL_REQUEST_9102",
          location: null,
        },
      ],
    },
    {
      statement:
        "Parser refactors may introduce edge-case regressions for unusual diff formats.",
      severity: "medium",
      category: "performance",
      citations: [
        {
          excerpt:
            "Refactors patch parsing to reduce intermediate allocations when handling large diffs.",
          kind: "pull_request",
          id: "PULL_REQUEST_9103",
          location: null,
        },
      ],
    },
    {
      statement:
        "Retry logic can increase request volume if limits and retryable codes are configured too broadly.",
      severity: "medium",
      category: "infra",
      citations: [
        {
          excerpt:
            "Introduces bounded retries with exponential backoff for transient GitHub API failures.",
          kind: "pull_request",
          id: "PULL_REQUEST_9104",
          location: null,
        },
      ],
    },
    {
      statement:
        "Strict validation may reject borderline outputs that previously passed.",
      severity: "low",
      category: "unknown",
      citations: [
        {
          excerpt:
            "Tightens structured output validation and normalizes refusal/error envelopes when schema decoding fails.",
          kind: "pull_request",
          id: "PULL_REQUEST_9105",
          location: null,
        },
      ],
    },
  ],
  confidence: {
    rationale:
      "Sufficient cross-PR coverage with explicit medium confidence in 9101-9104; 9105 does not publish a confidence level. Overall, the collected evidence supports a medium level of confidence for the day’s summary.",
    level: "medium",
  },
  intents: [
    {
      text: "Improve API scalability for repositories with large pull request history.",
      citations: [
        {
          id: "PULL_REQUEST_9101",
          location: null,
          kind: "pull_request",
          excerpt:
            "Adds cursor-based pagination to `GET /v1/pull-request-summaries` and returns `next_cursor` in the response envelope.",
        },
      ],
    },
    {
      text: "Strengthen traceability across request handling and failure paths.",
      citations: [
        {
          id: "PULL_REQUEST_9102",
          location: null,
          kind: "pull_request",
          excerpt:
            "Wires request IDs into run metadata and ensures error responses include the same request correlation identifier.",
        },
      ],
    },
    {
      text: "Reduce CPU and memory pressure during pull request summary generation.",
      citations: [
        {
          id: "PULL_REQUEST_9103",
          location: null,
          kind: "pull_request",
          excerpt:
            "Refactors patch parsing to reduce intermediate allocations when handling large diffs.",
        },
      ],
    },
    {
      text: "Improve ingestion reliability under temporary upstream instability.",
      citations: [
        {
          id: "PULL_REQUEST_9104",
          location: null,
          kind: "pull_request",
          excerpt:
            "Introduces bounded retries with exponential backoff for transient GitHub API failures.",
        },
      ],
    },
    {
      text: "Prevent malformed model output from silently degrading summary quality.",
      citations: [
        {
          id: "PULL_REQUEST_9105",
          location: null,
          kind: "pull_request",
          excerpt:
            "Tightens structured output validation and normalizes refusal/error envelopes when schema decoding fails.",
        },
      ],
    },
  ],
  impacts: [
    {
      citations: [
        {
          id: "PULL_REQUEST_9101",
          kind: "pull_request",
          excerpt:
            "Adds cursor-based pagination to `GET /v1/pull-request-summaries` and returns `next_cursor` in the response envelope.",
          location: null,
        },
      ],
      text: "Clients can incrementally load summaries without large payloads or timeout risk.",
      basis:
        "Inferred from the concrete API and runtime behavior changes in the pull request summary.",
    },
    {
      citations: [
        {
          id: "PULL_REQUEST_9102",
          kind: "pull_request",
          excerpt:
            "Wires request IDs into run metadata and ensures error responses include the same request correlation identifier.",
          location: null,
        },
      ],
      text: "Operators can correlate logs and API errors faster during incident triage.",
      basis:
        "Inferred from the concrete API and runtime behavior changes in the pull request summary.",
    },
    {
      citations: [
        {
          id: "PULL_REQUEST_9103",
          kind: "pull_request",
          excerpt:
            "Refactors patch parsing to reduce intermediate allocations when handling large diffs.",
          location: null,
        },
      ],
      text: "Large pull requests process more reliably with lower latency spikes.",
      basis:
        "Inferred from the concrete API and runtime behavior changes in the pull request summary.",
    },
    {
      citations: [
        {
          id: "PULL_REQUEST_9104",
          kind: "pull_request",
          excerpt:
            "Introduces bounded retries with exponential backoff for transient GitHub API failures.",
          location: null,
        },
      ],
      text: "Fewer failed synchronization runs during short-lived GitHub API errors.",
      basis:
        "Inferred from the concrete API and runtime behavior changes in the pull request summary.",
    },
    {
      citations: [
        {
          id: "PULL_REQUEST_9105",
          kind: "pull_request",
          excerpt:
            "Tightens structured output validation and normalizes refusal/error envelopes when schema decoding fails.",
          location: null,
        },
      ],
      text: "Consumers get consistent failure semantics and fewer ambiguous summary states.",
      basis:
        "Inferred from the concrete API and runtime behavior changes in the pull request summary.",
    },
  ],
  changes: [
    {
      citations: [
        {
          excerpt:
            "Adds cursor-based pagination to `GET /v1/pull-request-summaries` and returns `next_cursor` in the response envelope.",
          id: "PULL_REQUEST_9101",
          kind: "pull_request",
          location: null,
        },
      ],
      text:
        "Adds cursor-based pagination to `GET /v1/pull-request-summaries` and returns `next_cursor` in the response envelope.",
    },
    {
      citations: [
        {
          excerpt:
            "Wires request IDs into run metadata and ensures error responses include the same request correlation identifier.",
          id: "PULL_REQUEST_9102",
          kind: "pull_request",
          location: null,
        },
      ],
      text:
        "Wires request IDs into run metadata and ensures error responses include the same request correlation identifier.",
    },
    {
      citations: [
        {
          excerpt:
            "Refactors patch parsing to reduce intermediate allocations when handling large diffs.",
          id: "PULL_REQUEST_9103",
          kind: "pull_request",
          location: null,
        },
      ],
      text:
        "Refactors patch parsing to reduce intermediate allocations when handling large diffs.",
    },
    {
      citations: [
        {
          excerpt:
            "Introduces bounded retries with exponential backoff for transient GitHub API failures.",
          id: "PULL_REQUEST_9104",
          kind: "pull_request",
          location: null,
        },
      ],
      text:
        "Introduces bounded retries with exponential backoff for transient GitHub API failures.",
    },
    {
      citations: [
        {
          excerpt:
            "Tightens structured output validation and normalizes refusal/error envelopes when schema decoding fails.",
          id: "PULL_REQUEST_9105",
          kind: "pull_request",
          location: null,
        },
      ],
      text:
        "Tightens structured output validation and normalizes refusal/error envelopes when schema decoding fails.",
    },
  ],
  implications: [
    {
      basis:
        "Inferred from the concrete API and runtime behavior changes in the pull request summary.",
      citations: [
        {
          kind: "pull_request",
          location: null,
          id: "PULL_REQUEST_9101",
          excerpt:
            "Adds cursor-based pagination to `GET /v1/pull-request-summaries` and returns `next_cursor` in the response envelope.",
        },
      ],
      text:
        "Clients can continue to load summaries in pages, reducing payloads and avoiding timeouts.",
    },
    {
      basis:
        "Inferred from the concrete API and runtime behavior changes in the pull request summary.",
      citations: [
        {
          kind: "pull_request",
          location: null,
          id: "PULL_REQUEST_9102",
          excerpt:
            "Wires request IDs into run metadata and ensures error responses include the same request correlation identifier.",
        },
      ],
      text:
        "Operations teams should expect improved log correlation and faster incident triage due to request IDs in run metadata.",
    },
    {
      basis:
        "Inferred from the concrete API and runtime behavior changes in the pull request summary.",
      citations: [
        {
          kind: "pull_request",
          location: null,
          id: "PULL_REQUEST_9103",
          excerpt:
            "Refactors patch parsing to reduce intermediate allocations when handling large diffs.",
        },
      ],
      text: "Large pull requests process more reliably with lower latency spikes.",
    },
    {
      basis:
        "Inferred from the concrete API and runtime behavior changes in the pull request summary.",
      citations: [
        {
          kind: "pull_request",
          location: null,
          id: "PULL_REQUEST_9104",
          excerpt:
            "Introduces bounded retries with exponential backoff for transient GitHub API failures.",
        },
      ],
      text:
        "If GitHub API errors occur, bounded retries reduce overall failure rates.",
    },
    {
      basis:
        "Inferred from the concrete API and runtime behavior changes in the pull request summary.",
      citations: [
        {
          kind: "pull_request",
          location: null,
          id: "PULL_REQUEST_9105",
          excerpt:
            "Tightens structured output validation and normalizes refusal/error envelopes when schema decoding fails.",
        },
      ],
      text:
        "Schema validation tightening should improve confidence in summary outputs, with explicit failure behavior.",
    },
  ],
};
