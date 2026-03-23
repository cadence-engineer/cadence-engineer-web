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

## Endpoint Files

- [V1](Endpoints/V1.md)
- [Auth GitHub](Endpoints/AuthGitHub.md)
- [Whitelist](Endpoints/Whitelist.md)
- [Blacklist](Endpoints/Blacklist.md)
- [User](Endpoints/User.md)
- [Available Organizations](Endpoints/AvailableOrganizations.md)
- [Organization](Endpoints/Organization.md)
- [Setup](Endpoints/Setup.md)
- [Pull Request Summaries](Endpoints/PullRequestSummaries.md)
- [Daily](Endpoints/Daily.md)
- [Sprint](Endpoints/Sprint.md)
- [Webhook GitHub](Endpoints/WebhookGitHub.md)
