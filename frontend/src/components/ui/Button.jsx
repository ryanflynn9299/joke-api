import { Link } from "react-router-dom";

const baseStyle =
  "btn-base inline-flex items-center justify-center gap-2 px-8 py-3 rounded-[var(--radius-lg)] font-bold text-sm cursor-pointer border";

const variants = {
  primary:
    "btn-primary bg-[var(--accent-primary)] text-deep-space-blue-950 border-mint-leaf-500/40 shadow-[var(--shadow-btn-primary)] hover:shadow-[var(--shadow-btn-primary-hover)] hover:bg-[var(--accent-hover)]",
  secondary:
    "bg-white/5 text-white border-[var(--border-default)] hover:bg-white/8 hover:border-[var(--border-strong)]",
  ghost:
    "bg-transparent text-pacific-cyan-400 border-transparent hover:bg-pacific-cyan-900/30 hover:text-[var(--accent-text)]",
};

/**
 * Renders a router Link when `to` is given, otherwise a button — avoids
 * nesting interactive elements (<Link><button>) for CTA navigation.
 */
export default function Button({
  children,
  to,
  variant = "primary",
  className = "",
  ...props
}) {
  const classes = `${baseStyle} ${variants[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
