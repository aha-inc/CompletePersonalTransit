// Sprint 2: Accessibility needs form (UP-02, AX-02)
"use client";
import { useState } from "react";
import { useUserStore } from "@/store/user-store";
import type { AccessibilityNeeds } from "@/types/database";

type Props = { onNext: () => void };

const OPTIONS: { key: keyof AccessibilityNeeds; label: string }[] = [
  { key: "wheelchair", label: "I use a wheelchair or mobility device" },
  { key: "visual_impairment", label: "I have a visual impairment" },
  { key: "hearing_impairment", label: "I have a hearing impairment" },
  { key: "cognitive_disability", label: "I have a cognitive or learning disability" },
  { key: "stroller", label: "I travel with a stroller or pram" },
];

export function AccessibilityForm({ onNext }: Props) {
  const { accessibilityNeeds, setProfile } = useUserStore();
  const [needs, setNeeds] = useState<AccessibilityNeeds>(accessibilityNeeds);

  const toggle = (key: keyof AccessibilityNeeds) =>
    setNeeds((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleNext = () => {
    setProfile({ accessibilityNeeds: needs });
    onNext();
  };

  return (
    <div className="space-y-4">
      <h2 className="font-medium">Do any of these apply to you?</h2>
      <p className="text-sm text-gray-500">This helps us find routes that work for you.</p>
      <fieldset className="space-y-3">
        <legend className="sr-only">Accessibility needs</legend>
        {OPTIONS.map(({ key, label }) => (
          <label key={key} className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={!!needs[key]}
              onChange={() => toggle(key)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              aria-describedby={`${key}-desc`}
            />
            <span id={`${key}-desc`} className="text-sm text-gray-700">{label}</span>
          </label>
        ))}
      </fieldset>
      <button
        onClick={handleNext}
        className="w-full rounded-lg bg-blue-600 text-white py-2 text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Continue
      </button>
    </div>
  );
}
