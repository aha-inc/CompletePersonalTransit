// Sprint 3: Feed health status API (DI-09, AD-02)
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  const db = await createServiceClient();
  const { data: agencies, error } = await db.from("agencies").select("id, name, gtfs_url, updated_at");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const statuses = (agencies ?? []).map((a) => ({
    agencyId: a.id,
    name: a.name,
    lastIngestedAt: a.updated_at ?? null,
    isStale: false, // TODO Sprint 3: compare updated_at against expected refresh interval
    realtimeConnected: false,
  }));

  return NextResponse.json({ feeds: statuses });
}
