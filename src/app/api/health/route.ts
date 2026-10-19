import mongoose from "mongoose";
import { authConfigured } from "@/lib/auth";
import { connectDB, databaseConfigured } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const authentication = authConfigured ? "configured" : "missing_environment";
  if (!databaseConfigured()) {
    return Response.json(
      { status: "degraded", database: "not_configured", authentication },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    await connectDB();
    const database = mongoose.connection.db;
    if (!database) throw new Error("Mongoose connection did not expose a database handle");
    await database.admin().ping();

    return Response.json(
      { status: "ok", database: "connected", authentication },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    // Keep credentials and hostnames out of the public health response.
    console.error("[margin health] MongoDB ping failed", error instanceof Error ? error.name : "UnknownError");
    return Response.json(
      {
        status: "degraded",
        database: "unreachable",
        authentication: authConfigured ? "configured_database_unverified" : "missing_environment",
        hint: "Check the MongoDB connection string, database user permissions, and Atlas network access list.",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
