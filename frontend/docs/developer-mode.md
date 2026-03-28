# Developer Mode

Developer Mode is a specialized UI state designed for engineers and API consumers. It shifts the focus from a consumer-friendly "site" to a technical "API" perspective.

## Overview

When Developer Mode is enabled, the following changes occur across the platform:

- **Branding**: The primary subtext transforms from `Humor Engine` to `//Humor Engine`, adopting a code-comment syntax.
- **Hero Copy**: The main value proposition shifts to highlight the "API" nature of the service.
- **Joke Exploration**:
  - **cURL Skeleton**: Jokes are presented as terminal commands (`curl`) required to fetch them.
  - **Raw JSON**: The "response" for each joke is displayed in formatted JSON, showing the full data structure returned by the backend.
  - **Status Indicators**: Functional category tags are replaced with HTTP status codes (e.g., `200 OK`, `201 Created`).

## Toggling Developer Mode

The toggle is located in the top navigation bar (Header).

- **Normal Mode**: Standard consumer experience.
- **Dev Mode**: Technical API experience.

The state is persisted in your browser's local storage, so your preference will be remembered across sessions.

## Technical Implementation

Developer Mode is controlled via a global React Context (`DevModeContext`). Components subscribe to this context to conditionally render technical or consumer-oriented content.

```javascript
const { isDevMode } = useDevMode();

return <div>{isDevMode ? <ApiView /> : <ConsumerView />}</div>;
```
