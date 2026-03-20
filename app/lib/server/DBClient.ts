import mongoose from 'mongoose';

const uri =
  process.env.NODE_ENV === 'test'
    ? process.env.MONGOTESTDB_URI
    : process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please add your Mongo URI to .env file');
}
interface MongooseCache {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

// Initialize the cache
globalThis.mongoose ??= { connection: null, promise: null };
const cache = globalThis.mongoose;

const opts: mongoose.ConnectOptions = {
  serverSelectionTimeoutMS: 2000,
  connectTimeoutMS: 5000,
  bufferCommands: false,
};

export async function DBClient(): Promise<typeof mongoose> {
  if (cache.connection) return cache.connection;

  if (!cache.promise) {
    cache.promise = mongoose.connect(uri as string, opts);
  }

  try {
    cache.connection = await cache.promise;

    console.log('✅ Mongoose connection established');
  } catch (e) {
    cache.promise = null;
    console.error('❌ Mongoose connection failed:', e);
    throw e;
  }

  return cache.connection;
}
