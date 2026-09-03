import { Request, Response } from 'express';
import admin from '../config/firebase';
import { signToken } from '../config/jwt';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import Shop from '../models/Shop';
import Admin from '../models/Admin';
import asyncHandler from '../utils/asyncHandler';
import crypto from 'crypto';



// ─── USER AUTH ───────────────────────────────────────────

// export const verifyUserOtp = asyncHandler(async (req: Request, res: Response): Promise<void> => {
//   const { idToken, name } = req.body;

//   if (!idToken) {
//     res.status(400).json({ message: 'ID token is required' });
//     return;
//   }

//   const decodedToken = await admin.auth().verifyIdToken(idToken);
//   const phone = decodedToken.phone_number;

//   if (!phone) {
//     res.status(400).json({ message: 'Phone number not found in token' });
//     return;
//   }

//   let user = await User.findOne({ phone });

//   if (!user) {
//     user = await User.create({ phone, name: name || '' });
//   }

//   const token = signToken({ id: user._id.toString(), role: 'user' });

//   res.status(200).json({
//     message: 'Login successful',
//     token,
//     user: {
//       id: user._id,
//       phone: user.phone,
//       name: user.name
//     }
//   });
// });
export const verifyUserOtp = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { idToken, name } = req.body;

  if (!idToken) {
    res.status(400).json({ message: 'ID token is required' });
    return;
  }

  // ✅ Verify Firebase token using admin SDK
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  const phone = decodedToken.phone_number;

  if (!phone) {
    res.status(400).json({ message: 'Phone number not found in token' });
    return;
  }

  // ✅ Find or create user
  let user = await User.findOne({ phone });
  if (!user) {
    user = await User.create({
      phone,
      name: name || '',
      firebaseUid: decodedToken.uid
    });
  }

  // ✅ Use your existing signToken (not jwt.sign directly)
  const token = signToken({ id: user._id.toString(), role: 'user' });

  res.status(200).json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      phone: user.phone,
      name: user.name
    }
  });
});

// ─── SHOP AUTH ───────────────────────────────────────────

export const registerShop = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { shopId, name, address, ownerName, phone, password } = req.body;

  if (!shopId || !name || !address || !ownerName || !phone || !password) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }

  const existingShop = await Shop.findOne({ $or: [{ shopId }, { phone }] });
  if (existingShop) {
    res.status(400).json({ message: 'Shop with this ID or phone already exists' });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const shop = await Shop.create({
    shopId,
    name,
    address,
    ownerName,
    phone,
    password: hashedPassword,
    isVerified: false
  });

  res.status(201).json({
    message: 'Shop registered successfully. Please wait for admin verification.',
    shopId: shop.shopId
  });
});

export const loginShop = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    res.status(400).json({ message: 'Phone and password are required' });
    return;
  }

  const shop = await Shop.findOne({ phone });

  if (!shop) {
    res.status(404).json({ message: 'Shop not found' });
    return;
  }

  if (!shop.isVerified) {
    res.status(403).json({ message: 'Your shop is not verified yet. Please contact admin.' });
    return;
  }

  const isMatch = await bcrypt.compare(password, shop.password);
  if (!isMatch) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const token = signToken({ id: shop._id.toString(), role: 'shop' });

  res.status(200).json({
    message: 'Login successful',
    token,
    shop: {
      id: shop._id,
      shopId: shop.shopId,
      name: shop.name,
      address: shop.address
    }
  });
});


// ─── FORGOT PASSWORD ──────────────────────────────────────

export const forgotPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { phone } = req.body;

  if (!phone) {
    res.status(400).json({ message: 'Phone number is required' });
    return;
  }

  const shop = await Shop.findOne({ phone });

  if (!shop) {
    // Don't reveal if shop exists
    res.status(200).json({ message: 'If this phone is registered, a reset code has been sent.' });
    return;
  }

  // Generate 6-digit reset code
  const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
  const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  shop.resetToken = resetToken;
  shop.resetTokenExpiry = resetTokenExpiry;
  await shop.save();

  // In production: send via SMS. For now log to console
  console.log(`Password reset code for ${phone}: ${resetToken}`);

  res.status(200).json({
    message: 'Reset code sent successfully',
    // In development only — remove in production
    devCode: process.env.NODE_ENV === 'development' ? resetToken : undefined
  });
});

// ─── RESET PASSWORD ───────────────────────────────────────

export const resetPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { phone, resetToken, newPassword } = req.body;

  if (!phone || !resetToken || !newPassword) {
    res.status(400).json({ message: 'Phone, reset code and new password are required' });
    return;
  }

  if (newPassword.length < 6) {
    res.status(400).json({ message: 'Password must be at least 6 characters' });
    return;
  }

  const shop = await Shop.findOne({
    phone,
    resetToken,
    resetTokenExpiry: { $gt: new Date() }
  });

  if (!shop) {
    res.status(400).json({ message: 'Invalid or expired reset code' });
    return;
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  shop.password = hashedPassword;
  shop.resetToken = undefined;
  shop.resetTokenExpiry = undefined;
  await shop.save();

  res.status(200).json({ message: 'Password reset successfully. You can now login.' });
});

// ─── ADMIN AUTH ───────────────────────────────────────────

export const loginAdmin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  const adminUser = await Admin.findOne({ email });

  if (!adminUser) {
    res.status(404).json({ message: 'Admin not found' });
    return;
  }

  const isMatch = await bcrypt.compare(password, adminUser.password);
  if (!isMatch) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const token = signToken({ id: adminUser._id.toString(), role: 'admin' });

  res.status(200).json({
    message: 'Admin login successful',
    token
  });
});