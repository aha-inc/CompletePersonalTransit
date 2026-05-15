// Sprint 5: Transit Fit Recommendation card (HX-03)
import type { TransitFitOutput } from "@/types/ai";

type Props = { transitFit: TransitFitOutput };

export function TransitFitCard({ transitFit }: Props) {
  if (!transitFit.isCompetitive) return null;

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 space-y-2">
      <p className="font-medium text-blue-900 text-sm">Transit is a strong option today</p>
      <p className="text-blue-800 text-sm">{transitFit.summary}</p>
      {transitFit.contextualFactors.length > 0 && (
        <ul className="text-xs text-blue-700 space-y-0.5">
          {transitFit.contextualFactors.map((f, i) => (
            <li key={i}>· {f}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
