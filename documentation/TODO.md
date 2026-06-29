# TODO — Refine Current Features

Running action list for improving what already exists. No new product features yet — focus on correctness, completeness, and polish within the current scope.

Update this file as items are completed or reprioritized.

---

## Backend

### JOTD reliability
- [ ] Add `@EnableScheduling` to `App.java` so the cron-based JOTD reset actually runs
- [ ] Align JOTD lookback window documentation with code (currently 10 days; old notes referenced 30)
- [ ] Add integration test: JOTD selection is idempotent within the same day
- [ ] Handle edge case when no jokes are eligible for JOTD (empty pool after lookback filter)

### API completeness (read path)
- [ ] Return `404` with a consistent error body when joke/author ID is not found (currently returns `null`/empty)
- [ ] Adopt `JokeResponseDTO` in controllers — fix `modidifiedDateTime` typo and stabilize JSON field names
- [ ] Exclude or formally document transient `segments` in API responses
- [ ] Add `GET /authors` list endpoint (frontend has no author pages yet, but search references author names)
- [ ] Document `GET /jokes/search` in the in-app API reference (`ApiDocumentation.jsx`)

### Infrastructure / config
- [ ] Fix Docker port mismatch: Dockerfile exposes `8081`, app defaults to `8080`, compose healthcheck hits `8081`
- [ ] Add Spring Actuator dependency or remove healthcheck endpoint reference
- [ ] Wire `springdoc-openapi` dependency or remove unused config from `application.yml`
- [ ] Set `DB_HOST=ja-database` in `.env.example` with a comment for Docker vs local

### Write path (deferred — document before building)
- [ ] Design auth model (Bearer token mentioned in early notes; not started)
- [ ] Implement `POST /jokes` with validation
- [ ] Implement soft `DELETE /jokes/{id}` (privileged)
- [ ] Implement `PATCH /jokes/{id}` for content/metadata updates

---

## Data

- [ ] Add DB constraint or validation for semicolon-delimited content (minimum 2 segments for ONE_LINER)
- [ ] Seed additional joke types (`KNOCK_KNOCK`, `MULTI_TURN`) to exercise segment parsing in UI
- [ ] Decide fate of `last_posted_date` on `author` — use it or drop it
- [ ] Add index on `jokes.last_jotd_datetime` for JOTD queries at scale

---

## Frontend

### Explore / list page
- [ ] Add pagination to `/jokes` (backend supports Pageable on search; list endpoint returns all)
- [ ] Add client-side or server-side filter by author name
- [ ] Add sort options (newest, type, recently featured)

### Search
- [ ] Show empty-state vs loading vs error distinctly in SearchModal
- [ ] Highlight matched text in search results
- [ ] Debounce is 300ms — verify feel under slow network; consider stale-request cancellation

### Joke detail
- [ ] Improve 404 UX when joke ID does not exist
- [ ] Verify share/copy link works in production (nginx) as well as localhost
- [ ] "More jokes" section: avoid showing the current joke in related list

### Developer Mode
- [ ] Sync in-app API base URL with `VITE_API_URL` (hardcoded localhost check in JokeCard/JokeDetailPage)
- [ ] Add search endpoint to Developer Mode cURL examples
- [ ] Show mock-data indicator consistently when dev fallback is active

### API reference page (`HowItWorksPage`)
- [ ] Add missing `GET /jokes/search` endpoint docs
- [ ] Replace placeholder base URL (`https://api.joke.dev/v1`) with env-driven or clearly labeled example
- [ ] Tone down claims that overstate current backend (e.g. "comprehensive error handling" before 404 work lands)

### Housekeeping
- [ ] Remove unused `zustand` dependency or adopt it for a concrete need
- [ ] Add Playwright config and at least one smoke E2E test (script exists, no config)
- [ ] Remove stale references to Cypress/Jest from any remaining docs

---

## Testing

- [ ] Backend: controller tests for search pagination and JOTD endpoint
- [ ] Frontend: SearchModal interaction test
- [ ] E2E: home → explore → detail → share flow

---

## Documentation (meta)

- [x] Consolidate root README and `documentation/` to reflect current state
- [ ] Keep this TODO in sync when scope changes
- [ ] Add architecture diagram once write-path auth is designed

---

## Completed

_Move finished items here with date._

- 2026-06-29 — Documentation cleanup: root README, backend/data/frontend docs rewritten
