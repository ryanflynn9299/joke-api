import React from "react";
import "../../styles/Spoiler.css";

/**
 * An inline-wrapping spoiler component that matches Discord/Reddit behavior.
 * Hides text content until clicked while maintaining line flow.
 */
export default function InlineSpoiler({ children, isRevealed, onClick }) {
  return (
    <span
      className={`inline-spoiler ${isRevealed ? "is-revealed" : ""}`}
      onClick={!isRevealed ? onClick : undefined}
      role="button"
      aria-expanded={isRevealed}
      tabIndex={isRevealed ? -1 : 0}
      onKeyDown={(e) => {
        if (!isRevealed && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {children}
    </span>
  );
}
