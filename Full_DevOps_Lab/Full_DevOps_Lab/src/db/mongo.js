//Connection to MongoDB using Mongoose
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const client = new MongoClient (process.env.MONGO_URI);
let db;

export async function connectToDb(){
  try {
    await client.connect();
    db = client.db();
    console.log("SUCCESS: MongoDB connected: ", db.databaseName);
  } catch (err) {
    console.error("ERROR: Database connection failed", err);
    process.exit(1);
  }
};

export function getDb() {
  return db;
}