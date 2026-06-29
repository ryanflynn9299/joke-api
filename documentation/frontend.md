# Frontend

Canonical documentation for the `frontend/` directory. React 19 single-page application built with Vite 7 and Tailwind CSS 4.

## Stack

| Layer | Technology |
| ----- | ---------- |
| UI | React 19, React Router 7 |
| Data | TanStack Query v5 |
| Styling | Tailwind CSS 4, custom design tokens (`src/index.css`) |
| Icons | Lucide React |
| Tests | Vitest + jsdom, Playwright (script defined, config not yet added) |
| Package manager | pnpm |

`zustand` is listed in dependencies but not used in the codebase.

## Routes

| Path | Page | Description |
| ---- | ---- | ----------- |
| `/` | JokeOfTheDayPage | Landing + today's featured joke |
| `/jokes` | JokeListPage | Grid of all jokes |
| `/jokes/:id` | JokeDetailPage | Single joke with reveal, share, and related jokes |
| `/how-it-works` | HowItWorksPage | Product overview + embedded API reference |

Global search (⌘K / Ctrl+K) opens a modal that queries `GET /jokes/search`.

## Data fetching

`src/data/jokes/getJokes.js` wraps all API calls:

- Base URL: `VITE_API_URL` or `http://localhost:8080/api/v1`
- In **dev mode**, network failures fall back to mock data in `mockJokes.js`

## Developer Mode

Toggle in the header. Persisted in `localStorage`. See [developer-mode.md](../frontend/docs/developer-mode.md).

When enabled, joke cards and detail views show cURL commands, raw JSON, and HTTP status styling instead of consumer copy.

## Design system

All UI work must follow [design-system.md](../frontend/docs/design-system.md) — semantic tokens, spacing grid, typography scale, and component base classes.

## Project structure

```
frontend/src/
├── App.jsx                 Route definitions
├── pages/                  Page components
├── components/
│   ├── jokes/              JokeCard, InlineSpoiler
│   ├── layout/             Header, Footer, Layout, ApiDocumentation
│   └── ui/                 Button, SearchModal, LoadingSpinner, etc.
├── context/                DevModeContext
├── data/jokes/             API fetchers + mocks
└── utils/                  jokeUtils (parse, format)
```

## Running

```bash
cd frontend
pnpm install
pnpm dev          # http://localhost:5173
pnpm build        # production build → dist/
pnpm test         # Vitest unit tests
pnpm lint         # ESLint
```

## Docker

Multi-stage build: Node builder → nginx serving static files on port 80. Compose maps `5173:80`.

## Tests

Unit tests live in `frontend/tests/joke/`:

- `joke.happy.test.tsx` — successful render paths
- `joke.error.test.tsx` — error states
- `joke.contract.test.tsx` — API response shape expectations
- `joke.invariant.test.tsx` — UI invariants

MSW handlers in `tests/mocks/` support isolated component testing.
