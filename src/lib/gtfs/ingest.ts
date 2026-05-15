// Sprint 3: GTFS static feed ingestion (DI-01, DI-08)
import { createServiceClient } from "@/lib/supabase/server";

export type IngestResult = {
  agency: string;
  stops: number;
  routes: number;
  trips: number;
  stopTimes: number;
  durationMs: number;
};

export async function ingestGtfsStatic(agencyId: string, gtfsUrl: string): Promise<IngestResult> {
  const start = Date.now();
  const db = await createServiceClient();

  const res = await fetch(gtfsUrl);
  if (!res.ok) throw new Error(`Failed to fetch GTFS ZIP from ${gtfsUrl}: ${res.status}`);

  // TODO Sprint 3: unzip, parse CSV files, upsert into Supabase tables
  // Uses: agencies, routes, stops, trips, stop_times, calendar, calendar_dates tables

  await db.from("agencies").upsert({ id: agencyId, gtfs_url: gtfsUrl } as never);

  return { agency: agencyId, stops: 0, routes: 0, trips: 0, stopTimes: 0, durationMs: Date.now() - start };
}
