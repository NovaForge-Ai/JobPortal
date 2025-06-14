import mongoose from "mongoose";
import dotenv from "dotenv";
import UserType from "../models/user/user-type.model";
import UserAccount from '../models/user/user-account.model';

dotenv.config();

const MONGO_URL: string = process.env.MONGODB_URI || "mongodb://localhost:27017/job_portal";

async function fixUserType() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB');

    // Find the admin user type
    const adminType = await UserType.findOne({ user_type_name: 'admin' });
    if (!adminType) {
      throw new Error('Admin user type not found');
    }

    // Find the user account
    const user = await UserAccount.findOne({ email: 'anfas@novaforge.ai' });
    if (!user) {
      throw new Error('User account not found');
    }

    // Update the user type
    user.user_type_id = adminType._id;
    await user.save();

    console.log('User type updated successfully');
    console.log('Updated user:', JSON.stringify(user, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed');
  }
}

fixUserType(); 