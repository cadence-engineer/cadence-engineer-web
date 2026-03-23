# Auth GitHub Endpoints

## `POST /v1/auth/github`

### What it does
Exchanges a GitHub OAuth `code`, resolves or creates the internal Cadence user, and returns a Cadence access token.
The returned Cadence JWT includes the GitHub OAuth access token claim for downstream GitHub requests.
Authentication and signup use database-backed access rules:
- Blacklist is always enforced and blocks authentication for matching GitHub IDs.
- Whitelist blocks authentication for any GitHub ID not present in the whitelist when `WHITELIST_AUTH_ENABLED=true`.
- If the same GitHub ID appears in both lists, blacklist wins.

### What it needs
- No Cadence auth required
- JSON request body:
  - `code` (string, required, non-empty)

### Request example

```json
{
  "code": "1a2b3c4d5e6f"
}
```

### What it returns
- `200 OK`
- JSON response body:
  - `accessToken` (string)

### Response example

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Common error example

```json
{
  "error": true,
  "runId": null,
  "schemaVersion": "1.0.0",
  "reason": "Validation failed: code is required"
}
```

### Common error example (GitHub account not whitelisted for auth)

```json
{
  "error": true,
  "runId": null,
  "schemaVersion": "1.0.0",
  "reason": "GitHub account is not whitelisted."
}
```
