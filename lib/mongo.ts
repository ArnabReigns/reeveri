// Server-only Mongoose connection (MONGODB_URI). One connection is reused across requests and dev hot reloads.
import mongoose from "mongoose";

const g = globalThis as unknown as { _mongoose?: Promise<typeof mongoose> };

export function connectMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  g._mongoose ??= mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 }).catch((e) => {
    g._mongoose = undefined; // retry on the next request
    throw e;
  });
  return g._mongoose;
}
