# User Endpoints

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
