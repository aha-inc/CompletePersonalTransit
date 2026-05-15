import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AccessibilityNeeds, NotificationPrefs } from "@/types/database";

type UserStore = {
  userId: string | null;
  isGuest: boolean;
  accessibilityNeeds: AccessibilityNeeds;
  preferredModes: string[];
  maxWalkMeters: number;
  fareBudget: number | null;
  notificationPrefs: NotificationPrefs;
  setUser: (id: string) => void;
  setProfile: (profile: Partial<Omit<UserStore, "setUser" | "setProfile" | "clearUser">>) => void;
  clearUser: () => void;
};

const defaults: Pick<UserStore, "accessibilityNeeds" | "preferredModes" | "maxWalkMeters" | "fareBudget" | "notificationPrefs"> = {
  accessibilityNeeds: {},
  preferredModes: ["BUS", "RAIL", "WALK"],
  maxWalkMeters: 800,
  fareBudget: null,
  notificationPrefs: { departure_alerts: true, disruption_alerts: true },
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
