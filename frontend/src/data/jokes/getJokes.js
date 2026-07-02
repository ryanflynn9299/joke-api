/**
 * Fetch layer consumed by TanStack Query. Every response is passed through
 * normalizeJoke() so the rest of the app never touches the wire format.
 * In Vite dev, network failures fall back to mock data so the UI is
 * workable without the backend running.
 */

import { apiUrl } from "../apiConfig.js";
import { normalizeJoke } from "../../utils/jokeUtils.js";
import {
  MOCK_JOKES,
  getMockJokeOfTheDay,
  getMockJokeById,
} from "./mockJokes.js";

// Fallback applies to local dev only — never in tests, where error paths
// must stay observable, and never in production builds.
const isDev = import.meta.env.DEV && import.meta.env.MODE !== "test";

async function fetchWithFallback(fetchFn, fallbackFn) {
  try {
    return await fetchFn();
  } catch (err) {
    if (isDev) {
      console.warn(
        `[Dev Fallback] Backend unavailable, using mock data. (${err.message})`,
      );
      return fallbackFn();
    }
    throw err;
  }
}

async function getJson(path, label) {
  const response = await fetch(apiUrl(path));
  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${label}: ${response.status} ${response.statusText}`,
    );
  }
  return response.json();
}

const fetchJokeOfTheDay = async () =>
  fetchWithFallback(
    async () =>
      normalizeJoke(await getJson("/joke-of-the-day", "joke of the day")),
    () => normalizeJoke(getMockJokeOfTheDay(), { isMock: true }),
  );

const fetchJokes = async () =>
  fetchWithFallback(
    async () => {
      const data = await getJson("/jokes", "jokes");
      return data.map((joke) => normalizeJoke(joke)).filter(Boolean);
    },
    () => MOCK_JOKES.map((joke) => normalizeJoke(joke, { isMock: true })),
  );

const fetchJokeById = async (id) =>
  fetchWithFallback(
    async () => {
      const response = await fetch(apiUrl(`/jokes/${id}`));
      if (!response.ok) {
        throw new Error(
          `Failed to fetch joke #${id}: ${response.status} ${response.statusText}`,
        );
      }
      // The backend answers 200 with an empty body for unknown ids.
      const text = await response.text();
      if (!text) throw new Error(`Joke #${id} not found`);
      return normalizeJoke(JSON.parse(text));
    },
    () => {
      const joke = getMockJokeById(id);
      if (!joke) throw new Error(`Mock joke #${id} not found`);
      return normalizeJoke(joke, { isMock: true });
    },
  );

/**
 * Keyword search over joke content and author names.
 * Returns { results, total } — `total` is the backend's totalElements,
 * which can exceed results.length when the page size truncates.
 */
const searchJokes = async (query, { size = 10 } = {}) => {
  if (!query) return { results: [], total: 0 };
  return fetchWithFallback(
    async () => {
      const data = await getJson(
        `/jokes/search?q=${encodeURIComponent(query)}&size=${size}`,
        "search results",
      );
      const results = (data.content || [])
        .map((joke) => normalizeJoke(joke))
        .filter(Boolean);
      return { results, total: data.totalElements ?? results.length };
    },
    () => {
      const q = query.toLowerCase();
      const results = MOCK_JOKES.filter((j) =>
        j.jokeContent.toLowerCase().includes(q),
      ).map((joke) => normalizeJoke(joke, { isMock: true }));
      return { results: results.slice(0, size), total: results.length };
    },
  );
};

export { fetchJokeOfTheDay, fetchJokes, fetchJokeById, searchJokes };
