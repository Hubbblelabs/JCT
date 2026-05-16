import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var _mongooseConn: typeof mongoose | null;
}

let cached = global._mongooseConn ?? null;

export async function connectDB() {
  if (cached) return cached;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI environment variable is not set");

  cached = await mongoose.connect(uri, { bufferCommands: false });
  global._mongooseConn = cached;
  return cached;
}
