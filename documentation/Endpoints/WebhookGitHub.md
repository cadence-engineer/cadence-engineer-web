# Webhook GitHub Endpoints

## `POST /v1/webhook/github`

### What it does
Receives GitHub app webhooks and logs GitHub installation create/delete events.
Non-installation events are accepted and return success without additional processing.

### What it needs
- No Cadence auth required
- Request header:
  - `X-GitHub-Event` (`installation` to trigger installation-event handling)
- JSON request body for installation events:
  - `action` (`created` or `deleted`)
  - `installation.id` (integer)

### Request example

```json
{
  "action": "created",
  "installation": {
    "id": 123456
  }
}
```

### What it returns
- `200 OK`
- No JSON response body

### Response example

```http
HTTP/1.1 200 OK
```
