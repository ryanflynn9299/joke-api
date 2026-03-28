# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Tech Stack

- Javascript
- React
- Vite
- React Router
- TanStack Query
- Zustand
- Tailwind CSS
- Jest unit testing
- Cypress E2E testing

## Routes

- / - Home, Joke of the day
- /jokes - Jokes List (random, pagination, search, filter by author)
- /jokes/:id - Joke Details, deep link for shared jokes
- /authors - Authors List
- /authors/:id - Author Details
- /about - About Page
- /browse - stream of jokes, "infinite" scroll

## Navigation

- Home -> /jokes (main navigation)
  - access list of jokes
- Home -> /browse (main navigation)
  - access stream of jokes
- Home -> /authors (main navigation)
  - access list of authors
- Home -> /about (Footer)
  - access about page
- Home/Jokes/Browse -> jokes/id
  - deep link to joke (shareable)
- Anywhere -> projects (return to main website, exit application)
