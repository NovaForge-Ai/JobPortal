import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URL: string = process.env.MONGODB_URI || "";

async function clearDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection is not established.");
    }

    // Get all collections
    const collections = await db.collections();

    // Clear each collection
    for (const collection of collections) {
      console.log(`Clearing collection: ${collection.collectionName}`);
      await collection.deleteMany({});
    }

    console.log('✅ Database cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

clearDatabase(); 