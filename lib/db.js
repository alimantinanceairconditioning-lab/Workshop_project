import mongoose from "mongoose";
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (!process.env.MONGODB_URI && !process.env.MONGO_URI) {
  dotenv.config({ path: join(__dirname, '../.env.local') });
}

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGO_URI) {
    console.warn("⚠️ MONGODB_URI not defined - database features will be unavailable");
    // Don't throw error during build - allow build to complete
    // Runtime requests will handle the missing connection gracefully
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDb = async () => {
    // If no MONGO_URI, return null instead of throwing
    if (!MONGO_URI) {
        console.error("Cannot connect to MongoDB: MONGODB_URI not defined");
        return null;
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            maxPoolSize: 10,
            minPoolSize: 2,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 60000,
            family: 4, // Use IPv4, skip trying IPv6
            maxIdleTimeMS: 20000,
            connectTimeoutMS: 15000,
        };

        cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
            return mongoose;
        }).catch((error) => {
            console.error("MongoDB connection error:", error);
            cached.promise = null;
            throw error;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        console.error("Failed to establish MongoDB connection:", error.message);
        throw error;
    }

    return cached.conn;
};

export default connectDb;
