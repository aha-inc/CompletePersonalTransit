// Sprint 6: Active navigation controller (HX-04, HX-05, RT-01)
"use client";
import { useNavStore } from "@/store/nav-store";
import { JourneyProgress } from "@/components/ui/JourneyProgress";
import { MicroDelightBanner } from "@/components/ui/MicroDelightBanner";

type Props = { tripPlanId: string };

export function ActiveNavigation({ tripPlanId }: Props) {
  const { activeItinerary, currentLegIndex, microDelightMessages, shownMessageIds, markMessageShown } = useNavStore();

  if (!activeItinerary) return null;

  const currentLeg = activeItinerary.legs[currentLegIndex];
  const pendingMessage = microDelightMessages.find((m) => {
    const id = `${m.triggerType}-${m.displayAfterSeconds ?? 0}`;
    return !shownMessageIds.has(id);
  });

  return (
    <div className="space-y-4">
      <JourneyProgress itinerary={activeItinerary} currentLegIndex={currentLegIndex} />

      {currentLeg && (
        <div className="rounded-xl bg-white border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Now</p>
          <p className="font-medium">{currentLeg.mode} to {currentLeg.to.name}</p>
        </div>
      )}

      {pendingMessage && (
        <MicroDelightBanner
          message={pendingMessage.message}
          onDismiss={() => {
            const id = `${pendingMessage.triggerType}-${pendingMessage.displayAfterSeconds ?? 0}`;
            markMessageShown(id);
          }}
        />
      )}
    </div>
  );
}
