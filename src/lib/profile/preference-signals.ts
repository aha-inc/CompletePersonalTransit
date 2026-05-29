import { z } from "zod";
import { TRANSIT_MODE_VALUES } from "@/types/transit";

// ── Supporting schemas ────────────────────────────────────────────────────────

const TimeOfDaySchema = z.enum([
  "early_morning",
  "morning",
  "midday",
  "afternoon",
  "evening",
  "late_night",
]);

const TransitModeSchema = z.enum(TRANSIT_MODE_VALUES);

// ── Canonical schema ──────────────────────────────────────────────────────────

export const PreferenceSignalsSchema = z.object({
  version: z.literal(1),

  // Mode learning — count of accepted/rejected per mode
  accepted_modes: z.record(TransitModeSchema, z.number()).optional(),
  rejected_modes: z.record(TransitModeSchema, z.number()).optional(),
  avoided_modes: z.array(TransitModeSchema).optional(),

  // Walking tolerance derived from accepted itineraries
  typical_max_walk_meters: z.number().nonnegative().optional(),
  accepted_walk_meters_p50: z.number().nonnegative().optional(),
  accepted_walk_meters_p90: z.number().nonnegative().optional(),
  rejected_walk_meters_threshold: z.number().nonnegative().optional(),

  // Transfer behavior
  preferred_max_transfers: z.number().int().nonnegative().optional(),
  transfer_aversion_score: z.number().min(0).max(1).optional(),
  tight_transfer_aversion_score: z.number().min(0).max(1).optional(),

  // Time-of-day patterns
  preferred_departure_times: z.array(TimeOfDaySchema).optional(),
  avoided_departure_times: z.array(TimeOfDaySchema).optional(),

  // Fare sensitivity
  typical_max_fare_cents: z.number().int().nonnegative().optional(),
  fare_sensitivity_score: z.number().min(0).max(1).optional(),

  // Reliability
  delay_sensitivity_score: z.number().min(0).max(1).optional(),
  prefers_high_confidence_routes: z.boolean().optional(),

  // Accessibility / comfort signals
  avoids_stairs: z.boolean().optional(),
  avoids_poor_lighting: z.boolean().optional(),
  prefers_sheltered_stops: z.boolean().optional(),
  prefers_low_complexity_routes: z.boolean().optional(),

  // Geography patterns
  frequently_used_stop_ids: z.array(z.string()).optional(),
  avoided_stop_ids: z.array(z.string()).optional(),
  frequently_used_agency_ids: z.array(z.string()).optional(),

  // Behavioral counts
  accepted_itinerary_count: z.number().int().nonnegative().optional(),
  rejected_itinerary_count: z.number().int().nonnegative().optional(),
  completed_trip_count: z.number().int().nonnegative().optional(),
  abandoned_trip_count: z.number().int().nonnegative().optional(),

  // Timestamps (ISO 8601 strings from DB)
  last_itinerary_accepted_at: z.string().optional(),
  last_itinerary_rejected_at: z.string().optional(),
  last_trip_completed_at: z.string().optional(),

  confidence: z.enum(["low", "medium", "high"]).optional(),
  updated_at: z.string().optional(),
});

// Inferred type — single source of truth, no duplication
export type PreferenceSignals = z.infer<typeof PreferenceSignalsSchema>;

// ── Default ───────────────────────────────────────────────────────────────────

export const DEFAULT_PREFERENCE_SIGNALS: PreferenceSignals = {
  version: 1,
  accepted_itinerary_count: 0,
  rejected_itinerary_count: 0,
  completed_trip_count: 0,
  abandoned_trip_count: 0,
  confidence: "low",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * For DB reads — forgiving. Invalid/missing fields fall back to defaults.
 * Never throws; always returns a valid PreferenceSignals.
 */
export function normalizePreferenceSignals(value: unknown): PreferenceSignals {
  const result = PreferenceSignalsSchema.safeParse({
    ...DEFAULT_PREFERENCE_SIGNALS,
    ...(value && typeof value === "object" ? value : {}),
    version: 1,
  });
  return result.success ? result.data : { ...DEFAULT_PREFERENCE_SIGNALS };
}

/**
 * For API writes — strict. Throws a ZodError on invalid payload.
 * Callers must catch and return 400.
 */
export function parsePreferenceSignalsForWrite(value: unknown): PreferenceSignals {
  return PreferenceSignalsSchema.parse({
    ...DEFAULT_PREFERENCE_SIGNALS,
    ...(value && typeof value === "object" ? value : {}),
    version: 1,
  });
}
