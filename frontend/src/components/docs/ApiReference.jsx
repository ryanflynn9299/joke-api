import { useState } from "react";
import { ChevronDown, ChevronRight, Check, Copy, Play } from "lucide-react";
import JSONHighlighter from "../ui/JSONHighlighter.jsx";
import { API_BASE_URL, apiUrl, curlFor } from "../../data/apiConfig.js";

/**
 * Live API reference. Every endpoint documents the backend's actual wire
 * format and can be executed against the running API from the page.
 */

const EXAMPLE_JOKE = {
  id: 1,
  jokeContent:
    "Why was Cinderella so bad at soccer?;She ran away from the ball!",
  jokeType: "ONE_LINER",
  author: {
    authorId: 1,
    authorFirstName: "Ryan",
    authorLastName: "Flynn",
    authorFullName: "Ryan Flynn",
  },
  createdDateTime: "2026-02-04T12:00:00Z",
  modifiedDateTime: "2026-02-04T12:00:00Z",
  lastJotdDatetime: null,
  segments: [
    {
      text: "Why was Cinderella so bad at soccer?",
      type: "SETUP",
      revealStep: 0,
    },
    { text: "She ran away from the ball!", type: "PUNCHLINE", revealStep: 1 },
  ],
};

const ENDPOINT_GROUPS = [
  {
    group: "Jokes",
    endpoints: [
      {
        method: "GET",
        path: "/joke-of-the-day",
        tryPath: "/joke-of-the-day",
        summary: "Today's featured joke",
        description:
          "Returns the joke currently holding the Joke of the Day title. A new joke is promoted daily from the pool of jokes that haven't been featured recently.",
        example: { ...EXAMPLE_JOKE, lastJotdDatetime: "2026-06-10" },
      },
      {
        method: "GET",
        path: "/jokes",
        tryPath: "/jokes",
        summary: "List every joke",
        description:
          "The full, unpaginated collection. Each joke includes a structured segments array — setup, optional interaction beats, punchline — with reveal ordering, so clients don't have to parse jokeContent themselves.",
        example: [EXAMPLE_JOKE],
      },
      {
        method: "GET",
        path: "/jokes/{id}",
        tryPath: "/jokes/1",
        summary: "Fetch a single joke",
        description:
          "Look up one joke by its numeric id. Unknown ids currently return an empty 200 rather than a 404 — the API refuses to admit a joke doesn't exist.",
        params: [
          {
            name: "id",
            location: "path",
            type: "integer",
            description: "Unique id of the joke.",
          },
        ],
        example: EXAMPLE_JOKE,
      },
      {
        method: "GET",
        path: "/jokes/search",
        tryPath: "/jokes/search?q=ball&size=5",
        summary: "Search with pagination",
        description:
          "Case-insensitive keyword search across joke content and author names, returned as a Spring page. Omit q to page through everything.",
        params: [
          {
            name: "q",
            location: "query",
            type: "string",
            description: "Search term. Blank matches all jokes.",
          },
          {
            name: "page",
            location: "query",
            type: "integer",
            description: "Zero-based page index. Defaults to 0.",
          },
          {
            name: "size",
            location: "query",
            type: "integer",
            description: "Page size. Defaults to 20.",
          },
          {
            name: "sort",
            location: "query",
            type: "string",
            description: "Sort spec, e.g. jokeContent,asc or createdDate,desc.",
          },
        ],
        example: {
          content: [EXAMPLE_JOKE],
          totalElements: 1,
          totalPages: 1,
          size: 5,
          number: 0,
          first: true,
          last: true,
          empty: false,
        },
      },
    ],
  },
  {
    group: "Authors",
    endpoints: [
      {
        method: "GET",
        path: "/authors/{id}",
        tryPath: "/authors/1",
        summary: "Fetch an author",
        description: "Look up the comedian responsible, by numeric id.",
        params: [
          {
            name: "id",
            location: "path",
            type: "integer",
            description: "Unique id of the author.",
          },
        ],
        example: {
          authorId: 1,
          authorFirstName: "Ryan",
          authorLastName: "Flynn",
          authorFullName: "Ryan Flynn",
        },
      },
    ],
  },
];

function statusStyle(status) {
  if (status >= 200 && status < 300)
    return "bg-mint-leaf-500/10 text-[var(--accent-text)] border-mint-leaf-500/20";
  if (status >= 400 && status < 500)
    return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  return "bg-red-500/10 text-red-400 border-red-500/20";
}

function statusDot(status) {
  if (status >= 200 && status < 300) return "bg-[var(--status-success)]";
  if (status >= 400 && status < 500) return "bg-[var(--status-warning)]";
  return "bg-[var(--status-error)]";
}

function EndpointRow({ endpoint }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [live, setLive] = useState(null); // { status, body } | { error }

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(curlFor(endpoint.tryPath));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard denied */
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    try {
      const response = await fetch(apiUrl(endpoint.tryPath));
      const text = await response.text();
      let body;
      try {
        body = text ? JSON.parse(text) : "(empty body)";
      } catch {
        body = text;
      }
      setLive({ status: response.status, body });
    } catch (err) {
      setLive({ error: err.message });
    } finally {
      setIsRunning(false);
    }
  };

  const shownBody = live && !live.error ? live.body : endpoint.example;

  return (
    <div className="border border-[var(--border-subtle)] rounded-[var(--radius-md)] overflow-hidden bg-[var(--bg-inset)]">
      {/* Row header: label left, affordance right */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        className="w-full flex items-center justify-between gap-4 p-4 text-left cursor-pointer group hover:bg-white/[0.02] transition-colors duration-[var(--duration-normal)]"
      >
        <div className="flex items-center gap-4 min-w-0">
          <span className="px-2 py-1 rounded-[var(--radius-sm)] bg-mint-leaf-500/10 text-[var(--accent-text)] text-[10px] font-black tracking-widest border border-mint-leaf-500/20 shrink-0">
            {endpoint.method}
          </span>
          <span className="font-mono text-sm text-pearl-aqua-100/90 group-hover:text-[var(--text-primary)] transition-colors duration-[var(--duration-normal)] truncate">
            {endpoint.path}
          </span>
          <span className="hidden lg:inline text-[var(--text-faint)] text-sm truncate">
            {endpoint.summary}
          </span>
        </div>
        {isExpanded ? (
          <ChevronDown
            aria-hidden="true"
            className="h-4 w-4 text-[var(--text-faint)] shrink-0"
          />
        ) : (
          <ChevronRight
            aria-hidden="true"
            className="h-4 w-4 text-[var(--text-faint)] shrink-0"
          />
        )}
      </button>

      {isExpanded && (
        <div className="p-6 border-t border-[var(--border-subtle)] flex flex-col gap-6 detail-reveal-in">
          <p className="text-[var(--text-muted)] text-sm leading-relaxed max-w-2xl">
            {endpoint.description}
          </p>

          {endpoint.params && (
            <div className="flex flex-col gap-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-pacific-cyan-400">
                Parameters
              </h4>
              <dl className="flex flex-col gap-2">
                {endpoint.params.map((p) => (
                  <div
                    key={p.name}
                    className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 text-xs"
                  >
                    <dt className="font-mono shrink-0 sm:w-32">
                      <span className="text-[var(--accent-text)] font-bold">
                        {p.name}
                      </span>
                      <span className="text-[var(--text-faint)] ml-2">
                        {p.type}
                      </span>
                    </dt>
                    <dd className="text-[var(--text-muted)]">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-faint)] mr-2">
                        {p.location}
                      </span>
                      {p.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Request */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-pacific-cyan-400">
                Request
              </h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-[var(--radius-sm)] text-[10px] font-bold text-[var(--text-faint)] hover:text-pacific-cyan-300 hover:bg-white/5 transition-colors duration-[var(--duration-normal)] cursor-pointer"
                  title="Copy as cURL"
                >
                  {copied ? (
                    <Check
                      aria-hidden="true"
                      className="h-3 w-3 text-[var(--accent-text)]"
                    />
                  ) : (
                    <Copy aria-hidden="true" className="h-3 w-3" />
                  )}
                  {copied ? "Copied" : "cURL"}
                </button>
                <button
                  onClick={handleRun}
                  disabled={isRunning}
                  className="btn-base flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-sm)] border border-[var(--border-default)] text-[10px] font-bold uppercase tracking-widest text-[var(--accent-text)] hover:bg-white/5 hover:border-[var(--border-strong)] disabled:opacity-50 cursor-pointer"
                >
                  <Play aria-hidden="true" className="h-3 w-3" />
                  {isRunning ? "Sending..." : "Send request"}
                </button>
              </div>
            </div>
            <code className="block p-3 rounded-[var(--radius-sm)] bg-black/40 border border-[var(--border-subtle)] font-mono text-xs text-pacific-cyan-300 overflow-x-auto whitespace-nowrap">
              {curlFor(endpoint.tryPath)}
            </code>
          </div>

          {/* Response */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-pacific-cyan-400">
                Response
              </h4>
              {live?.error ? (
                <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-full)] px-2 py-0.5 text-[10px] font-bold border bg-red-500/10 text-red-400 border-red-500/20">
                  <span className="h-1 w-1 rounded-[var(--radius-full)] bg-[var(--status-error)] animate-pulse" />
                  Network error
                </span>
              ) : live ? (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-[var(--radius-full)] px-2 py-0.5 text-[10px] font-bold border ${statusStyle(live.status)}`}
                >
                  <span
                    className={`h-1 w-1 rounded-[var(--radius-full)] animate-pulse ${statusDot(live.status)}`}
                  />
                  {live.status}
                </span>
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-faint)]">
                  Example
                </span>
              )}
            </div>
            <div className="p-3 rounded-[var(--radius-sm)] bg-black/40 border border-[var(--border-subtle)] overflow-x-auto">
              {live?.error ? (
                <p className="font-mono text-xs text-red-400">{live.error}</p>
              ) : (
                <JSONHighlighter data={shownBody} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ApiReference() {
  return (
    <section className="md3-card-static p-6 md:p-8 flex flex-col gap-8">
      {/* Header: label left, base URL right */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            API Reference
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            Every endpoint below is live — send a request and see for yourself.
          </p>
        </div>
        <div className="flex flex-col gap-1 md:items-end">
          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-faint)]">
            Base URL
          </span>
          <code className="font-mono text-sm text-pearl-aqua-200">
            {API_BASE_URL}
          </code>
        </div>
      </div>

      {ENDPOINT_GROUPS.map((group) => (
        <div key={group.group} className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-faint)]">
              {group.group}
            </h3>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-white/8 to-transparent" />
          </div>
          <div className="flex flex-col gap-4">
            {group.endpoints.map((endpoint) => (
              <EndpointRow key={endpoint.path} endpoint={endpoint} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
