import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search, Code, Terminal } from "lucide-react";
import { useDevMode } from "../../context/DevModeContext.js";
import SearchModal from "../ui/SearchModal.jsx";
import Logomark from "./Logomark.jsx";

function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-[var(--radius-sm)] text-sm font-bold transition-colors duration-[var(--duration-normal)] ${
        active
          ? "text-[var(--text-primary)] bg-white/8"
          : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5"
      }`}
    >
      {children}
    </Link>
  );
}

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isDevMode, toggleDevMode } = useDevMode();
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-20 glass-panel">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between gap-4">
          {/* Brand lockup */}
          <Link to="/" className="flex items-center gap-3 group">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] border transition-colors duration-[var(--duration-normal)] ${
                isDevMode
                  ? "bg-pacific-cyan-500/10 border-pacific-cyan-500/30 text-pacific-cyan-300"
                  : "bg-[var(--accent-subtle)] border-mint-leaf-500/20 text-[var(--accent-text)]"
              }`}
            >
              <Logomark className="h-6 w-6" />
            </span>
            <span className="flex flex-col gap-1">
              <span className="text-2xl font-black text-[var(--text-primary)] tracking-tighter leading-none group-hover:text-pearl-aqua-100 transition-colors duration-[var(--duration-normal)]">
                Joke API
              </span>
              <span
                className={`text-[10px] font-black uppercase tracking-widest leading-none ${
                  isDevMode
                    ? "font-mono text-pacific-cyan-400 normal-case"
                    : "text-[var(--accent-text)]"
                }`}
              >
                {isDevMode ? "//Humor Engine" : "Humor Engine"}
              </span>
            </span>
          </Link>

          <nav
            className="flex items-center gap-1 sm:gap-2"
            aria-label="Primary"
          >
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors duration-[var(--duration-normal)] cursor-pointer"
              aria-label="Search jokes"
            >
              <Search
                className="h-4 w-4"
                strokeWidth={2.5}
                aria-hidden="true"
              />
              <kbd
                className="hidden md:inline text-[10px] font-black uppercase tracking-widest font-sans"
                aria-hidden="true"
              >
                ⌘K
              </kbd>
            </button>

            <NavLink
              to="/jokes"
              active={location.pathname.startsWith("/jokes")}
            >
              Explore
            </NavLink>
            <NavLink
              to="/how-it-works"
              active={location.pathname.startsWith("/how-it-works")}
            >
              How it works
            </NavLink>

            <div
              className="hidden sm:block w-px h-4 bg-[var(--border-default)] mx-1"
              aria-hidden="true"
            />

            {/* Developer Mode toggle */}
            <button
              onClick={toggleDevMode}
              aria-pressed={isDevMode}
              aria-label="Developer Mode"
              title={
                isDevMode ? "Disable Developer Mode" : "Enable Developer Mode"
              }
              className={`btn-base flex items-center gap-2 px-3 py-2 rounded-[var(--radius-full)] border text-[10px] font-black uppercase tracking-widest cursor-pointer ${
                isDevMode
                  ? "bg-pacific-cyan-500/10 border-pacific-cyan-500/30 text-pacific-cyan-300"
                  : "bg-white/5 border-[var(--border-default)] text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
              }`}
            >
              {isDevMode ? (
                <Terminal className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Code className="h-4 w-4" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">
                {isDevMode ? "Dev On" : "Dev Off"}
              </span>
            </button>
          </nav>
        </div>
      </header>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
