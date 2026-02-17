# Backend Documentation
Some notes about my implementation as I build for consolidation and future reference

## Structure
- Spring REST API over Hibernate
- Daemon to reset JOTD daily
- CSR API architecture/project structure
- Bearer token for API authentication

### API Structure
- Author
    - GET info
- Jokes
    - GET JOTD
    - GET joke by ID
    - POST new joke
    - single/bulk PATCH/PUT joke record and metadata
    - DELETE joke

### JOTD Daemon information
- runs around midnight for earliest timezone, application handles day divide
- randomly select from eligible jokes
    - scaling question: randomly select sample? as n gets large?
- selects from null or !(WITHIN LAST MIN(30|n-1) days)


### E2E Tests required
- POST new Joke, DELETE joke
