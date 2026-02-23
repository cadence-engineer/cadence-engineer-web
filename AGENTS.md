# AGENTS.md

## Purpose
This repository is a Next.js (App Router, TypeScript) frontend for the `cadence-engineer-api` Vapor backend.

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
5. Prefer server-side data fetching when SEO/perf allows it.
6. For browser-side calls, only expose safe values via `NEXT_PUBLIC_*` env vars.

## Environment Variables
Use these names unless the project already defines alternatives:
- `CADENCE_API_BASE_URL`: server-side base URL for Vapor API.
- `NEXT_PUBLIC_CADENCE_API_BASE_URL`: optional public base URL for client-side requests.

Typical local backend URL is `http://localhost:8080` (adjust if your Vapor app runs elsewhere).

## App Router Conventions
1. Keep route UI in `app/**`.
2. Put reusable non-UI logic in `lib/**`.
3. Prefer Server Components by default; use Client Components only when interactivity is required.
4. Keep page-level loading/error states explicit (`loading.tsx`, `error.tsx`) for async routes.

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
