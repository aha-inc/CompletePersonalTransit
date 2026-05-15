import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { planTrip } from "@/lib/otp/client";
import { rankItineraries } from "@/lib/ai/decision-engine";
import type { TripRequest } from "@/types/trip";

export async function POST(req: NextRequest) {
  const db = await createClient();
  const { data: { user } } = await db.auth.getUser();

  const body: TripRequest = await req.json();

  // 1. Fetch itineraries from OTP
  const itineraries = await planTrip(body);

  if (itineraries.length === 0) {
    return NextResponse.json({ error: "No routes found" }, { status: 404 });
  }

  // 2. Fetch user profile for accessibility context
  const { data: profile } = user
    ? await db.from("user_profiles").select("*").eq("user_id", user.id).single()
    : { data: null };

  // 3. Persist trip plan shell to get an ID for audit logging
  const { data: tripPlan, error: insertError } = await db
    .from("trip_plans")
    .insert({
      user_id: user?.id ?? null,
      origin: `POINT(${body.origin.lon} ${body.origin.lat})`,
      destination: `POINT(${body.destination.lon} ${body.destination.lat})`,
      itinerary: itineraries,
      ai_recommendation: null,
      status: "draft",
    })
    .select("id")
    .single();

  if (insertError || !tripPlan) {
    return NextResponse.json({ error: "Failed to create trip plan" }, { status: 500 });
  }

  // 4. Run AI ranking
  const { rankedItineraries } = await rankItineraries(tripPlan.id, {
    itineraries,
    accessibilityNeeds: profile?.accessibility_needs ?? {},
    fareBudget: profile?.fare_budget,
  });

  // 5. Persist AI recommendation back to trip plan
  await db
    .from("trip_plans")
    .update({
      ai_recommendation: {
        ranked_itinerary_ids: rankedItineraries.map((r) => r.id),
        confidence: rankedItineraries[0]?.confidence ?? 0,
        explanation: rankedItineraries[0]?.explanation ?? "",
        model_version: "claude-sonnet-4-6",
      },
    })
    .eq("id", tripPlan.id);

  return NextResponse.json({ tripPlanId: tripPlan.id, itineraries: rankedItineraries });
}
