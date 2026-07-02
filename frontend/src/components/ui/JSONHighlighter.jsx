/**
 * A simple, themed JSON syntax highlighter.
 */
export default function JSONHighlighter({ data }) {
  const jsonString = JSON.stringify(data, null, 2);

  return (
    <pre className="text-[11px] font-mono leading-relaxed whitespace-pre custom-scrollbar">
      {jsonString.split("\n").map((line, i) => {
        // Keep the exact indentation by splitting leading spaces
        const match = line.match(/^(\s*)(.*)$/);
        const indent = match[1];
        const rest = match[2];

        const parts = rest.split(/(".*?"(?=:)|".*?"|\d+|true|false|null)/g);

        return (
          <div key={i} className="flex min-w-0">
            <span
              className="opacity-20 inline-block w-4 mr-4 text-right select-none shrink-0"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <span className="truncate whitespace-pre">
              {indent}
              {parts.map((part, j) => {
                if (/^".*?":$/.test(part))
                  return (
                    <span key={j} className="text-pearl-aqua-300">
                      {part}
                    </span>
                  );
                if (/^".*?"$/.test(part))
                  return (
                    <span key={j} className="text-mint-leaf-400">
                      {part}
                    </span>
                  );
                if (/^\d+$/.test(part) || /^(true|false)$/.test(part))
                  return (
                    <span key={j} className="text-pacific-cyan-300">
                      {part}
                    </span>
                  );
                if (part === "null")
                  return (
                    <span key={j} className="text-deep-space-blue-400">
                      {part}
                    </span>
                  );
                return (
                  <span key={j} className="text-deep-space-blue-200">
                    {part}
                  </span>
                );
              })}
            </span>
          </div>
        );
      })}
    </pre>
  );
}
