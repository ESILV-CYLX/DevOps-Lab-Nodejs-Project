import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

export const connectToDb = async () => {
  try {
    mongoose.set('strictQuery', false);
    
    const conn = await mongoose.connect(MONGO_URI);

    console.log(`✅ SUCCESS: Connected to MongoDB via Mongoose: ${conn.connection.name}`);
  } catch (err) {
    console.error(`❌ ERROR: Database connection failed: ${err.message}`);
    process.exit(1);
  }
};


export function getDb() {
  if (!mongoose.connection.readyState) {
    throw new Error("Database not connected via Mongoose yet.");
  }
  return mongoose.connection.db;
}