import type { Itinerary, TripRequest } from "@/types/trip";

const OTP_BASE = process.env.OTP_BASE_URL ?? "http://localhost:8080/otp/routers/default";

type OtpPlanResponse = {
  plan?: { itineraries: Itinerary[] };
  error?: { message: string };
};

export async function planTrip(req: TripRequest): Promise<Itinerary[]> {
  const params = new URLSearchParams({
    fromPlace: `${req.origin.lat},${req.origin.lon}`,
    toPlace: `${req.destination.lat},${req.destination.lon}`,
    time: req.departureTime
      ? req.departureTime.toTimeString().slice(0, 5)
      : new Date().toTimeString().slice(0, 5),
    date: (req.departureTime ?? new Date()).toISOString().slice(0, 10),
    mode: "TRANSIT,WALK",
    numItineraries: "5",
    wheelchair: "false",
  });

  const res = await fetch(`${OTP_BASE}/plan?${params}`, {
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    throw new Error(`OTP request failed: ${res.status}`);
  }

  const data: OtpPlanResponse = await res.json();

  if (data.error) {
    throw new Error(`OTP error: ${data.error.message}`);
  }

  return data.plan?.itineraries ?? [];
}
