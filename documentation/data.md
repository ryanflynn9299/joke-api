# Data Layer

PostgreSQL schema managed by Flyway migrations in `backend/src/main/resources/db/migration/`.

## Tables

### `author`

| Column | Type | Notes |
| ------ | ---- | ----- |
| `author_id` | `SERIAL` PK | Auto-increment integer |
| `author_first_name` | `VARCHAR(255)` NOT NULL | |
| `author_last_name` | `VARCHAR(255)` | Nullable in DB; entity marks required |
| `last_posted_date` | `DATE` | Nullable; unused by current API |
| `is_deleted` | `BOOLEAN` DEFAULT `FALSE` | Added in V3; soft delete |

### `jokes`

| Column | Type | Notes |
| ------ | ---- | ----- |
| `joke_id` | `SERIAL` PK | |
| `content` | `TEXT` NOT NULL | Semicolon-delimited segments (see below) |
| `joke_type` | `VARCHAR(50)` | Maps to `JokeType` enum |
| `author_id` | `INT` FK → `author` | `ON DELETE RESTRICT` |
| `created_date` | `TIMESTAMPTZ` | Default `NOW()` |
| `modified_date` | `TIMESTAMPTZ` | Default `NOW()` |
| `last_jotd_datetime` | `DATE` | Nullable; set when joke is JOTD |
| `is_deleted` | `BOOLEAN` DEFAULT `FALSE` | Soft delete |

## Joke content format

Content is a single `TEXT` field with segments separated by `;`:

```
setup text;middle segment (optional);punchline text
```

The `Joke.getSegments()` method parses this into typed segments:

| Position | Type |
| -------- | ---- |
| First | `SETUP` |
| Last | `PUNCHLINE` |
| Middle | `INTERACTION` |

## Joke types (`JokeType` enum)

`ONE_LINER`, `KNOCK_KNOCK`, `MULTI_TURN`, `STORY`, `INTERACTIVE`

Seed data currently uses `ONE_LINER` only.

## Migrations

| Version | File | Purpose |
| ------- | ---- | ------- |
| V1 | `V1__Initial_Schema.sql` | `author` and `jokes` tables |
| V2 | `V2__Seed_Data.sql` | 1 author (Ryan Flynn), 4 jokes |
| V3 | `V3__Add_Author_Soft_Delete.sql` | `is_deleted` on `author` |

## Useful commands

Reset the database completely (Docker):

```bash
docker compose down -v
docker compose up --build
```

Run migrations locally via Spring Boot startup (Flyway is enabled in `application.yml`).
