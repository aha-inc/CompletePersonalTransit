// Sprint 5: Single itinerary result card with Confidence Meter (TP-03, HX-02)
"use client";
import type { RankedItinerary } from "@/types/trip";
import type { ConfidenceLevel } from "@/types/ai";
import { ConfidenceMeter } from "@/components/ui/ConfidenceMeter";
import { useTripStore } from "@/store/trip-store";

type Props = {
  itinerary: RankedItinerary;
  isSelected: boolean;
};

function scoreToLevel(confidence: number): ConfidenceLevel {
  if (confidence >= 0.75) return "High";
  if (confidence >= 0.45) return "Medium";
  return "Low";
}

function formatDuration(seconds: number): string {
  const m = Math.round(seconds / 60);
  return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`;
}

export function ItineraryCard({ itinerary, isSelected }: Props) {
  const { selectItinerary } = useTripStore();

  return (
    <button
      onClick={() => selectItinerary(itinerary.id)}
      className={`w-full text-left rounded-xl border p-4 space-y-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"
      }`}
      aria-pressed={isSelected}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium text-sm">{formatDuration(itinerary.duration)}</span>
        {itinerary.fare && (
          <span className="text-sm text-gray-600">
            {itinerary.fare.currency} {(itinerary.fare.amount / 100).toFixed(2)}
          </span>
        )}
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {itinerary.legs.map((leg, i) => (
          <span key={i} className="text-xs bg-gray-100 rounded px-1.5 py-0.5">{leg.mode}</span>
        ))}
      </div>

      {itinerary.explanation && (
        <ConfidenceMeter
          level={scoreToLevel(itinerary.confidence)}
          rationale={itinerary.explanation}
        />
      )}
    </button>
  );
}
