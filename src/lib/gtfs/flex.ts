// Sprint 6: GTFS-Flex ingestion for rural demand-response services (DI-03)
export type FlexZone = {
  agencyId: string;
  zoneId: string;
  geometry: GeoJSON.Polygon;
  serviceWindowStart: string; // HH:MM
  serviceWindowEnd: string;
  bookingUrl?: string;
  phoneNumber?: string;
};

export async function ingestGtfsFlex(_agencyId: string, _gtfsFlexUrl: string) {
  // TODO Sprint 6: parse GTFS-Flex location_groups.txt, booking_rules.txt, stop_areas.txt
}
