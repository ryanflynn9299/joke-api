# Joke API

A full-stack joke-of-the-day application: Spring Boot REST API, PostgreSQL, and a React SPA.

## What it does today

- Serves a daily **Joke of the Day** (JOTD), selected from jokes not featured in the last 10 days
- Lists all jokes and returns individual jokes by ID
- Supports keyword search across joke content and author names
- Provides a consumer-facing UI with spoiler reveals, share links, and global search (⌘K / Ctrl+K)
- Offers **Developer Mode** — an API-oriented view with cURL examples and raw JSON

Read-only API. Write endpoints (create/update/delete) and authentication are not implemented yet.

## Repository layout

```
backend/          Spring Boot 4 API (Java 25, Gradle)
frontend/         Vite + React 19 SPA
documentation/    Architecture, data model, and running TODO
docker-compose.yml  Postgres + backend + frontend containers
```

## Quick start (Docker)

1. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

   For Docker, set `DB_HOST=ja-database` in `.env`.

2. Create the external network (required once):

   ```bash
   docker network create backend-net
   ```

3. Start the stack:

   ```bash
   docker compose up --build
   ```

| Service   | URL                        |
| --------- | -------------------------- |
| Frontend  | http://localhost:5173      |
| Backend   | http://localhost:8080      |
| Postgres  | localhost:5432             |

Health check: `GET http://localhost:8080/actuator/health`

## Local development (without Docker)

**Backend** — requires Java 25, PostgreSQL, and a `.env` file with `DB_HOST=localhost`:

```bash
cd backend && ./gradlew bootRun
```

**Frontend** — requires Node 22+ and pnpm:

```bash
cd frontend && pnpm install && pnpm dev
```

The frontend reads `VITE_API_URL` (defaults to `http://localhost:8080/api/v1`). In dev mode, if the backend is unreachable, the UI falls back to mock data.

## Documentation

| Doc | Description |
| --- | ----------- |
| [documentation/backend.md](documentation/backend.md) | API endpoints, JOTD daemon, stack |
| [documentation/data.md](documentation/data.md) | Schema, migrations, joke content format |
| [documentation/frontend.md](documentation/frontend.md) | Routes, features, testing |
| [documentation/TODO.md](documentation/TODO.md) | Running backlog to refine current features |
| [frontend/docs/design-system.md](frontend/docs/design-system.md) | UI tokens and component standards |
| [frontend/docs/developer-mode.md](frontend/docs/developer-mode.md) | Developer Mode behavior |

## Tests

```bash
# Backend
cd backend && ./gradlew test

# Frontend unit tests
cd frontend && pnpm test
```
