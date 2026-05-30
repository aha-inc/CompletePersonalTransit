import { z } from "zod";
import { TRANSIT_MODE_VALUES } from "@/types/transit";
import type { PreferenceSignals } from "@/types/preference-signals";

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

const PartialModeCountSchema = z.partialRecord(
  TransitModeSchema,
  z.number().int().nonnegative()
);

const NonNegativeNumberSchema = z.number().nonnegative();
const NonNegativeIntSchema = z.number().int().nonnegative();
const ScoreSchema = z.number().min(0).max(1);
const SignalConfidenceSchema = z.enum(["low", "medium", "high"]);
const IsoDateTimeSchema = z.string().datetime({ offset: true });

// ── Canonical schema ──────────────────────────────────────────────────────────

export const PreferenceSignalsSchema = z.object({
  version: z.literal(1),

  accepted_modes: PartialModeCountSchema.optional(),
  rejected_modes: PartialModeCountSchema.optional(),
  avoided_modes: z.array(TransitModeSchema).optional(),

  typical_max_walk_meters: NonNegativeNumberSchema.optional(),
  accepted_walk_meters_p50: NonNegativeNumberSchema.optional(),
  accepted_walk_meters_p90: NonNegativeNumberSchema.optional(),
  rejected_walk_meters_threshold: NonNegativeNumberSchema.optional(),

  preferred_max_transfers: NonNegativeIntSchema.optional(),
  transfer_aversion_score: ScoreSchema.optional(),
  tight_transfer_aversion_score: ScoreSchema.optional(),

  preferred_departure_times: z.array(TimeOfDaySchema).optional(),
  avoided_departure_times: z.array(TimeOfDaySchema).optional(),

  typical_max_fare_cents: NonNegativeIntSchema.optional(),
  fare_sensitivity_score: ScoreSchema.optional(),

  delay_sensitivity_score: ScoreSchema.optional(),
  prefers_high_confidence_routes: z.boolean().optional(),

  avoids_stairs: z.boolean().optional(),
  avoids_poor_lighting: z.boolean().optional(),
  prefers_sheltered_stops: z.boolean().optional(),
  prefers_low_complexity_routes: z.boolean().optional(),

  frequently_used_stop_ids: z.array(z.string()).optional(),
  avoided_stop_ids: z.array(z.string()).optional(),
  frequently_used_agency_ids: z.array(z.string()).optional(),

  accepted_itinerary_count: NonNegativeIntSchema.optional(),
  rejected_itinerary_count: NonNegativeIntSchema.optional(),
  completed_trip_count: NonNegativeIntSchema.optional(),
  abandoned_trip_count: NonNegativeIntSchema.optional(),

  last_itinerary_accepted_at: IsoDateTimeSchema.optional(),
  last_itinerary_rejected_at: IsoDateTimeSchema.optional(),
  last_trip_completed_at: IsoDateTimeSchema.optional(),

  confidence: SignalConfidenceSchema.optional(),
  updated_at: IsoDateTimeSchema.optional(),
});

const PreferenceSignalsWriteSchema = PreferenceSignalsSchema.strict();

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

function parseOptional<T>(value: unknown, schema: z.ZodType<T>): T | undefined {
  const result = schema.safeParse(value);
  return result.success ? result.data : undefined;
}

/**
 * For DB reads — per-field tolerant. One bad field falls back to undefined;
 * all valid fields are preserved. Never throws; always returns a valid PreferenceSignals.
 */
export function normalizePreferenceSignals(value: unknown): PreferenceSignals {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ...DEFAULT_PREFERENCE_SIGNALS };
  }
  const raw = value as Record<string, unknown>;

  return {
    ...DEFAULT_PREFERENCE_SIGNALS,
    version: 1,
    accepted_modes:                 parseOptional(raw.accepted_modes, PartialModeCountSchema),
    rejected_modes:                 parseOptional(raw.rejected_modes, PartialModeCountSchema),
    avoided_modes:                  parseOptional(raw.avoided_modes, z.array(TransitModeSchema)),
    typical_max_walk_meters:        parseOptional(raw.typical_max_walk_meters, NonNegativeNumberSchema),
    accepted_walk_meters_p50:       parseOptional(raw.accepted_walk_meters_p50, NonNegativeNumberSchema),
    accepted_walk_meters_p90:       parseOptional(raw.accepted_walk_meters_p90, NonNegativeNumberSchema),
    rejected_walk_meters_threshold: parseOptional(raw.rejected_walk_meters_threshold, NonNegativeNumberSchema),
    preferred_max_transfers:        parseOptional(raw.preferred_max_transfers, NonNegativeIntSchema),
    transfer_aversion_score:        parseOptional(raw.transfer_aversion_score, ScoreSchema),
    tight_transfer_aversion_score:  parseOptional(raw.tight_transfer_aversion_score, ScoreSchema),
    preferred_departure_times:      parseOptional(raw.preferred_departure_times, z.array(TimeOfDaySchema)),
    avoided_departure_times:        parseOptional(raw.avoided_departure_times, z.array(TimeOfDaySchema)),
    typical_max_fare_cents:         parseOptional(raw.typical_max_fare_cents, NonNegativeIntSchema),
    fare_sensitivity_score:         parseOptional(raw.fare_sensitivity_score, ScoreSchema),
    delay_sensitivity_score:        parseOptional(raw.delay_sensitivity_score, ScoreSchema),
    prefers_high_confidence_routes: parseOptional(raw.prefers_high_confidence_routes, z.boolean()),
    avoids_stairs:                  parseOptional(raw.avoids_stairs, z.boolean()),
    avoids_poor_lighting:           parseOptional(raw.avoids_poor_lighting, z.boolean()),
    prefers_sheltered_stops:        parseOptional(raw.prefers_sheltered_stops, z.boolean()),
    prefers_low_complexity_routes:  parseOptional(raw.prefers_low_complexity_routes, z.boolean()),
    frequently_used_stop_ids:       parseOptional(raw.frequently_used_stop_ids, z.array(z.string())),
    avoided_stop_ids:               parseOptional(raw.avoided_stop_ids, z.array(z.string())),
    frequently_used_agency_ids:     parseOptional(raw.frequently_used_agency_ids, z.array(z.string())),
    accepted_itinerary_count:       parseOptional(raw.accepted_itinerary_count, NonNegativeIntSchema),
    rejected_itinerary_count:       parseOptional(raw.rejected_itinerary_count, NonNegativeIntSchema),
    completed_trip_count:           parseOptional(raw.completed_trip_count, NonNegativeIntSchema),
    abandoned_trip_count:           parseOptional(raw.abandoned_trip_count, NonNegativeIntSchema),
    last_itinerary_accepted_at:     parseOptional(raw.last_itinerary_accepted_at, IsoDateTimeSchema),
    last_itinerary_rejected_at:     parseOptional(raw.last_itinerary_rejected_at, IsoDateTimeSchema),
    last_trip_completed_at:         parseOptional(raw.last_trip_completed_at, IsoDateTimeSchema),
    confidence:                     parseOptional(raw.confidence, SignalConfidenceSchema),
    updated_at:                     parseOptional(raw.updated_at, IsoDateTimeSchema),
  };
}

/**
 * For API writes — strict. Throws on non-object input, unknown keys, or invalid field values.
 * Callers must catch and return 400.
 */
export function parsePreferenceSignalsForWrite(value: unknown): PreferenceSignals {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("preference_signals must be a non-null object.");
  }
  return PreferenceSignalsWriteSchema.parse({
    ...DEFAULT_PREFERENCE_SIGNALS,
    ...value,
    version: 1,
  }) satisfies PreferenceSignals;
}
