/**
 * Single source of truth for where the API lives. Used by the fetch layer
 * and by every Developer Mode surface that displays real request URLs.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

/** Absolute URL for an API path, e.g. apiUrl("/jokes/1"). */
export const apiUrl = (path) => `${API_BASE_URL}${path}`;

/** The exact terminal command that reproduces a GET request. */
export const curlFor = (path) => `curl ${apiUrl(path)}`;
