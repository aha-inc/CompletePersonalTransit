// Sprint 6: Active navigation state (HX-04, HX-05)
import { create } from "zustand";
import type { RankedItinerary, Leg } from "@/types/trip";
import type { MicroDelightMessage } from "@/types/ai";

type NavStore = {
  isNavigating: boolean;
  activeTripPlanId: string | null;
  activeItinerary: RankedItinerary | null;
  currentLegIndex: number;
  microDelightMessages: MicroDelightMessage[];
  shownMessageIds: Set<string>;
  startNavigation: (tripPlanId: string, itinerary: RankedItinerary, messages: MicroDelightMessage[]) => void;
  advanceLeg: () => void;
  markMessageShown: (id: string) => void;
  stopNavigation: () => void;
};

export const useNavStore = create<NavStore>((set, get) => ({
  isNavigating: false,
  activeTripPlanId: null,
  activeItinerary: null,
  currentLegIndex: 0,
  microDelightMessages: [],
  shownMessageIds: new Set(),
  startNavigation: (tripPlanId, itinerary, messages) =>
    set({ isNavigating: true, activeTripPlanId: tripPlanId, activeItinerary: itinerary, currentLegIndex: 0, microDelightMessages: messages }),
  advanceLeg: () =>
    set((s) => ({ currentLegIndex: Math.min(s.currentLegIndex + 1, (s.activeItinerary?.legs.length ?? 1) - 1) })),
  markMessageShown: (id) =>
    set((s) => ({ shownMessageIds: new Set([...s.shownMessageIds, id]) })),
  stopNavigation: () =>
    set({ isNavigating: false, activeTripPlanId: null, activeItinerary: null, currentLegIndex: 0, microDelightMessages: [] }),
}));
