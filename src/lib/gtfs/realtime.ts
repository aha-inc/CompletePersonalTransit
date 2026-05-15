// Sprint 3: GTFS-RT ingestion — VehiclePositions, TripUpdates, ServiceAlerts (DI-02)
import { getRedis, TTL } from "@/lib/redis/client";
import { createServiceClient } from "@/lib/supabase/server";

export async function fetchVehiclePositions(agencyId: string, rtUrl: string) {
  const redis = getRedis();
  const cacheKey = `gtfs-rt:vehicle-positions:${agencyId}`;

  const cached = await redis.get(cacheKey);
  if (cached) return cached;

  // TODO Sprint 3: fetch protobuf, parse with gtfs-realtime-bindings, write to realtime_vehicle_positions
  const db = await createServiceClient();
  void db; // will be used in Sprint 3

  await redis.set(cacheKey, [], { ex: TTL.vehiclePositions });
  return [];
}

export async function fetchServiceAlerts(agencyId: string, rtUrl: string) {
  const redis = getRedis();
  const cacheKey = `gtfs-rt:alerts:${agencyId}`;

  const cached = await redis.get(cacheKey);
  if (cached) return cached;

  // TODO Sprint 3: fetch protobuf alerts, write to realtime_alerts table
  await redis.set(cacheKey, [], { ex: TTL.serviceAlerts });
  return [];
}
