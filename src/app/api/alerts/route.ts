// Sprint 3/6: Active service alerts API (RT-02, RT-04)
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const db = await createServiceClient();
  const agencyId = req.nextUrl.searchParams.get("agencyId");

  let query = db.from("realtime_alerts").select("*").order("created_at", { ascending: false });
  if (agencyId) query = query.contains("affected_entities", [{ agency_id: agencyId }]);

  const { data, error } = await query.limit(50);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ alerts: data ?? [] });
}
