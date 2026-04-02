# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 16 (App Router, TypeScript strict) web app serving as a BFF (Backend-For-Frontend) for the `cadence-engineer-api` Vapor backend. The browser never calls the Vapor API directly — all requests go through Next.js route handlers.

## Commands

- **Install**: `pnpm install`
- **Dev server**: `pnpm dev` (runs on localhost:3000)
- **Lint**: `pnpm lint`
- **Build**: `pnpm build` (fallback: `pnpm build:webpack` if environment blocks turbopack)
- **Start**: `pnpm start`
- **No test runner** is configured.

Always run `pnpm lint` and `pnpm build` before finishing work.

## Environment Variables

Set in `.env.local`:
- `DEV_API_URL` — local Vapor backend (typically `http://localhost:8080`)
- `PROD_API_URL` — production backend (`https://api.cadence.engineer`)
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` — GitHub OAuth app credentials

## Architecture

### BFF Pattern

```
Browser → Next.js BFF (/api/**) → Vapor backend
```

- **Browser-side API calls** use `fetchBff()` from `lib/api/client.ts` which hits `/api/**` routes with `credentials: "include"`.
- **Server-side API calls** use `fetchCadenceApi()` from `lib/server/cadence-api.ts` which calls the Vapor backend directly using `DEV_API_URL`/`PROD_API_URL`.
- Client modules live in `lib/api/` (dailies-client, organizations-client, auth-client).
- Server modules live in `lib/server/` (cadence-api, auth-session, auth-cookies, access-token).

### Auth Flow (GitHub OAuth)

1. `GET /auth/github/start` — generates OAuth state cookie, redirects to GitHub
2. `GET /auth/github/callback` — validates state, exchanges code with Vapor, sets HttpOnly `cadence_access` cookie
3. Middleware (`proxy.ts`) validates JWT on every request; redirects to `/auth/session-expired` if expired
4. Session operations via BFF: `GET /api/auth/me`, `POST /api/auth/logout`

### Key Conventions

- **Server Components** are the default; add `"use client"` only for interactive UI
- **Route handlers** (`app/api/`) proxy to Vapor and handle auth token injection
- **Auth routes** live in `app/auth/` (GitHub OAuth start/callback, sign-out, session-expired)
- **Shared types** and data parsing live in `lib/daily/types.ts`
- **Middleware** (`proxy.ts`) handles token validation and auth redirects before page render
- **Styling**: Tailwind CSS v4, Geist font/icons
- **Path aliases**: `@/*` → root, `geist/icons` → `./lib/geist-icons`

### Setup Flow

- `GET /api/setup` → 404 (setup required) or 204 (complete)
- `POST /api/setup` → 202 (initiates setup for selected org)

## Key Rules

- Browser code must call `/api/**` BFF endpoints, never the Vapor backend directly.
- Centralize backend calls in `lib/api/` (browser) or `lib/server/` (server). No scattered raw `fetch`.
- Use TypeScript types for all request/response payloads.
- Handle non-2xx API responses explicitly; don't throw raw backend payloads into UI.
- Inspect existing patterns in nearby files before editing.
