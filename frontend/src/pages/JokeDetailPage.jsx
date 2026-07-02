import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Share2,
  Link2,
  Check,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Terminal,
  User,
} from "lucide-react";
import { fetchJokeById, fetchJokes } from "../data/jokes/getJokes.js";
import {
  formatType,
  setupOf,
  responseSegmentsOf,
  fullTextOf,
} from "../utils/jokeUtils.js";
import { useDevMode } from "../context/DevModeContext.js";
import LoadingSpinner from "../components/ui/LoadingSpinner.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";
import JokeSegments from "../components/jokes/JokeSegments.jsx";
import ApiSnippet from "../components/dev/ApiSnippet.jsx";
import Button from "../components/ui/Button.jsx";

const MORE_JOKES_COUNT = 3;

export default function JokeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDevMode } = useDevMode();

  const [isRevealed, setIsRevealed] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [shareFired, setShareFired] = useState(false);
  const [devPanelOpen, setDevPanelOpen] = useState(false);

  const {
    data: joke,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["joke", id],
    queryFn: () => fetchJokeById(id),
  });

  const { data: allJokes } = useQuery({
    queryKey: ["jokes"],
    queryFn: fetchJokes,
  });

  // New joke, fresh state (render-time reset, per react.dev guidance)
  const [prevId, setPrevId] = useState(id);
  if (prevId !== id) {
    setPrevId(id);
    setIsRevealed(false);
    setDevPanelOpen(false);
  }

  useEffect(() => {
    if (joke) {
      document.title = `${setupOf(joke) || `Joke #${id}`} — Joke API`;
    }
    return () => {
      document.title = "Joke API";
    };
  }, [joke, id]);

  const handleReveal = useCallback(() => setIsRevealed(true), []);

  const moreJokes = useMemo(
    () =>
      (allJokes || [])
        .filter((j) => String(j.id) !== String(joke?.id ?? id))
        .slice(0, MORE_JOKES_COUNT),
    [allJokes, joke, id],
  );
  const nextJoke = moreJokes[0];

  const handleNextJoke = useCallback(() => {
    if (nextJoke) navigate(`/jokes/${nextJoke.id}`);
  }, [nextJoke, navigate]);

  // Space reveals, Enter advances
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;
      if (e.code === "Space" && !isRevealed) {
        e.preventDefault();
        handleReveal();
      } else if (e.code === "Enter" && isRevealed && nextJoke) {
        e.preventDefault();
        handleNextJoke();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isRevealed, handleReveal, handleNextJoke, nextJoke]);

  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Joke #${id}`,
          text: fullTextOf(joke),
          url: pageUrl,
        });
      } else {
        await navigator.clipboard.writeText(pageUrl);
        setShareFired(true);
        setTimeout(() => setShareFired(false), 2000);
      }
    } catch {
      /* user cancelled */
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      /* clipboard denied */
    }
  };

  if (isLoading) return <LoadingSpinner message="Loading joke..." />;
  if (error) return <ErrorMessage message={error.message} onRetry={refetch} />;

  const setup = setupOf(joke);
  const response = responseSegmentsOf(joke);

  return (
    <main className="flex flex-col items-center px-6 pb-16">
      <div className="w-full max-w-[640px]">
        {/* Breadcrumb */}
        <nav className="mb-6 animate-fade-in" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-xs font-semibold">
            <li>
              <Link
                to="/jokes"
                className="text-[var(--text-faint)] hover:text-[var(--text-muted)] transition-colors duration-[var(--duration-normal)]"
              >
                Jokes
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-3 w-3 text-deep-space-blue-600" />
            </li>
            <li className="text-[var(--text-faint)]" aria-current="page">
              Joke #{id}
            </li>
          </ol>
        </nav>

        {/* Main card */}
        <article className="animate-fade-in md3-card-static p-6 md:p-8 flex flex-col">
          {/* Meta row */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-semibold text-[var(--text-faint)] uppercase tracking-widest">
              Joke #{id}
            </span>
            {joke.type && (
              <>
                <span className="text-deep-space-blue-700" aria-hidden="true">
                  ·
                </span>
                <span className="inline-flex items-center rounded-[var(--radius-full)] bg-deep-space-blue-800/40 px-2 py-1 text-[10px] font-semibold text-pearl-aqua-400 border border-[var(--border-subtle)] tracking-widest uppercase">
                  {formatType(joke.type)}
                </span>
              </>
            )}
          </div>

          {/* Setup — the focal point */}
          <h1 className="text-[clamp(1.75rem,5vw,2.5rem)] font-medium text-[var(--text-primary)] leading-[1.2] tracking-tighter max-w-[22ch]">
            {setup || `Joke #${id}`}
          </h1>

          <div
            className="h-[1px] w-24 mx-auto bg-gradient-to-r from-transparent via-white/8 to-transparent my-6"
            aria-hidden="true"
          />

          {/* aria-live: announce the punchline when it replaces the CTA */}
          <div aria-live="polite">
            {!isRevealed ? (
              <Button
                variant="primary"
                className="w-full"
                onClick={handleReveal}
              >
                Reveal Punchline
              </Button>
            ) : (
              <div className="flex flex-col gap-6">
                {/* The peak moment */}
                <div className="detail-reveal-in">
                  {response.length > 0 ? (
                    <JokeSegments segments={response} size="lg" />
                  ) : (
                    <p className="text-base italic text-[var(--text-muted)]">
                      (The punchline was lost in serialization.)
                    </p>
                  )}
                </div>

                <div className="h-[1px] bg-[var(--border-subtle)]" />

                {/* Post-reveal actions */}
                <div className="detail-reveal-in flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleShare}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-[var(--radius-sm)] text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 active:scale-[0.98] transition-all duration-[var(--duration-normal)] cursor-pointer"
                    >
                      {shareFired ? (
                        <>
                          <Check className="h-4 w-4 text-[var(--accent-text)]" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Share2 className="h-4 w-4" strokeWidth={2} />
                          Share
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCopyLink}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-[var(--radius-sm)] text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 active:scale-[0.98] transition-all duration-[var(--duration-normal)] cursor-pointer"
                    >
                      {linkCopied ? (
                        <>
                          <Check className="h-4 w-4 text-[var(--accent-text)]" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Link2 className="h-4 w-4" strokeWidth={2} />
                          Copy Link
                        </>
                      )}
                    </button>
                  </div>

                  {nextJoke && (
                    <Button
                      to={`/jokes/${nextJoke.id}`}
                      variant="primary"
                      className="group w-full sm:w-auto"
                    >
                      Next Joke
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  )}
                </div>

                {joke.author?.name && (
                  <div className="detail-reveal-in flex items-center gap-2 text-xs text-[var(--text-faint)]">
                    <User className="h-3 w-3 opacity-60" aria-hidden="true" />
                    <span className="font-medium">{joke.author.name}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </article>

        {/* Developer Mode: progressively disclosed after the punchline lands */}
        {isDevMode && isRevealed && (
          <div className="mt-4 detail-reveal-in">
            <button
              onClick={() => setDevPanelOpen(!devPanelOpen)}
              aria-expanded={devPanelOpen}
              className="inline-flex items-center gap-2 px-2 py-2 text-xs font-medium text-[var(--text-faint)] hover:text-[var(--text-muted)] transition-colors duration-[var(--duration-normal)] cursor-pointer"
            >
              <Terminal className="h-3 w-3" aria-hidden="true" />
              View API request
              <ChevronDown
                aria-hidden="true"
                className={`h-3 w-3 transition-transform duration-[var(--duration-normal)] ${
                  devPanelOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {devPanelOpen && (
              <div className="mt-3 md3-card-static p-4 detail-reveal-in">
                <ApiSnippet
                  path={`/jokes/${id}`}
                  data={joke.raw}
                  isMock={joke.isMock}
                />
              </div>
            )}
          </div>
        )}

        {/* More jokes */}
        {moreJokes.length > 0 && (
          <section className="mt-12 animate-fade-in">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-sm font-semibold text-[var(--text-muted)] tracking-tight whitespace-nowrap">
                Keep the laughs going
              </h2>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-white/8 to-transparent" />
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              {moreJokes.map((j) => (
                <Link
                  key={j.id}
                  to={`/jokes/${j.id}`}
                  className="group md3-card p-4 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    {j.type ? (
                      <span className="inline-flex items-center rounded-[var(--radius-full)] bg-deep-space-blue-800/40 px-2 py-1 text-[10px] font-semibold text-pearl-aqua-400 border border-[var(--border-subtle)] tracking-widest uppercase">
                        {formatType(j.type)}
                      </span>
                    ) : (
                      <span />
                    )}
                    <span className="text-[10px] font-mono text-[var(--text-faint)]">
                      #{j.id}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed tracking-tight line-clamp-3 flex-1">
                    {setupOf(j)}
                  </p>
                  <span className="text-xs font-semibold text-[var(--text-faint)] group-hover:text-pearl-aqua-300 transition-colors duration-[var(--duration-normal)] mt-auto">
                    View joke →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
