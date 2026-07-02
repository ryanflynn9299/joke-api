import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchJokes } from "../data/jokes/getJokes.js";
import { formatType } from "../utils/jokeUtils.js";
import JokeCard from "../components/jokes/JokeCard.jsx";
import LoadingSpinner from "../components/ui/LoadingSpinner.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";

function FilterPill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`btn-base px-4 py-2 rounded-[var(--radius-full)] text-xs font-semibold border cursor-pointer ${
        active
          ? "bg-[var(--accent-subtle)] text-[var(--accent-text)] border-mint-leaf-500/30"
          : "bg-white/5 text-[var(--text-muted)] border-[var(--border-default)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]"
      }`}
    >
      {children}
    </button>
  );
}

export default function JokeListPage() {
  const [typeFilter, setTypeFilter] = useState(null);
  const {
    data: jokes,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["jokes"],
    queryFn: fetchJokes,
  });

  const types = useMemo(
    () => [...new Set((jokes ?? []).map((j) => j.type).filter(Boolean))],
    [jokes],
  );

  if (isLoading) return <LoadingSpinner message="Loading jokes..." />;
  if (error) return <ErrorMessage message={error.message} onRetry={refetch} />;

  const visible = typeFilter
    ? jokes.filter((j) => j.type === typeFilter)
    : jokes;

  return (
    <main className="max-w-7xl mx-auto w-full px-6 pb-16">
      {/* Page header */}
      <div className="mb-8 animate-fade-in flex flex-col gap-2">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] tracking-tight">
          Explore Jokes
        </h1>
        <p className="text-sm text-[var(--text-muted)] font-medium">
          {visible.length} of {jokes.length} joke{jokes.length !== 1 ? "s" : ""}
          {typeFilter ? ` · ${formatType(typeFilter)}` : " in the collection"}.
        </p>
      </div>

      {/* Type filter — only when the collection has variety */}
      {types.length > 1 && (
        <div className="mb-8 flex flex-wrap items-center gap-2 animate-fade-in">
          <FilterPill active={!typeFilter} onClick={() => setTypeFilter(null)}>
            All
          </FilterPill>
          {types.map((type) => (
            <FilterPill
              key={type}
              active={typeFilter === type}
              onClick={() => setTypeFilter(typeFilter === type ? null : type)}
            >
              {formatType(type)}
            </FilterPill>
          ))}
        </div>
      )}

      {/* Grid */}
      {visible.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((joke, i) => (
            <JokeCard key={joke.id} joke={joke} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 md3-card-static">
          <p className="text-xl font-medium text-[var(--text-muted)]">
            No jokes here yet. Check back soon!
          </p>
        </div>
      )}
    </main>
  );
}
