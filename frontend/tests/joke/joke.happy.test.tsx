import { screen } from "../utils/test-utils";
import { render } from "../utils/test-utils";
import JokeDetailPage from "../../src/pages/JokeDetailPage";
import { describe, it, expect } from "vitest";

describe("JokeDetailPage - Happy Path", () => {
  it("renders joke setup and initially hides punchline", async () => {
    render(<JokeDetailPage />, {
      initialRoute: "/jokes/1",
      routePath: "/jokes/:id",
    });

    // Wait for the joke setup to appear
    expect(
      await screen.findByText("Why do programmers prefer dark mode?"),
    ).toBeInTheDocument();

    // Check initial state
    expect(
      screen.getByRole("button", { name: /reveal punchline/i }),
    ).toBeVisible();
    expect(
      screen.queryByText("Because light attracts bugs!"),
    ).not.toBeInTheDocument();
  });

  it('reveals punchline and transitions CTA to "Next Joke"', async () => {
    const { user } = render(<JokeDetailPage />, {
      initialRoute: "/jokes/1",
      routePath: "/jokes/:id",
    });

    await screen.findByText("Why do programmers prefer dark mode?");

    // Click Reveal
    const revealButton = screen.getByRole("button", {
      name: /reveal punchline/i,
    });
    await user.click(revealButton);

    // Punchline appears
    expect(
      await screen.findByText("Because light attracts bugs!"),
    ).toBeVisible();

    // CTA transitions to Next Joke (which is a link)
    expect(
      screen.queryByRole("button", { name: /reveal punchline/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /next joke/i })).toBeVisible();
  });

  it('loads a new joke and resets state when "Next Joke" is clicked', async () => {
    const { user } = render(<JokeDetailPage />, {
      initialRoute: "/jokes/1",
      routePath: "/jokes/:id",
    });

    await screen.findByText("Why do programmers prefer dark mode?");
    await user.click(screen.getByRole("button", { name: /reveal punchline/i }));

    const nextJokeLink = await screen.findByRole("link", {
      name: /next joke/i,
    });
    await user.click(nextJokeLink);

    // After clicking next joke, the URL changes and component ID resets,
    // which should cause the reveal button to appear again for the next joke.
    expect(
      await screen.findByRole("button", { name: /reveal punchline/i }),
    ).toBeVisible();
    expect(
      screen.queryByRole("link", { name: /next joke/i }),
    ).not.toBeInTheDocument();
  });
});
