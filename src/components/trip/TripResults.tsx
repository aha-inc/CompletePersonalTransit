// Sprint 5: Trip results list (TP-03, TP-05)
"use client";
import { useTripStore } from "@/store/trip-store";
import { ItineraryCard } from "./ItineraryCard";
import { TransitFitCard } from "@/components/ui/TransitFitCard";

export function TripResults() {
  const { itineraries, selectedItineraryId } = useTripStore();

  if (itineraries.length === 0) return null;

  return (
    <div className="space-y-3" role="list" aria-label="Route options">
      {/* TODO Sprint 5: inject TransitFit from AI response */}
      <div className="space-y-2">
        {itineraries.map((itin) => (
          <div key={itin.id} role="listitem">
            <ItineraryCard
              itinerary={itin}
              isSelected={itin.id === selectedItineraryId}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
