import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

// Liveness/readiness probe for container HEALTHCHECK and load-balancer
// checks. Never cached, and intentionally unauthenticated (it lives outside
// the /api/admin gate). Reports 200 only when the DB is reachable so an
// orchestrator can pull an instance with a broken DB connection out of
// rotation; the body carries no sensitive detail.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ status: "ok", time: new Date().toISOString() });
  } catch {
    return NextResponse.json(
      { status: "degraded", time: new Date().toISOString() },
      { status: 503 },
    );
  }
}
