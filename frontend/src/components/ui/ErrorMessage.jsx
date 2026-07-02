import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorMessage({
  message = "Something went wrong.",
  onRetry,
}) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 animate-fade-in"
      role="alert"
    >
      <div className="md3-card-static p-8 max-w-md text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--radius-full)] bg-red-500/10">
          <AlertTriangle
            className="h-6 w-6 text-[var(--status-error)]"
            aria-hidden="true"
          />
        </div>
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
          Well, that didn't land.
        </h3>
        <p className="text-sm text-[var(--text-muted)] mb-6">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn-base inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-white/5 px-4 py-2 text-sm font-medium text-[var(--text-secondary)] border border-[var(--border-default)] hover:bg-white/8 hover:border-[var(--border-strong)] cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
