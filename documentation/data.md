# Data Layer Information

## Models
- Joke
    - sequential id
    - joke content
    - joke author
    - created date
    - modified date
    - categories
    - last_joke_of_day_dt

- Author
    - author UUID
    - Author name
    - Author created
    - author modified

## Data Types
- joke_id INT non-null unique
- content VARCHAR(255) non-null unique
- author_id INT foreign key non-null (will have an anon user default)
- created_date, modified_date date object handled by POSTGRES
- categories nullable VARCHAR(255) csv
- last_joke_of_day_dt date nullable
- author_name VARCHAR(255) non-null

## Users
- APP_USER: read/write
- DATA_OWNER: Write/Migrations/Own data

## Next Steps
- write compose - DONE
- write DDL create tables - DONE
- write initial DML with 5 jokes - DONE
- write queries for:
    - get JOTD
    - get new joke
    - get n jokes
    - get joke by id

## Useful commands
- docker compose down -v
    - Reset db completely





