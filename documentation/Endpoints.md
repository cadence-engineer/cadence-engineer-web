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

---

## `GET /v1/organizations`

### What it does
Returns all GitHub organizations for the authenticated Cadence user.

### What it needs
- Bearer auth with a Cadence JWT
- The authenticated user must have a stored GitHub access token
- No request body

### Headers example

```http
Authorization: Bearer <cadence_access_token>
```

### What it returns
- `200 OK`
- JSON response body:
  - `organizations` (array)
    - `id` (int)
    - `name` (string)
    - `url` (string)

### Response example

```json
{
  "organizations": [
    {
      "id": 12345,
      "name": "cadence-engineer",
      "url": "https://api.github.com/orgs/cadence-engineer"
    }
  ]
}
```

### Common error example

```json
{
  "error": true,
  "runId": null,
  "schemaVersion": "1.0.0",
  "reason": "Missing GitHub access token for the authenticated user."
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
