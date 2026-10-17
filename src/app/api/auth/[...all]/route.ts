import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

async function unavailable() {
  return Response.json({ error: "Authentication is not configured for this deployment yet. Add the MongoDB and Better Auth environment variables." }, { status: 503 });
}
export async function GET(request: Request) {
  if (!auth) return unavailable();
  return toNextJsHandler(auth).GET(request);
}
export async function POST(request: Request) {
  if (!auth) return unavailable();
  return toNextJsHandler(auth).POST(request);
}