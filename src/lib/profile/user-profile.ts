import type { UserProfileRow } from "@/types/database";
import type { PreferenceSignals } from "@/types/preference-signals";
import { normalizePreferenceSignals } from "@/lib/profile/preference-signals";

export type UserProfile = Omit<UserProfileRow, "preference_signals"> & {
  preference_signals: PreferenceSignals;
};

export function normalizeUserProfileRow(row: UserProfileRow): UserProfile {
  return {
    ...row,
    preference_signals: normalizePreferenceSignals(row.preference_signals),
  };
}
