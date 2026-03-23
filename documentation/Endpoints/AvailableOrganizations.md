# Available Organizations Endpoints

## `GET /v1/available-organizations`

### What it does
Returns only GitHub organizations for the authenticated Cadence user
where the Cadence GitHub app (`cadence-engineer`) is installed and visible
to that user.

### What it needs
- Bearer auth with a Cadence JWT
- The Cadence JWT must include a GitHub access token claim
- No request body

### Headers example

```http
Authorization: Bearer <cadence_access_token>
```

### What it returns
- `200 OK`
- JSON response body: array
  - `login` (string)

### Response example

```json
[
  {
    "login": "cadence-engineer"
  }
]
```

### Common error example (missing GitHub access token claim)

```json
{
  "error": true,
  "runId": null,
  "schemaVersion": "1.0.0",
  "reason": "Missing GitHub access token for the authenticated user."
}
```
