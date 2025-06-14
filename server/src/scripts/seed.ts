import mongoose from "mongoose";
import dotenv from "dotenv";
import { seedUserTypes } from "../seeders/user-type.seeder";

dotenv.config();

const MONGO_URL: string = "mongodb://admin:password123@localhost:27017/jobportal?authSource=admin";

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 30000, // Increase to 30 seconds
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000, // Add connection timeout
  family: 4
};

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URL, options);
    console.log('Connected to MongoDB');

    // Seed user types
    await seedUserTypes();

    console.log('✅ Seeding completed successfully');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

seed(); 