import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/auth/session";

export async function proxy(req: NextRequest) {
  const requestId = crypto.randomUUID();
  const start = Date.now();

  const res = await updateSession(req);

  const latencyMs = Date.now() - start;

  // Structured JSON log for every API request (MO-01)
  if (req.nextUrl.pathname.startsWith("/api/")) {
    console.log(
      JSON.stringify({
        request_id: requestId,
        method: req.method,
        path: req.nextUrl.pathname,
        status: res.status,
        latency_ms: latencyMs,
        ts: new Date().toISOString(),
      })
    );
  }

  res.headers.set("x-request-id", requestId);
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
