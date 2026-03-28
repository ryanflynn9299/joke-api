import { screen } from "../utils/test-utils";
import { render } from "../utils/test-utils";
import JokeDetailPage from "../../src/pages/JokeDetailPage";
import { describe, it, expect } from "vitest";

describe("JokeDetailPage - Feature Contracts", () => {
  it("renders ONLY ONE primary CTA at a time (Hick's Law)", async () => {
    const { user } = render(<JokeDetailPage />, {
      initialRoute: "/jokes/1",
      routePath: "/jokes/:id",
    });

    // Wait for the joke to load
    await screen.findByText("Why do programmers prefer dark mode?");

    const getRevealButton = () =>
      screen.queryByRole("button", { name: /reveal punchline/i });
    const getNextJokeLink = () =>
      screen.queryByRole("link", { name: /next joke/i });

    // Contract: Only Reveal CTA is present initially
    expect(getRevealButton()).toBeInTheDocument();
    expect(getNextJokeLink()).not.toBeInTheDocument();

    await user.click(getRevealButton()!);

    // Wait for the Next Joke CTA to appear
    await screen.findByRole("link", { name: /next joke/i });

    // Contract: After reveal, Reveal CTA is gone, Next CTA takes its place
    expect(getRevealButton()).not.toBeInTheDocument();
    expect(getNextJokeLink()).toBeInTheDocument();
  });

  it("secondary actions (share, copy) appear ONLY after reveal", async () => {
    const { user } = render(<JokeDetailPage />, {
      initialRoute: "/jokes/1",
      routePath: "/jokes/:id",
    });

    await screen.findByText("Why do programmers prefer dark mode?");

    const getShareButton = () =>
      screen.queryByRole("button", { name: /share/i });
    const getCopyButton = () =>
      screen.queryByRole("button", { name: /copy link/i });

    // Ensure secondary actions do not distract from the primary joke reveal
    expect(getShareButton()).not.toBeInTheDocument();
    expect(getCopyButton()).not.toBeInTheDocument();

    // Reveal the punchline
    await user.click(screen.getByRole("button", { name: /reveal punchline/i }));

    // Secondary actions are now available
    expect(
      await screen.findByRole("button", { name: /share/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /copy link/i }),
    ).toBeInTheDocument();
  });

  it("dev mode features are progressively disclosed to avoid clutter", async () => {
    const { user } = render(<JokeDetailPage />, {
      initialRoute: "/jokes/1",
      routePath: "/jokes/:id",
      isDevMode: true,
    });

    await screen.findByText("Why do programmers prefer dark mode?");

    const getDevModeToggle = () =>
      screen.queryByRole("button", { name: /view api request/i });

    // Contract: Hidden initially to maintain clean UX
    expect(getDevModeToggle()).not.toBeInTheDocument();

    // Trigger reveal interaction
    await user.click(screen.getByRole("button", { name: /reveal punchline/i }));

    // Contract: Becomes visible after user interacts with the joke
    const devToggle = await screen.findByRole("button", {
      name: /view api request/i,
    });
    expect(devToggle).toBeInTheDocument();

    // Contract: API details are hidden behind an expandable accordion
    expect(screen.queryByText(/GET/i)).not.toBeInTheDocument();

    // Expands inline when clicked
    await user.click(devToggle);
    expect(await screen.findByText(/GET/i)).toBeInTheDocument();
  });
});
