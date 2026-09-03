// run this file once: npx ts-node src/scripts/resetAdmin.ts
import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import Shop from '../models/Shop';
import dns  from "dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

async function run() {
  await mongoose.connect(process.env.MONGO_URI as string);
  const hash = await bcrypt.hash('Shop@123', 12);
  await Shop.updateOne(
    { phone: '9876543210' },
    { $set: { password: hash } },
    { upsert: true }
  );
  console.log('✅ Shop password reset to: Shop@123');
  await mongoose.disconnect();
}

run();