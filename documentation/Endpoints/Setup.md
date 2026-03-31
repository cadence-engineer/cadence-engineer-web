# Setup Endpoints

## `POST /v1/setup`

### What it does
Performs the authenticated user's one-time organization setup from a GitHub organization login.
The endpoint resolves the `cadence-engineer` GitHub app installation for the organization, stores the installation access token,
assigns the organization to the user, creates `Daily` records for the last 7 UTC days,
and starts summarizing those dailies asynchronously in a background task.

### What it needs
- Bearer auth with a Cadence JWT
- If the Cadence JWT has no GitHub access token claim,
  the endpoint returns `422 Unprocessable Entity`
- The authenticated user must be a member of the selected GitHub organization
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
- `202 Accepted`
- No response body

### Response example

```http
HTTP/1.1 202 Accepted
```

### Conflict error example (setup already started)

```json
{
  "error": true,
  "runId": null,
  "schemaVersion": "1.0.0",
  "reason": "Setup has already been started for organization cadence-engineer."
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

### Forbidden error example (not an organization member)

```json
{
  "error": true,
  "runId": null,
  "schemaVersion": "1.0.0",
  "reason": "Authenticated user is not a member of cadence-engineer."
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
Returns whether the authenticated user's setup has started, derived from the organization's `Daily` records.
Setup is considered started once at least one `Daily` exists for the organization.

### What it needs
- Bearer auth with a Cadence JWT

### Headers example

```http
Authorization: Bearer <cadence_access_token>
```

### What it returns
- `404 Not Found` when no setup `Daily` records exist for the organization
- `204 No Content` when at least one setup `Daily` exists

### Not found error example (no organization assigned)

```json
{
  "error": true,
  "runId": null,
  "schemaVersion": "1.0.0",
  "reason": "No organization found for the authenticated user."
}
```

### Not found error example (no setup dailies)

```json
{
  "error": true,
  "runId": null,
  "schemaVersion": "1.0.0",
  "reason": "No setup found for the authenticated user."
}
```

### Completed response example

```http
HTTP/1.1 204 No Content
```
