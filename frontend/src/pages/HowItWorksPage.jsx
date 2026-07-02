import ApiReference from "../components/docs/ApiReference.jsx";

const STACK = [
  {
    label: "Backend",
    detail:
      "Spring Boot REST API with structured joke segments, keyword search via Data Specifications, pageable results, and soft deletes.",
  },
  {
    label: "Frontend",
    detail:
      "Vite + React SPA. TanStack Query for server state, Tailwind 4 over a tokenized design system.",
  },
  {
    label: "Database",
    detail:
      "PostgreSQL holding a tightly curated collection of low-quality puns.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="max-w-7xl mx-auto w-full px-6 pb-16 flex flex-col gap-8 animate-fade-in">
      <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] tracking-tight">
        How it works
      </h1>

      {/* What this is */}
      <div className="md3-card-static p-6 md:p-8 flex flex-col gap-6">
        <p className="text-xl text-pearl-aqua-100 font-medium leading-relaxed max-w-2xl">
          A production-grade API committed to a single deliverable:{" "}
          <span className="text-[var(--accent-text)] font-bold">
            terrible jokes.
          </span>
        </p>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-2xl">
          Each joke is stored as a sequence of segments — setup, optional
          back-and-forth, punchline — so any client can stage the delivery
          properly. This site is one such client. The API itself is public,
          unauthenticated, and documented below.
        </p>

        <div className="h-[1px] bg-[var(--border-subtle)]" />

        <dl className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STACK.map(({ label, detail }) => (
            <div key={label} className="flex flex-col gap-2">
              <dt className="text-xs font-black uppercase tracking-widest text-[var(--text-faint)]">
                {label}
              </dt>
              <dd className="text-sm text-[var(--text-muted)] leading-relaxed">
                {detail}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <ApiReference />
    </main>
  );
}
