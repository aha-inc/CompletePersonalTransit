import { create } from "zustand";
import type { Coordinates, RankedItinerary } from "@/types/trip";

type TripStore = {
  origin: Coordinates | null;
  destination: Coordinates | null;
  selectedItineraryId: string | null;
  itineraries: RankedItinerary[];
  tripPlanId: string | null;
  setOrigin: (coords: Coordinates) => void;
  setDestination: (coords: Coordinates) => void;
  setResults: (tripPlanId: string, itineraries: RankedItinerary[]) => void;
  selectItinerary: (id: string) => void;
  reset: () => void;
};

export const useTripStore = create<TripStore>((set) => ({
  origin: null,
  destination: null,
  selectedItineraryId: null,
  itineraries: [],
  tripPlanId: null,
  setOrigin: (origin) => set({ origin }),
  setDestination: (destination) => set({ destination }),
  setResults: (tripPlanId, itineraries) =>
    set({ tripPlanId, itineraries, selectedItineraryId: itineraries[0]?.id ?? null }),
  selectItinerary: (id) => set({ selectedItineraryId: id }),
  reset: () =>
    set({ origin: null, destination: null, selectedItineraryId: null, itineraries: [], tripPlanId: null }),
}));
