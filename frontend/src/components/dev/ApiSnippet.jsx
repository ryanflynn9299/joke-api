import { useState } from "react";
import { Check, Copy } from "lucide-react";
import JSONHighlighter from "../ui/JSONHighlighter.jsx";
import { curlFor, apiUrl } from "../../data/apiConfig.js";

/**
 * The Developer Mode primitive: a joke (or any payload) presented as the
 * API exchange that produced it — cURL skeleton, HTTP status, raw JSON.
 * Reused by the dev joke card, the home page hero, and the detail panel.
 */
export default function ApiSnippet({ path, data, isMock = false }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(curlFor(path));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard denied */
    }
  };

  return (
    <div className="flex flex-col gap-3 font-mono min-w-0">
      {/* Request */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-pacific-cyan-400">
          Request
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded-[var(--radius-sm)] text-[10px] font-bold text-[var(--text-faint)] hover:text-pacific-cyan-300 hover:bg-white/5 transition-colors duration-[var(--duration-normal)] cursor-pointer"
          title="Copy as cURL"
        >
          {copied ? (
            <Check
              className="h-3 w-3 text-[var(--accent-text)]"
              aria-hidden="true"
            />
          ) : (
            <Copy className="h-3 w-3" aria-hidden="true" />
          )}
          {copied ? "Copied" : "cURL"}
        </button>
      </div>

      <code className="flex items-baseline gap-2 p-3 rounded-[var(--radius-sm)] bg-[var(--bg-inset)] border border-[var(--border-subtle)] text-xs overflow-x-auto whitespace-nowrap">
        <span className="text-[var(--accent-text)] font-bold select-none">
          GET
        </span>
        <span className="text-pacific-cyan-300">{apiUrl(path)}</span>
      </code>

      {/* Response */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-pacific-cyan-400">
          Response
        </span>
        {isMock ? (
          <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-full)] px-2 py-0.5 text-[10px] font-bold border bg-amber-500/10 text-amber-400 border-amber-500/20">
            <span className="h-1 w-1 rounded-[var(--radius-full)] bg-[var(--status-warning)] animate-pulse" />
            MOCK
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-full)] px-2 py-0.5 text-[10px] font-bold border bg-mint-leaf-500/10 text-[var(--accent-text)] border-mint-leaf-500/20">
            <span className="h-1 w-1 rounded-[var(--radius-full)] bg-[var(--status-success)] animate-pulse" />
            200 OK
          </span>
        )}
      </div>

      <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--bg-inset)] border border-[var(--border-subtle)] overflow-x-auto">
        <JSONHighlighter data={data} />
      </div>
    </div>
  );
}
