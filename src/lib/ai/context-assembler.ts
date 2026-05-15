// Sprint 5: AI pipeline step 2 — assemble structured context document (AI-01)
import type { Itinerary } from "@/types/trip";
import type { AccessibilityNeeds } from "@/types/database";

export type PreferenceSignals = {
  preferredModes?: string[];
  avoidedModes?: string[];
  typicalDepartureHour?: number;
  acceptedHighConfidenceCount?: number;
  rejectedLowConfidenceCount?: number;
};

export type AssembledContext = {
  itineraries: Itinerary[];
  accessibilityNeeds: AccessibilityNeeds;
  fareBudget: number | null;
  activeAlerts: string[];
  preferenceSignals: PreferenceSignals;
  currentConditions: {
    weatherSummary?: string;
    elevatorOutages?: string[];
  };
};

export function assembleContext(
  itineraries: Itinerary[],
  profile: {
    accessibilityNeeds: AccessibilityNeeds;
    fareBudget: number | null;
    preferenceSignals: PreferenceSignals;
  },
  activeAlerts: string[],
  conditions: AssembledContext["currentConditions"] = {}
): AssembledContext {
  return {
    itineraries,
    accessibilityNeeds: profile.accessibilityNeeds,
    fareBudget: profile.fareBudget,
    activeAlerts,
    preferenceSignals: profile.preferenceSignals,
    currentConditions: conditions,
  };
}
