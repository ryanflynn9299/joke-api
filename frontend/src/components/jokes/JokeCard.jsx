import { Link } from "react-router-dom";
import { useState } from "react";
import { User } from "lucide-react";
import { useDevMode } from "../../context/DevModeContext.js";
import InlineSpoiler from "./InlineSpoiler.jsx";
import ApiSnippet from "../dev/ApiSnippet.jsx";
import {
  formatType,
  setupOf,
  responseSegmentsOf,
} from "../../utils/jokeUtils.js";

/**
 * A single joke in a collection. Consumer mode: setup with the response
 * hidden behind inline spoilers. Developer Mode: the same joke as the API
 * exchange that fetched it.
 */
export default function JokeCard({ joke, index = 0, requestPath }) {
  const { isDevMode } = useDevMode();
  const [revealedSteps, setRevealedSteps] = useState(() => new Set());

  const setup = setupOf(joke);
  const response = responseSegmentsOf(joke);
  const path = requestPath ?? `/jokes/${joke.id}`;

  const reveal = (step) => setRevealedSteps((prev) => new Set(prev).add(step));

  return (
    <article
      className="md3-card p-6 md:p-8 flex flex-col gap-6 h-full animate-fade-in"
      style={{ animationDelay: `${Math.min(index, 8) * 0.06}s` }}
    >
      {isDevMode ? (
        <ApiSnippet path={path} data={joke.raw} isMock={joke.isMock} />
      ) : (
        <div className="flex flex-col gap-4 flex-1">
          {/* Meta row */}
          <div className="flex items-center justify-between">
            {joke.type ? (
              <span className="inline-flex items-center rounded-[var(--radius-full)] bg-deep-space-blue-800/40 px-3 py-1 text-xs font-semibold text-pearl-aqua-300 border border-[var(--border-subtle)]">
                {formatType(joke.type)}
              </span>
            ) : (
              <span />
            )}
            <span className="text-xs font-mono text-[var(--text-faint)]">
              #{joke.id}
            </span>
          </div>

          {/* Setup */}
          <p className="text-xl md:text-2xl font-bold text-[var(--text-primary)] leading-snug tracking-tight">
            {setup}
          </p>

          {/* Response, hidden until tapped */}
          {response.length > 0 && (
            <div className="flex flex-col gap-2">
              {response.map((segment) => (
                <p
                  key={segment.step}
                  className="text-base font-medium leading-relaxed"
                >
                  <InlineSpoiler
                    isRevealed={revealedSteps.has(segment.step)}
                    onClick={() => reveal(segment.step)}
                  >
                    <span
                      className={
                        segment.kind === "PUNCHLINE"
                          ? "text-[var(--accent-text)]"
                          : "text-pearl-aqua-200"
                      }
                    >
                      {segment.text}
                    </span>
                  </InlineSpoiler>
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 mt-auto border-t border-[var(--border-subtle)]">
        {joke.author?.name && !isDevMode ? (
          <span className="inline-flex items-center gap-2 text-xs font-medium text-[var(--text-muted)]">
            <User className="h-3 w-3 opacity-70" aria-hidden="true" />
            {joke.author.name}
          </span>
        ) : (
          <span className="text-xs font-mono text-[var(--text-faint)]">
            {isDevMode ? `id: ${joke.id}` : ""}
          </span>
        )}
        <Link
          to={`/jokes/${joke.id}`}
          className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-[var(--duration-normal)]"
        >
          View details →
        </Link>
      </div>
    </article>
  );
}
