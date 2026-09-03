import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import Admin from '../models/Admin';
import dns  from "dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config();

const seedAdmin = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('MongoDB Connected');

    const existingAdmin = await Admin.findOne({ email: 'admin@printapp.com' });

    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('Admin@123', 12);

    await Admin.create({
      email: 'admin@printapp.com',
      password: hashedPassword
    });

    console.log('Admin created successfully');
    console.log('Email: admin@printapp.com');
    console.log('Password: Admin@123');
    process.exit(0);

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();