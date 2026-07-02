import { Link } from "react-router-dom";
import { Github } from "lucide-react";
import Logomark from "./Logomark.jsx";
import { API_BASE_URL } from "../../data/apiConfig.js";

const columnHeading =
  "text-xs font-black uppercase tracking-widest text-[var(--text-faint)]";
const footerLink =
  "text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-[var(--duration-normal)]";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full mt-auto border-t border-[var(--border-subtle)]">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-10">
        {/* Brand */}
        <div className="flex flex-col gap-4 items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-subtle)] border border-mint-leaf-500/20 text-[var(--accent-text)]">
              <Logomark className="h-6 w-6" />
            </span>
            <span className="text-lg font-black text-[var(--text-primary)] tracking-tighter">
              Joke API
            </span>
          </div>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-[36ch]">
            Underwhelming punchlines, reliably delivered. One hand-curated joke
            a day, served over REST.
          </p>
        </div>

        {/* Site */}
        <nav
          aria-label="Site"
          className="flex flex-col gap-3 items-center md:items-start"
        >
          <h2 className={columnHeading}>Site</h2>
          <Link to="/" className={footerLink}>
            Joke of the Day
          </Link>
          <Link to="/jokes" className={footerLink}>
            Explore
          </Link>
          <Link to="/how-it-works" className={footerLink}>
            How it works
          </Link>
        </nav>

        {/* Developers */}
        <div className="flex flex-col gap-3 items-center md:items-start">
          <h2 className={columnHeading}>Developers</h2>
          <Link to="/how-it-works" className={footerLink}>
            API reference
          </Link>
          <a
            href="https://github.com/ryanflynn9299"
            target="_blank"
            rel="noopener noreferrer"
            className={`${footerLink} inline-flex items-center gap-2`}
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            GitHub
          </a>
          <code className="text-xs font-mono text-[var(--text-faint)] break-all">
            {API_BASE_URL}
          </code>
        </div>
      </div>

      {/* Meta */}
      <div className="border-t border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[var(--text-faint)]">
          <span>&copy; {year} Ryan Flynn. All rights reserved. (Mostly.)</span>
          <span>Built on Spring Boot &amp; React.</span>
        </div>
      </div>
    </footer>
  );
}
