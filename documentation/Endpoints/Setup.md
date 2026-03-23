# Setup Endpoints

## `POST /v1/setup`

### What it does
Performs the authenticated user's one-time organization setup from a GitHub organization login.
The endpoint resolves the `cadence-engineer` GitHub app installation for the organization, stores the installation access token,
assigns the organization to the user, and starts a background import that loads accessible repositories,
imports merged pull requests, and generates summaries asynchronously.
If setup is already running or has already completed successfully for that organization, the endpoint returns `409 Conflict`.

### What it needs
- Bearer auth with a Cadence JWT
- If the Cadence JWT has no GitHub access token claim,
  the endpoint returns `422 Unprocessable Entity`
- The selected organization must have the `cadence-engineer` GitHub app installed
- JSON request body:
  - `login` (string, required, non-empty)

### Headers example

```http
Authorization: Bearer <cadence_access_token>
```

### Request example

```json
{
  "login": "cadence-engineer"
}
```

### What it returns
- `202 Accepted` when the background setup has been started
- JSON response body:
  - `login` (string)
  - `status` (`in_progress`, `completed`, or `failed`)
  - `processed_pull_request_count` (int)
  - `error` (string, nullable)

### In-progress response example

```json
{
  "login": "cadence-engineer",
  "status": "in_progress",
  "processed_pull_request_count": 12,
  "error": null
}
```

### Conflict error example (setup already completed)

```json
{
  "error": true,
  "runId": null,
  "schemaVersion": "1.0.0",
  "reason": "Setup has already been completed successfully for organization 'cadence-engineer'."
}
```

### Common error example (missing GitHub access token)

```json
{
  "error": true,
  "runId": null,
  "schemaVersion": "1.0.0",
  "reason": "Missing GitHub access token for the authenticated user."
}
```

### Validation error example (empty login)

```json
{
  "error": true,
  "runId": null,
  "schemaVersion": "1.0.0",
  "reason": "login is empty"
}
```

### Conflict error example (setup already in progress)

```json
{
  "error": true,
  "runId": null,
  "schemaVersion": "1.0.0",
  "reason": "Setup is already in progress for organization 'cadence-engineer'."
}
```

### Common error example (app not installed)

```json
{
  "error": true,
  "runId": null,
  "schemaVersion": "1.0.0",
  "reason": "GitHub app 'cadence-engineer' is not installed for organization 'acme'."
}
```

---

## `GET /v1/setup`

### What it does
Returns the current setup state for the authenticated user's assigned organization.
If the organization setup is still marked `in_progress`, the endpoint also ensures the background import is enqueued.

### What it needs
- Bearer auth with a Cadence JWT
- The authenticated user must already have an assigned organization setup

### Headers example

```http
Authorization: Bearer <cadence_access_token>
```

### What it returns
- `200 OK`
- JSON response body:
  - `login` (string)
  - `status` (`in_progress`, `completed`, or `failed`)
  - `processed_pull_request_count` (int)
  - `error` (string, nullable)

### Response example

```json
{
  "login": "cadence-engineer",
  "status": "completed",
  "processed_pull_request_count": 128,
  "error": null
}
```

### Not found error example

```json
{
  "error": true,
  "runId": null,
  "schemaVersion": "1.0.0",
  "reason": "No setup found for the authenticated user."
}
```
