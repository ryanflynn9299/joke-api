# Backend

Spring Boot REST API backed by PostgreSQL and Flyway migrations.

## Stack

| Layer | Technology |
| ----- | ---------- |
| Runtime | Java 25, Spring Boot 4 |
| Persistence | Spring Data JPA, Hibernate |
| Database | PostgreSQL 16 |
| Migrations | Flyway (`backend/src/main/resources/db/migration/`) |
| Build | Gradle (`./gradlew`) |

## Project structure

```
backend/src/main/java/joke/
├── App.java                          Application entry point
├── api/
│   ├── controllers/                  REST controllers
│   ├── services/                     Business logic + JPA Specifications
│   ├── repositories/                 Spring Data repositories
│   ├── entities/                     Joke, Author, JokeType, JokeSegment
│   └── dtos/                         DTOs (currently unused by controllers)
└── daemon/
    ├── jobs/JokeOfTheDayDaemon.java  Scheduled JOTD reset
    └── services/JokeOfTheDayService.java
```

## API (`/api/v1`)

All endpoints are public read-only. CORS is open (`*`).

| Method | Path | Description |
| ------ | ---- | ----------- |
| `GET` | `/joke-of-the-day` | Today's featured joke. Triggers on-demand JOTD selection if none is set for today. |
| `GET` | `/jokes` | All non-deleted jokes |
| `GET` | `/jokes/{id}` | Single joke by ID |
| `GET` | `/jokes/search?q={term}` | Paginated keyword search (content, author first/last name). Supports standard Spring `page`, `size`, `sort` params. |
| `GET` | `/authors/{id}` | Author by ID |

### Response shape (Joke)

Controllers return `Joke` entities directly. Typical JSON fields:

```json
{
  "id": 1,
  "jokeContent": "Why was Cinderella so bad at soccer?;She ran away from the ball!",
  "jokeType": "ONE_LINER",
  "author": {
    "authorId": 1,
    "authorFirstName": "Ryan",
    "authorLastName": "Flynn"
  },
  "createdDateTime": "2026-02-04T12:00:00Z",
  "modidifiedDateTime": "2026-02-04T12:00:00Z",
  "lastJotdDatetime": "2026-06-29",
  "segments": [
    { "text": "Why was Cinderella so bad at soccer?", "type": "SETUP", "index": 0 },
    { "text": "She ran away from the ball!", "type": "PUNCHLINE", "index": 1 }
  ]
}
```

Joke content uses semicolon-delimited segments. The `segments` field is computed at runtime from `jokeContent` (not stored in the database).

### Not implemented

- `POST`, `PUT`, `PATCH`, `DELETE` for jokes or authors
- Bearer token / API authentication
- OpenAPI UI (configured in `application.yml` but dependency not wired)
- List-all-authors endpoint

## Joke of the Day

**Selection rules** (`JokeOfTheDayService`):

1. If a joke already has `last_jotd_datetime = today`, return it (idempotent).
2. Otherwise pick a random joke where `last_jotd_datetime` is `NULL` or older than 10 days.
3. Set `last_jotd_datetime` to today for the chosen joke.

**Scheduler** (`JokeOfTheDayDaemon`):

- Cron: every 15 minutes, `America/New_York`
- Also runs once on application startup
- Requires `@EnableScheduling` on the application class (see [TODO.md](TODO.md))

## Soft delete

Both `jokes` and `author` tables have an `is_deleted` flag. Hibernate `@SQLRestriction("is_deleted = false")` filters deleted records from queries automatically.

## Configuration

Key environment variables (see `.env.example`):

| Variable | Purpose |
| -------- | ------- |
| `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` | Database credentials |
| `DB_HOST` | Postgres host (`localhost` for local dev, `ja-database` in Docker) |
| `SERVER_PORT` | API port (default `8080`) |

Actuator exposes `/actuator/health` and `/actuator/info`.

## Running

```bash
# Local (loads ../.env automatically via bootRun task)
cd backend && ./gradlew bootRun

# Tests
./gradlew test
```

## Docker

Multi-stage build in `backend/Dockerfile`. Compose service `ja-backend` maps port `8080`.
