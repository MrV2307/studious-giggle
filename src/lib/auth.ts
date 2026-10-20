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

// Prefer a stable production hostname in BETTER_AUTH_URL / NEXT_PUBLIC_SITE_URL.
// Vercel previews use generated subdomains, so allow those origins for previews.
const trustedOrigins = [
  process.env.BETTER_AUTH_URL,
  process.env.NEXT_PUBLIC_SITE_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined,
  "https://studious-giggle-vparmarbhardwaj-7101.vercel.app",
  "https://studious-giggle-tawny.vercel.app",
  "https://margin-journal-vparmarbhardwaj-7101.vercel.app",
  "https://margin-journal-inky.vercel.app",
  "http://localhost:3000",
].filter((origin): origin is string => Boolean(origin));

export const auth = client && db && secret ? betterAuth({
  database: mongodbAdapter(db, { client }),
  secret,
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_SITE_URL,
  emailAndPassword: { enabled: true, minPasswordLength: 8 },
  session: { expiresIn: 60 * 60 * 24 * 14, updateAge: 60 * 60 * 24 },
  trustedOrigins: [...new Set(trustedOrigins)],
}) : null;