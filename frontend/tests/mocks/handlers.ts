import { http, HttpResponse } from "msw";

export const mockJoke = {
  jokeId: "1",
  jokeType: "programming",
  jokeContent:
    "Why do programmers prefer dark mode?;Because light attracts bugs!",
  author: { authorFirstName: "Grace", authorLastName: "Hopper" },
};

export const mockJokesList = [
  mockJoke,
  {
    jokeId: "2",
    jokeType: "dad",
    jokeContent: "Why did the coffee file a police report?;It got mugged.",
    author: null,
  },
];

export const handlers = [
  http.get("*/api/v1/jokes/:id", ({ params }) => {
    const joke = mockJokesList.find((j) => j.jokeId === params.id);
    if (joke) {
      return HttpResponse.json(joke);
    }
    return new HttpResponse(null, { status: 404 });
  }),

  http.get("*/api/v1/jokes", () => {
    return HttpResponse.json(mockJokesList);
  }),
];
