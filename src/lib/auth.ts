import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const secret = process.env.BETTER_AUTH_SECRET;
export const authConfigured = Boolean(uri && secret);

const globalForAuth = globalThis as typeof globalThis & { marginAuthMongo?: MongoClient };
const client = authConfigured && uri ? (globalForAuth.marginAuthMongo ?? new MongoClient(uri)) : null;
if (client && process.env.NODE_ENV !== "production") globalForAuth.marginAuthMongo = client;
const db = client?.db();

/**
 * Normalize URLs before giving them to Better Auth. Vercel variables are
 * hostnames (without a scheme), while manually configured variables may
 * contain a trailing slash or a path.
 */
function normalizeOrigin(value?: string): string | undefined {
  const raw = value?.trim();
  if (!raw) return undefined;
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    return url.origin;
  } catch {
    return undefined;
  }
}

const configuredOrigins = [
  normalizeOrigin(process.env.BETTER_AUTH_URL),
  normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL),
  normalizeOrigin(process.env.VERCEL_URL),
  normalizeOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL),
  "https://studious-giggle-vparmarbhardwaj-7101.vercel.app",
  "https://studious-giggle-tawny.vercel.app",
  "https://margin-journal-vparmarbhardwaj-7101.vercel.app",
  "https://margin-journal-inky.vercel.app",
  "http://localhost:3000",
].filter((origin): origin is string => Boolean(origin));

const trustedOrigins = [...new Set(configuredOrigins)];
const allowedHosts = [...new Set(trustedOrigins.map(origin => new URL(origin).host))];
const fallbackBaseURL =
  normalizeOrigin(process.env.BETTER_AUTH_URL) ??
  normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL) ??
  "https://margin-journal-vparmarbhardwaj-7101.vercel.app";

export const auth = client && db && secret ? betterAuth({
  database: mongodbAdapter(db, { client }),
  secret,
  // Resolve the active hostname from a small allowlist. Do not use a broad
  // *.vercel.app wildcard, which would trust unrelated Vercel tenants.
  baseURL: { allowedHosts, fallback: fallbackBaseURL },
  emailAndPassword: { enabled: true, minPasswordLength: 8 },
  session: { expiresIn: 60 * 60 * 24 * 14, updateAge: 60 * 60 * 24 },
  trustedOrigins,
}) : null;
