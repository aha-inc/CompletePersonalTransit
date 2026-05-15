// Sprint 6: GTFS-Flex ingestion for rural demand-response services (DI-03)
import { createServiceClient } from "@/lib/supabase/server";

export type FlexZone = {
  agencyId: string;
  zoneId: string;
  geometry: GeoJSON.Polygon;
  serviceWindowStart: string; // HH:MM
  serviceWindowEnd: string;
  bookingUrl?: string;
  phoneNumber?: string;
};

export async function ingestGtfsFlex(agencyId: string, gtfsFlexUrl: string) {
  const db = await createServiceClient();
  void db;

  // TODO Sprint 6: parse GTFS-Flex location_groups.txt, booking_rules.txt, stop_areas.txt
  // Store flex zones in pedestrian_infrastructure or a dedicated flex_zones table
}
