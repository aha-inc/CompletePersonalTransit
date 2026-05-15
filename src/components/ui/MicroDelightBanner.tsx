// Sprint 6: Micro-delight message banner during active navigation (HX-04)
type Props = {
  message: string;
  onDismiss?: () => void;
};

export function MicroDelightBanner({ message, onDismiss }: Props) {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-lg bg-indigo-50 border border-indigo-100 px-4 py-3 flex items-start gap-3"
    >
      <span className="text-lg" aria-hidden>✨</span>
      <p className="flex-1 text-sm text-indigo-900">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-indigo-400 hover:text-indigo-600 text-xs shrink-0"
          aria-label="Dismiss message"
        >
          ✕
        </button>
      )}
    </div>
  );
}
