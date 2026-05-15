// Sprint 2: Multi-step onboarding wizard (UP-02, AX-02)
"use client";
import { useState } from "react";
import { AccessibilityForm } from "./AccessibilityForm";
import { useUserStore } from "@/store/user-store";

type Step = "accessibility" | "modes" | "preferences" | "done";

export function OnboardingWizard({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<Step>("accessibility");
  const { setProfile } = useUserStore();

  return (
    <div className="space-y-6">
      <nav aria-label="Onboarding progress">
        <ol className="flex gap-2 text-xs text-gray-500">
          {(["accessibility", "modes", "preferences"] as Step[]).map((s, i) => (
            <li key={s} className={step === s ? "text-blue-600 font-medium" : ""}>
              {i + 1}. {s.charAt(0).toUpperCase() + s.slice(1)}
            </li>
          ))}
        </ol>
      </nav>

      {step === "accessibility" && (
        <AccessibilityForm onNext={() => setStep("modes")} />
      )}

      {step === "modes" && (
        <div className="space-y-4">
          <h2 className="font-medium">How do you usually get around?</h2>
          {/* TODO Sprint 2: preferred modes multi-select */}
          <button onClick={() => setStep("preferences")} className="w-full rounded-lg bg-blue-600 text-white py-2 text-sm">
            Continue
          </button>
        </div>
      )}

      {step === "preferences" && (
        <div className="space-y-4">
          <h2 className="font-medium">A few more preferences</h2>
          {/* TODO Sprint 2: max walk distance, fare budget */}
          <button onClick={onComplete} className="w-full rounded-lg bg-blue-600 text-white py-2 text-sm">
            Get started
          </button>
        </div>
      )}
    </div>
  );
}
