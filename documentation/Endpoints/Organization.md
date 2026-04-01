# Organization Endpoints

## `GET /v1/organization`

### What it does
Returns the selected organization of the authenticated Cadence user.

### What it needs
- Bearer auth with a Cadence JWT
- No request body

### Headers example

```http
Authorization: Bearer <cadence_access_token>
```

### What it returns
- `200 OK`
- JSON response body:
  - `login` (string)

### Response example

```json
{
  "login": "cadence-engineer"
}
```

### Common error example

```json
{
  "error": true,
  "runId": null,
  "schemaVersion": "1.0.0",
  "reason": "No organization found for the authenticated user."
}
```

---

## `PUT /v1/organization`

### What it does
Sets the selected organization for the authenticated Cadence user from a GitHub organization login.
During this operation, the API also resolves the `cadence-engineer` app installation for that organization,
creates a GitHub installation access token, and stores it on the organization installation record.
This endpoint is restricted to the Cadence admin account.

### What it needs
- Bearer auth with a Cadence JWT
- The authenticated Cadence user must be the Cadence admin
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
- `200 OK`
- JSON response body:
  - `login` (string)

### Response example

```json
{
  "login": "cadence-engineer"
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

### Forbidden error example (non-admin caller)

```json
{
  "error": true,
  "runId": null,
  "schemaVersion": "1.0.0",
  "reason": "Only the Cadence admin can access this endpoint."
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

### Common error example (app not installed)

```json
{
  "error": true,
  "runId": null,
  "schemaVersion": "1.0.0",
  "reason": "GitHub app 'cadence-engineer' is not installed for organization 'acme'."
}
```
