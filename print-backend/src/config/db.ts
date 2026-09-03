import mongoose from 'mongoose';

import dotenv from 'dotenv';
import dns  from "dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error((error as Error).message);
    process.exit(1);
  }
};

export default connectDB;