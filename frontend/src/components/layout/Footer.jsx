import { Link } from "react-router-dom";
import { Github } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full py-8 mt-auto border-t border-[var(--border-subtle)] relative z-10 glass-panel bg-[var(--bg-base)]/20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Basics & Copyright */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="text-[var(--text-primary)] font-bold tracking-tight">
            Joke API
          </span>
          <span className="text-xs text-[var(--text-faint)]">
            &copy; {year} Ryan Flynn. All rights reserved. (Mostly).
          </span>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* GitHub Link */}
          <a
            href="https://github.com/ryanflynn9299"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-[var(--radius-full)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 active:scale-[0.98] transition-all duration-[var(--duration-normal)]"
            aria-label="GitHub Repository"
          >
            <Github className="h-5 w-5" />
          </a>

          {/* Version Number */}
          <span className="text-[10px] font-mono text-[var(--text-faint)] opacity-50 tracking-widest hidden sm:block select-none">
            v1.1.0
          </span>
        </div>
      </div>
    </footer>
  );
}
