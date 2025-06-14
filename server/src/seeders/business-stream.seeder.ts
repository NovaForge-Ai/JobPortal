import BusinessStream from "../models/company-profile/business_stream.model";

const businessStreams = [
  "Information Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Real Estate",
  "Transportation",
  "Energy",
  "Media & Entertainment",
  "Construction",
  "Agriculture",
  "Telecommunications",
  "Hospitality",
  "Professional Services"
];

export const seedBusinessStreams = async () => {
  try {
    console.log('Starting business stream seeding...');
    
    // Check if we already have business streams
    const existingStreams = await BusinessStream.find({});
    if (existingStreams.length > 0) {
      console.log('Business streams already exist, skipping seeding');
      return existingStreams;
    }
    
    // Create new business streams
    const streams = businessStreams.map(name => ({ business_stream_name: name }));
    const createdStreams = await BusinessStream.insertMany(streams);
    console.log('Created business streams:', createdStreams.map(s => ({ id: s._id, name: s.business_stream_name })));
    
    console.log("✅ Business streams seeded successfully");
    return createdStreams;
  } catch (error) {
    console.error("❌ Error seeding business streams:", error);
    throw error;
  }
}; 