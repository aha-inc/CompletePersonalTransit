import type { Itinerary, RankedItinerary } from "@/types/trip";
import type { AccessibilityNeeds } from "@/types/database";
import { createServiceClient } from "@/lib/supabase/server";
import crypto from "crypto";

type DecisionContext = {
  itineraries: Itinerary[];
  accessibilityNeeds: AccessibilityNeeds;
  fareBudget?: number | null;
  activeAlerts?: string[];
};

type DecisionOutput = {
  rankedItineraries: RankedItinerary[];
  modelVersion: string;
  latencyMs: number;
};

// All factual content is injected from the data layer — the LLM only reasons and generates language.
export async function rankItineraries(
  tripPlanId: string,
  ctx: DecisionContext
): Promise<DecisionOutput> {
  const start = Date.now();

  // Lazy-import to avoid loading LLM SDK on routes that don't need it
  const { ChatAnthropic } = await import("@langchain/anthropic");
  const { HumanMessage, SystemMessage } = await import("@langchain/core/messages");

  const model = new ChatAnthropic({
    model: "claude-sonnet-4-6",
    maxTokens: 1024,
  });

  const contextDoc = buildContextDocument(ctx);

  const response = await model.invoke([
    new SystemMessage(SYSTEM_PROMPT),
    new HumanMessage(contextDoc),
  ]);

  const latencyMs = Date.now() - start;
  const output = parseModelOutput(response.content as string, ctx.itineraries);
  const modelVersion = "claude-sonnet-4-6";

  await auditLog(tripPlanId, modelVersion, contextDoc, output, latencyMs);

  return { rankedItineraries: output, modelVersion, latencyMs };
}

function buildContextDocument(ctx: DecisionContext): string {
  return JSON.stringify({
    itineraries: ctx.itineraries,
    accessibility_needs: ctx.accessibilityNeeds,
    fare_budget: ctx.fareBudget ?? null,
    active_alerts: ctx.activeAlerts ?? [],
  });
}

function parseModelOutput(raw: string, itineraries: Itinerary[]): RankedItinerary[] {
  try {
    const parsed = JSON.parse(raw);
    return parsed.rankings.map((r: { id: string; confidence: number; explanation: string }, i: number) => {
      const itin = itineraries.find((it) => it.id === r.id) ?? itineraries[i];
      return { ...itin, rank: i + 1, confidence: r.confidence, explanation: r.explanation };
    });
  } catch {
    // Fallback: return itineraries unranked with a warning explanation
    return itineraries.map((itin, i) => ({
      ...itin,
      rank: i + 1,
      confidence: 0,
      explanation: "Ranking unavailable — showing options in default order.",
    }));
  }
}

async function auditLog(
  tripPlanId: string,
  modelVersion: string,
  input: string,
  output: RankedItinerary[],
  latencyMs: number
) {
  const db = await createServiceClient();
  const inputHash = crypto.createHash("sha256").update(input).digest("hex");

  await db.from("ai_decision_log").insert({
    trip_plan_id: tripPlanId,
    model_version: modelVersion,
    input_hash: inputHash,
    output_summary: output.map((r) => ({
      id: r.id,
      rank: r.rank,
      confidence: r.confidence,
      explanation: r.explanation,
    })),
    confidence: output[0]?.confidence ?? 0,
    latency_ms: latencyMs,
  });
}

const SYSTEM_PROMPT = `You are the AI decision engine for the Complete Trip transit assistance platform.

You will receive a JSON context document containing:
- itineraries: candidate multimodal trip options from OpenTripPlanner
- accessibility_needs: the traveler's accessibility requirements
- fare_budget: optional maximum fare
- active_alerts: any current service disruptions

Your task:
1. Rank the itineraries from best to worst for this specific traveler
2. Assign each a confidence score (0.0–1.0)
3. Write a 1–2 sentence plain-language explanation for the top recommendation

Rules:
- Only cite facts present in the context document — never invent stops, fares, or schedules
- If accessibility_needs.wheelchair is true, exclude any itinerary with a leg where accessibilityCompliant is false
- If an active alert affects a leg, penalize or exclude that itinerary and explain why

Respond ONLY with valid JSON matching this schema:
{
  "rankings": [
    { "id": "<itinerary id>", "confidence": <0.0–1.0>, "explanation": "<string, top option only>" }
  ]
}`;
