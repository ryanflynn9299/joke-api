import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 rounded-[var(--radius-full)] bg-dark-teal-500/20 blur-xl animate-pulse-glow" />
        <Loader2
          className="h-10 w-10 text-pearl-aqua-400 animate-spin relative z-10"
          strokeWidth={2}
        />
      </div>
      <p className="mt-6 text-sm text-[var(--text-muted)] tracking-wide">
        {message}
      </p>
    </div>
  );
}
