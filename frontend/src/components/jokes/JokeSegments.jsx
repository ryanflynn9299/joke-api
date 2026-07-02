/**
 * Renders the answering half of a joke — everything after the setup.
 * INTERACTION segments (knock-knock exchanges, multi-turn beats) read as
 * dialogue lines; the PUNCHLINE lands last in the accent color.
 */
export default function JokeSegments({ segments, size = "md" }) {
  const textSize =
    size === "lg"
      ? "text-[clamp(1.25rem,3.5vw,1.5rem)]"
      : "text-xl md:text-2xl";

  return (
    <div className="flex flex-col gap-3">
      {segments.map((segment) => (
        <p
          key={segment.step}
          className={`${textSize} font-medium leading-[1.35] tracking-tight ${
            segment.kind === "PUNCHLINE"
              ? "text-[var(--accent-text)]"
              : "text-pearl-aqua-200"
          }`}
        >
          {segment.text}
        </p>
      ))}
    </div>
  );
}
