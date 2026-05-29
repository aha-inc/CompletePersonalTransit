// Manually maintained until Supabase project is linked.
// Replace with: npx supabase gen types typescript --linked > src/types/database.ts

import type { TransitMode } from "@/types/transit";
import type { PreferenceSignals } from "@/lib/profile/preference-signals";
export type { PreferenceSignals };

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type AccessibilityNeeds = {
  wheelchair?: boolean;
  visual_impairment?: boolean;
  hearing_impairment?: boolean;
  cognitive_disability?: boolean;
  stroller?: boolean;
};

export type NotificationPrefs = {
  departure_alerts?: boolean;
  disruption_alerts?: boolean;
  arrival_confirmation?: boolean;
  push_enabled?: boolean;
};

export type AiRecommendation = {
  ranked_itinerary_ids: string[];
  confidence: number;
  explanation: string;
  model_version: string;
};

// ── Row types (what comes back from SELECT) ──────────────────────────────────

export type UserRow = {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
};

export type UserProfileRow = {
  user_id: string;
  accessibility_needs: AccessibilityNeeds;
  preferred_modes: TransitMode[];
  max_walk_meters: number;
  fare_budget: number | null;
  language_code: string;
  notification_prefs: NotificationPrefs;
  preference_signals: PreferenceSignals;
  created_at: string;
  updated_at: string;
};

export type AgencyRow = {
  id: string;
  name: string;
  gtfs_url: string;
  gtfs_rt_url: string | null;
  gbfs_url: string | null;
  timezone: string;
  updated_at: string;
};

export type TripPlanRow = {
  id: string;
  user_id: string | null;
  origin: string; // WKT e.g. POINT(lon lat)
  destination: string;
  created_at: string;
  itinerary: Json;
  ai_recommendation: AiRecommendation | null;
  status: "draft" | "active" | "completed" | "abandoned";
};

export type AiDecisionLogRow = {
  id: string;
  trip_plan_id: string;
  model_version: string;
  input_hash: string;
  output_summary: Json;
  confidence: number;
  latency_ms: number;
  created_at: string;
};

export type TripFeedbackRow = {
  id: string;
  trip_plan_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  disruption_encountered: boolean;
  created_at: string;
};

// ── Insert types (what you pass to INSERT) ───────────────────────────────────

export type TripPlanInsert = Omit<TripPlanRow, "id" | "created_at">;
export type AiDecisionLogInsert = Omit<AiDecisionLogRow, "id" | "created_at">;
export type TripFeedbackInsert = Omit<TripFeedbackRow, "id" | "created_at">;
export type AgencyInsert = Omit<AgencyRow, "id">;

// ── Database schema ──────────────────────────────────────────────────────────
// Shape matches what `supabase gen types typescript` produces (v2 format).

type NoRelationships = [];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: UserRow;
        Insert: Omit<UserRow, "id" | "created_at">;
        Update: Partial<Omit<UserRow, "id">>;
        Relationships: NoRelationships;
      };
      user_profiles: {
        Row: UserProfileRow;
        Insert: UserProfileRow;
        Update: Partial<UserProfileRow>;
        Relationships: NoRelationships;
      };
      agencies: {
        Row: AgencyRow;
        Insert: AgencyInsert;
        Update: Partial<AgencyRow>;
        Relationships: NoRelationships;
      };
      trip_plans: {
        Row: TripPlanRow;
        Insert: TripPlanInsert;
        Update: Partial<TripPlanRow>;
        Relationships: NoRelationships;
      };
      ai_decision_log: {
        Row: AiDecisionLogRow;
        Insert: AiDecisionLogInsert;
        Update: Partial<AiDecisionLogRow>;
        Relationships: NoRelationships;
      };
      trip_feedback: {
        Row: TripFeedbackRow;
        Insert: TripFeedbackInsert;
        Update: Partial<TripFeedbackRow>;
        Relationships: NoRelationships;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
