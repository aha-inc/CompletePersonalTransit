export type GtfsFeedStatus = {
  agencyId: string;
  lastIngestedAt: string | null;
  recordCounts: {
    stops: number;
    routes: number;
    trips: number;
  };
  isStale: boolean;
  realtimeConnected: boolean;
};

export type GtfsAlert = {
  id: string;
  agencyId: string;
  headerText: string;
  descriptionText: string;
  cause: string;
  effect: string;
  activePeriodStart: string;
  activePeriodEnd: string | null;
  affectedRoutes: string[];
  affectedStops: string[];
};

export type VehiclePosition = {
  vehicleId: string;
  tripId: string;
  routeId: string;
  lat: number;
  lon: number;
  bearing?: number;
  speed?: number;
  timestamp: number;
  currentStopSequence?: number;
  stopId?: string;
};
