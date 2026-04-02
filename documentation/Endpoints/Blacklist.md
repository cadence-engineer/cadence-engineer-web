# Blacklist Endpoints

## `GET /v1/blacklist-auth`

### What it does
Returns the current blacklist of GitHub IDs blocked from Cadence authentication.

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
    "githubID": 999999
  }
]
```

---

## `POST /v1/blacklist-auth`

### What it does
Adds a GitHub ID to the blacklist. The operation is idempotent and returns the existing entry if already present.

### What it needs
- Bearer auth with a Cadence JWT
- Authenticated Cadence user must have GitHub ID `47605786`
- JSON request body:
  - `githubID` (integer, required)

### Request example

```json
{
  "githubID": 999999
}
```

### What it returns
- `200 OK`
- JSON response body:
  - `githubID` (integer)

### Response example

```json
{
  "githubID": 999999
}
```

---

## `DELETE /v1/blacklist-auth/:githubID`

### What it does
Removes a GitHub ID from the blacklist. The operation is idempotent.

### What it needs
- Bearer auth with a Cadence JWT
- Authenticated Cadence user must have GitHub ID `47605786`
- Path parameter:
  - `githubID` (integer, required)

### What it returns
- `204 No Content`
