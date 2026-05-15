export type Coordinates = { lat: number; lon: number };

export type TransitMode =
  | "WALK"
  | "BUS"
  | "RAIL"
  | "SUBWAY"
  | "FERRY"
  | "BICYCLE"
  | "SCOOTER"
  | "CAR";

export type Leg = {
  mode: TransitMode;
  startTime: number; // Unix ms
  endTime: number;
  from: { name: string; lat: number; lon: number; stopId?: string };
  to: { name: string; lat: number; lon: number; stopId?: string };
  distance: number; // meters
  agencyId?: string;
  routeShortName?: string;
  headsign?: string;
  accessibilityCompliant?: boolean;
};

export type Itinerary = {
  id: string;
  legs: Leg[];
  duration: number; // seconds
  startTime: number;
  endTime: number;
  walkDistance: number;
  transitTime: number;
  waitingTime: number;
  fare?: { amount: number; currency: string };
};

export type TripRequest = {
  origin: Coordinates;
  destination: Coordinates;
  departureTime?: Date;
  arrivalByTime?: Date;
  userId?: string;
};

export type RankedItinerary = Itinerary & {
  rank: number;
  confidence: number;
  explanation: string;
};
