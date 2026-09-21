# Bowflex Workout Tracker

A full-stack Next.js workout tracker with Supabase persistence through its REST API.

## Prerequisites

- Node.js `>=22.13.0`
- A Supabase project
- A Vercel project connected to this repository

Vercel detects the Next.js application automatically. Use `npm install` for
local dependencies and the default `npm run build` command in Vercel.

## Included Shape

- edit site code under `app/`
- `app/chatgpt-auth.ts` provides optional dispatch-owned ChatGPT sign-in helpers
- `.openai/hosting.json` declares the Sites project and optional R2 binding
- `app/api/progress/route.ts` reads Supabase through server-side REST requests
- The workout API accepts only the selected `bill` or `paulette` user key
- `supabase/schema.sql` contains the PostgreSQL schema for the workout tables
- `db/` and `examples/d1/` remain as unused starter files from the original template

## Workspace Auth Headers

OpenAI workspace sites can read the current user's email from `oai-authenticated-user-email`.

SIWC-authenticated workspace sites may also receive `oai-authenticated-user-full-name` when the user's SIWC profile has a non-empty `name` claim. The full-name value is percent-encoded UTF-8 and is accompanied by `oai-authenticated-user-full-name-encoding: percent-encoded-utf-8`.

Treat the full name as optional and fall back to email when it is absent:

```tsx
import { headers } from "next/headers";

export default async function Home() {
  const requestHeaders = await headers();
  const email = requestHeaders.get("oai-authenticated-user-email");
  const encodedFullName = requestHeaders.get("oai-authenticated-user-full-name");
  const fullName =
    encodedFullName &&
    requestHeaders.get("oai-authenticated-user-full-name-encoding") ===
      "percent-encoded-utf-8"
      ? decodeURIComponent(encodedFullName)
      : null;

  const displayName = fullName ?? email;
  // ...
}
```

## Optional Dispatch-Owned ChatGPT Sign-In

Import the ready-to-use helpers from `app/chatgpt-auth.ts` when the site needs optional or required ChatGPT sign-in:

- Use `getChatGPTUser()` for optional signed-in UI.
- Use `requireChatGPTUser(returnTo)` for server-rendered pages that should send anonymous visitors through Sign in with ChatGPT.
- In a Server Component, start sign-in with `<a href={chatGPTSignInPath(returnTo)} target="_top">`. The auth helper module is server-only; do not import it into a Client Component.
- Do not use `fetch`, XHR, a client-side router, or a framework link that can prefetch the sign-in route. SIWC must start as a top-level navigation.
- Never request the AuthAPI authorization endpoint directly. The dispatch-owned `/signin-with-chatgpt` route must start the SIWC flow.
- Use `chatGPTSignOutPath(returnTo)` for browser sign-out links or actions.
- Pass a same-origin relative `returnTo` path for the destination after sign-in or sign-out. The helper validates and safely encodes it.
- Mark protected pages with `export const dynamic = "force-dynamic"` because they depend on per-request identity headers.

Dispatch owns `/signin-with-chatgpt`, `/signout-with-chatgpt`, `/callback`, the OAuth cookies, and identity header injection. Do not implement app routes for those reserved paths. Routes that do not import and call the helper remain anonymous-compatible.

SIWC establishes identity only; it does not prove workspace membership. Use the Sites hosting platform's access policy controls for workspace-wide restrictions, or enforce explicit server-side membership or allowlist checks.

Use SIWC for account pages, user-specific dashboards, saved records, and write actions tied to the current ChatGPT user. Leave public content anonymous.

## Production Subdomain

Deploy this app as its own Vercel project and attach the custom domain
`workouts.leblancsontheloose.com`. This keeps the existing
`leblancsontheloose.com` travel site and its routes unchanged. Workout data is
stored in Supabase through its server-side REST API.

Before sending production traffic:

1. Import this repository as a new project in Vercel and select Next.js if it
  is not detected automatically.
2. In **Project Settings > Environment Variables**, add the secrets
   `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Keep the service-role key
   server-only; it must not be exposed to browser code.
3. In Supabase SQL Editor, run `supabase/schema.sql`, or confirm the project
  already contains the PostgreSQL tables
  `w_workout_entries`, `w_cardio_entries`, and `w_weekly_weights` with the columns
   used by `app/api/progress/route.ts`. The existing SQLite migration in
   `drizzle/` should not be applied directly to Supabase.
4. In Vercel, open the project’s **Settings > Domains**, add
  `workouts.leblancsontheloose.com`, and follow the DNS verification step. If
  the root domain is already connected to the travel site, only the
  `workouts` subdomain should point to this Vercel project.
5. Open `https://workouts.leblancsontheloose.com` and submit a test workout,
  cardio entry, and weight entry. Confirm that refreshing the page retains the
  data.

No `basePath`, hostname check, or redirect is required in the application code;
Vercel serves the same app on the custom domain.

For direct API testing, send the selected user in the `x-workout-user` header:

```bash
curl -H "x-workout-user: bill" http://localhost:3000/api/progress
curl -H "x-workout-user: paulette" http://localhost:3000/api/progress
```

## Database upgrades

Before deploying the workout difficulty checkbox, run
`supabase/migrations/20260921_add_workout_difficulty.sql` in the Supabase SQL
Editor. It adds the `too_easy` flag and defaults existing sets to unchecked.

## Local Commands

- Copy `.env.local.example` to `.env.local` and fill in the Supabase project URL
  and service-role key from **Supabase > Project Settings > API**. Never commit
  `.env.local` or expose the service-role key with a `NEXT_PUBLIC_` name.
- `npm run dev`: start the Next.js development server
- `npm run build`: build the Vercel deployment artifact
- `npm run start`: start the production Next.js server

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
