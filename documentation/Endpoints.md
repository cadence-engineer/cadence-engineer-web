# Cadence Engineer API Endpoints

Base path: `/v1`

## Conventions

- Content type for JSON endpoints: `application/json`
- Authenticated endpoints use bearer tokens:
  - `Authorization: Bearer <cadence_access_token>`
- Error responses are produced by `CadenceEngineerErrorMiddleware` in this shape:

```json
{
  "error": true,
  "runId": "8CC5C9AA-2E73-4E11-B84A-7E457AD01F95",
  "schemaVersion": "1.0.0",
  "reason": "Human-readable error message"
}
```

Notes:
- `runId` is nullable and only present when a route creates a `Run` for the request.
- Some endpoints return a status only (`200 OK`) with no JSON body.

---

## `GET /v1`

### What it does
Health/check endpoint. Returns a simple string.

### What it needs
- No auth
- No request body

### What it returns
- `200 OK`
- Plain text body: `It works!`

### Example response

```http
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8

It works!
```

---

## `GET /v1/hello`

### What it does
Simple hello endpoint. Also creates a run context for the request.

### What it needs
- No auth
- No request body

### What it returns
- `200 OK`
- Plain text body: `Hello, world!`
- Response header: `X-Run-Id: <uuid>`

### Example response

```http
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8
X-Run-Id: 8CC5C9AA-2E73-4E11-B84A-7E457AD01F95

Hello, world!
```

---

## `POST /v1/auth/github`

### What it does
Exchanges a GitHub OAuth `code`, resolves or creates the internal Cadence user, and returns a Cadence access token.
The returned Cadence JWT includes the GitHub OAuth access token claim for downstream GitHub requests.
Only allowlisted GitHub IDs can authenticate:
- `47605786`
- `265279238`

### What it needs
- No Cadence auth required (public endpoint)
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

### Common error example (GitHub account not allowlisted)

```json
{
  "error": true,
  "runId": null,
  "schemaVersion": "1.0.0",
  "reason": "GitHub account is not allowlisted."
}
```

---

## `GET /v1/user`

### What it does
Returns the authenticated Cadence user profile.

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
  - `id` (UUID)
  - `name` (string)
  - `email` (string or null)
  - `githubID` (integer or null)

### Response example

```json
{
  "id": "8cc5c9aa-2e73-4e11-b84a-7e457ad01f95",
  "name": "Cadence User",
  "email": "cadence@example.com",
  "githubID": 47605786
}
```

---

## `GET /v1/user/name`

### What it does
Returns only the authenticated Cadence user's name.

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
  - `name` (string)

### Response example

```json
{
  "name": "Cadence User"
}
```

---

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
- JSON response body: array (filtered to orgs with installed app `cadence-engineer`)
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

---

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
  "reason": "No organization selected for the authenticated user."
}
```

---

## `PUT /v1/organization`

### What it does
Sets the selected organization for the authenticated Cadence user from a GitHub organization login.
During this operation, the API also resolves the `cadence-engineer` app installation for that organization,
creates a GitHub installation access token, and stores it on the organization installation record.

### What it needs
- Bearer auth with a Cadence JWT
- If the Cadence JWT has no GitHub access token claim,
  the endpoint redirects to `/auth/github`
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

### Redirect example (missing GitHub access token)

```http
HTTP/1.1 307 Temporary Redirect
Location: /auth/github
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

---

## `POST /v1/pull-request-summaries`

### What it does
Fetches a GitHub pull request (including commits and changed files), resolves/stores summary artifacts, and returns success.

### What it needs
- No Cadence auth required
- JSON request body:
  - `owner` (string, required, non-empty)
  - `repo` (string, required, non-empty)
  - `pull_number` (int, required, `>= 1`)
  - `token` (string, optional, GitHub token used for API calls)

### Request example

```json
{
  "owner": "octocat",
  "repo": "hello-world",
  "pull_number": 42,
  "token": "github_pat_xxx"
}
```

### What it returns
- `200 OK`
- No JSON response body (status only)
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
  "reason": "Validation failed: pull_number is not valid"
}
```

---

## `POST /v1/daily-summaries`

### What it does
Generates or resolves a daily summary artifact for a given day.

### What it needs
- No Cadence auth required
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
- No JSON response body (status only)
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

---

## `POST /v1/sprint-summaries`

### What it does
Generates or resolves a sprint summary artifact anchored to a given day.

### What it needs
- No Cadence auth required
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
- No JSON response body (status only)
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
  "reason": "Invalid day 'March 10, 2026'. Expected format: YYYY-MM-DD."
}
```

---

## `POST /v1/webhook/github`

### What it does
Receives GitHub app webhooks. It only acts on `installation` events and logs app install/uninstall actions.

### What it needs
- No Cadence auth required
- Header:
  - `X-GitHub-Event: installation` (required for processing)
- JSON body for installation events:
  - `action` (string enum: `created` or `deleted`)
  - `installation.id` (int)

### Request example

```http
X-GitHub-Event: installation
Content-Type: application/json
```

```json
{
  "action": "created",
  "installation": {
    "id": 987654
  }
}
```

### What it returns
- `200 OK`
- No JSON response body
- If `X-GitHub-Event` is not `installation`, the endpoint still returns `200 OK` and does nothing.

### Response example

```http
HTTP/1.1 200 OK
```
