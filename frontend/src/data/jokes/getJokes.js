/**
 * This file contains the functions used by TanStack Query to fetch jokes from the backend API.
 * In dev mode, if the backend is unavailable, mock data is used as a fallback.
 */

import {
  MOCK_JOKES,
  getMockJokeOfTheDay,
  getMockJokeById,
} from "./mockJokes.js";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";
const isDev = import.meta.env.DEV;

/**
 * Wraps a fetch call so that in dev mode, network failures fall back to mock data.
 */
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

const fetchJokeOfTheDay = async () => {
  return fetchWithFallback(
    async () => {
      const response = await fetch(`${API_BASE_URL}/joke-of-the-day`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch joke of the day: ${response.status} ${response.statusText}`,
        );
      }
      const data = await response.json();
      return { ...data, isMock: false };
    },
    () => ({ ...getMockJokeOfTheDay(), isMock: true }),
  );
};

const fetchJokes = async () => {
  return fetchWithFallback(
    async () => {
      const response = await fetch(`${API_BASE_URL}/jokes`);
      if (!response.ok) {
        throw new Error(
          `Failed to get jokes from backend: ${response.status} ${response.statusText}`,
        );
      }
      const data = await response.json();
      return data.map((joke) => ({ ...joke, isMock: false }));
    },
    () => MOCK_JOKES.map((joke) => ({ ...joke, isMock: true })),
  );
};

const fetchJokeById = async (id) => {
  return fetchWithFallback(
    async () => {
      const response = await fetch(`${API_BASE_URL}/jokes/${id}`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch joke #${id}: ${response.status} ${response.statusText}`,
        );
      }
      const data = await response.json();
      return { ...data, isMock: false };
    },
    () => {
      const joke = getMockJokeById(id);
      if (!joke) throw new Error(`Mock joke #${id} not found`);
      return { ...joke, isMock: true };
    },
  );
};

const searchJokes = async (query) => {
  if (!query) return [];
  return fetchWithFallback(
    async () => {
      const response = await fetch(
        `${API_BASE_URL}/jokes/search?q=${encodeURIComponent(query)}&size=10`,
      );
      if (!response.ok) {
        throw new Error(
          `Failed to search jokes: ${response.status} ${response.statusText}`,
        );
      }
      const data = await response.json();
      // Backend returns a Page object, content is in data.content
      return (data.content || []).map((joke) => ({ ...joke, isMock: false }));
    },
    () => {
      return MOCK_JOKES.filter(
        (j) =>
          j.setup.toLowerCase().includes(query.toLowerCase()) ||
          j.punchline.toLowerCase().includes(query.toLowerCase()),
      )
        .slice(0, 10)
        .map((joke) => ({ ...joke, isMock: true }));
    },
  );
};

export { fetchJokeOfTheDay, fetchJokes, fetchJokeById, searchJokes };
