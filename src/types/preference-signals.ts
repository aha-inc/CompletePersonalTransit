import type { TransitMode } from "@/types/transit";

export type TimeOfDayPreference =
  | "early_morning"
  | "morning"
  | "midday"
  | "afternoon"
  | "evening"
  | "late_night";

export type SignalConfidence = "low" | "medium" | "high";

export type PreferenceSignals = {
  version: 1;

  accepted_modes?: Partial<Record<TransitMode, number>>;
  rejected_modes?: Partial<Record<TransitMode, number>>;
  avoided_modes?: TransitMode[];

  typical_max_walk_meters?: number;
  accepted_walk_meters_p50?: number;
  accepted_walk_meters_p90?: number;
  rejected_walk_meters_threshold?: number;

  preferred_max_transfers?: number;
  transfer_aversion_score?: number;
  tight_transfer_aversion_score?: number;

  preferred_departure_times?: TimeOfDayPreference[];
  avoided_departure_times?: TimeOfDayPreference[];

  typical_max_fare_cents?: number;
  fare_sensitivity_score?: number;

  delay_sensitivity_score?: number;
  prefers_high_confidence_routes?: boolean;

  avoids_stairs?: boolean;
  avoids_poor_lighting?: boolean;
  prefers_sheltered_stops?: boolean;
  prefers_low_complexity_routes?: boolean;

  frequently_used_stop_ids?: string[];
  avoided_stop_ids?: string[];
  frequently_used_agency_ids?: string[];

  accepted_itinerary_count?: number;
  rejected_itinerary_count?: number;
  completed_trip_count?: number;
  abandoned_trip_count?: number;

  last_itinerary_accepted_at?: string;
  last_itinerary_rejected_at?: string;
  last_trip_completed_at?: string;

  confidence?: SignalConfidence;
  updated_at?: string;
};
