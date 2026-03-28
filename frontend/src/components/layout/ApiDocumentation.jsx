import {
  ChevronDown,
  ChevronRight,
  ArrowLeftRight,
  Lock,
  Unlock,
} from "lucide-react";
import { useState } from "react";
import JSONHighlighter from "../ui/JSONHighlighter.jsx";

const API_ENDPOINTS = [
  {
    group: "Jokes",
    endpoints: [
      {
        method: "GET",
        path: "/api/v1/joke-of-the-day",
        summary: "Retrieve the joke of the day",
        description:
          "Returns a single joke selected as the daily feature. This endpoint is cache-friendly.",
        response: {
          status: 200,
          body: {
            jokeId: 42,
            jokeContent:
              "Why do programmers prefer dark mode?;Because light attracts bugs.",
            jokeType: "ONE_LINER",
            author: {
              authorId: 1,
              authorFirstName: "Ryan",
              authorLastName: "Flynn",
            },
            createdDateTime: "2024-03-24T10:00:00",
            updatedDateTime: "2024-03-24T10:00:00",
          },
        },
      },
      {
        method: "GET",
        path: "/api/v1/jokes",
        summary: "List all jokes",
        description:
          "Retrieves a comprehensive list of all jokes stored in the repository.",
        response: {
          status: 200,
          body: [
            {
              jokeId: 1,
              jokeContent:
                "How many programmers does it take to change a light bulb?;None, that's a hardware problem.",
              jokeType: "ONE_LINER",
              author: {
                authorId: 2,
                authorFirstName: "Jane",
                authorLastName: "Doe",
              },
            },
            {
              jokeId: 2,
              jokeContent:
                "Knock knock;Who's there?;Java;Java who?;Java good time?",
              jokeType: "KNOCK_KNOCK",
              author: {
                authorId: 1,
                authorFirstName: "Ryan",
                authorLastName: "Flynn",
              },
            },
          ],
        },
      },
      {
        method: "GET",
        path: "/api/v1/jokes/{id}",
        summary: "Get joke by ID",
        description:
          "Fetch the details of a specific joke using its unique identifier.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "Long",
            description: "The unique ID of the joke",
          },
        ],
        response: {
          status: 200,
          body: {
            jokeId: 1,
            jokeContent:
              "How many programmers does it take to change a light bulb?;None, that's a hardware problem.",
            jokeType: "ONE_LINER",
            author: {
              authorId: 2,
              authorFirstName: "Jane",
              authorLastName: "Doe",
            },
          },
        },
      },
    ],
  },
  {
    group: "Authors",
    endpoints: [
      {
        method: "GET",
        path: "/api/v1/authors/{id}",
        summary: "Get author details",
        description:
          "Retrieves information about a specific author by their unique ID.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "Long",
            description: "The unique ID of the author",
          },
        ],
        response: {
          status: 200,
          body: {
            authorId: 1,
            authorFirstName: "Ryan",
            authorLastName: "Flynn",
          },
        },
      },
    ],
  },
];

function EndpointRow({ endpoint }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-[var(--border-subtle)] rounded-[var(--radius-md)] overflow-hidden mb-4 bg-[var(--bg-base)]/40 hover:border-[var(--border-default)] transition-colors duration-[var(--duration-normal)]">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left group"
      >
        <div className="flex items-center gap-4">
          <span className="px-2 py-1 rounded-[var(--radius-sm)] bg-pearl-aqua-500/10 text-pearl-aqua-400 text-[10px] font-black tracking-widest border border-pearl-aqua-500/20 uppercase shrink-0">
            {endpoint.method}
          </span>
          <span className="font-mono text-sm text-pearl-aqua-100/90 group-hover:text-[var(--text-primary)] transition-colors duration-[var(--duration-normal)] truncate">
            {endpoint.path}
          </span>
          <span className="hidden lg:inline-block text-[var(--text-faint)] text-sm italic opacity-60">
            {endpoint.summary}
          </span>
        </div>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-white/40" />
        ) : (
          <ChevronRight className="h-4 w-4 text-white/40" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-6 border-t border-[var(--border-subtle)] bg-black/20 animate-fade-in">
          <p className="text-[var(--text-muted)] text-sm mb-6 leading-relaxed max-w-2xl">
            {endpoint.description}
          </p>

          {endpoint.parameters && (
            <div className="mb-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-pacific-cyan-500/60 mb-3 ml-1">
                Parameters
              </h4>
              <div className="bg-[var(--bg-inset)] rounded-[var(--radius-md)] border border-[var(--border-subtle)] overflow-hidden shadow-inner">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--border-subtle)] bg-white/5">
                      <th className="p-3 font-semibold text-[var(--text-secondary)]">
                        Name
                      </th>
                      <th className="p-3 font-semibold text-[var(--text-secondary)]">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {endpoint.parameters.map((p, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-white/[0.02] transition-colors duration-[var(--duration-normal)]"
                      >
                        <td className="p-3 font-mono">
                          <span className="text-[var(--accent-text)] font-bold">
                            {p.name}
                          </span>
                          <span className="text-white/20 mx-1">*</span>
                          <span className="text-[var(--text-faint)] text-[10px]">
                            [{p.type}]
                          </span>
                        </td>
                        <td className="p-3 text-[var(--text-muted)]">
                          <span className="text-[9px] font-black text-pacific-cyan-600 uppercase mr-2 opacity-50 bg-pacific-cyan-500/10 px-1.5 py-0.5 rounded border border-pacific-cyan-500/10">
                            ({p.in})
                          </span>
                          {p.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-3 ml-1">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-pacific-cyan-500/60">
                Responses
              </h4>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-[var(--radius-full)] bg-mint-leaf-500 animate-pulse" />
                <span className="text-[11px] font-black font-mono text-[var(--accent-text)]">
                  {endpoint.response.status} Success
                </span>
              </div>
            </div>
            <div className="bg-[var(--bg-inset)] rounded-[var(--radius-md)] border border-[var(--border-subtle)] p-4 shadow-inner">
              <div className="rounded-[var(--radius-sm)] bg-black/60 border border-[var(--border-subtle)] p-4 shadow-inner">
                <JSONHighlighter data={endpoint.response.body} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ApiDocumentation() {
  return (
    <section className="w-full max-w-7xl mx-auto md3-card-static mt-8 p-6 md:p-8 flex flex-col gap-8 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute -top-[10vw] -right-[10vw] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-pearl-aqua-500/15 blur-[120px] pointer-events-none -z-10 rounded-[var(--radius-full)]" />

      {/* Header Content */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight flex items-center gap-3">
            <ArrowLeftRight className="h-8 w-8 text-pearl-aqua-400" />
            API Reference
          </h2>
        </div>
        <p className="text-[var(--text-faint)] text-sm font-medium italic mb-1">
          Simple REST endpoints for your next project
        </p>
      </div>

      {/* Base URL Box */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between p-6 rounded-[var(--radius-lg)] bg-black/60 border border-[var(--border-subtle)] gap-6 shadow-inner relative group/base">
        <div className="absolute inset-0 bg-gradient-to-r from-pearl-aqua-500/5 to-transparent opacity-0 group-hover/base:opacity-100 transition-opacity duration-[var(--duration-slow)] rounded-[var(--radius-lg)] pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="h-12 w-12 rounded-[var(--radius-md)] bg-mint-leaf-500/10 flex items-center justify-center border border-mint-leaf-500/20 shrink-0">
            <Lock className="h-6 w-6 text-[var(--accent-text)]" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-pacific-cyan-500/60 block mb-1">
              Service Base URL
            </span>
            <code className="text-lg md:text-xl font-black text-[var(--text-primary)] tracking-tighter">
              https://api.joke.dev/v1
            </code>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-pacific-cyan-500/40 relative z-10">
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-[var(--radius-full)] border border-[var(--border-subtle)]">
            <Unlock className="h-3 w-3" />
            Public Access
          </div>
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-[var(--radius-full)] border border-[var(--border-subtle)]">
            <Lock className="h-3 w-3" />
            SSL Secured
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-[var(--border-default)] via-[var(--border-subtle)] to-transparent" />

      {/* Endpoints */}
      <div className="space-y-12">
        {API_ENDPOINTS.map((group, idx) => (
          <div key={idx} className="group/group">
            <div className="flex items-center gap-4 mb-6">
              <h3 className="text-xl font-bold text-[var(--text-primary)]/90 tracking-tight flex items-center gap-2">
                <div className="h-1 w-1 rounded-[var(--radius-full)] bg-pearl-aqua-500" />
                {group.group}
              </h3>
              <div className="h-px flex-1 bg-gradient-to-r from-[var(--border-default)] via-[var(--border-subtle)] to-transparent" />
            </div>
            <div className="space-y-4">
              {group.endpoints.map((endpoint, eIdx) => (
                <EndpointRow key={eIdx} endpoint={endpoint} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
