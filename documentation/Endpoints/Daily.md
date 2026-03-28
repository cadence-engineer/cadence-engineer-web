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
  - `title` (string)
  - `text` (string or null)
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
    "title": "Daily Summary",
    "text": "Two pull requests were merged for the authenticated organization.",
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
  - `title` (string)
  - `text` (string or null)
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
  "title": "Daily Summary",
  "text": "Two pull requests were merged for the authenticated organization.",
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
Validates the request shape, but daily generation is currently not exposed here.
This endpoint always returns `501 Not Implemented` because daily generation is handled by setup.

### What it needs
- Bearer auth with a Cadence JWT
- JSON request body:
  - `day` (string, required, format `YYYY-MM-DD`)

### Request example

```json
{
  "day": "2026-03-10"
}
```

### What it returns
- `501 Not Implemented`

### Common error example

```json
{
  "error": true,
  "runId": "8CC5C9AA-2E73-4E11-B84A-7E457AD01F95",
  "schemaVersion": "1.0.0",
  "reason": "Daily generation is currently handled by setup."
}
```
