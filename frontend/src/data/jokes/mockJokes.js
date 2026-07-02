/**
 * Fallback data for local development when the backend is unreachable.
 * Shapes mirror the real wire format (see normalizeJoke), including the
 * backend's actual field names.
 */

const author = {
  authorId: 1,
  authorFirstName: "Ryan",
  authorLastName: "Flynn",
  authorFullName: "Ryan Flynn",
};

function mockJoke(id, jokeContent, jokeType) {
  const parts = jokeContent
    .split(";")
    .map((p) => p.trim())
    .filter(Boolean);
  return {
    id,
    jokeContent,
    jokeType,
    author,
    createdDateTime: "2026-01-01T12:00:00Z",
    modifiedDateTime: "2026-01-01T12:00:00Z",
    lastJotdDatetime: null,
    segments: parts.map((text, i) => ({
      text,
      type:
        i === 0
          ? "SETUP"
          : i === parts.length - 1
            ? "PUNCHLINE"
            : "INTERACTION",
      revealStep: i,
    })),
  };
}

export const MOCK_JOKES = [
  mockJoke(
    1,
    "Why was Cinderella so bad at soccer?;She ran away from the ball!",
    "ONE_LINER",
  ),
  mockJoke(
    2,
    'Why can\'t you hear a pterodactyl going to the bathroom?;Because the "P" is silent.',
    "ONE_LINER",
  ),
  mockJoke(3, "What do you call a well-balanced horse?;Stable.", "ONE_LINER"),
  mockJoke(
    4,
    "Knock knock.;Who's there?;Recursion.;Recursion who?;Knock knock.",
    "KNOCK_KNOCK",
  ),
  mockJoke(
    5,
    "Why don't skeletons fight each other?;They don't have the guts.",
    "ONE_LINER",
  ),
  mockJoke(
    6,
    "What did the ocean say to the beach?;Nothing, it just waved.",
    "ONE_LINER",
  ),
];

/** Deterministic "joke of the day" derived from the current date. */
export function getMockJokeOfTheDay() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      86400000,
  );
  return MOCK_JOKES[dayOfYear % MOCK_JOKES.length];
}

export function getMockJokeById(id) {
  return MOCK_JOKES.find((j) => j.id === Number(id));
}
