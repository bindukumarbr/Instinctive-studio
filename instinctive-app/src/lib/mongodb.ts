import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://devuser:czhhfbnikpKfyKMF@instinctive-studio.pthg1mr.mongodb.net/?retryWrites=true&w=majority&appName=instinctive-studio";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env"
  );
}

const cached = global as typeof global & {
  mongoose?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

async function dbConnect() {
  if (!cached.mongoose) {
    cached.mongoose = { conn: null, promise: null };
  }

  const mongooseCache = cached.mongoose;

  if (mongooseCache.conn) {
    return mongooseCache.conn;
  }

  if (!mongooseCache.promise) {
    const opts = {
      bufferCommands: false,
    };

    mongooseCache.promise = mongoose
      .connect(MONGODB_URI!, opts)
      .then((mongoose) => {
        return mongoose;
      });
  }

  mongooseCache.conn = await mongooseCache.promise;
  console.log("MongoDB Connected Successfully from Next.js!");
  return mongooseCache.conn;
}

export default dbConnect;
