import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchJokeById, fetchJokes } from "../data/jokes/getJokes.js";
import { formatType } from "../utils/jokeUtils.js";
import LoadingSpinner from "../components/ui/LoadingSpinner.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";
import JSONHighlighter from "../components/ui/JSONHighlighter.jsx";
import {
  Share2,
  Link2,
  Check,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Terminal,
  Copy,
  User,
  AlertCircle,
} from "lucide-react";
import Button from "../components/ui/Button.jsx";
import { useState, useEffect, useCallback, useRef } from "react";
import { useDevMode } from "../context/DevModeContext.js";

const MORE_JOKES_COUNT = 3;

function parseJoke(content) {
  if (!content) return [];
  return content.split(";").filter(Boolean);
}

export default function JokeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDevMode } = useDevMode();

  const [isRevealed, setIsRevealed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [shareFired, setShareFired] = useState(false);
  const [devPanelOpen, setDevPanelOpen] = useState(false);

  // Dev mode API states
  const API_HOST =
    window.location.origin === "http://localhost:5173"
      ? "http://localhost:8080"
      : window.location.origin;
  const [pathInput, setPathInput] = useState(`/api/v1/jokes/${id}`);
  const [responseStatus, setResponseStatus] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionError, setExecutionError] = useState(null);
  const [curlCopied, setCurlCopied] = useState(false);

  const ctaRef = useRef(null);

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

  // Reset state when joke changes
  useEffect(() => {
    setIsRevealed(false);
    setIsAnimating(false);
    setDevPanelOpen(false);
    setPathInput(`/api/v1/jokes/${id}`);
    setResponseStatus(null);
    setResponseData(null);
    setExecutionError(null);
  }, [id]);

  // Document title
  useEffect(() => {
    if (joke) {
      const setup = joke.jokeContent?.split(";")[0] || `Joke #${id}`;
      document.title = `${setup} — Joke API`;
    }
    return () => {
      document.title = "Joke API";
    };
  }, [joke, id]);

  // Reveal handler with delay
  const handleReveal = useCallback(() => {
    if (isRevealed || isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setIsRevealed(true);
      setIsAnimating(false);
    }, 120); // --duration-fast
  }, [isRevealed, isAnimating]);

  // Next joke
  const moreJokes = (allJokes || [])
    .filter((j) => j.jokeId !== joke?.jokeId)
    .slice(0, MORE_JOKES_COUNT);

  const nextJoke = moreJokes[0];

  const handleNextJoke = useCallback(() => {
    if (nextJoke) {
      navigate(`/jokes/${nextJoke.jokeId}`);
    }
  }, [nextJoke, navigate]);

  // Keyboard handling
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

  // Actions
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";
  const jokeText = joke?.jokeContent?.split(";").join(" ") || "";

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Joke #${id}`,
          text: jokeText,
          url: pageUrl,
        });
      } else {
        await navigator.clipboard.writeText(pageUrl);
        setShareFired(true);
        setTimeout(() => setShareFired(false), 2000);
      }
    } catch {
      /* User cancelled */
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      /* Clipboard denied */
    }
  };

  // Dev mode: execute request
  const handleExecuteRequest = async () => {
    setIsExecuting(true);
    setExecutionError(null);
    try {
      const response = await fetch(`${API_HOST}${pathInput}`);
      setResponseStatus(response.status);
      const data = await response.json();
      setResponseData(data);
    } catch (err) {
      setExecutionError(err.message);
      setResponseStatus(500);
    } finally {
      setIsExecuting(false);
    }
  };

  if (isLoading) return <LoadingSpinner message="Loading joke..." />;
  if (error) return <ErrorMessage message={error.message} onRetry={refetch} />;

  const segments = parseJoke(joke.jokeContent);
  const setup = segments[0] || "";
  const punchlineSegments = segments.slice(1);
  const hasPunchline = punchlineSegments.length > 0;
  const authorName = joke.author
    ? `${joke.author.authorFirstName} ${joke.author.authorLastName}`
    : null;

  return (
    <main className="min-h-[calc(100vh-160px)] flex flex-col items-center px-4 pt-8 pb-16 md:pt-12">
      {/* Subtle radial glow behind card area */}
      <div
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(ellipse 600px 500px at 50% 35%, rgba(51, 204, 204, 0.04), transparent 70%)",
        }}
      />

      {/* ── Center Column ── */}
      <div className="w-full max-w-[640px]">
        {/* ── Breadcrumb ── */}
        <nav className="mb-6 animate-fade-in" aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-[13px] font-medium">
            <li>
              <Link
                to="/jokes"
                className="text-[var(--text-faint)] hover:text-[var(--text-muted)] transition-colors duration-[var(--duration-normal)]"
              >
                Jokes
              </Link>
            </li>
            <li>
              <ChevronRight className="h-3 w-3 text-deep-space-blue-600" />
            </li>
            <li className="text-[var(--text-faint)]">Joke #{id}</li>
          </ol>
        </nav>

        {/* ── Main Card ── */}
        <article className="animate-fade-in rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-[var(--shadow-card)] p-8">
          {/* Content Stack */}
          <div className="flex flex-col">
            {/* Title — small, muted */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-semibold text-[var(--text-faint)] uppercase tracking-wider">
                Joke #{id}
              </span>
              {joke.jokeType && (
                <>
                  <span className="text-deep-space-blue-700">·</span>
                  <span className="inline-flex items-center rounded-[var(--radius-full)] bg-deep-space-blue-800/40 px-2 py-0.5 text-[10px] font-semibold text-pearl-aqua-400 border border-[var(--border-subtle)] tracking-wide uppercase">
                    {formatType(joke.jokeType)}
                  </span>
                </>
              )}
            </div>

            {/* Setup — PRIMARY FOCAL POINT */}
            <h1
              className="text-[clamp(1.75rem,5vw,2.5rem)] font-medium text-[var(--text-primary)] leading-[1.2] tracking-tight"
              style={{ maxWidth: "22ch" }}
            >
              {setup}
            </h1>

            {/* Divider — callback to card style */}
            {hasPunchline && (
              <div className="h-[1px] w-24 mx-auto bg-gradient-to-r from-transparent via-white/8 to-transparent my-6" />
            )}

            {/* CTA / Reveal */}
            {hasPunchline && (
              <div className="flex flex-col gap-6">
                {!isRevealed ? (
                  <Button
                    ref={ctaRef}
                    onClick={handleReveal}
                    disabled={isAnimating}
                    className="w-full h-12"
                  >
                    {isAnimating ? "..." : "Reveal Punchline"}
                  </Button>
                ) : (
                  <>
                    {/* Punchline — revealed */}
                    <div className="detail-reveal-in">
                      {punchlineSegments.map((seg, idx) => (
                        <p
                          key={idx}
                          className={`text-[clamp(1.25rem,3.5vw,1.5rem)] font-medium leading-[1.35] tracking-tight ${
                            idx === punchlineSegments.length - 1
                              ? "text-[var(--accent-text)]"
                              : "text-pearl-aqua-200"
                          } ${idx > 0 ? "mt-3" : ""}`}
                        >
                          {seg}
                        </p>
                      ))}
                    </div>

                    {/* Divider */}
                    <div className="h-[1px] bg-[var(--border-subtle)] mt-2" />

                    {/* Actions Row */}
                    <div className="detail-reveal-in flex items-center justify-between mt-1">
                      {/* Left: ghost actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleShare}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[var(--radius-sm)] text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 active:scale-[0.98] transition-all duration-[var(--duration-normal)]"
                        >
                          {shareFired ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-[var(--accent-text)]" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Share2 className="h-3.5 w-3.5" strokeWidth={2} />
                              Share
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleCopyLink}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[var(--radius-sm)] text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 active:scale-[0.98] transition-all duration-[var(--duration-normal)]"
                        >
                          {linkCopied ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-[var(--accent-text)]" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Link2 className="h-3.5 w-3.5" strokeWidth={2} />
                              Copy Link
                            </>
                          )}
                        </button>
                      </div>

                      {/* Right: primary next joke */}
                      {nextJoke && (
                        <Link
                          to={`/jokes/${nextJoke.jokeId}`}
                          className="inline-flex"
                        >
                          <Button
                            variant="primary"
                            className="group h-10 w-full md:w-auto"
                          >
                            Next Joke
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </Link>
                      )}
                    </div>

                    {/* Meta */}
                    {authorName && (
                      <div className="detail-reveal-in flex items-center gap-2 text-xs text-[var(--text-faint)] mt-1">
                        <User className="h-3 w-3 opacity-60" />
                        <span className="font-medium">{authorName}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Non-punchline jokes — just show meta inline */}
            {!hasPunchline && authorName && (
              <div className="flex items-center gap-2 text-xs text-[var(--text-faint)] mt-4">
                <User className="h-3 w-3 opacity-60" />
                <span className="font-medium">{authorName}</span>
              </div>
            )}
          </div>
        </article>

        {/* ── Dev Mode: "View API request" ── */}
        {isDevMode && (
          <div className="mt-4 animate-fade-in">
            <button
              onClick={() => setDevPanelOpen(!devPanelOpen)}
              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[var(--text-faint)] hover:text-[var(--text-muted)] transition-colors duration-[var(--duration-normal)] cursor-pointer"
            >
              <Terminal className="h-3 w-3" />
              View API request
              <ChevronDown
                className={`h-3 w-3 transition-transform duration-[var(--duration-normal)] ${
                  devPanelOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {devPanelOpen && (
              <div className="mt-3 rounded-[var(--radius-md)] bg-[var(--bg-inset)] border border-[var(--border-subtle)] p-4 font-mono text-xs detail-reveal-in">
                {/* Request Editor */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] text-pacific-cyan-500/60 uppercase tracking-widest font-bold flex items-center gap-1.5">
                    <Terminal className="h-3 w-3" />
                    Request
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `curl -X GET ${API_HOST}${pathInput}`,
                        );
                        setCurlCopied(true);
                        setTimeout(() => setCurlCopied(false), 2000);
                      }}
                      className="text-[var(--text-faint)] hover:text-pacific-cyan-400 transition-colors duration-[var(--duration-normal)]"
                      title="Copy as cURL"
                    >
                      {curlCopied ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                    <button
                      onClick={handleExecuteRequest}
                      disabled={isExecuting}
                      className="btn-base px-2.5 py-1 rounded-[var(--radius-sm)] border border-[var(--border-default)] text-[var(--accent-text)] hover:bg-white/5 hover:border-[var(--border-strong)] disabled:opacity-50 cursor-pointer"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-tight">
                        {isExecuting ? "Sending..." : "Send"}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center p-2 rounded-[var(--radius-sm)] bg-[var(--bg-inset)] border border-[var(--border-subtle)] text-xs overflow-hidden mb-4">
                  <span className="text-[var(--text-faint)] select-none mr-2">
                    GET
                  </span>
                  <span className="text-deep-space-blue-600 select-none bg-deep-space-blue-900/40 px-1.5 py-0.5 rounded border border-[var(--border-subtle)] mr-2 text-[10px]">
                    {API_HOST}
                  </span>
                  <input
                    type="text"
                    value={pathInput}
                    onChange={(e) => setPathInput(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-pacific-cyan-300 placeholder:text-pacific-cyan-900 text-xs"
                    spellCheck="false"
                  />
                </div>

                {/* Response */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-pacific-cyan-500/60 uppercase tracking-widest font-bold flex items-center gap-1.5">
                    <div className="h-1 w-1 rounded-[var(--radius-full)] bg-pacific-cyan-500/40" />
                    Response
                  </span>
                  <div className="flex items-center gap-2">
                    {executionError && (
                      <span className="text-red-400 flex items-center gap-1 text-[10px] font-bold">
                        <AlertCircle className="h-3 w-3" />
                        Error
                      </span>
                    )}
                    {responseStatus && (
                      <span
                        className={`inline-flex items-center gap-1 rounded-[var(--radius-full)] px-2 py-0.5 text-[9px] font-bold border tracking-wider ${
                          responseStatus >= 200 && responseStatus < 300
                            ? "bg-pacific-cyan-500/10 text-pacific-cyan-400 border-pacific-cyan-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}
                      >
                        <div
                          className={`h-1 w-1 rounded-[var(--radius-full)] ${
                            isExecuting ? "animate-ping" : ""
                          } ${
                            responseStatus >= 200 && responseStatus < 300
                              ? "bg-pacific-cyan-500"
                              : "bg-red-500"
                          }`}
                        />
                        {responseStatus}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-[var(--radius-sm)] bg-black/60 border border-[var(--border-subtle)] overflow-x-auto min-h-[120px] shadow-inner">
                  {responseData ? (
                    <JSONHighlighter data={responseData} />
                  ) : (
                    <span className="text-deep-space-blue-600 text-[11px]">
                      Click "Send" to execute the request
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Keep the laughs going ── */}
        {moreJokes.length > 0 && (
          <section
            className="mt-12 animate-fade-in"
            style={{ animationDelay: "0.15s" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-sm font-semibold text-[var(--text-muted)] tracking-tight whitespace-nowrap">
                Keep the laughs going
              </h2>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-white/8 to-transparent" />
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              {moreJokes.map((j, i) => {
                const jSetup = j.jokeContent?.split(";")[0] || "";
                return (
                  <Link
                    key={j.jokeId}
                    to={`/jokes/${j.jokeId}`}
                    className="group md3-card p-4 flex flex-col gap-3 animate-fade-in"
                    style={{
                      animationDelay: `${0.2 + i * 0.06}s`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      {j.jokeType ? (
                        <span className="inline-flex items-center rounded-[var(--radius-full)] bg-deep-space-blue-800/40 px-2 py-0.5 text-[10px] font-semibold text-pearl-aqua-400 border border-[var(--border-subtle)] tracking-wide uppercase">
                          {formatType(j.jokeType)}
                        </span>
                      ) : (
                        <span />
                      )}
                      <span className="text-[10px] font-mono text-deep-space-blue-600">
                        #{j.jokeId}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed tracking-tight line-clamp-3 flex-1">
                      {jSetup}
                    </p>
                    <span className="text-[11px] font-semibold text-[var(--text-faint)] group-hover:text-pearl-aqua-300 transition-colors duration-[var(--duration-normal)] mt-auto">
                      View joke →
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
