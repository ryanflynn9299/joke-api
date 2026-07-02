# Suggested Client Features

A curated backlog for the frontend. Each item earns its place by being
obviously useful for _this_ site at _this_ size — no feature here requires
accounts, monetization, or pretending the project is something it isn't.
They are ordered roughly by value-to-effort.

---

## Product

### 1. Shareable URL state

Put search queries and type filters in the URL (`/jokes?type=KNOCK_KNOCK`,
`/jokes?q=ball`). Filters survive refresh and back/forward, and any view
becomes a link you can send someone.

- **Approach:** `useSearchParams` as the single source of truth; the existing
  `searchJokes` pagination params map 1:1 onto query strings.
- **Demonstrates:** Treating the URL as state architecture rather than an
  afterthought — the difference between an app that deep-links and one that
  doesn't.

### 2. Hover-intent prefetching

Prefetch a joke's detail query when its card is hovered or focused, so
navigation feels instant (the Doherty threshold in the design system is a
budget; this is how you stay under it).

- **Approach:** `queryClient.prefetchQuery` on `pointerenter`/`focus` in
  `JokeCard`; TanStack Query dedupes against the cache for free.
- **Demonstrates:** Cache-aware performance work — optimizing perceived
  latency instead of reaching for a spinner.

### 3. Skeleton loading states

Replace the centered spinner with skeletons that match the final card
geometry on the browse grid and detail page. No layout shift, and the page
communicates its structure while loading.

- **Approach:** Static skeleton variants of `JokeCard` and the detail card
  rendered from the same layout primitives, gated on `isLoading`.
- **Demonstrates:** CLS-conscious rendering and component design that can
  express "shape without data."

### 4. Multi-language snippets in Developer Mode

Extend `ApiSnippet`'s cURL skeleton with tabs for `fetch`, Python
(`requests`), and Go. Developer Mode currently shows the request; this makes
it copy-pasteable into whatever the visitor is actually building.

- **Approach:** Snippet templates keyed by language over the existing
  `apiConfig` URL builder; one new tab strip component.
- **Demonstrates:** Developer-experience product sense — the same instinct
  that makes real API docs good.

### 5. Per-joke social share cards

Server-generated Open Graph images for `/jokes/:id` showing the setup —
punchline withheld, naturally. Shared links stop rendering as a generic
favicon and start doing the joke's job for it.

- **Approach:** A small edge function (or build-time generation, given the
  collection size) rendering setup text onto the design-system palette;
  `og:image` meta wired per route.
- **Demonstrates:** Working beyond the SPA boundary — edge rendering, social
  meta, and image generation as a pipeline.

---

## Engineering foundation

### 6. TypeScript migration with a typed API client

The tests are already TypeScript; the app isn't. Migrate `src/` and type the
wire format once in the data layer, so `normalizeJoke` becomes a checked
boundary instead of a documented convention.

- **Approach:** Incremental — `allowJs`, convert the data layer first, then
  components leaf-to-root. The normalized `Joke` model is the only type most
  components need.
- **Demonstrates:** Running an incremental migration without stopping
  feature work — a directly transferable production skill.

### 7. API contract tests

A small suite that runs against the real backend and asserts the actual
serialization: field names, segment ordering, the search page envelope,
the empty-200 on unknown ids. The class of bug where the client renders
fields the API never sent dies here.

- **Approach:** Vitest suite hitting `API_BASE_URL` behind a CI flag (or
  docker-compose service), validating responses against the same schema the
  typed client uses.
- **Demonstrates:** Consumer-driven contract testing — knowing where
  integration bugs actually come from.

### 8. End-to-end coverage for the critical journeys

The `e2e` script exists but has no specs. Cover the four journeys that
matter: reveal flow, browse → detail, search → select, and the Developer
Mode toggle persisting across reload.

- **Approach:** Playwright specs against the dev server with the existing
  MSW handlers reused for deterministic data; wire into CI alongside unit
  tests.
- **Demonstrates:** A deliberate test pyramid — unit contracts already
  exist; this adds the thin, high-value E2E layer on top.

### 9. Quality gates in CI

Budgets that fail the build: Lighthouse performance/accessibility scores,
axe-core violations, and bundle size. The design system promises premium
feel and <240ms interactions — gates make those claims falsifiable.

- **Approach:** Lighthouse CI + `@axe-core/playwright` in the E2E run, plus
  a size-limit check on `dist/`.
- **Demonstrates:** Turning quality standards into enforced constraints
  instead of aspirations.

---

## Non-goals

Deliberately excluded, to keep the project legible as what it is:

- **Accounts, favorites, submissions** — implies moderation and persistence
  the joke collection doesn't warrant.
- **Ratings or engagement mechanics** — the punchlines are underwhelming on
  purpose; measuring it would be cruel.
- **i18n** — the puns do not survive translation.
