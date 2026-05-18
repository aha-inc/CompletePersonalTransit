// Sprint 6: Journey Progress Visualization (HX-05)
import type { RankedItinerary } from "@/types/trip";

type Props = {
  itinerary: RankedItinerary;
  currentLegIndex: number;
};

const modeIcons: Record<string, string> = {
  WALK: "🚶",
  BUS: "🚌",
  RAIL: "🚆",
  SUBWAY: "🚇",
  FERRY: "⛴️",
  BICYCLE: "🚲",
  SCOOTER: "🛴",
  CAR: "🚗",
};

export function JourneyProgress({ itinerary, currentLegIndex }: Props) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto py-2" role="list" aria-label="Journey progress">
      {itinerary.legs.map((leg, i) => (
        <div key={i} className="flex items-center gap-1 shrink-0" role="listitem">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
              i < currentLegIndex
                ? "bg-green-500 text-white"
                : i === currentLegIndex
                ? "bg-blue-600 text-white ring-2 ring-blue-300 animate-pulse"
                : "bg-gray-200 text-gray-500"
            }`}
            aria-current={i === currentLegIndex ? "step" : undefined}
          >
            {modeIcons[leg.mode] ?? "•"}
          </div>
          {i < itinerary.legs.length - 1 && (
            <div className={`h-0.5 w-4 ${i < currentLegIndex ? "bg-green-500" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}
