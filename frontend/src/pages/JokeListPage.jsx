import { useQuery } from "@tanstack/react-query";
import { fetchJokes } from "../data/jokes/getJokes.js";
import JokeCard from "../components/jokes/JokeCard.jsx";
import LoadingSpinner from "../components/ui/LoadingSpinner.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";

export default function JokeListPage() {
  const {
    data: jokes,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["jokes"],
    queryFn: fetchJokes,
  });

  if (isLoading) return <LoadingSpinner message="Loading jokes..." />;
  if (error) return <ErrorMessage message={error.message} onRetry={refetch} />;

  return (
    <main className="max-w-7xl mx-auto w-full px-6 py-16 md:py-24">
      {/* Page Header */}
      <div className="mb-16 animate-fade-in text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] tracking-tight mb-4">
          Explore Jokes
        </h1>
        <p className="text-lg text-[var(--text-muted)] font-medium">
          A curated collection of {jokes.length} developer joke
          {jokes.length !== 1 ? "s" : ""}.
        </p>
      </div>

      {/* Joke Grid */}
      <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {jokes.map((joke, i) => (
          <JokeCard key={joke.jokeId} joke={joke} index={i} showHost={false} />
        ))}
      </div>

      {jokes.length === 0 && (
        <div className="text-center py-24 md3-card-static mt-8">
          <p className="text-xl font-medium text-[var(--text-muted)]">
            No jokes found. Check back soon!
          </p>
        </div>
      )}
    </main>
  );
}
