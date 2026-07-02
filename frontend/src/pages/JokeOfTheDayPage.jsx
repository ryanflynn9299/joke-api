import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { fetchJokeOfTheDay } from "../data/jokes/getJokes.js";
import { setupOf, responseSegmentsOf, formatType } from "../utils/jokeUtils.js";
import { useDevMode } from "../context/DevModeContext.js";
import LoadingSpinner from "../components/ui/LoadingSpinner.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";
import JokeSegments from "../components/jokes/JokeSegments.jsx";
import ApiSnippet from "../components/dev/ApiSnippet.jsx";
import Button from "../components/ui/Button.jsx";

const todayLabel = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
}).format(new Date());

export default function JokeOfTheDayPage() {
  const { isDevMode } = useDevMode();
  const [isRevealed, setIsRevealed] = useState(false);
  const {
    data: joke,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["joke-of-the-day"],
    queryFn: fetchJokeOfTheDay,
  });

  if (isLoading) return <LoadingSpinner message="Fetching today's joke..." />;
  if (error) return <ErrorMessage message={error.message} onRetry={refetch} />;

  const response = responseSegmentsOf(joke);
  const hasPunchline = response.length > 0;
  const isResolved = isDevMode || isRevealed || !hasPunchline;

  return (
    <main className="flex-1 flex items-center px-6 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center animate-fade-in">
        {/* ── Pitch ── */}
        <div className="flex flex-col gap-6 items-center lg:items-start text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] tracking-tighter leading-[1.05] text-balance max-w-[18ch]">
            An over-engineered{" "}
            <span className="text-[var(--accent-text)]">
              {isDevMode ? "API" : "site"}
            </span>{" "}
            dedicated to{" "}
            <span className="text-[var(--accent-text)]">
              underwhelming punchlines.
            </span>
          </h1>

          <p className="text-base text-[var(--text-muted)] font-medium leading-relaxed max-w-[44ch]">
            One hand-curated joke a day, served over REST. The setup is free —
            the punchline is strictly opt-in.
          </p>

          {/* Promoted to primary once today's joke has resolved */}
          <Button
            to="/jokes"
            variant={isResolved ? "primary" : "secondary"}
            className="group w-full sm:w-auto"
          >
            Browse All Jokes
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* ── Today's joke, staged ── */}
        <section
          aria-label="Joke of the day"
          className="md3-card-static overflow-hidden w-full"
        >
          {/* Panel header: label left, date right */}
          <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-[var(--border-subtle)] bg-white/[0.02]">
            <h2 className="text-xs font-black uppercase tracking-widest text-[var(--text-faint)]">
              Joke of the Day
            </h2>
            <span className="text-xs font-semibold text-[var(--text-faint)] whitespace-nowrap">
              {todayLabel}
            </span>
          </div>

          <div className="p-6 md:p-8">
            {isDevMode ? (
              <ApiSnippet
                path="/joke-of-the-day"
                data={joke.raw}
                isMock={joke.isMock}
              />
            ) : (
              <div className="flex flex-col gap-6">
                {/* Setup */}
                <p className="text-xl md:text-2xl font-bold text-[var(--text-primary)] leading-snug tracking-tight">
                  {setupOf(joke)}
                </p>

                {/* aria-live: announce the punchline when it replaces the CTA */}
                {hasPunchline && (
                  <div aria-live="polite">
                    {!isRevealed ? (
                      <Button
                        variant="primary"
                        className="w-full"
                        onClick={() => setIsRevealed(true)}
                      >
                        Reveal Punchline
                      </Button>
                    ) : (
                      <div className="detail-reveal-in flex flex-col gap-6">
                        <JokeSegments segments={response} />

                        {/* Attribution: label left, action right */}
                        <div className="flex items-center justify-between gap-4 pt-4 border-t border-[var(--border-subtle)]">
                          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text-faint)]">
                            {[formatType(joke.type), joke.author?.name]
                              .filter(Boolean)
                              .join(" · ")}
                          </span>
                          <Link
                            to={`/jokes/${joke.id}`}
                            className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-[var(--duration-normal)] whitespace-nowrap"
                          >
                            Permalink →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
