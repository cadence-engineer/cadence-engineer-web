# Pull Request Summary Endpoints

## `POST /v1/pull-request-summaries`

### What it does
Fetches a GitHub pull request, its commits, and its changed files, resolves and stores summary artifacts, and returns success.

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
  "reason": "Validation failed: pull_number is not valid"
}
```
