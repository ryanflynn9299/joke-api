/**
 * Normalization boundary between the backend's wire format and the UI.
 *
 * The backend serializes jokes as:
 *   { id, jokeContent, jokeType, author, createdDateTime,
 *     modifiedDateTime, lastJotdDatetime, segments[] }
 *
 * `segments` is the backend's own structured view of a joke —
 * [{ text, type: SETUP|INTERACTION|PUNCHLINE, revealStep }] — and is the
 * preferred source of truth. Older fixtures use `jokeId` and omit
 * `segments`; both are tolerated here so nothing downstream has to care.
 */

const SEGMENT_KINDS = ["SETUP", "INTERACTION", "PUNCHLINE"];

function kindForIndex(index, total) {
  if (index === 0) return "SETUP";
  if (index === total - 1) return "PUNCHLINE";
  return "INTERACTION";
}

/** Mirrors the backend's split: ";"-delimited acts, trimmed, empties dropped. */
export function segmentsFromContent(content) {
  if (!content) return [];
  const parts = content
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.map((text, i) => ({
    text,
    kind: kindForIndex(i, parts.length),
    step: i,
  }));
}

/**
 * Maps a raw backend joke payload to the shape the UI consumes.
 * The untouched payload is kept on `raw` for Developer Mode, which renders
 * exactly what the API returned.
 */
export function normalizeJoke(raw, { isMock = false } = {}) {
  if (!raw || typeof raw !== "object") return null;

  const fromApi = Array.isArray(raw.segments)
    ? raw.segments
        .filter((s) => s && s.text)
        .map((s, i) => ({
          text: s.text,
          kind: SEGMENT_KINDS.includes(s.type)
            ? s.type
            : kindForIndex(i, raw.segments.length),
          step: s.revealStep ?? i,
        }))
    : [];

  const segments =
    fromApi.length > 0 ? fromApi : segmentsFromContent(raw.jokeContent);

  const author = raw.author
    ? {
        id: raw.author.authorId ?? null,
        name:
          raw.author.authorFullName ||
          [raw.author.authorFirstName, raw.author.authorLastName]
            .filter(Boolean)
            .join(" "),
      }
    : null;

  return {
    id: raw.id ?? raw.jokeId ?? null,
    type: raw.jokeType ?? null,
    segments,
    author,
    createdAt: raw.createdDateTime ?? null,
    isMock,
    raw,
  };
}

export const setupOf = (joke) => joke?.segments?.[0]?.text ?? "";

export const responseSegmentsOf = (joke) => joke?.segments?.slice(1) ?? [];

export const fullTextOf = (joke) =>
  (joke?.segments ?? []).map((s) => s.text).join(" ");

/** "KNOCK_KNOCK" -> "Knock Knock" */
export function formatType(jokeType) {
  if (!jokeType) return "";
  return jokeType
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
}
