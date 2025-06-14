import mongoose from "mongoose";
import dotenv from "dotenv";
import UserType from "../models/user/user-type.model";
import UserAccount from '../models/user/user-account.model';

dotenv.config();

const MONGO_URL: string = process.env.MONGODB_URI || "mongodb://localhost:27017/job_portal";

async function checkUserTypes() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB');

    const userTypes = await UserType.find({});
    console.log('\nAvailable User Types:');
    console.log(JSON.stringify(userTypes, null, 2));

    const users = await UserAccount.find({}).populate('user_type_id');
    console.log('\nUser Accounts:');
    console.log(JSON.stringify(users, null, 2));

    const specificUser = await UserAccount.findOne({ email: 'anfas@novaforge.ai' }).populate('user_type_id');
    console.log('\nSpecific User (anfas@novaforge.ai):');
    console.log(JSON.stringify(specificUser, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed');
  }
}

checkUserTypes(); 