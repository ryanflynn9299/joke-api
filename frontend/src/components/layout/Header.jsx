import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search, Code, Terminal } from "lucide-react";
import { useDevMode } from "../../context/DevModeContext.js";
import SearchModal from "../ui/SearchModal.jsx";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isDevMode, toggleDevMode } = useDevMode();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const isJokesPath = location.pathname.startsWith("/jokes");
  const isHowItWorksPath = location.pathname.startsWith("/how-it-works");

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex items-center transition-all duration-[var(--duration-slow)] ease-[var(--ease-default)] will-change-transform ${
          scrolled
            ? "h-16 bg-[var(--bg-elevated)] backdrop-blur-2xl border-b border-[var(--border-default)] shadow-[var(--shadow-elevated)]"
            : "h-28 bg-transparent border-b border-transparent shadow-none"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between gap-8">
          {/* Logo */}
          <Link to="/" className="relative flex items-center group h-[40px]">
            <span
              className={`font-black text-[var(--text-primary)] group-hover:text-pearl-aqua-100 transition-all duration-[var(--duration-slow)] ease-[var(--ease-default)] origin-left tracking-tighter will-change-transform ${
                scrolled ? "text-[22px] leading-none" : "text-4xl leading-none"
              }`}
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Joke API
            </span>
            <span
              className={`absolute whitespace-nowrap font-bold tracking-widest uppercase transition-all duration-[var(--duration-slow)] ease-[var(--ease-default)] will-change-transform text-[10px] ${
                isDevMode
                  ? "text-pacific-cyan-400 font-mono"
                  : "text-[var(--accent-text)]"
              } ${
                scrolled
                  ? "translate-x-[96px] translate-y-[4px]"
                  : "translate-x-[2px] translate-y-[22px]"
              }`}
            >
              {isDevMode ? "// Humor Engine" : "Humor Engine"}
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 sm:px-2.5 rounded-[var(--radius-full)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 active:scale-[0.98] transition-all duration-[var(--duration-normal)] group flex items-center gap-1.5"
              aria-label="Search Jokes"
            >
              <span className="hidden md:block text-[11px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0 translate-x-1">
                <kbd className="font-sans">⌘</kbd>K
              </span>
              <Search
                className="h-5 w-5 md:h-4 md:w-4 transition-transform group-hover:scale-110 shrink-0"
                strokeWidth={3}
              />
            </button>

            <div className="hidden sm:block w-px h-4 bg-[var(--border-default)] mx-0 rounded-full" />

            <Link
              to="/jokes"
              className={`relative px-4 py-2 rounded-[var(--radius-full)] text-sm font-bold transition-all duration-[var(--duration-normal)] ${
                isJokesPath
                  ? "text-[var(--text-primary)] bg-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 active:scale-[0.98]"
              }`}
            >
              Explore
            </Link>

            <div className="hidden sm:block w-px h-4 bg-[var(--border-default)] mx-0 rounded-full" />

            <Link
              to="/how-it-works"
              className={`relative px-4 py-2 rounded-[var(--radius-full)] text-sm font-bold transition-all duration-[var(--duration-normal)] ${
                isHowItWorksPath
                  ? "text-[var(--text-primary)] bg-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 active:scale-[0.98]"
              }`}
            >
              How it works
            </Link>

            <div className="hidden sm:block w-px h-4 bg-[var(--border-default)] mx-1 rounded-full" />

            {/* Developer Mode Toggle */}
            <button
              onClick={toggleDevMode}
              className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-full)] border transition-all duration-[var(--duration-normal)] active:scale-[0.98] ${
                isDevMode
                  ? "bg-pacific-cyan-500/10 border-pacific-cyan-500/30 text-pacific-cyan-300 shadow-[0_0_12px_rgba(14,165,233,0.08)]"
                  : "bg-white/5 border-[var(--border-default)] text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
              }`}
              title={
                isDevMode ? "Disable Developer Mode" : "Enable Developer Mode"
              }
            >
              {isDevMode ? (
                <Terminal className="h-4 w-4 animate-pulse" />
              ) : (
                <Code className="h-4 w-4" />
              )}
              <span className="text-[10px] font-black uppercase tracking-tighter">
                {isDevMode ? "Dev On" : "Dev Off"}
              </span>

              <div className="absolute inset-0 rounded-[var(--radius-full)] opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--duration-normal)] pointer-events-none bg-gradient-to-r from-transparent via-white/5 to-transparent" />
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
