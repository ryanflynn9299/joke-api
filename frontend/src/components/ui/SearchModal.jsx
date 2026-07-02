import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Loader2, CornerDownLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { searchJokes } from "../../data/jokes/getJokes.js";
import {
  setupOf,
  responseSegmentsOf,
  formatType,
} from "../../utils/jokeUtils.js";

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const panelRef = useRef(null);

  // Trap focus inside the dialog; restore it to the trigger on close.
  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement;
    const handleTab = (e) => {
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll(
        'button, input, a[href], [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleTab);
    return () => {
      window.removeEventListener("keydown", handleTab);
      previouslyFocused?.focus?.();
    };
  }, [isOpen]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data, isLoading } = useQuery({
    queryKey: ["search-jokes", debouncedQuery],
    queryFn: () => searchJokes(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  });
  const results = data?.results ?? [];
  const total = data?.total ?? 0;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        setQuery("");
        setDebouncedQuery("");
      }, 50);
      return () => {
        document.body.style.overflow = "unset";
        clearTimeout(timer);
      };
    }
    document.body.style.overflow = "unset";
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (id) => {
    navigate(`/jokes/${id}`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-6"
      role="dialog"
      aria-modal="true"
      aria-label="Search jokes"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[var(--bg-base)]/80"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative w-full max-w-2xl bg-deep-space-blue-900 border border-[var(--border-default)] rounded-[var(--radius-lg)] shadow-[var(--shadow-elevated)] overflow-hidden animate-fade-in flex flex-col max-h-[70vh]"
      >
        {/* Input bar */}
        <div className="flex items-center px-6 py-4 border-b border-[var(--border-default)] gap-4">
          <Search
            className="h-5 w-5 text-pearl-aqua-400 shrink-0"
            strokeWidth={2.5}
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="text"
            aria-label="Search jokes and authors"
            placeholder="Search jokes and authors..."
            className="w-full bg-transparent text-[var(--text-primary)] text-lg font-medium !outline-none placeholder:text-[var(--text-faint)]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {isLoading ? (
            <Loader2
              className="h-5 w-5 text-pearl-aqua-400 animate-spin shrink-0"
              aria-hidden="true"
            />
          ) : (
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/8 rounded-[var(--radius-sm)] text-[var(--text-faint)] transition-colors duration-[var(--duration-normal)] cursor-pointer"
              aria-label="Close search"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-2">
          {query.length === 0 ? (
            <div className="py-16 px-6 flex flex-col items-center justify-center text-center gap-2">
              <p className="text-[var(--text-primary)] font-bold text-lg">
                Search the collection
              </p>
              <p className="text-[var(--text-faint)] text-sm max-w-[36ch]">
                Find a setup, a punchline, or an author. Matching is generous;
                the jokes are not.
              </p>
            </div>
          ) : debouncedQuery.length > 0 &&
            results.length === 0 &&
            !isLoading ? (
            <div className="py-16 px-6 flex flex-col items-center justify-center text-center gap-2">
              <p className="text-[var(--text-primary)] font-bold text-lg">
                No results for "{debouncedQuery}"
              </p>
              <p className="text-[var(--text-faint)] text-sm">
                Try a different keyword, or blame the search index.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-1 list-none m-0 p-0">
              {results.map((joke) => (
                <li key={joke.id}>
                  <button
                    onClick={() => handleSelect(joke.id)}
                    className="w-full flex items-center justify-between gap-4 p-4 rounded-[var(--radius-md)] hover:bg-white/[0.03] group transition-colors duration-[var(--duration-normal)] text-left border border-transparent hover:border-[var(--border-subtle)] cursor-pointer"
                  >
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="text-pearl-aqua-100 font-bold line-clamp-1 group-hover:text-[var(--text-primary)] transition-colors duration-[var(--duration-normal)]">
                        {setupOf(joke)}
                      </span>
                      <span className="text-[var(--text-faint)] text-sm line-clamp-1 italic group-hover:text-[var(--text-muted)]">
                        {responseSegmentsOf(joke)
                          .map((s) => s.text)
                          .join(" ")}
                      </span>
                    </div>
                    <div className="shrink-0 flex items-center gap-3">
                      {joke.type && (
                        <span className="hidden sm:inline text-[10px] font-semibold uppercase tracking-widest text-[var(--text-faint)]">
                          {formatType(joke.type)}
                        </span>
                      )}
                      <CornerDownLeft className="h-4 w-4 text-pearl-aqua-500 opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--duration-normal)]" />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[var(--border-subtle)] bg-[var(--bg-base)]/40 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-[var(--text-faint)]">
          <div className="flex gap-6">
            <span className="flex items-center gap-2">
              <kbd className="px-2 py-1 rounded-[var(--radius-sm)] bg-deep-space-blue-800 border border-[var(--border-subtle)] text-[var(--text-secondary)] leading-none">
                ESC
              </kbd>
              close
            </span>
            <span className="flex items-center gap-2">
              <kbd className="px-2 py-1 rounded-[var(--radius-sm)] bg-deep-space-blue-800 border border-[var(--border-subtle)] text-[var(--text-secondary)] leading-none">
                ↵
              </kbd>
              open
            </span>
          </div>
          {results.length > 0 && (
            <span
              role="status"
              className="font-mono normal-case tracking-tight"
            >
              {total} match{total !== 1 ? "es" : ""}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
