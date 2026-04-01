# Whitelist Endpoints

## `GET /v1/whitelist-auth`

### What it does
Returns the current whitelist of GitHub IDs allowed to authenticate when `WHITELIST_AUTH_ENABLED=true`.

### What it needs
- Bearer auth with a Cadence JWT
- Authenticated Cadence user must have GitHub ID `47605786`
- No request body

### What it returns
- `200 OK`
- JSON array response body:
  - `githubID` (integer)

### Response example

```json
[
  {
    "githubID": 47605786
  },
  {
    "githubID": 265279238
  }
]
```

---

## `POST /v1/whitelist-auth`

### What it does
Adds a GitHub ID to the whitelist used for authentication when `WHITELIST_AUTH_ENABLED=true`.
The operation is idempotent and returns the existing entry if already present.

### What it needs
- Bearer auth with a Cadence JWT
- Authenticated Cadence user must have GitHub ID `47605786`
- JSON request body:
  - `githubID` (integer, required)

### Request example

```json
{
  "githubID": 265279238
}
```

### What it returns
- `200 OK`
- JSON response body:
  - `githubID` (integer)

### Response example

```json
{
  "githubID": 265279238
}
```

---

## `DELETE /v1/whitelist-auth/:githubID`

### What it does
Removes a GitHub ID from the authentication whitelist. The operation is idempotent.

### What it needs
- Bearer auth with a Cadence JWT
- Authenticated Cadence user must have GitHub ID `47605786`
- Path parameter:
  - `githubID` (integer, required)

### What it returns
- `204 No Content`
