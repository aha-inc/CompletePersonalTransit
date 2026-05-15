// Sprint 5: Origin/destination search inputs (TP-01)
"use client";
import { useTripStore } from "@/store/trip-store";

export function TripSearch() {
  const { setOrigin, setDestination } = useTripStore();

  return (
    <div className="space-y-2" role="search" aria-label="Trip planning">
      <div>
        <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">
          From
        </label>
        <input
          id="origin"
          type="text"
          placeholder="Enter starting address"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Starting address"
          // TODO Sprint 5: geocoding integration
        />
      </div>
      <div>
        <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
          To
        </label>
        <input
          id="destination"
          type="text"
          placeholder="Enter destination address"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Destination address"
        />
      </div>
      <button
        type="button"
        className="w-full rounded-lg bg-blue-600 text-white py-2 text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Find routes
      </button>
    </div>
  );
}
