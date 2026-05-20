"use client";
import { useState } from "react";
import type { AccessibilityNeeds } from "@/types/database";

type Props = {
  initialNeeds: AccessibilityNeeds;
  onNext: (needs: AccessibilityNeeds) => void;
};

const OPTIONS: { key: keyof AccessibilityNeeds; label: string; description: string }[] = [
  {
    key: "wheelchair",
    label: "Wheelchair or mobility device",
    description: "Routes will use elevators and accessible boarding only.",
  },
  {
    key: "visual_impairment",
    label: "Visual impairment",
    description: "We'll provide more detailed stop and transfer guidance.",
  },
  {
    key: "hearing_impairment",
    label: "Hearing impairment",
    description: "Alerts will be visual-first.",
  },
  {
    key: "cognitive_disability",
    label: "Cognitive or learning disability",
    description: "Directions will use simpler language and fewer steps.",
  },
  {
    key: "stroller",
    label: "Traveling with a stroller or pram",
    description: "Routes will avoid stairs and narrow turnstiles.",
  },
];

export function AccessibilityForm({ initialNeeds, onNext }: Props) {
  const [needs, setNeeds] = useState<AccessibilityNeeds>(initialNeeds);

  const toggle = (key: keyof AccessibilityNeeds) =>
    setNeeds((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Do any of these apply to you?</h2>
        <p className="text-sm text-gray-500 mt-1">
          This helps us find routes that work for you. You can change this any time.
        </p>
      </div>

      <fieldset className="space-y-2">
        <legend className="sr-only">Accessibility needs</legend>
        {OPTIONS.map(({ key, label, description }) => {
          const checked = !!needs[key];
          return (
            <label
              key={key}
              className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${
                checked ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(key)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 shrink-0"
                aria-describedby={`${key}-desc`}
              />
              <div>
                <span className={`block text-sm font-medium ${checked ? "text-blue-700" : "text-gray-700"}`}>
                  {label}
                </span>
                <span id={`${key}-desc`} className="block text-xs text-gray-400 mt-0.5">
                  {description}
                </span>
              </div>
            </label>
          );
        })}
      </fieldset>

      <p className="text-xs text-gray-400">
        None of these apply? That&apos;s fine — just continue.
      </p>

      <button
        type="button"
        onClick={() => onNext(needs)}
        className="w-full rounded-lg bg-blue-600 text-white py-2.5 text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Continue
      </button>
    </div>
  );
}
