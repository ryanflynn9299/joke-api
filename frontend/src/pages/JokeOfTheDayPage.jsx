import { useQuery } from "@tanstack/react-query";
import { fetchJokeOfTheDay } from "../data/jokes/getJokes.js";
import JokeCard from "../components/jokes/JokeCard.jsx";
import LoadingSpinner from "../components/ui/LoadingSpinner.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, ArrowLeftRight } from "lucide-react";
import { useDevMode } from "../context/DevModeContext.js";
import Button from "../components/ui/Button.jsx";

export default function JokeOfTheDayPage() {
  const { isDevMode } = useDevMode();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["joke-of-the-day"],
    queryFn: fetchJokeOfTheDay,
  });

  if (isLoading) return <LoadingSpinner message="Fetching today's joke..." />;
  if (error) return <ErrorMessage message={error.message} onRetry={refetch} />;

  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center pt-8 pb-24 px-4 relative">
      {/* Ambient Hero Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-pacific-cyan-500/10 rounded-[var(--radius-full)] blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/4 w-[600px] h-[400px] bg-mint-leaf-500/5 rounded-[var(--radius-full)] blur-2xl pointer-events-none -z-10" />

      <div className="w-full max-w-[75ch] animate-fade-in flex flex-col gap-8 z-10 relative">
        {/* Landing Header */}
        <header className="flex flex-col items-center text-center gap-6 mt-12 mb-4">
          <div className="inline-flex items-center gap-2 glass-panel py-1.5 px-4 rounded-[var(--radius-full)] border border-[var(--border-default)]">
            <Sparkles className="h-4 w-4 text-[var(--accent-text)]" />
            <span className="text-xs font-semibold text-pearl-aqua-100 uppercase tracking-widest">
              Joke of the Day
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-[var(--text-primary)] tracking-tighter leading-[1.05] drop-shadow-2xl max-w-[14ch] md:max-w-[20ch] mx-auto">
            An over-engineered{" "}
            <span className="text-[var(--accent-text)]">
              {isDevMode ? "API" : "site"}
            </span>{" "}
            <br />
            dedicated to{" "}
            <span className="text-[var(--accent-text)]">
              underwhelming punchlines.
            </span>
          </h1>
        </header>

        {/* Main Hero Card */}
        <section className="mx-auto w-full max-w-[65ch]">
          <JokeCard joke={data} index={0} showReveal={true} />
        </section>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <Link to="/jokes" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full sm:w-auto group">
              Browse All Jokes
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>

          {isDevMode && (
            <Link to="/how-it-works" className="w-full sm:w-auto">
              <Button variant="secondary" className="w-full sm:w-auto group">
                <ArrowLeftRight className="h-4 w-4 text-pearl-aqua-400" />
                See How It Works
              </Button>
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
