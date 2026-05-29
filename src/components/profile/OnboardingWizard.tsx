"use client";
import { useState } from "react";
import { AccessibilityForm } from "./AccessibilityForm";
import { useUserStore } from "@/store/user-store";
import type { AccessibilityNeeds } from "@/types/database";
import { TRANSIT_MODE_VALUES, type TransitMode } from "@/types/transit";

// ── Types ────────────────────────────────────────────────────────────────────

type Step = "accessibility" | "modes" | "preferences";

type WizardState = {
  accessibilityNeeds: AccessibilityNeeds;
  preferredModes: TransitMode[];
  maxWalkMeters: number;
  fareBudget: number | null;
};

// ── Mode options ─────────────────────────────────────────────────────────────

const MODE_OPTIONS: { value: TransitMode; label: string; icon: string }[] = [
  { value: "BUS",     label: "Bus",                    icon: "🚌" },
  { value: "RAIL",    label: "Rail / Commuter train",  icon: "🚆" },
  { value: "SUBWAY",  label: "Subway / Metro",         icon: "🚇" },
  { value: "FERRY",   label: "Ferry",                  icon: "⛴️" },
  { value: "BICYCLE", label: "Bike-share",             icon: "🚲" },
  { value: "WALK",    label: "Walking",                icon: "🚶" },
];

// Ensure MODE_OPTIONS covers every TransitMode (compile-time exhaustiveness check)
const _modeCheck: TransitMode[] = TRANSIT_MODE_VALUES.map(
  (v) => MODE_OPTIONS.find((o) => o.value === v)!.value
);
void _modeCheck;

// ── Walk distance options ────────────────────────────────────────────────────

const WALK_OPTIONS: { label: string; sublabel: string; meters: number }[] = [
  { label: "Short",    sublabel: "~5 min / 400 m",         meters: 400  },
  { label: "Moderate", sublabel: "~10 min / 800 m",        meters: 800  },
  { label: "Long",     sublabel: "~20 min / 1.6 km",       meters: 1600 },
  { label: "No limit", sublabel: "I don&apos;t mind walking", meters: 3200 },
];

// ── Step progress bar ────────────────────────────────────────────────────────

const STEPS: Step[] = ["accessibility", "modes", "preferences"];
const STEP_LABELS: Record<Step, string> = {
  accessibility: "Accessibility",
  modes:         "Transit modes",
  preferences:   "Preferences",
};

function ProgressBar({ current }: { current: Step }) {
  const currentIdx = STEPS.indexOf(current);
  return (
    <nav aria-label="Onboarding steps">
      <ol className="flex items-center gap-0">
        {STEPS.map((step, i) => {
          const done   = i < currentIdx;
          const active = i === currentIdx;
          return (
            <li key={step} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    done   ? "bg-blue-600 text-white" :
                    active ? "bg-blue-600 text-white ring-4 ring-blue-100" :
                             "bg-gray-100 text-gray-400"
                  }`}
                  aria-current={active ? "step" : undefined}
                >
                  {done ? "✓" : i + 1}
                </div>
                <span className={`text-xs ${active ? "text-blue-600 font-medium" : "text-gray-400"}`}>
                  {STEP_LABELS[step]}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mb-5 mx-1 ${i < currentIdx ? "bg-blue-600" : "bg-gray-200"}`} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ── Step 2: Transit modes ────────────────────────────────────────────────────

function ModesForm({
  selected,
  onNext,
  onBack,
}: {
  selected: TransitMode[];
  onNext: (modes: TransitMode[]) => void;
  onBack: () => void;
}) {
  const [modes, setModes] = useState<TransitMode[]>(
    selected.length > 0 ? selected : ["BUS", "RAIL", "WALK"]
  );

  const toggle = (value: TransitMode) =>
    setModes((prev) =>
      prev.includes(value) ? prev.filter((m) => m !== value) : [...prev, value]
    );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">How do you like to get around?</h2>
        <p className="text-sm text-gray-500 mt-1">Select all the modes you&apos;re open to using.</p>
      </div>

      <fieldset className="space-y-2">
        <legend className="sr-only">Preferred transit modes</legend>
        {MODE_OPTIONS.map(({ value, label, icon }) => {
          const checked = modes.includes(value);
          return (
            <label
              key={value}
              className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 ${
                checked ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(value)}
                className="sr-only"
              />
              <span className="text-xl" aria-hidden>{icon}</span>
              <span className={`text-sm font-medium ${checked ? "text-blue-700" : "text-gray-700"}`}>
                {label}
              </span>
              {checked && (
                <span className="ml-auto text-blue-600 text-sm" aria-hidden>✓</span>
              )}
            </label>
          );
        })}
      </fieldset>

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-lg border border-gray-300 text-gray-700 py-2.5 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => onNext(modes)}
          disabled={modes.length === 0}
          className="flex-1 rounded-lg bg-blue-600 text-white py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// ── Step 3: Walk distance + fare budget ──────────────────────────────────────

const FARE_HINT_ID  = "fare-budget-hint";
const FARE_ERROR_ID = "fare-budget-error";

function PreferencesForm({
  maxWalkMeters,
  fareBudget,
  onComplete,
  onBack,
  saving,
}: {
  maxWalkMeters: number;
  fareBudget: number | null;
  onComplete: (maxWalk: number, fare: number | null) => void;
  onBack: () => void;
  saving: boolean;
}) {
  const [walk, setWalk] = useState(maxWalkMeters);
  const [fare, setFare] = useState<string>(fareBudget != null ? String(fareBudget) : "");

  const parsedFare = fare.trim() === "" ? null : Number(fare);
  const fareValid  = fare.trim() === "" || (!isNaN(Number(fare)) && Number(fare) >= 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">A few more preferences</h2>
        <p className="text-sm text-gray-500 mt-1">These help us rank routes for you.</p>
      </div>

      {/* Max walk distance */}
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-gray-700">
          How far are you willing to walk?
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {WALK_OPTIONS.map(({ label, sublabel, meters }) => (
            <label
              key={meters}
              className={`flex flex-col rounded-xl border p-3 cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 ${
                walk === meters ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="maxWalk"
                value={meters}
                checked={walk === meters}
                onChange={() => setWalk(meters)}
                className="sr-only"
              />
              <span className={`text-sm font-medium ${walk === meters ? "text-blue-700" : "text-gray-700"}`}>
                {label}
              </span>
              <span className="text-xs text-gray-400 mt-0.5">{sublabel}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Fare budget */}
      <div className="space-y-1.5">
        <label htmlFor="fare-budget" className="block text-sm font-medium text-gray-700">
          Daily fare budget <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">$</span>
          <input
            id="fare-budget"
            type="number"
            min="0"
            step="0.50"
            placeholder="e.g. 5.00"
            value={fare}
            onChange={(e) => setFare(e.target.value)}
            aria-invalid={!fareValid}
            aria-describedby={fareValid ? FARE_HINT_ID : `${FARE_HINT_ID} ${FARE_ERROR_ID}`}
            className={`w-full pl-7 pr-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              fareValid ? "border-gray-300" : "border-red-400"
            }`}
          />
        </div>
        <p id={FARE_HINT_ID} className="text-xs text-gray-400">
          We&apos;ll flag routes that exceed this amount.
        </p>
        {!fareValid && (
          <p id={FARE_ERROR_ID} className="text-xs text-red-500" role="alert">
            Please enter a valid dollar amount.
          </p>
        )}
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onBack}
          disabled={saving}
          className="flex-1 rounded-lg border border-gray-300 text-gray-700 py-2.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => fareValid && onComplete(walk, parsedFare)}
          disabled={!fareValid || saving}
          className="flex-1 rounded-lg bg-blue-600 text-white py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {saving ? "Saving…" : "Get started"}
        </button>
      </div>
    </div>
  );
}

// ── Wizard orchestrator ───────────────────────────────────────────────────────

export function OnboardingWizard({ onComplete }: { onComplete: () => void }) {
  const store = useUserStore();
  const [step, setStep] = useState<Step>("accessibility");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [draft, setDraft] = useState<WizardState>({
    accessibilityNeeds: store.accessibilityNeeds,
    preferredModes:     store.preferredModes,
    maxWalkMeters:      store.maxWalkMeters,
    fareBudget:         store.fareBudget,
  });

  const handleAccessibilityNext = (needs: AccessibilityNeeds) => {
    setDraft((d) => ({ ...d, accessibilityNeeds: needs }));
    setStep("modes");
  };

  const handleModesNext = (modes: TransitMode[]) => {
    setDraft((d) => ({ ...d, preferredModes: modes }));
    setStep("preferences");
  };

  const handlePreferencesComplete = async (maxWalk: number, fare: number | null) => {
    const final: WizardState = { ...draft, maxWalkMeters: maxWalk, fareBudget: fare };

    store.setProfile({
      accessibilityNeeds: final.accessibilityNeeds,
      preferredModes:     final.preferredModes,
      maxWalkMeters:      final.maxWalkMeters,
      fareBudget:         final.fareBudget,
    });

    if (store.isGuest) {
      onComplete();
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessibility_needs: final.accessibilityNeeds,
          preferred_modes:     final.preferredModes,
          max_walk_meters:     final.maxWalkMeters,
          fare_budget:         final.fareBudget,
        }),
      });
      if (!res.ok) throw new Error("Failed to save profile");
      onComplete();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't save your preferences — you can update them later in your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <ProgressBar current={step} />

      {error && (
        <div role="alert" className="rounded-lg bg-orange-50 border border-orange-200 px-4 py-3 text-sm text-orange-800">
          {error}
        </div>
      )}

      {step === "accessibility" && (
        <AccessibilityForm
          initialNeeds={draft.accessibilityNeeds}
          onNext={handleAccessibilityNext}
        />
      )}

      {step === "modes" && (
        <ModesForm
          selected={draft.preferredModes}
          onNext={handleModesNext}
          onBack={() => setStep("accessibility")}
        />
      )}

      {step === "preferences" && (
        <PreferencesForm
          maxWalkMeters={draft.maxWalkMeters}
          fareBudget={draft.fareBudget}
          onComplete={handlePreferencesComplete}
          onBack={() => setStep("modes")}
          saving={saving}
        />
      )}
    </div>
  );
}
