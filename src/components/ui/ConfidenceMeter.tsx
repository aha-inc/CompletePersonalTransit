// Sprint 5: Confidence Meter UI component (HX-02, EU-04)
import type { ConfidenceLevel } from "@/types/ai";

type Props = {
  level: ConfidenceLevel;
  rationale: string;
};

const levelStyles: Record<ConfidenceLevel, string> = {
  High: "bg-green-100 text-green-800 border-green-200",
  Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Low: "bg-orange-100 text-orange-800 border-orange-200",
};

export function ConfidenceMeter({ level, rationale }: Props) {
  return (
    <div className={`rounded-lg border px-3 py-2 text-sm ${levelStyles[level]}`}>
      <span className="font-medium">{level} confidence</span>
      {" — "}
      <span>{rationale}</span>
    </div>
  );
}
