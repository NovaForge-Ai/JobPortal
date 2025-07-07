import { seedUserTypes } from "./user-type.seeder";
import { seedBusinessStreams } from "./business-stream.seeder";

async function runSeeders() {
  try {
    console.log("🌱 Starting database seeding...");
    
    // Seed user types
    await seedUserTypes();
    
    // Seed business streams
    await seedBusinessStreams();
    
    console.log("✅ Database seeding completed successfully");
  } catch (error) {
    console.error("❌ Error during database seeding:", error);
    throw error;
  }
}

// Export the runSeeders function as default
export default runSeeders;
// Run the seeders
runSeeders();

