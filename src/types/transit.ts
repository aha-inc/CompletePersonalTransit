export const TRANSIT_MODE_VALUES = [
  "BUS",
  "RAIL",
  "SUBWAY",
  "FERRY",
  "BICYCLE",
  "WALK",
] as const;

export type TransitMode = (typeof TRANSIT_MODE_VALUES)[number];

export function isTransitMode(value: unknown): value is TransitMode {
  return typeof value === "string" && (TRANSIT_MODE_VALUES as readonly string[]).includes(value);
}
