export type ConfidenceLevel = "High" | "Medium" | "Low";

export type ConfidenceMeterOutput = {
  level: ConfidenceLevel;
  rationale: string; // 1–2 sentences, plain language
  score: number;     // 0.0–1.0
};

export type TransitFitOutput = {
  isCompetitive: boolean;
  contextualFactors: string[]; // e.g. ["Parking costs $18 today", "No weather delays"]
  summary: string;             // 1 sentence
};

export type MicroDelightMessage = {
  triggerType: "departure" | "transfer" | "arrival" | "on_time" | "delay";
  message: string;
  displayAfterSeconds?: number;
};

export type DiscoveryPrompt = {
  type: "bike_path" | "hill_avoidance" | "event_proximity" | "fare_tip";
  message: string;
};

export type AiExperienceLayer = {
  confidenceMeter: ConfidenceMeterOutput;
  transitFit?: TransitFitOutput;
  microDelightMessages: MicroDelightMessage[];
  discoveryPrompts: DiscoveryPrompt[];
};
