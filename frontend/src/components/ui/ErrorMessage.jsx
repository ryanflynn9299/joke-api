import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorMessage({
  message = "Something went wrong.",
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="md3-card-static p-8 max-w-md text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--radius-full)] bg-red-500/10">
          <AlertTriangle className="h-6 w-6 text-red-400" />
        </div>
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
          Oops!
        </h3>
        <p className="text-sm text-[var(--text-muted)] mb-6">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn-base inline-flex items-center gap-2 rounded-[var(--radius-md)]
                                   bg-pearl-aqua-700/30 px-4 py-2 text-sm font-medium text-pearl-aqua-300
                                   border border-pearl-aqua-700/40
                                   hover:bg-pearl-aqua-700/50 hover:border-pearl-aqua-600/50
                                   cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
