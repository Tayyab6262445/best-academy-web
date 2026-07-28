# Best Academy Web — Migration Tickets

Source of truth: `f:\app` (Expo/React Native app, "Best Academy"). Target: this repo,
a production Vite + React web app with **feature parity for the student experience only**.
The teacher portal (`app/teacher/**`, `app/teacher-dashboard.js`, and teacher-only
endpoints in `src/Api/testApi.js`) is intentionally **excluded** from the web app per
product decision — students only.

Backend is unchanged: `https://acadify-backend-production.up.railway.app/api/` (Railway,
already live). No backend code in this repo.

---

## TICKET-01 — Project scaffold
**Do:** Vite + React (JS), Tailwind CSS v3 with `academyRed #E31E24`, `academyYellow #FFD100`,
`academyBlue #231F20` extended theme (copied from `tailwind.config.js`), `react-router-dom`,
`@reduxjs/toolkit` + `react-redux`, `dayjs`, `react-icons` (Ionicons5/`io5` set to match
`@expo/vector-icons` `Ionicons` 1:1 by name), path aliases (`@/`).
**After-effects:** Establishes every later ticket's import paths and design tokens. Getting
the color/spacing tokens wrong here means re-touching every screen later.

## TICKET-02 — State & API layer
**Do:** Port `authSlice.js` unchanged (logic-wise). Port `authApi.js` and the student-relevant
parts of `testApi.js` (`getClasses`, `getSections`, `getSubjects`) and all of `test.js`
(renamed `attemptApi.js`) unchanged. Drop teacher-only mutations
(`createSubject/updateSubject/deleteSubject/createTest/addSingleMcq/addBulkMcqs/publishTest/
getTeacherTests*/updateTestMetadata/archiveTest/deleteTest/updateMcq/deleteMcq/getQuizDetails`).
Base URL moves to `import.meta.env.VITE_API_BASE_URL` with the Railway URL as fallback so
Vercel env vars work without code changes.
**After-effects:** Every page's data-fetching hooks depend on this. Trimming the teacher
mutations here means `store.js`'s reducer map only registers 3 API slices, not touching
backend routes that never had a UI in this project anyway.

## TICKET-03 — Shared UI primitives
**Do:** `<Icon name="..." />` (maps Ionicons kebab-case names → `react-icons/io5` PascalCase),
`<Pressable>` (button reset + `active:opacity` to replace `TouchableOpacity`), `<SafeArea>`
(uses `env(safe-area-inset-*)` padding for notch phones), `<Spinner color size>` (replaces
`ActivityIndicator`), `<AlertModal>` / `useConfirm()` (replaces `Alert.alert` — RN's
`Alert.alert(title, msg, [Cancel, Submit])` confirm pattern is used in the test-submit flow,
so this needs a real modal, not `window.confirm`).
**After-effects:** Every page composes these instead of raw RN components. A bug here
propagates to all 11 screens, so this gets built and manually eyeballed before any page work.

## TICKET-04 — Routing & layouts
**Do:** `react-router-dom` tree mirroring `expo-router`'s file structure:
`/` (auth gateway, replicates `app/index.tsx`'s redirect-based-on-auth behavior — the RN
app's old marketing `HomePage.js` is dead code, not wired into any active route, so it is
**not** ported), `/login`, protected layout with bottom tab bar
(`dashboard|attendance|results|quizzes|profile`) mirroring `(tabs)/_layout.tsx` exactly
(same icons, same active/inactive colors `#E31E24`/`#94A3B8`), and full-screen stack routes
(`/courses`, `/pdf-viewer`, `/attempted-tests`, `/quiz-result`, `/test-attempt`,
`/review-test`) matching the RN stack screens. `<ProtectedRoute>` redirects to `/login` when
`isAuthenticated` is false, mirroring the gateway logic.
**After-effects:** Deep-linking and browser back/forward must behave sanely (RN used
`backBehavior="initialRoute"` on tabs — mirrored here so tab back-nav returns to dashboard).
Getting the guard wrong either exposes student data pre-login or traps users.

## TICKET-05 — Login page
**Do:** 1:1 port of `LoginPage.js`: dark gradient background, glass card, `BAM-` prefixed
roll number field, password field with show/hide, loading state disables inputs + button,
error handling identical (`error?.data?.message` fallback chain), success stores credentials
in Redux **and** localStorage (see persistence note in TICKET-02 after-effects below).
**After-effects:** This is the only entry point to the authenticated app — any regression
here blocks every other screen from being reachable during manual testing.

> **Deliberate web adaptation (documented, not silent):** The RN app keeps auth state in
> Redux memory only — no persistence — so a cold app restart always re-shows login. On the
> web, a page refresh is a routine, frequent action (not a full app restart), so keeping
> that literal behavior would log users out constantly. `authSlice` is persisted to
> `localStorage` on the web build only. This is a UX-necessary deviation, not a business-logic
> or API change — flagged here for visibility rather than buried silently in code.

## TICKET-06 — Dashboard
**Do:** 1:1 port of `Dashboard.js` — greeting logic, attendance summary card, bar
sparkline, 4 quick-action cards (Attempted Quiz / Quiz Result / Courses / Profile), notice
board teaser. All `router.push` targets remapped to the new route paths.

## TICKET-07 — Attendance
**Do:** 1:1 port of `attendance.tsx` — student card, circular rate indicator, month
scroller, status pill filter, infinite-scroll record list (`FlatList onEndReached` →
`IntersectionObserver` sentinel), PDF export.
**After-effects (deviation):** `expo-print` + `expo-sharing` have no web equivalent for
generating a native share sheet. Replaced with: build the same HTML report, open it in a
new tab, call `window.print()` — user saves as PDF via the browser's print dialog. Same
HTML/CSS as the original, same data, different delivery mechanism (necessary, not optional).

## TICKET-08 — Results
**Do:** 1:1 port of `results.tsx` — student ribbon, per-round cards with subject progress
bars, empty state.

## TICKET-09 — Quizzes (Student Test Portal)
**Do:** 1:1 port of `quizzes.tsx` — horizontal subject selector, test list cards, empty
states, loading states.

## TICKET-10 — Profile
**Do:** 1:1 port of `profile.tsx` — hero header, quick stats, academic/contact detail
rows, logout ("Terminate Session") clearing Redux + localStorage and redirecting to
`/login`.

## TICKET-11 — Courses & PDF viewer
**Do:** 1:1 port of `courses.js` (dark header, subject tabs, PDF list) and `pdf-viewer.js`
(Google Docs Viewer iframe — works natively on web, no WebView wrapper needed).
**After-effects (deviation):** `expo-screen-capture`'s screenshot-prevention has no web
API equivalent (browsers cannot block screenshots). Omitted; noted in README as a known
platform limitation, not silently dropped.

## TICKET-12 — Attempted Tests / Quiz Result / Review Test
**Do:** 1:1 port of `attemptedtest.js`, `quizresult.js`, `ReviewTest.js` — history cards,
pass/fail badges, per-question review with correct/incorrect highlighting.
`@react-navigation/native`'s `useRoute/useNavigation` calls in these three files convert to
`react-router-dom`'s `useNavigate` + route params/query string.

**Bug fixed while porting (flagged, not silent):** `quizresult.js`'s component signature is
`const QuizResult = ({ studentId = "69adb8737005bb0be16b8b81" }) => …` — a hardcoded debug
default. No caller in the RN app ever passes a `studentId` prop (`Dashboard` navigates to
`/quizresult` with zero params), so in production every student's Report Card silently shows
that one hardcoded test student's data instead of their own. `QuizResultPage.jsx` instead
reads `studentId` from the Redux auth user, matching the pattern `attemptedtest.js` already
uses correctly (`user?.studentId || user?._id || user?.id`). This is a correctness fix, not a
scope change.

**UX adaptation:** `attemptedtest.js`'s `FlatList` used `onRefresh`/`refreshing` (native
pull-to-refresh). The web has no pull-to-refresh gesture, so `AttemptedTestsPage` exposes the
same `refetch` behind a visible refresh icon button instead.

## TICKET-13 — Test Attempt (quiz-taking flow)
**Do:** 1:1 port of `test-attempt.js` — MCQ list, radio-style option selection, confirm-
before-submit dialog (via the `useConfirm()` primitive from TICKET-03), result modal with
score breakdown, redirect to quizzes on close.
**After-effects:** Highest-risk screen for data loss — a bug here means a student's answers
don't reach the API. Gets the most manual click-through testing.

## TICKET-14 — Responsive pass
**Do:** Every screen above is built mobile-first (matches RN default). This ticket adds
`sm:/md:/lg:` breakpoints: max-width centered content columns on desktop/tablet, bottom tab
bar becomes a left sidebar ≥ `md`, grids reflow (2-col quick actions → 4-col on desktop),
touch targets stay ≥44px. Visual identity (colors/type/radii/shadows) unchanged — only
layout reflow.

## TICKET-15 — Build verification
**Do:** `npm run build`, fix all errors/warnings, add a top-level `ErrorBoundary`, add a
`*` 404 route, verify no console errors during a full manual click-through of every screen.

## TICKET-16 — README
**Do:** Setup, local dev, env vars, build, deploy instructions; note the two documented
deviations (localStorage auth persistence, print-to-PDF, no screenshot-block) explicitly so
nothing looks like an accidental omission.

## TICKET-17 — GitHub
**Do:** `git init`, meaningful incremental commits, push to
`github.com/Tayyab6262445/best-academy-web`.

## TICKET-18 — Vercel deploy
**Do:** Deploy via Vercel, set `VITE_API_BASE_URL` env var, verify the live URL loads and
can hit the live Railway backend (login, dashboard fetch) without CORS/console errors.
