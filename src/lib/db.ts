import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

type MongooseCache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
declare global { var mongooseCache: MongooseCache | undefined; }
const cache = global.mongooseCache ?? { conn: null, promise: null };
if (process.env.NODE_ENV !== "production") global.mongooseCache = cache;

export function databaseConfigured() { return Boolean(uri); }

export async function connectDB() {
  if (!uri) throw new Error("Database-backed features are not configured yet. Add MONGODB_URI in the hosting environment.");

  if (cache.conn?.connection.readyState === 1) return cache.conn;
  if (cache.conn && cache.conn.connection.readyState !== 1) cache.conn = null;

  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, { bufferCommands: false })
      .then((connected) => {
        cache.conn = connected;
        return connected;
      })
      .catch((error: unknown) => {
        // Do not leave a rejected promise cached in a warm serverless instance.
        cache.conn = null;
        cache.promise = null;
        throw error;
      });
  }

  return await cache.promise;
}