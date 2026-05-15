// Upstash Redis client — used for GTFS-RT caching and rate limiting (PF-02, SE-05)

let client: ReturnType<typeof import("@upstash/redis").Redis.fromEnv> | null = null;

export function getRedis() {
  if (!client) {
    const { Redis } = require("@upstash/redis");
    client = Redis.fromEnv();
  }
  return client!;
}

export const TTL = {
  vehiclePositions: 300,  // 5 min
  tripUpdates: 60,        // 1 min
  serviceAlerts: 120,     // 2 min
  rateLimitWindow: 60,    // 1 min sliding window
} as const;
