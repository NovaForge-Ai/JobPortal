import UserType from "../models/user/user-type.model";

const userTypes = [
  {
    user_type_name: "job_seeker",
    user_type_display_name: "Job Seeker",
    user_type_description: "A user looking for job opportunities",
  },
  {
    user_type_name: "hr_recruiter",
    user_type_display_name: "HR Recruiter",
    user_type_description: "A user representing a company posting jobs",
  },
  {
    user_type_name: "admin",
    user_type_display_name: "Administrator",
    user_type_description: "An administrator of the platform",
  },
];

const maxRetries = 3;
const retryDelay = 2000; // 2 seconds

export const seedUserTypes = async () => {
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      console.log('Starting user type seeding...');
      console.log('User types to be seeded:', JSON.stringify(userTypes, null, 2));
      
      // Check if user types already exist
      const existingTypes = await UserType.find({});
      if (existingTypes.length > 0) {
        console.log('User types already exist:', JSON.stringify(existingTypes, null, 2));
        return;
      }
      
      // Create new user types
      const result = await UserType.insertMany(userTypes);
      console.log('Seeded user types:', JSON.stringify(result, null, 2));
      
      console.log("✅ User types seeded successfully");
      return;
    } catch (error) {
      console.error(`❌ Error seeding user types (attempt ${retryCount + 1}/${maxRetries}):`, error);
      retryCount++;
      
      if (retryCount < maxRetries) {
        console.log(`Retrying in ${retryDelay/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      } else {
        throw error;
      }
    }
  }
};
