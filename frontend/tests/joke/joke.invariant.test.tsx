import { screen } from "../utils/test-utils";
import { render } from "../utils/test-utils";
import JokeDetailPage from "../../src/pages/JokeDetailPage";
import { describe, it, expect } from "vitest";

describe("JokeDetailPage - Core Invariants", () => {
  it("never shows punchline before reveal action is triggered", async () => {
    render(<JokeDetailPage />, {
      initialRoute: "/jokes/1",
      routePath: "/jokes/:id",
    });
    await screen.findByText("Why do programmers prefer dark mode?");

    // Invariant: Punchline strictly hidden before user interacts
    expect(
      screen.queryByText(/Because light attracts bugs!/i),
    ).not.toBeInTheDocument();
  });

  it("reveal action is idempotent and prevents duplicate state issues", async () => {
    const { user } = render(<JokeDetailPage />, {
      initialRoute: "/jokes/1",
      routePath: "/jokes/:id",
    });

    const revealButton = await screen.findByRole("button", {
      name: /reveal punchline/i,
    });
    await user.click(revealButton);

    // Simulate double-click or rapid firing if button hasn't unmounted yet
    try {
      await user.click(revealButton);
    } catch {
      // If Element is unmounted, it's intrinsically idempotent
    }

    // Invariant: Only one truth-state exists for the punchline, no duplication
    const punchlines = await screen.findAllByText(
      /Because light attracts bugs!/i,
    );
    expect(punchlines).toHaveLength(1);
  });

  it("CTA strictly reflects exact state transition (Reveal -> Next Joke)", async () => {
    const { user } = render(<JokeDetailPage />, {
      initialRoute: "/jokes/1",
      routePath: "/jokes/:id",
    });

    const getRevealCTA = () =>
      screen.queryByRole("button", { name: /reveal punchline/i });
    const getNextJokeCTA = () =>
      screen.queryByRole("link", { name: /next joke/i });

    // Initial State Constraint
    expect(getRevealCTA()).toBeInTheDocument();

    // State Mutation
    await user.click(getRevealCTA()!);
    await screen.findByText(/Because light attracts bugs!/i);

    // Final State Constraint
    expect(getNextJokeCTA()).toBeInTheDocument();
    expect(getRevealCTA()).not.toBeInTheDocument();
  });
});
