import ApiDocumentation from "../components/layout/ApiDocumentation.jsx";
import { Cpu, Layers, Zap, ShieldCheck } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col items-center pt-16 pb-24 px-4 relative">
      <div className="w-full max-w-7xl text-left animate-fade-in relative z-10 flex flex-col gap-8">
        <h1 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] tracking-tighter">
          How it works
        </h1>

        {/* Pos 1: Vision & Tech */}
        <div className="md3-card-static p-8 flex flex-col gap-6">
          <p className="text-xl text-pearl-aqua-100 font-medium leading-relaxed">
            This is a highly sophisticated, robust API designed to serve exactly
            one thing:
            <br />
            <span className="text-[var(--accent-text)] font-bold">
              Terrible developer jokes.
            </span>
          </p>

          <div className="h-px bg-[var(--border-subtle)] w-full rounded-[var(--radius-full)] my-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                The Mission
              </h3>
              <p className="text-[var(--text-muted)]">
                Our goal is to provide developers with a reliable,
                high-performance source of humor to mitigate the stress of
                debugging and the existential dread of architectural reviews.
              </p>
            </div>
            <div className="flex flex-col gap-4 text-sm">
              <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
                The Stack
              </h3>
              <ul className="list-disc pl-4 space-y-2 text-[var(--text-muted)]">
                <li>
                  <strong>Backend</strong>: Spring Boot Java application serving
                  data via RESTful endpoints.
                </li>
                <li>
                  <strong>Frontend</strong>: Vite React SPA utilizing
                  TailwindCSS 4 and Material Design 3 elevation geometry.
                </li>
                <li>
                  <strong>Database</strong>: A tightly curated repository of
                  low-quality puns and high-quality setup patterns.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pos 2: Features */}
        <div className="md3-card-static p-8 flex flex-col gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-mint-leaf-500/15 blur-[100px] rounded-[var(--radius-full)] translate-x-32 -translate-y-32 pointer-events-none" />

          <div className="flex flex-col gap-4 relative z-10">
            <h3 className="text-2xl font-black text-[var(--text-primary)] tracking-tight flex items-center gap-3">
              <Cpu className="h-6 w-6 text-pearl-aqua-400" />
              System Features & Technical Skills
            </h3>
            <p className="text-[var(--text-muted)] max-w-3xl leading-relaxed">
              This application serves as a comprehensive demonstration of
              professional full-stack engineering. From sophisticated backend
              data filtering to a highly-optimized, responsive frontend, every
              layer is built with production standards in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
            {/* Backend Column */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] pb-4">
                <div className="h-8 w-8 rounded-[var(--radius-md)] bg-pearl-aqua-500/10 flex items-center justify-center border border-pearl-aqua-500/20">
                  <Layers className="h-4 w-4 text-pearl-aqua-400" />
                </div>
                <h4 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-[0.2em] pt-1">
                  Backend Architecture
                </h4>
              </div>

              <ul className="flex flex-col gap-4">
                {[
                  {
                    title: "Spring Boot 3 Core",
                    desc: "Robust REST API implementation with comprehensive error handling and REST-compliant status codes.",
                  },
                  {
                    title: "Advanced Data Filtering",
                    desc: (
                      <>
                        Type-safe query construction using{" "}
                        <strong>Spring Data Specifications</strong> for complex,
                        multi-field search logic.
                      </>
                    ),
                  },
                  {
                    title: "Scalable Pagination",
                    desc: (
                      <>
                        Native <strong>Pageable</strong> support across
                        endpoints to optimize memory usage and response payload
                        sizes.
                      </>
                    ),
                  },
                  {
                    title: "Automated Soft-Delete",
                    desc: "Sophisticated entity lifecycle management using Hibernate's `@SQLRestriction` for transparent data retention.",
                  },
                ].map(({ title, desc }, idx) => (
                  <li key={idx} className="flex gap-4">
                    <div className="h-2 w-2 rounded-[var(--radius-full)] bg-pearl-aqua-500/40 mt-1.5 shrink-0" />
                    <div className="flex flex-col gap-1">
                      <span className="text-[var(--text-primary)] font-bold text-sm">
                        {title}
                      </span>
                      <p className="text-xs text-[var(--text-faint)] leading-normal">
                        {desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Frontend Column */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] pb-4">
                <div className="h-8 w-8 rounded-[var(--radius-md)] bg-mint-leaf-500/10 flex items-center justify-center border border-mint-leaf-500/20">
                  <Zap className="h-4 w-4 text-[var(--accent-text)]" />
                </div>
                <h4 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-[0.2em] pt-1">
                  Frontend Engineering
                </h4>
              </div>

              <ul className="flex flex-col gap-4">
                {[
                  {
                    title: "Asynchronous State Management",
                    desc: (
                      <>
                        Utilizing <strong>TanStack Query</strong> for resilient
                        data fetching, automatic caching, and elegant loading
                        states.
                      </>
                    ),
                  },
                  {
                    title: "Optimized Search Interaction",
                    desc: (
                      <>
                        High-performance <strong>Debounced Search</strong>{" "}
                        implementation to minimize API overhead while providing
                        instant feedback.
                      </>
                    ),
                  },
                  {
                    title: "Design System Integration",
                    desc: (
                      <>
                        Built with <strong>TailwindCSS 4</strong> and customized
                        tokens, ensuring a responsive, high-fidelity Material
                        Design 3 experience.
                      </>
                    ),
                  },
                  {
                    title: "Integrated Developer Mode",
                    desc: "Custom context-aware debugging tools and mock-data fallbacks for seamless local development environments.",
                  },
                ].map(({ title, desc }, idx) => (
                  <li key={idx} className="flex gap-4">
                    <div className="h-2 w-2 rounded-[var(--radius-full)] bg-mint-leaf-500/40 mt-1.5 shrink-0" />
                    <div className="flex flex-col gap-1">
                      <span className="text-[var(--text-primary)] font-bold text-sm">
                        {title}
                      </span>
                      <p className="text-xs text-[var(--text-faint)] leading-normal">
                        {desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <ApiDocumentation />
      </div>
    </main>
  );
}
