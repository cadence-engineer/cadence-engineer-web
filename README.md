## Environment

Create a local `.env.local` file:

```bash
DEV_API_URL=http://localhost:8080
PROD_API_URL=https://api.cadence.engineer
GITHUB_CLIENT_ID=your-github-client-id
```

## Authentication Architecture (BFF)

Cadence web uses Next.js as a BFF between browser and Vapor API:
- Browser starts login at `GET /auth/github/start` on `cadence.engineer`.
- Next.js generates OAuth `state` and redirects to GitHub.
- GitHub returns to `GET /auth/github/callback` on Next.js.
- Next.js validates `state`, then calls Vapor server-to-server:
  - `POST {API_BASE}/oauth/github/exchange` with `{ "code": "<auth_code>" }`.
- Vapor resolves GitHub identity and returns Cadence auth tokens to Next.js.
- Next.js sets HttpOnly auth cookies and redirects to the app.

Browser auth/session calls go to Next.js BFF endpoints:
- `GET /api/auth/me`
- `POST /api/auth/logout`

The browser does not call `api.cadence.engineer` directly for auth and never receives GitHub tokens.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
