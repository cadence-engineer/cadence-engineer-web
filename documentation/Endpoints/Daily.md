# Daily Endpoints

## `GET /v1/dailies`

### What it does
Lists daily summaries for the authenticated user's selected organization.

### What it needs
- Bearer auth with a Cadence JWT
- Authenticated Cadence user must have a selected organization
- No request body

### What it returns
- `200 OK`
- JSON array response body:
  - `id` (UUID)
  - `day` (string, `YYYY-MM-DD`)
  - `status` (string: `pending`, `summarizing`, `summarized`, `empty`, or `failed`)
  - `title` (string)
  - `text` (string, short standalone daily summary)
  - `highlights` (array of strings, scan-friendly summary list, may be empty)
  - `changes` (array or null)
  - `intents` (array or null)
  - `areas` (array or null)
  - `impacts` (array or null)
  - `risks` (array or null)
  - `implications` (array or null)
  - `confidence` (object or null)

### Response example

```json
[
  {
    "id": "8cc5c9aa-2e73-4e11-b84a-7e457ad01f95",
    "day": "2026-03-10",
    "status": "summarized",
    "title": "Release reliability improved",
    "text": "Release reliability improved for downstream users.",
    "highlights": [
      "Tightened output validation for malformed responses.",
      "Added retry handling for temporary upstream failures."
    ],
    "changes": [],
    "intents": [],
    "areas": [],
    "impacts": [],
    "risks": [],
    "implications": [],
    "confidence": null
  }
]
```

---

## `GET /v1/dailies/:id`

### What it does
Returns a single daily summary for the authenticated user's selected organization.

### What it needs
- Bearer auth with a Cadence JWT
- Authenticated Cadence user must have a selected organization
- Path parameter:
  - `id` (UUID, required)

### What it returns
- `200 OK`
- JSON response body:
  - `id` (UUID)
  - `day` (string, `YYYY-MM-DD`)
  - `status` (string: `pending`, `summarizing`, `summarized`, `empty`, or `failed`)
  - `title` (string)
  - `text` (string, short standalone daily summary)
  - `highlights` (array of strings, scan-friendly summary list, may be empty)
  - `changes` (array or null)
  - `intents` (array or null)
  - `areas` (array or null)
  - `impacts` (array or null)
  - `risks` (array or null)
  - `implications` (array or null)
  - `confidence` (object or null)

### Response example

```json
{
  "id": "8cc5c9aa-2e73-4e11-b84a-7e457ad01f95",
  "day": "2026-03-10",
  "status": "summarized",
  "title": "Release reliability improved",
  "text": "Release reliability improved for downstream users.",
  "highlights": [
    "Tightened output validation for malformed responses.",
    "Added retry handling for temporary upstream failures."
  ],
  "changes": [],
  "intents": [],
  "areas": [],
  "impacts": [],
  "risks": [],
  "implications": [],
  "confidence": null
}
```

### Not found error example

```json
{
  "error": true,
  "runId": null,
  "schemaVersion": "1.0.0",
  "reason": "Daily summary not found for the authenticated organization."
}
```

---

## `POST /v1/dailies`

### What it does
Creates a daily summary for the requested day and starts async summarization.
The day must be in the past and within the last 8 days. Returns `409 Conflict` if a daily already exists for that day and organization.

### What it needs
- Bearer auth with a Cadence JWT
- A GitHub App installation with an access token for the user's organization
- JSON request body:
  - `day` (date, required, ISO 8601 format, must be 1–8 days ago)

### Request example

```json
{
  "day": "2026-03-29T00:00:00Z"
}
```

### What it returns
- `202 Accepted` — daily record created, summarization started in background

### Common error examples

```json
{
  "error": true,
  "runId": "8CC5C9AA-2E73-4E11-B84A-7E457AD01F95",
  "schemaVersion": "1.0.0",
  "reason": "A daily already exists for this day."
}
```

```json
{
  "error": true,
  "runId": "8CC5C9AA-2E73-4E11-B84A-7E457AD01F95",
  "schemaVersion": "1.0.0",
  "reason": "day must be in the past and within the last 8 days"
}
```

---

## `POST /v1/dailies/:id/retry`

### What it does
Retries summarization for an existing failed daily summary in the authenticated user's selected organization.
The daily must currently have status `failed`.

### What it needs
- Bearer auth with a Cadence JWT
- A GitHub App installation with an access token for the user's organization
- Path parameter:
  - `id` (UUID, required)
- No request body

### What it returns
- `202 Accepted` — retry started in background

### Common error examples

```json
{
  "error": true,
  "runId": "8CC5C9AA-2E73-4E11-B84A-7E457AD01F95",
  "schemaVersion": "1.0.0",
  "reason": "Only failed daily summaries can be retried."
}
```

```json
{
  "error": true,
  "runId": "8CC5C9AA-2E73-4E11-B84A-7E457AD01F95",
  "schemaVersion": "1.0.0",
  "reason": "Daily summary not found for the authenticated organization."
}
```
