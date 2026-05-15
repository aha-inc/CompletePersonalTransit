// Sprint 3/7: Feed health status table (AD-02, DI-09)
import type { GtfsFeedStatus } from "@/types/gtfs";

type Props = { feeds: GtfsFeedStatus[] };

export function FeedHealth({ feeds }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" aria-label="GTFS feed status">
        <thead>
          <tr className="border-b text-left text-gray-500">
            <th className="pb-2 font-medium">Agency</th>
            <th className="pb-2 font-medium">Last ingested</th>
            <th className="pb-2 font-medium">Stops</th>
            <th className="pb-2 font-medium">Routes</th>
            <th className="pb-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {feeds.map((feed) => (
            <tr key={feed.agencyId}>
              <td className="py-2">{feed.agencyId}</td>
              <td className="py-2 text-gray-600">
                {feed.lastIngestedAt ? new Date(feed.lastIngestedAt).toLocaleString() : "Never"}
              </td>
              <td className="py-2">{feed.recordCounts.stops.toLocaleString()}</td>
              <td className="py-2">{feed.recordCounts.routes.toLocaleString()}</td>
              <td className="py-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                    feed.isStale ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                  }`}
                  role="status"
                >
                  <span aria-hidden>{feed.isStale ? "●" : "●"}</span>
                  {feed.isStale ? "Stale" : "Fresh"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
