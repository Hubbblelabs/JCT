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

/** How long to wait for an existing connection to come back before giving up. */
const RECONNECT_WAIT_MS = 15_000;

export async function connectDB(): Promise<typeof mongoose> {
  if (global._mongooseConn && mongoose.connection.readyState === 1) {
    return global._mongooseConn;
  }
  if (global._mongoosePending) {
    return global._mongoosePending;
  }

  // A connection we already own that is momentarily not `connected` — wait for
  // it, never re-connect.
  //
  // Mongoose flips readyState to `disconnected` on any topology change that
  // loses the primary: an Atlas election, a rolling maintenance window, a
  // transient partition. Calling `mongoose.connect()` again in that window
  // builds a whole new MongoClient and its pool WITHOUT closing the previous
  // one — `createClient` simply overwrites `this.client` — so every failover
  // orphaned up to maxPoolSize sockets plus their heartbeat timers, all
  // counting against the Atlas connection cap forever. The driver reconnects
  // on its own; the only correct move here is to wait for it.
  if (global._mongooseConn) {
    const conn = mongoose.connection;
    if (conn.readyState === 0 || conn.readyState === 2) {
      try {
        await Promise.race([
          conn.asPromise(),
          new Promise<never>((_, reject) =>
            setTimeout(
              () =>
                reject(new Error("Timed out waiting for MongoDB to reconnect")),
              RECONNECT_WAIT_MS,
            ),
          ),
        ]);
        return global._mongooseConn;
      } catch (err) {
        // Give up on the cached handle: close it so its pool is released
        // before a genuine re-connect below opens another.
        console.warn("[mongodb] reconnect wait failed; reconnecting:", err);
        global._mongooseConn = null;
        try {
          await conn.close();
        } catch {
          /* non-fatal */
        }
      }
    }
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
