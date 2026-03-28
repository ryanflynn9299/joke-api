/**
 * Splits joke content on ";" into segments.
 */
export function parseJoke(content) {
  if (!content) return [];
  return content.split(";").filter(Boolean);
}

/**
 * Formats a JokeType enum value for display.
 */
export function formatType(jokeType) {
  if (!jokeType) return "";
  return jokeType
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
}
