/**
 * Brand mark: a speech bubble mid-delivery. Stroke inherits currentColor,
 * so the surrounding tile controls the brand state (mint = consumer,
 * pacific cyan = Developer Mode).
 */
export default function Logomark({ className = "h-6 w-6" }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Bubble with bottom-left tail */}
      <path d="M10 4.5h12a5.5 5.5 0 0 1 5.5 5.5v7a5.5 5.5 0 0 1-5.5 5.5h-8l-5.5 4.5v-4.7c-2.3-.8-4-3-4-5.3v-7A5.5 5.5 0 0 1 10 4.5Z" />
      {/* Eyes */}
      <circle cx="12" cy="11.5" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="20" cy="11.5" r="1.4" fill="currentColor" stroke="none" />
      {/* Smile */}
      <path d="M11.5 15.5c1.1 1.9 2.9 2.9 4.5 2.9s3.4-1 4.5-2.9" />
    </svg>
  );
}
