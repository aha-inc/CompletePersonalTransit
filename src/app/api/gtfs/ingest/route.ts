// Sprint 3: Manual GTFS ingest trigger (admin-only) (DI-01, DI-08)
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ingestGtfsStatic } from "@/lib/gtfs/ingest";

export async function POST(req: NextRequest) {
  const db = await createClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // TODO Sprint 3: verify Admin role via user_profiles
  const { agencyId, gtfsUrl } = await req.json();
  if (!agencyId || !gtfsUrl) {
    return NextResponse.json({ error: "agencyId and gtfsUrl required" }, { status: 400 });
  }

  const result = await ingestGtfsStatic(agencyId, gtfsUrl);
  return NextResponse.json(result);
}
