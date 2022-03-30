import mongoose from "mongoose";

const { NEXT_PUBLIC_MONGODB_URI_MATERIALDB } = process.env;

if (!NEXT_PUBLIC_MONGODB_URI_MATERIALDB) {
  throw new Error(
    "Please define the NEXT_PUBLIC_MONGODB_URI_MATERIALDB environment variable inside .env.local"
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;
if (!cached) {
  /*right-associativity assignment,i.e. the object is assigned to global.mongoose 
  and global.mongoose is assigned to cachedConnection*/
  cached = global.mongoose = { connection: null, promise: null };
}

async function DBClient() {
  if (cached.connection) {
    return cached.connection;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(NEXT_PUBLIC_MONGODB_URI_MATERIALDB, opts)
      .then((mongoose) => {
        console.log(" Connected to MongoDB via mongoose");
        return mongoose;
      })
      .catch((e) => console.log(e));
  }

  cached.connection = await cached.promise;
  return cached.connection;
}

export default DBClient;
