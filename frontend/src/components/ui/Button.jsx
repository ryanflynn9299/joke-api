import React from "react";

export default function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  ...props
}) {
  const baseStyle =
    "btn-base inline-flex items-center justify-center gap-2 px-8 py-3 rounded-[var(--radius-lg)] font-bold text-sm cursor-pointer border transition-all active:scale-[0.98]";

  const variants = {
    primary:
      "bg-[var(--accent-primary)] text-deep-space-blue-950 border-mint-leaf-500/40 shadow-[var(--shadow-btn-primary)] hover:shadow-[var(--shadow-btn-primary-hover)] hover:bg-[var(--accent-hover)]",
    secondary:
      "bg-white/5 text-white border-[var(--border-default)] hover:bg-white/8 hover:border-[var(--border-strong)] backdrop-blur-md",
    ghost:
      "bg-transparent text-pacific-cyan-400 border-transparent hover:bg-pacific-cyan-900/30 hover:text-[var(--accent-text)]",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
