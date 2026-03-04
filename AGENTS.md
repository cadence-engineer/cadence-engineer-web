# AGENTS.md

## Purpose
This repository is a Next.js (App Router, TypeScript) web app for the `cadence-engineer-api` Vapor backend.

The app is mostly frontend, but authentication and API access use a BFF layer in Next.js route handlers.

Agents working here should prioritize:
- Safe, typed API integration.
- Clear separation between UI and networking logic.
- Small, reviewable changes.

## Stack And Defaults
- Framework: Next.js 16 (`app/` directory).
- Language: TypeScript (`strict: true`).
- Styling: Tailwind CSS v4.
- Linting: ESLint (`eslint-config-next`).
- Package manager: `pnpm`.

## Common Commands
- Install deps: `pnpm install`
- Dev server: `pnpm dev`
- Lint: `pnpm lint`
- Build: `pnpm build`
- Start production build: `pnpm start`

## API Integration Rules
1. Centralize backend calls in a shared client module (for example `lib/api/client.ts`).
2. Do not scatter raw `fetch` calls across unrelated UI components.
3. Keep endpoint paths, headers, and error handling in one place.
4. Use TypeScript types for request/response payloads.
5. Browser code must call Next.js BFF endpoints (`/api/**`) instead of calling `api.cadence.engineer` directly.
6. Next.js route handlers perform server-to-server calls to Vapor using `DEV_API_URL` / `PROD_API_URL`.

## Environment Variables
Use these names unless the project already defines alternatives:
- `DEV_API_URL`: base URL for backend calls in local development.
- `PROD_API_URL`: base URL for backend calls in production.
- `GITHUB_CLIENT_ID`: GitHub OAuth app client ID used by Next.js `/auth/github/start`.

Typical local backend URL is `http://localhost:8080` (adjust if your Vapor app runs elsewhere).

## App Router Conventions
1. Keep route UI in `app/**`.
2. Put reusable non-UI logic in `lib/**`.
3. Keep browser-facing auth entry/callback routes in `app/auth/**`.
4. Keep BFF API handlers in `app/api/**`.
5. Keep page-level loading/error states explicit (`loading.tsx`, `error.tsx`) for async routes.

## Canonical Auth Flow (BFF)
1. Browser starts login at `GET /auth/github/start` (Next.js).
2. Next.js generates OAuth `state`, stores it in HttpOnly cookie, and redirects to GitHub authorize URL.
3. GitHub redirects back to `GET /auth/github/callback?code=...&state=...` (Next.js).
4. Next.js validates `state` and calls Vapor server-to-server `POST /oauth/github/exchange` with `{ code }`.
5. Vapor exchanges GitHub code, resolves Cadence user, and returns Cadence auth tokens to Next.js.
6. Next.js stores Cadence auth in HttpOnly cookies and redirects browser into the app.
7. Browser uses Next.js BFF routes (`/api/auth/me`, `/api/auth/logout`) for session operations.

## Error Handling
- Always handle non-2xx API responses explicitly.
- Show user-friendly messages in UI, while preserving technical detail in logs.
- Avoid throwing raw backend payloads directly into rendered components.

## Change Guidelines For Agents
1. Before editing, inspect existing patterns in nearby files.
2. Make the smallest change that satisfies the request.
3. Run `pnpm lint` (and build when relevant) before finishing.
4. If you introduce new env vars or scripts, update `README.md`.
5. Do not add dependencies unless they are clearly necessary.

## Suggested Structure As The App Grows
- `lib/api/` for backend client, endpoint helpers, and shared types.
- `lib/utils/` for generic helpers.
- `app/(routes)/...` for route groups as feature count increases.
- `components/` for reusable UI primitives and feature components.

## Definition Of Done
- Feature works against the Vapor backend.
- Types are correct and no TypeScript errors are introduced.
- Lint passes.
- Any new setup requirements are documented.
