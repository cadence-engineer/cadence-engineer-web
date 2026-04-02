# Sprint Endpoints

## `GET /v1/sprint`

### What it does
Lists sprint summaries for the authenticated user's selected organization.

### What it needs
- Bearer auth with a Cadence JWT
- Authenticated Cadence user must have a selected organization
- No request body

### What it returns
- `200 OK`
- JSON array response body:
  - `id` (UUID)
  - `day` (string, `YYYY-MM-DD`)
  - `summary` (string)
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
    "summary": "The sprint focused on platform setup and repository onboarding.",
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

## `GET /v1/sprint/:id`

### What it does
Returns a single sprint summary for the authenticated user's selected organization.

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
  - `summary` (string)
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
  "summary": "The sprint focused on platform setup and repository onboarding.",
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
  "reason": "Sprint summary not found for the authenticated organization."
}
```

---

## `POST /v1/sprints`

### What it does
Generates or resolves a sprint summary artifact for the authenticated user's selected organization.

### What it needs
- Bearer auth with a Cadence JWT
- Authenticated Cadence user must have a selected organization
- JSON request body:
  - `day` (string, required, format `YYYY-MM-DD`)

### Request example

```json
{
  "day": "2026-03-10"
}
```

### What it returns
- `200 OK`
- No JSON response body
- Response header: `X-Run-Id: <uuid>`

### Response example

```http
HTTP/1.1 200 OK
X-Run-Id: 8CC5C9AA-2E73-4E11-B84A-7E457AD01F95
```

### Common error example

```json
{
  "error": true,
  "runId": "8CC5C9AA-2E73-4E11-B84A-7E457AD01F95",
  "schemaVersion": "1.0.0",
  "reason": "Invalid day '2026/03/10'. Expected format: YYYY-MM-DD."
}
```
