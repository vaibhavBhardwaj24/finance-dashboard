// db.js
import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/mydatabase";

export async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: "finance" });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}
