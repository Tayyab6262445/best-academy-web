# Best Academy — Student Web Portal

A production React (Vite) web port of the Best Academy React Native student app. Same brand,
same layouts, same navigation flow, same API/backend — no teacher portal (student-only by
design). See [TICKETS.md](./TICKETS.md) for the full migration breakdown, including every
deliberate deviation from the RN source (and why).

## Stack

- React 19 + Vite 7
- React Router 7 (client-side only — no SSR/RSC/server actions)
- Redux Toolkit + RTK Query (auth, classes/subjects, test attempts)
- Tailwind CSS 3 (same `academyRed` / `academyYellow` / `academyBlue` palette as the RN app)
- react-icons (Ionicons5 set) — 1:1 icon-name mapping with `@expo/vector-icons`' `Ionicons`

## Getting started

```bash
npm install
cp .env.example .env      # set VITE_API_BASE_URL if you're not using the default
npm run dev                # http://localhost:5173
```

## Environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_BASE_URL` | No | `https://acadify-backend-production.up.railway.app/api/` | Base URL of the Acadify backend API. Must include the trailing `/api/`. |

Copy `.env.example` to `.env` for local overrides. On Vercel, set `VITE_API_BASE_URL` under
Project Settings → Environment Variables (Production/Preview/Development).

## Scripts

```bash
npm run dev       # start dev server
npm run build     # production build to dist/
npm run preview   # preview the production build locally
npm run lint      # eslint
```

## Deployment (Vercel)

1. Import this repository into Vercel (framework preset: Vite).
2. Build command: `npm run build`, output directory: `dist` (Vercel auto-detects both).
3. Set `VITE_API_BASE_URL` as an environment variable if you need a non-default backend.
4. `vercel.json` in this repo rewrites all paths to `/index.html` so client-side routing
   (`/dashboard`, `/attendance`, deep links, browser refresh on any route) works correctly.

## What's intentionally different from the React Native app

This is a **1:1 recreation of the student experience** — same colors, typography, spacing,
icons, navigation flow and business logic — with a handful of necessary web adaptations.
Full rationale for each is in [TICKETS.md](./TICKETS.md); summary:

- **No teacher portal.** The RN app's teacher screens and teacher-only API mutations
  (`createTest`, `publishTest`, MCQ CRUD, subject CRUD, teacher test listings) are not part
  of this web app. Student-shared endpoints (classes/sections/subjects/pdfs) are kept.
- **Auth persists to `localStorage`.** The RN app keeps auth in memory only, so a cold app
  restart re-shows login. A web page refresh is a routine action, not a restart — persisting
  the session avoids logging students out constantly.
- **PDF export uses the browser's print dialog**, not `expo-print`/`expo-sharing` (no web
  equivalent) — same HTML report, "Print to PDF" instead of a native share sheet.
- **No screenshot-blocking on the course library.** `expo-screen-capture` has no browser
  equivalent; browsers cannot prevent screenshots.
- **Pull-to-refresh → a refresh button.** The Attempted Tests screen used a native
  pull-to-refresh gesture; the web version exposes the same `refetch` via a visible icon
  button.
- **Quiz Result screen reads the logged-in student's ID from Redux**, not a hardcoded
  default that shipped in the RN source (`studentId = "69adb8737005bb0be16b8b81"`) — a bug
  fix, since no RN screen ever actually passed that prop.

## Known inherited behavior

The results screen submits the student's stored password back to the `results/view` endpoint
(`{ rollNumber, password }`), exactly as the RN app does — this is existing backend API
contract, unchanged here.

## Project structure

```
src/
  api/            RTK Query slices (authApi, testApi, attemptApi) + base URL
  app/            Redux store
  features/auth/  authSlice (login state, persisted to localStorage)
  components/     Shared primitives: Icon, Pressable, SafeArea, Spinner, AlertProvider,
                  ProtectedRoute, ErrorBoundary
  layouts/        TabLayout (bottom tab bar / desktop sidebar)
  pages/          One file per screen, named after its route
```
