// Upstash Redis client — used for GTFS-RT caching and rate limiting (PF-02, SE-05)
// TODO Sprint 3: install @upstash/redis and uncomment
// import { Redis } from "@upstash/redis";
// let client: InstanceType<typeof Redis> | null = null;

export function getRedis(): never {
  throw new Error("Redis not yet configured — install @upstash/redis in Sprint 3");
}

export const TTL = {
  vehiclePositions: 300,  // 5 min
  tripUpdates: 60,        // 1 min
  serviceAlerts: 120,     // 2 min
  rateLimitWindow: 60,    // 1 min sliding window
} as const;
