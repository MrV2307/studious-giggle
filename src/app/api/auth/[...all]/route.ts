import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

async function unavailable(request: Request) {
  // Session polling runs on every page. Keep read-only browsing quiet when
  // auth has not been configured, while still making sign-in failures explicit.
  const pathname = new URL(request.url).pathname;
  if (request.method === "GET" && pathname.endsWith("/get-session")) {
    return Response.json(null);
  }

  return Response.json(
    { error: "Authentication is not configured for this deployment yet. Add MONGODB_URI and BETTER_AUTH_SECRET in the hosting environment." },
    { status: 503 },
  );
}

export async function GET(request: Request) {
  if (!auth) return unavailable(request);
  return toNextJsHandler(auth).GET(request);
}

export async function POST(request: Request) {
  if (!auth) return unavailable(request);
  return toNextJsHandler(auth).POST(request);
}
