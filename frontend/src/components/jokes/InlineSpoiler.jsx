import "../../styles/Spoiler.css";

/**
 * Inline click-to-reveal spoiler (Discord/Reddit pattern).
 * While hidden, the content is removed from the accessibility tree and the
 * control exposes an explicit "reveal" affordance; visually-transparent text
 * would otherwise still be read aloud by screen readers.
 */
export default function InlineSpoiler({ children, isRevealed, onClick }) {
  if (isRevealed) {
    return <span className="inline-spoiler is-revealed">{children}</span>;
  }

  return (
    <span
      className="inline-spoiler"
      onClick={onClick}
      role="button"
      aria-label="Reveal hidden text"
      aria-expanded={false}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <span aria-hidden="true">{children}</span>
    </span>
  );
}
