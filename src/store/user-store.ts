import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AccessibilityNeeds, NotificationPrefs, PreferenceSignals } from "@/types/database";
import type { TransitMode } from "@/types/transit";
import { DEFAULT_PREFERENCE_SIGNALS } from "@/lib/profile/preference-signals";

type UserStore = {
  userId: string | null;
  isGuest: boolean;
  accessibilityNeeds: AccessibilityNeeds;
  preferredModes: TransitMode[];
  maxWalkMeters: number;
  fareBudget: number | null;
  notificationPrefs: NotificationPrefs;
  preferenceSignals: PreferenceSignals;
  setUser: (id: string) => void;
  setProfile: (profile: Partial<Omit<UserStore, "setUser" | "setProfile" | "clearUser">>) => void;
  clearUser: () => void;
};

const defaults: Pick<UserStore, "accessibilityNeeds" | "preferredModes" | "maxWalkMeters" | "fareBudget" | "notificationPrefs" | "preferenceSignals"> = {
  accessibilityNeeds: {},
  preferredModes: ["BUS", "RAIL", "WALK"],
  maxWalkMeters: 800,
  fareBudget: null,
  notificationPrefs: { departure_alerts: true, disruption_alerts: true },
  preferenceSignals: { ...DEFAULT_PREFERENCE_SIGNALS },
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userId: null,
      isGuest: true,
      ...defaults,
      setUser: (id) => set({ userId: id, isGuest: false }),
      setProfile: (profile) => set(profile),
      clearUser: () => set({ userId: null, isGuest: true, ...defaults }),
    }),
    {
      name: "complete-trip-user",
      // Guest mode: profile survives in localStorage until account sync (UP-04)
    }
  )
);
