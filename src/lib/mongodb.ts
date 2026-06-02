import mongoose from "mongoose";

/**
 * Cache the live connection AND any in-flight connect promise on the Node
 * `global` so concurrent first-callers (e.g. multiple route handlers fired
 * by the static-render workers during `next build`) share a single TCP
 * connection attempt instead of stampeding Atlas.
 */
declare global {
  var _mongooseConn: typeof mongoose | null;
  var _mongoosePending: Promise<typeof mongoose> | null;
}

const CONNECT_TIMEOUT_MS = 15_000;

export async function connectDB(): Promise<typeof mongoose> {
  if (global._mongooseConn && mongoose.connection.readyState === 1) {
    return global._mongooseConn;
  }
  if (global._mongoosePending) {
    return global._mongoosePending;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI environment variable is not set");

  const attempt = mongoose
    .connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: CONNECT_TIMEOUT_MS,
      // Per-instance pool. Lower this (via env) on serverless where many
      // ephemeral instances each open a pool and can exhaust the Atlas
      // connection cap; raise it for a single long-lived container.
      maxPoolSize: Number(process.env.MONGODB_MAX_POOL_SIZE) || 10,
    })
    .then((m) => {
      global._mongooseConn = m;
      return m;
    })
    .catch((err) => {
      global._mongooseConn = null;
      throw err;
    })
    .finally(() => {
      global._mongoosePending = null;
    });

  global._mongoosePending = attempt;
  return attempt;
}
