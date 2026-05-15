import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  const checks: Record<string, "ok" | "error"> = {};

  // Supabase
  try {
    const db = await createServiceClient();
    await db.from("agencies").select("id").limit(1);
    checks.supabase = "ok";
  } catch {
    checks.supabase = "error";
  }

  // OTP
  try {
    const res = await fetch(`${process.env.OTP_BASE_URL}/index/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "{ agencies { gtfsId } }" }),
      signal: AbortSignal.timeout(3000),
    });
    checks.otp = res.ok ? "ok" : "error";
  } catch {
    checks.otp = "error";
  }

  const allOk = Object.values(checks).every((v) => v === "ok");

  return NextResponse.json(
    { status: allOk ? "ok" : "degraded", checks },
    { status: allOk ? 200 : 503 }
  );
}
