// Sprint 2: User profile API — read and update (UP-02, HX-09)
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isTransitMode } from "@/types/transit";
import { parsePreferenceSignalsForWrite } from "@/lib/profile/preference-signals";
import { normalizeUserProfileRow } from "@/lib/profile/user-profile";

export async function GET() {
  const db = await createClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await db.from("user_profiles").select("*").eq("user_id", user.id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(normalizeUserProfileRow(data));
}

export async function PATCH(req: NextRequest) {
  const db = await createClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  if (body.preferred_modes !== undefined) {
    if (
      !Array.isArray(body.preferred_modes) ||
      !body.preferred_modes.every(isTransitMode)
    ) {
      return NextResponse.json(
        { error: "preferred_modes contains an invalid transit mode value." },
        { status: 400 }
      );
    }
  }

  if (body.preference_signals !== undefined) {
    try {
      body.preference_signals = parsePreferenceSignalsForWrite(body.preference_signals);
    } catch {
      return NextResponse.json(
        { error: "Invalid preference_signals payload." },
        { status: 400 }
      );
    }
  }

  const { data, error } = await db
    .from("user_profiles")
    .upsert({ user_id: user.id, ...body })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
