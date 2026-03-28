import { Link } from "react-router-dom";
import {
  Eye,
  User,
  Terminal,
  Copy,
  Check,
  AlertCircle,
  Share2,
} from "lucide-react";
import { useState, useEffect } from "react";
import Button from "../ui/Button.jsx";
import { useDevMode } from "../context/DevModeContext.js";
import JSONHighlighter from "../ui/JSONHighlighter.jsx";
import InlineSpoiler from "./InlineSpoiler.jsx";
import { parseJoke, formatType } from "../../utils/jokeUtils.js";

export default function JokeCard({
  joke,
  index = 0,
  showReveal = true,
  isDetail = false,
  showHost = true,
  forceDevView,
}) {
  const { isDevMode } = useDevMode();
  const showDevView = forceDevView !== undefined ? forceDevView : isDevMode;
  const [revealIndex, setRevealIndex] = useState(!showReveal ? 999 : 0);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  // Developer View States
  const API_HOST =
    window.location.origin === "http://localhost:5173"
      ? "http://localhost:8080"
      : window.location.origin;

  const [pathInput, setPathInput] = useState(`/api/v1/jokes/${joke.jokeId}`);
  const [responseStatus, setResponseStatus] = useState(
    joke.isMock ? 200 : null,
  );
  const [responseData, setResponseData] = useState(joke);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionError, setExecutionError] = useState(null);

  const segments = parseJoke(joke.jokeContent);
  const hasMultipleSegments = segments.length > 1;

  useEffect(() => {
    setResponseData(joke);
    setPathInput(`/api/v1/jokes/${joke.jokeId}`);
    setResponseStatus(joke.isMock ? 200 : null);
  }, [joke]);

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

  const authorName = joke.author
    ? `${joke.author.authorFirstName} ${joke.author.authorLastName}`
    : null;

  const jokeText = segments.join(" ");
  const jokeUrl = `${window.location.origin}/jokes/${joke.jokeId}`;

  const handleShare = async (e) => {
    e.stopPropagation();
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Joke #${joke.jokeId}`,
          text: jokeText,
          url: jokeUrl,
        });
      } else {
        await navigator.clipboard.writeText(jokeUrl);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch {
      // User cancelled or share failed silently
    }
  };

  return (
    <article
      className={`md3-card p-6 md:p-8 flex flex-col gap-6 animate-fade-in group h-full ${
        showDevView
          ? "font-mono border-pacific-cyan-500/20 bg-deep-space-blue-900/50"
          : ""
      }`}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Header / Type */}
      <div className="flex items-center justify-between">
        {showDevView ? (
          <span className="text-xs font-mono text-pacific-cyan-500/40 uppercase tracking-widest font-bold">
            Network Inspection
          </span>
        ) : joke.jokeType ? (
          <span className="inline-flex items-center rounded-[var(--radius-full)] bg-deep-space-blue-800/40 px-3 py-1 text-xs font-semibold text-pearl-aqua-300 border border-[var(--border-subtle)] tracking-wide">
            {formatType(joke.jokeType)}
          </span>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-3">
          {!showDevView && (
            <button
              onClick={handleShare}
              className="p-1.5 rounded-[var(--radius-full)] text-[var(--text-faint)] hover:text-pearl-aqua-300 hover:bg-white/5 active:scale-[0.98] transition-all duration-[var(--duration-normal)]"
              title={shared ? "Link copied" : "Share joke"}
            >
              {shared ? (
                <Check className="h-4 w-4 text-[var(--accent-text)]" />
              ) : (
                <Share2 className="h-4 w-4" strokeWidth={2.5} />
              )}
            </button>
          )}
          {!isDetail && (
            <span
              className={`text-xs font-mono opacity-60 ${showDevView ? "text-pacific-cyan-500" : "text-[var(--text-faint)]"}`}
            >
              #{joke.jokeId}
            </span>
          )}
        </div>
      </div>

      {showDevView ? (
        // Developer Mode Content
        <div className="flex flex-col gap-6 flex-1">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-[10px] text-pacific-cyan-500/60 uppercase tracking-widest font-bold">
              <span className="flex items-center gap-2">
                <Terminal className="h-3 w-3" />
                Request Editor
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `curl -X GET ${API_HOST}${pathInput}`,
                    );
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="hover:text-pacific-cyan-400 transition-colors duration-[var(--duration-normal)]"
                  title="Copy as cURL"
                >
                  {copied ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
                <button
                  onClick={handleExecuteRequest}
                  disabled={isExecuting}
                  className="px-3 py-1 rounded-[var(--radius-full)] border border-[var(--border-default)] text-[var(--accent-text)] hover:bg-white/5 hover:border-[var(--border-strong)] disabled:opacity-50 transition-all duration-[var(--duration-normal)] active:scale-[0.98]"
                  title="Execute Request"
                >
                  <span className="text-[10px] font-black uppercase tracking-tighter">
                    {isExecuting ? "Sending..." : "Send Request"}
                  </span>
                </button>
              </div>
            </div>
            <div className="flex items-center p-3 rounded-[var(--radius-md)] bg-[var(--bg-inset)] border border-[var(--border-subtle)] text-sm font-mono overflow-hidden">
              <span className="text-[var(--text-faint)] select-none mr-2">
                GET
              </span>
              {showHost && (
                <span className="text-deep-space-blue-600 select-none bg-deep-space-blue-900/40 px-1.5 py-0.5 rounded border border-[var(--border-subtle)] mr-2">
                  {API_HOST}
                </span>
              )}
              <input
                type="text"
                value={pathInput}
                onChange={(e) => setPathInput(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-pacific-cyan-300 placeholder:text-pacific-cyan-900"
                spellCheck="false"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <div className="flex items-center justify-between text-[10px] text-pacific-cyan-500/60 uppercase tracking-widest font-bold">
              <span className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-[var(--radius-full)] bg-pacific-cyan-500/40" />
                Response
              </span>

              <div className="flex items-center gap-3">
                {executionError && (
                  <span className="text-red-400 flex items-center gap-1 normal-case font-bold">
                    <AlertCircle className="h-3 w-3" />
                    Error
                  </span>
                )}

                <span
                  className={`inline-flex items-center gap-1.5 rounded-[var(--radius-full)] px-2 py-0.5 text-[9px] font-black border tracking-wider transition-colors duration-[var(--duration-normal)] ${
                    responseStatus >= 200 && responseStatus < 300
                      ? "bg-pacific-cyan-500/10 text-pacific-cyan-400 border-pacific-cyan-500/20"
                      : responseStatus >= 400
                        ? "bg-red-500/10 text-red-400 border-red-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}
                >
                  <div
                    className={`h-1 w-1 rounded-[var(--radius-full)] ${isExecuting ? "animate-ping" : ""} ${
                      responseStatus >= 200 && responseStatus < 300
                        ? "bg-pacific-cyan-500"
                        : "bg-red-500"
                    }`}
                  />
                  {responseStatus || "---"}{" "}
                  {joke.isMock && !responseStatus && "MOCK"}
                </span>
              </div>
            </div>
            <div className="p-4 rounded-[var(--radius-md)] bg-black/60 border border-[var(--border-subtle)] overflow-x-auto flex-1 min-h-[200px] shadow-inner">
              <JSONHighlighter data={responseData} />
            </div>
          </div>
        </div>
      ) : (
        // Standard Consumer Content
        <div className="flex flex-col flex-1">
          <div className="flex flex-col gap-4">
            {segments.map((segment, idx) => {
              const isRevealed = idx <= revealIndex;
              const isSetup = idx === 0;

              if (isSetup) {
                return (
                  <>
                    <p
                      key={idx}
                      className="text-xl md:text-2xl text-[var(--text-primary)] font-medium leading-relaxed tracking-tight group-hover:text-pearl-aqua-50 transition-colors duration-[var(--duration-normal)]"
                    >
                      {segment}
                    </p>
                    {hasMultipleSegments && (
                      <div className="h-[1px] w-24 mx-auto bg-gradient-to-r from-transparent via-white/8 to-transparent my-2" />
                    )}
                  </>
                );
              }

              return (
                <div
                  key={idx}
                  className="mt-2 text-xl md:text-2xl font-semibold mb-6 tracking-tight leading-relaxed"
                >
                  <InlineSpoiler
                    isRevealed={isRevealed}
                    onClick={() => setRevealIndex(idx)}
                  >
                    <span
                      className={
                        idx === segments.length - 1
                          ? "text-[var(--accent-text)]"
                          : "text-pearl-aqua-200"
                      }
                    >
                      {segment}
                    </span>
                  </InlineSpoiler>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      {!showDevView && (
        <div
          className={`flex items-center justify-between pt-6 mt-6 border-t border-[var(--border-subtle)] ${!hasMultipleSegments ? "mt-auto" : ""}`}
        >
          {authorName ? (
            <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-muted)]">
              <User className="h-4 w-4 opacity-70" />
              {authorName}
            </span>
          ) : (
            <span />
          )}

          {!isDetail && (
            <Link
              to={`/jokes/${joke.jokeId}`}
              className="text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-[var(--duration-normal)]"
            >
              View details →
            </Link>
          )}
        </div>
      )}
    </article>
  );
}
