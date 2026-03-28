/**
 * Placeholder joke data used as a fallback when the backend API is unavailable during development.
 */

export const MOCK_JOKES = [
  {
    jokeId: 1,
    jokeContent:
      "Why was Cinderella so bad at soccer?;She ran away from the ball!",
    jokeType: "ONE_LINER",
    author: { authorId: 1, authorFirstName: "Ryan", authorLastName: "Flynn" },
  },
  {
    jokeId: 2,
    jokeContent:
      'Why can\'t you hear a pterodactyl going to the bathroom?;Because the "P" is silent.',
    jokeType: "ONE_LINER",
    author: { authorId: 1, authorFirstName: "Ryan", authorLastName: "Flynn" },
  },
  {
    jokeId: 3,
    jokeContent: "What do you call a well-balanced horse?;Stable.",
    jokeType: "ONE_LINER",
    author: { authorId: 1, authorFirstName: "Ryan", authorLastName: "Flynn" },
  },
  {
    jokeId: 4,
    jokeContent: "What do you call an angry carrot?;A steamed veggie.",
    jokeType: "ONE_LINER",
    author: { authorId: 1, authorFirstName: "Ryan", authorLastName: "Flynn" },
  },
  {
    jokeId: 5,
    jokeContent:
      "Why don't skeletons fight each other?;They don't have the guts.",
    jokeType: "ONE_LINER",
    author: { authorId: 1, authorFirstName: "Ryan", authorLastName: "Flynn" },
  },
  {
    jokeId: 6,
    jokeContent: "What did the ocean say to the beach?;Nothing, it just waved.",
    jokeType: "ONE_LINER",
    author: { authorId: 1, authorFirstName: "Ryan", authorLastName: "Flynn" },
  },
];

/**
 * Returns a deterministic "joke of the day" from the mock data based on the current date.
 */
export function getMockJokeOfTheDay() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      86400000,
  );
  return MOCK_JOKES[dayOfYear % MOCK_JOKES.length];
}

/**
 * Returns a single mock joke by ID, or undefined if not found.
 */
export function getMockJokeById(id) {
  return MOCK_JOKES.find((j) => j.jokeId === Number(id));
}
