import { screen } from "../utils/test-utils";
import { render } from "../utils/test-utils";
import JokeDetailPage from "../../src/pages/JokeDetailPage";
import { describe, it, expect } from "vitest";
import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";

describe("JokeDetailPage - Error Boundaries", () => {
  it("displays graceful fallback UI on network error", async () => {
    server.use(
      http.get("*/api/v1/jokes/:id", () => {
        return HttpResponse.error();
      }),
    );

    render(<JokeDetailPage />, {
      initialRoute: "/jokes/1",
      routePath: "/jokes/:id",
    });

    // The ErrorMessage component should be rendered
    expect(
      await screen.findByText(/Failed to fetch|Network Error|error/i),
    ).toBeInTheDocument();
  });

  it("handles server 500 empty response gracefully", async () => {
    server.use(
      http.get("*/api/v1/jokes/:id", () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    render(<JokeDetailPage />, {
      initialRoute: "/jokes/1",
      routePath: "/jokes/:id",
    });

    // Wait for the error component to catch and display the error message
    expect(await screen.findByText(/500|error|failed/i)).toBeInTheDocument();
  });

  it("handles malformed JSON response gracefully", async () => {
    server.use(
      http.get("*/api/v1/jokes/:id", () => {
        return HttpResponse.json({ malformed: "data" });
      }),
    );

    render(<JokeDetailPage />, {
      initialRoute: "/jokes/1",
      routePath: "/jokes/:id",
    });

    // We verify that the component handles missing fields without crashing
    // Even if jokeContent is missing, a fallback or empty state should prevent a crash
    const cta = await screen.findByRole("button", {
      name: /reveal punchline/i,
    });
    expect(cta).toBeInTheDocument();
  });
});
