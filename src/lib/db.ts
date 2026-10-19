import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

type MongooseCache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
declare global { var mongooseCache: MongooseCache | undefined; }
const cache: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };
if (process.env.NODE_ENV !== "production") global.mongooseCache = cache;

export function databaseConfigured() { return Boolean(uri); }

export async function connectDB(): Promise<typeof mongoose> {
  if (!uri) throw new Error("Database-backed features are not configured yet. Add MONGODB_URI in the hosting environment.");
  if (cache.conn) return cache.conn;
  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, { bufferCommands: false }).catch((error: unknown) => {
      // Reset a rejected connection promise so a warm instance can retry.
      cache.conn = null;
      cache.promise = null;
      throw error;
    });
  }
  cache.conn = await cache.promise;
  return cache.conn;
}
