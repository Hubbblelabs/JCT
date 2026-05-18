import mongoose from "mongoose";

declare global {
   
  var _mongooseConn: typeof mongoose | null;
}

let cached = global._mongooseConn ?? null;

export async function connectDB() {
  // If already cached and connection is ready
  if (cached && mongoose.connection.readyState === 1) {
    return cached;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI environment variable is not set");

  try {
    cached = await Promise.race([
      mongoose.connect(uri, { bufferCommands: false }),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("MongoDB connection timeout")),
          10000
        )
      ),
    ]) as typeof mongoose;

    global._mongooseConn = cached;

    // Ensure connection is fully ready with a reasonable timeout
    let retries = 0;
    while (mongoose.connection.readyState !== 1 && retries < 50) {
      await new Promise((resolve) => setTimeout(resolve, 10));
      retries++;
    }

    if (mongoose.connection.readyState !== 1) {
      throw new Error(
        "MongoDB connection failed to reach ready state after timeout"
      );
    }

    return cached;
  } catch (error) {
    cached = null;
    global._mongooseConn = null;
    throw error;
  }
}
