import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Loader2, CornerDownLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { searchJokes } from "../../data/jokes/getJokes.js";

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: results = [], isLoading } = useQuery({
    queryKey: ["search-jokes", debouncedQuery],
    queryFn: () => searchJokes(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  });

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
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (id) => {
    navigate(`/jokes/${id}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 sm:px-6 pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[var(--bg-base)]/80 backdrop-blur-xl animate-fade-in pointer-events-auto"
        style={{ animationDuration: "400ms" }}
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-2xl bg-deep-space-blue-900 border border-[var(--border-default)] rounded-[var(--radius-lg)] shadow-[var(--shadow-elevated)] overflow-hidden animate-fade-in flex flex-col max-h-[70vh] pointer-events-auto outline-none"
        style={{ animationDuration: "500ms" }}
        tabIndex="-1"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-6 py-4 border-b border-[var(--border-default)] gap-4">
          <Search
            className="h-6 w-6 text-pearl-aqua-400 shrink-0"
            strokeWidth={2.5}
          />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for jokes, setups, or punchlines..."
            className="w-full bg-transparent text-[var(--text-primary)] text-lg font-medium !outline-none focus:!outline-none focus-visible:!outline-none focus:!ring-0 placeholder:text-[var(--text-faint)]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-pearl-aqua-400 animate-spin shrink-0" />
          ) : (
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/8 rounded-[var(--radius-sm)] text-[var(--text-faint)] transition-colors focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-2">
          {query.length === 0 ? (
            <div className="py-16 px-6 flex flex-col items-center justify-center text-center gap-2">
              <div className="w-16 h-16 rounded-[var(--radius-full)] bg-white/5 flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-[var(--text-faint)] opacity-20" />
              </div>
              <p className="text-[var(--text-primary)] font-bold text-lg">
                Search Humor Engine
              </p>
              <p className="text-[var(--text-faint)] text-sm max-w-[30ch]">
                Start typing to find the perfect underwhelming punchline.
              </p>
            </div>
          ) : debouncedQuery.length > 0 &&
            results.length === 0 &&
            !isLoading ? (
            <div className="py-16 px-6 flex flex-col items-center justify-center text-center gap-2">
              <p className="text-[var(--text-primary)] font-bold text-lg">
                No results found for "{query}"
              </p>
              <p className="text-[var(--text-faint)] text-sm">
                Try searching for keywords like "developer", "API", or "joke".
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {results.map((joke) => (
                <button
                  key={joke.id}
                  onClick={() => handleSelect(joke.id)}
                  className="flex items-center justify-between p-4 rounded-[var(--radius-md)] hover:bg-white/[0.03] group transition-all duration-[var(--duration-normal)] text-left border border-transparent hover:border-[var(--border-subtle)] focus:outline-none"
                >
                  <div className="flex flex-col gap-1 pr-4">
                    <div className="text-pearl-aqua-100 font-bold line-clamp-1 group-hover:text-[var(--text-primary)] transition-colors duration-[var(--duration-normal)]">
                      {joke.setup}
                    </div>
                    <div className="text-[var(--text-faint)] text-sm line-clamp-1 italic group-hover:text-[var(--text-muted)]">
                      {joke.punchline}
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-deep-space-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--duration-normal)]">
                      Select
                    </span>
                    <CornerDownLeft className="h-4 w-4 text-pearl-aqua-500 opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--duration-normal)]" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Keyboard Footer */}
        <div className="px-6 py-3 border-t border-[var(--border-subtle)] bg-[var(--bg-base)]/40 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.15em] text-[var(--text-faint)]">
          <div className="flex gap-6">
            <span className="flex items-center gap-2">
              <kbd className="px-1.5 py-1 rounded bg-deep-space-blue-800 border border-[var(--border-subtle)] text-[var(--text-secondary)] leading-none">
                ESC
              </kbd>
              <span>to close</span>
            </span>
            <span className="flex items-center gap-2">
              <kbd className="px-1.5 py-1 rounded bg-deep-space-blue-800 border border-[var(--border-subtle)] text-[var(--text-secondary)] leading-none">
                ↵
              </kbd>
              <span>to select</span>
            </span>
          </div>
          {results.length > 0 && (
            <span className="text-pearl-aqua-500/60 font-mono tracking-tighter">
              {results.length} jokes matched
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
