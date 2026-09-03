// import { Request, Response } from 'express';
// import asyncHandler from '../utils/asyncHandler';
// import Order from '../models/Order';
// import Finance from '../models/Finance';
// import Shop from '../models/Shop';
// import { generateOrderCode } from '../utils/orderCode';
// import { calculatePlatformFee } from '../utils/platformFee';
// import cloudinary from '../config/cloudinary';
// import razorpay from '../config/razorpay';
// import crypto from 'crypto';
// import { AuthRequest } from '../middleware/auth';

// // ─── CREATE RAZORPAY ORDER ───────────────────────────────

// // export const createPaymentOrder = asyncHandler(async (req: Request, res: Response): Promise<void> => {
// //   const { totalAmount } = req.body;

// //   if (!totalAmount) {
// //     res.status(400).json({ message: 'Total amount is required' });
// //     return;
// //   }

// //   const options = {
// //     amount: Math.round(totalAmount * 100), // Razorpay uses paise
// //     currency: 'INR',
// //     receipt: `receipt_${Date.now()}`
// //   };

// //   const order = await razorpay.orders.create(options);

// //   res.status(200).json({
// //     orderId: order.id,
// //     amount: order.amount,
// //     currency: order.currency
// //   });
// // });

// export const createPaymentOrder = asyncHandler(async (req: Request, res: Response): Promise<void> => {
//   const { totalAmount } = req.body;

//   if (!totalAmount) {
//     res.status(400).json({ message: 'Total amount is required' });
//     return;
//   }

//   // Mock Razorpay order for testing
//   const mockOrder = {
//     orderId: `order_mock_${Date.now()}`,
//     amount: Math.round(totalAmount * 100),
//     currency: 'INR'
//   };

//   res.status(200).json(mockOrder);
// });

// // ─── VERIFY PAYMENT AND CREATE ORDER ────────────────────

// // export const verifyPaymentAndCreateOrder = asyncHandler(
// //   async (req: AuthRequest, res: Response): Promise<void> => {
// //     const {
// //       razorpayOrderId,
// //       razorpayPaymentId,
// //       razorpaySignature,
// //       shopId,
// //       printType,
// //       totalAmount,
// //       filesMetadata // array of { type, copies } matching uploaded files
// //     } = req.body;

// //     // Step 1 — Verify Razorpay signature
// //     const body = razorpayOrderId + '|' + razorpayPaymentId;
// //     const expectedSignature = crypto
// //       .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string)
// //       .update(body)
// //       .digest('hex');

// //     if (expectedSignature !== razorpaySignature) {
// //       res.status(400).json({ message: 'Payment verification failed' });
// //       return;
// //     }

// //     // Step 2 — Check shop exists
// //     const shop = await Shop.findOne({ shopId, isVerified: true });
// //     if (!shop) {
// //       res.status(404).json({ message: 'Shop not found' });
// //       return;
// //     }

// //     // Step 3 — Upload files to Cloudinary
// //     const uploadedFiles: { url: string; type: 'document' | 'image'; copies: number }[] = [];

// //     const files = req.files as Express.Multer.File[];

// //     if (!files || files.length === 0) {
// //       res.status(400).json({ message: 'No files uploaded' });
// //       return;
// //     }

// //     for (let i = 0; i < files.length; i++) {
// //       const file = files[i];
// //       const metadata = JSON.parse(filesMetadata)[i];

// //       const uploadResult = await new Promise<string>((resolve, reject) => {
// //         const uploadStream = cloudinary.uploader.upload_stream(
// //           {
// //             folder: 'printapp/orders',
// //             resource_type: file.mimetype === 'application/pdf' ? 'raw' : 'image'
// //           },
// //           (error, result) => {
// //             if (error) reject(error);
// //             else resolve(result!.secure_url);
// //           }
// //         );
// //         uploadStream.end(file.buffer);
// //       });

// //       uploadedFiles.push({
// //         url: uploadResult,
// //         type: metadata.type,
// //         copies: metadata.copies
// //       });
// //     }

// //     // Step 4 — Calculate platform fee
// //     const platformFee = calculatePlatformFee(totalAmount);

// //     // Step 5 — Generate unique order code
// //     const orderCode = generateOrderCode();

// //     // Step 6 — Save order to database
// //     const order = await Order.create({
// //       orderCode,
// //       userId: req.user!.id,
// //       shopId,
// //       files: uploadedFiles,
// //       printType,
// //       totalAmount,
// //       platformFee,
// //       paymentStatus: 'paid',
// //       paymentId: razorpayPaymentId,
// //       orderStatus: 'pending'
// //     });

// //     // Step 7 — Emit order to shop via Socket.io
// //     const io = req.app.get('io');
// //     io.to(shopId).emit('new_order', {
// //       orderCode: order.orderCode,
// //       files: order.files,
// //       printType: order.printType,
// //       totalAmount: order.totalAmount,
// //       createdAt: order.createdAt
// //     });

// //     res.status(201).json({
// //       message: 'Order placed successfully',
// //       orderCode: order.orderCode
// //     });
// //   }
// // );
// export const verifyPaymentAndCreateOrder = asyncHandler(
//   async (req: AuthRequest, res: Response): Promise<void> => {
//     const {
//       razorpayOrderId,
//       razorpayPaymentId,
//       razorpaySignature,
//       shopId,
//       printType,
//       totalAmount,
//       filesMetadata
//     } = req.body;

//     export const verifyPaymentAndCreateOrder = asyncHandler(
//   async (req: AuthRequest, res: Response): Promise<void> => {
//     const {
//       razorpayOrderId,
//       razorpayPaymentId,
//       razorpaySignature,
//       shopId,
//       printType,
//       totalAmount,
//       filesMetadata
//     } = req.body;

//     // ─── DEBUG LOGS ──────────────────────────────────
//     console.log('=== NEW ORDER REQUEST ===');
//     console.log('Body:', req.body);
//     console.log('Files:', req.files);
//     console.log('Files count:', (req.files as Express.Multer.File[])?.length ?? 0);
//     console.log('filesMetadata:', filesMetadata);
//     console.log('Content-Type:', req.headers['content-type']);
//     console.log('=========================');
//     // ─────────────────────────────────────────────────

//     if (!shopId || !printType || !totalAmount) {
//       res.status(400).json({ message: 'shopId, printType and totalAmount are required' });
//       return;
//     }
//     // ... rest of code unchanged

//     if (!shopId || !printType || !totalAmount) {
//       res.status(400).json({ message: 'shopId, printType and totalAmount are required' });
//       return;
//     }

//     // Check shop exists
//     const shop = await Shop.findOne({ shopId, isVerified: true });
//     if (!shop) {
//       res.status(404).json({ message: 'Shop not found' });
//       return;
//     }

//     // Skip real Razorpay signature verification in test mode
//     const isTestMode = process.env.RAZORPAY_TEST_MODE === 'true';

//     if (!isTestMode) {
//       // Real signature verification — used in production
//       const body = razorpayOrderId + '|' + razorpayPaymentId;
//       const expectedSignature = crypto
//         .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string)
//         .update(body)
//         .digest('hex');

//       if (expectedSignature !== razorpaySignature) {
//         res.status(400).json({ message: 'Payment verification failed' });
//         return;
//       }
//     }

//     // Upload files to Cloudinary
//  // Safely parse filesMetadata
// let parsedFilesMetadata: { type: 'document' | 'image'; copies: number }[] = [];
// try {
//   parsedFilesMetadata = filesMetadata ? JSON.parse(filesMetadata) : [];
// } catch {
//   parsedFilesMetadata = [];
// }

// const uploadedFiles: { url: string; type: 'document' | 'image'; copies: number }[] = [];
// const files = req.files as Express.Multer.File[];

// if (files && files.length > 0) {
//   for (let i = 0; i < files.length; i++) {
//     const file = files[i];
//     const metadata = parsedFilesMetadata[i] || { type: 'document', copies: 1 };

// const uploadResult = await new Promise<string>((resolve, reject) => {
//       const isPdf = file.mimetype === 'application/pdf';
//       const uploadStream = cloudinary.uploader.upload_stream(
//         {
//           folder: 'printapp/orders',
//           resource_type: isPdf ? 'raw' : 'image',
//           format: isPdf ? 'pdf' : undefined,
//           flags: isPdf ? 'attachment' : undefined,
//           access_mode: 'public'
//         },
//         (error, result) => {
//           if (error) reject(error);
//           else resolve(result!.secure_url);
//         }
//       );
//       uploadStream.end(file.buffer);
//     });

//     uploadedFiles.push({
//       url: uploadResult,
//       type: metadata.type as 'document' | 'image',
//       copies: metadata.copies
//     });
//   }
// }
//     // Calculate platform fee
//     const platformFee = calculatePlatformFee(totalAmount);

//     // Generate unique order code
//     const orderCode = generateOrderCode();

//     // Save order to database
//     const order = await Order.create({
//       orderCode,
//       userId: req.user!.id,
//       shopId,
//       files: uploadedFiles,
//       printType,
//       totalAmount,
//       platformFee,
//       paymentStatus: 'paid',
//       paymentId: razorpayPaymentId || `mock_payment_${Date.now()}`,
//       orderStatus: 'pending'
//     });

//     // Emit order to shop via Socket.io
//     const io = req.app.get('io');
//     io.to(shopId).emit('new_order', {
//       _id: order._id,
//       orderCode: order.orderCode,
//       files: order.files,
//       printType: order.printType,
//       totalAmount: order.totalAmount,
//       platformFee: order.platformFee,
//       orderStatus: order.orderStatus,
//       createdAt: order.createdAt
//     });

//     res.status(201).json({
//       message: 'Order placed successfully',
//       orderCode: order.orderCode
//     });
//   }
// );

// // ─── GET SHOP PENDING ORDERS ─────────────────────────────

// export const getShopOrders = asyncHandler(
//   async (req: AuthRequest, res: Response): Promise<void> => {
//     const { shopId } = req.params;

//     const orders = await Order.find({
//       shopId,
//       orderStatus: 'pending'
//     }).sort({ createdAt: -1 });

//     res.status(200).json({ orders });
//   }
// );

// // ─── MARK ORDER AS PRINTED ───────────────────────────────

// export const markOrderAsPrinted = asyncHandler(
//   async (req: AuthRequest, res: Response): Promise<void> => {
//     const { orderId } = req.params;

//     const order = await Order.findById(orderId);

//     if (!order) {
//       res.status(404).json({ message: 'Order not found' });
//       return;
//     }

//     if (order.orderStatus === 'printed') {
//       res.status(400).json({ message: 'Order already marked as printed' });
//       return;
//     }

//     // Update order status
//     order.orderStatus = 'printed';
//     await order.save();

//     // Save to finances
//     await Finance.create({
//       shopId: order.shopId,
//       orderId: order._id,
//       orderCode: order.orderCode,
//       totalAmount: order.totalAmount,
//       platformFee: order.platformFee,
//       netEarning: order.totalAmount - order.platformFee,
//       date: new Date()
//     });

//     res.status(200).json({ message: 'Order marked as printed' });
//   }
// );

// // ─── GET USER ORDER HISTORY (LAST 5 DAYS) ────────────────

// export const getUserOrderHistory = asyncHandler(
//   async (req: AuthRequest, res: Response): Promise<void> => {
//     const userId = req.user!.id;

//     const fiveDaysAgo = new Date();
//     fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

//     const orders = await Order.find({
//       userId,
//       createdAt: { $gte: fiveDaysAgo }
//     }).sort({ createdAt: -1 });

//     res.status(200).json({ orders });
//   }
// );

// // ─── GET SHOP FINANCES ────────────────────────────────────

// export const getShopFinances = asyncHandler(
//   async (req: AuthRequest, res: Response): Promise<void> => {
//     const { shopId } = req.params;

//     const finances = await Finance.find({ shopId }).sort({ date: -1 });

//     res.status(200).json({ finances });
//   }
// );

// // ─── GET TODAY'S EARNINGS ─────────────────────────────────

// export const getTodayEarnings = asyncHandler(
//   async (req: AuthRequest, res: Response): Promise<void> => {
//     const { shopId } = req.params;

//     const startOfDay = new Date();
//     startOfDay.setHours(0, 0, 0, 0);

//     const endOfDay = new Date();
//     endOfDay.setHours(23, 59, 59, 999);

//     const finances = await Finance.find({
//       shopId,
//       date: { $gte: startOfDay, $lte: endOfDay }
//     });

//     const totalEarnings = finances.reduce((sum, f) => sum + f.netEarning, 0);
//     const totalOrders = finances.length;

//     res.status(200).json({ totalEarnings, totalOrders, finances });
//   }
// );

// import dotenv from 'dotenv';
// dotenv.config();

// import { Request, Response } from 'express';
// import asyncHandler from '../utils/asyncHandler';
// import Order from '../models/Order';
// import Finance from '../models/Finance';
// import Shop from '../models/Shop';
// import { generateOrderCode } from '../utils/orderCode';
// import { calculatePlatformFee } from '../utils/platformFee';
// import cloudinary from '../config/cloudinary';
// import crypto from 'crypto';
// import { AuthRequest } from '../middleware/auth';
// import fs from 'fs/promises';
import dotenv from 'dotenv';
dotenv.config();

import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import Order from '../models/Order';
import Finance from '../models/Finance';
import Shop from '../models/Shop';
import { generateOrderCode } from '../utils/orderCode';
import {
  calculatePlatformFee,
  calculateTotalFromFiles,
  calculateFilePrice,
  PRICING
} from '../utils/platformFee';
import cloudinary from '../config/cloudinary';
import crypto from 'crypto';
import { AuthRequest } from '../middleware/auth';
import { CustomerSessionRequest } from '../middleware/customerSession';
import fs from 'fs/promises';
import { getPdfPageCount } from '../utils/pdfPageCount';

// ─── CREATE RAZORPAY ORDER ───────────────────────────────

export const createPaymentOrder = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { totalAmount } = req.body;

    if (!totalAmount) {
      res.status(400).json({ message: 'Total amount is required' });
      return;
    }

    const mockOrder = {
      orderId: `order_mock_${Date.now()}`,
      amount: Math.round(totalAmount * 100),
      currency: 'INR'
    };

    res.status(200).json(mockOrder);
  }
);

// ─── CALCULATE PRICE ─────────────────────────────────────

// export const calculatePrice = asyncHandler(
//   async (req: AuthRequest, res: Response): Promise<void> => {
//     const { files } = req.body;

//     if (!files) {
//       res.status(400).json({ message: 'files are required' });
//       return;
//     }

//     const PRICING = {
//       bw: { firstPage: 2, extraPage: 1.5 },
//       color: { firstPage: 5, extraPage: 4 }
//     };

//     let totalAmount = 0;
//     const breakdown: {
//       name: string;
//       pages: number;
//       copies: number;
//       printType: string;
//       pricePerCopy: number;
//       total: number;
//     }[] = [];

//     for (const file of files) {
//       const pages = file.pages || 1;
//       const copies = file.copies || 1;
//       const printType = file.printType || 'bw';
//       const pricing = PRICING[printType as 'bw' | 'color'];

//       const firstPageCost = pricing.firstPage;
//       const extraPagesCost = pages > 1 ? (pages - 1) * pricing.extraPage : 0;
//       const pricePerCopy = firstPageCost + extraPagesCost;
//       const fileTotal = pricePerCopy * copies;

//       totalAmount += fileTotal;

//       breakdown.push({
//         name: file.name || 'File',
//         pages,
//         copies,
//         printType,
//         pricePerCopy: Math.round(pricePerCopy * 100) / 100,
//         total: Math.round(fileTotal * 100) / 100
//       });
//     }

//     const platformFee = calculatePlatformFee(totalAmount);
//     const grandTotal = Math.round((totalAmount + platformFee) * 100) / 100;

//     res.status(200).json({
//       breakdown,
//       totalAmount: Math.round(totalAmount * 100) / 100,
//       platformFee: Math.round(platformFee * 100) / 100,
//       grandTotal
//     });
//   }
// );
export const calculatePrice = asyncHandler(
  async (req: CustomerSessionRequest, res: Response): Promise<void> => {
    const { files } = req.body;

    if (!files) {
      res.status(400).json({ message: 'files are required' });
      return;
    }

    const PRICING_MAP = {
      bw: { firstPage: 2, extraPage: 1.5 },
      color: { firstPage: 5, extraPage: 4 }
    };

    let totalAmount = 0;
    const breakdown: {
      name: string;
      pages: number;
      copies: number;
      printType: string;
      sided: string;
      pricePerCopy: number;
      total: number;
      sheetsPerCopy: number;
    }[] = [];

    for (const file of files) {
      const pages = file.pages || 1;
      const copies = file.copies || 1;
      const printType = file.printType || 'bw';
      const sided = file.sided || 'single';
      const pricing = PRICING_MAP[printType as 'bw' | 'color'];

      let pricePerCopy = 0;
      let sheetsPerCopy = pages;

      if (sided === 'single') {
        const firstPageCost = pricing.firstPage;
        const extraPagesCost = pages > 1 ? (pages - 1) * pricing.extraPage : 0;
        pricePerCopy = firstPageCost + extraPagesCost;
        sheetsPerCopy = pages;
      } else {
        // Double sided
        const fullSheets = Math.floor(pages / 2);
        const hasOddPage = pages % 2 !== 0;
        sheetsPerCopy = fullSheets + (hasOddPage ? 1 : 0);

        if (fullSheets > 0) {
          pricePerCopy += pricing.firstPage;
          if (fullSheets > 1) {
            pricePerCopy += (fullSheets - 1) * pricing.extraPage;
          }
        }
        if (hasOddPage) {
          pricePerCopy += fullSheets === 0 ? pricing.firstPage : pricing.extraPage;
        }
      }

      const fileTotal = pricePerCopy * copies;
      totalAmount += fileTotal;

      breakdown.push({
        name: file.name || 'File',
        pages,
        copies,
        printType,
        sided,
        sheetsPerCopy,
        pricePerCopy: Math.round(pricePerCopy * 100) / 100,
        total: Math.round(fileTotal * 100) / 100
      });
    }

    const platformFee = calculatePlatformFee(totalAmount);
    const grandTotal = Math.round((totalAmount + platformFee) * 100) / 100;

    res.status(200).json({
      breakdown,
      totalAmount: Math.round(totalAmount * 100) / 100,
      platformFee: Math.round(platformFee * 100) / 100,
      grandTotal
    });
  }
);


// ─── VERIFY PAYMENT AND CREATE ORDER ────────────────────

export const verifyPaymentAndCreateOrder = asyncHandler(
  async (req: CustomerSessionRequest, res: Response): Promise<void> => {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      shopId,
      totalAmount,
      filesMetadata
    } = req.body;

    // ─── DEBUG LOGS ──────────────────────────────────
    console.log('=== NEW ORDER REQUEST ===');
    console.log('Body:', req.body);
    console.log('Files:', req.files);
    // console.log('Files count:', (req.files as Express.Multer.File[])?.length ?? 0);
    const filesObjDebug = req.files as { [fieldname: string]: Express.Multer.File[] };
    console.log('Files count:', filesObjDebug?.['files']?.length ?? 0);
    console.log('filesMetadata:', filesMetadata);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('=========================');
    // ─────────────────────────────────────────────────

    const customerSessionId = req.customerSessionId;
    const sessionShopId = req.shopId;

    console.log('Customer session:', customerSessionId, 'Shop:', sessionShopId);

    if (!customerSessionId || !sessionShopId) {
      res.status(401).json({ message: 'Invalid customer session' });
      return;
    }
    //---------------------------------------------------


 const verifiedShopId = sessionShopId;

    if (!totalAmount) {
      res.status(400).json({ message: 'totalAmount is required' });
      return;
    }

    // Check shop exists
    const shop = await Shop.findOne({ shopId: verifiedShopId, isVerified: true });
    if (!shop) {
      res.status(404).json({ message: 'Shop not found' });
      return;
    }

    // Skip real Razorpay verification in test mode
    if (process.env.RAZORPAY_TEST_MODE !== 'true') {
      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        res.status(400).json({ message: 'Payment details are required' });
        return;
      }
      const body = razorpayOrderId + '|' + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string)
        .update(body)
        .digest('hex');

      if (expectedSignature !== razorpaySignature) {
        res.status(400).json({ message: 'Payment verification failed' });
        return;
      }
    }

    // Safely parse filesMetadata
    let parsedFilesMetadata: { type: 'document' | 'image'; copies: number ; pages?: number; printType?: 'bw' | 'color'; sided?: 'single' | 'double' }[] = [];
    try {
      parsedFilesMetadata = filesMetadata ? JSON.parse(filesMetadata) : [];
    } catch {
      parsedFilesMetadata = [];
    }

    // ─── Upload files to Cloudinary ───────────────────────────────

const uploadedFiles: {
  url: string;
  type: "document" | "image";
  copies: number;
  pages: number;
  printType: "bw" | "color";
  sided: "single" | "double";
}[] = [];

const filesObj = req.files as {
  [fieldname: string]: Express.Multer.File[];
};

const files = filesObj?.["files"] || [];

console.log("Parsed files count:", files.length);

if (files.length > 0) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    const metadata = parsedFilesMetadata[i] || {
      type: "document",
      copies: 1,
    };

    console.log(
      `Uploading file ${i}`,
      file.originalname,
      file.mimetype,
      file.size,
      file.path
    );

    try {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: "printapp/orders",
        resource_type:
          file.mimetype === "application/pdf" ? "raw" : "image",
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      });

      console.log("Cloudinary URL:", uploadResult.secure_url);

      uploadedFiles.push({
        url: uploadResult.secure_url,
        type: metadata.type as "document" | "image",
        copies: metadata.copies,
        pages: metadata.pages || 1,
        printType: metadata.printType || "bw",
        sided: metadata.sided || 'single'
      });

      // Delete the local file
      await fs.unlink(file.path);
    } catch (err) {
      console.error("Cloudinary Upload Error:", err);

      // Delete the local file even if upload fails
      try {
        await fs.unlink(file.path);
      } catch {}

      throw err;
    }
  }
}

console.log("Uploaded Files:", uploadedFiles);


   // Recalculate total on backend using actual page counts from uploaded files
// const recalculatedTotal = calculateTotalFromFiles(
//   uploadedFiles.map(f => ({
//     pages: f.pages,
//     copies: f.copies
//   })),
//   printType as 'bw' | 'color'
// );
// Recalculate total using actual page counts and per-file print type
// const PRICING_MAP = {
//   bw: { firstPage: 2, extraPage: 1.5 },
//   color: { firstPage: 5, extraPage: 4 }
// };

// let recalculatedTotal = 0;

// for (let i = 0; i < uploadedFiles.length; i++) {
//   const f = uploadedFiles[i];
//   const fileMeta = parsedFilesMetadata[i];
//   const printType = fileMeta?.printType || 'bw';
//   const pricing = PRICING_MAP[printType as 'bw' | 'color'];
//   const pages = f.pages || 1;
//   const copies = f.copies || 1;

//   const firstPageCost = pricing.firstPage;
//   const extraPagesCost = pages > 1 ? (pages - 1) * pricing.extraPage : 0;
//   const pricePerCopy = firstPageCost + extraPagesCost;
//   recalculatedTotal += pricePerCopy * copies;
// }

// recalculatedTotal = Math.round(recalculatedTotal * 100) / 100;

const PRICING_MAP = {
  bw: { firstPage: 2, extraPage: 1.5 },
  color: { firstPage: 5, extraPage: 4 }
};

let recalculatedTotal = 0;

for (let i = 0; i < uploadedFiles.length; i++) {
  const f = uploadedFiles[i];
  const fileMeta = parsedFilesMetadata[i];
  const filePrintType = fileMeta?.printType || 'bw';
  const sided = fileMeta?.sided || 'single';
  const pricing = PRICING_MAP[filePrintType as 'bw' | 'color'];
  const pages = f.pages || 1;
  const copies = f.copies || 1;

  let pricePerCopy = 0;

  if (sided === 'single') {
    pricePerCopy = pricing.firstPage + (pages > 1 ? (pages - 1) * pricing.extraPage : 0);
  } else {
    const fullSheets = Math.floor(pages / 2);
    const hasOddPage = pages % 2 !== 0;
    if (fullSheets > 0) {
      pricePerCopy += pricing.firstPage;
      if (fullSheets > 1) pricePerCopy += (fullSheets - 1) * pricing.extraPage;
    }
    if (hasOddPage) {
      pricePerCopy += fullSheets === 0 ? pricing.firstPage : pricing.extraPage;
    }
  }

  recalculatedTotal += pricePerCopy * copies;
}

recalculatedTotal = Math.round(recalculatedTotal * 100) / 100;

console.log('Frontend totalAmount:', totalAmount);
console.log('Backend recalculated totalAmount:', recalculatedTotal);

// Always use backend calculated total
const platformFee = calculatePlatformFee(recalculatedTotal);

// Generate unique order code
const orderCode = generateOrderCode();

// Save order to database
const order = await Order.create({
  orderCode,
  customerSessionId,
  shopId: verifiedShopId,
  files: uploadedFiles,
  printType: 'mixed', // Use first file's print type as order print type
  totalAmount: recalculatedTotal, // ← backend calculated
  platformFee,
  paymentStatus: 'paid',
  paymentId: razorpayPaymentId || `mock_payment_${Date.now()}`,
  orderStatus: 'pending'
});

    console.log('Order saved:', order._id, 'Files:', order.files.length);

    // Fetch complete order to make sure all fields are included
    const savedOrder = await Order.findById(order._id);

    // Emit to shop via Socket.io
    const io = req.app.get('io');
    io.to(shopId).emit('new_order', savedOrder);

    res.status(201).json({
      message: 'Order placed successfully',
      orderCode: order.orderCode,
      orderId: order._id.toString(),
    });
  }
);

// ─── GET SHOP PENDING ORDERS ─────────────────────────────

export const getShopOrders = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { shopId } = req.params;

    const orders = await Order.find({
      shopId,
      orderStatus: 'pending'
    }).sort({ createdAt: -1 });

    res.status(200).json({ orders });
  }
);

// ─── MARK ORDER AS PRINTED ───────────────────────────────

export const markOrderAsPrinted = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    if (order.orderStatus === 'printed') {
      res.status(400).json({ message: 'Order already marked as printed' });
      return;
    }

    order.orderStatus = 'printed';
    await order.save();

    await Finance.create({
      shopId: order.shopId,
      orderId: order._id,
      orderCode: order.orderCode,
      totalAmount: order.totalAmount,
      platformFee: order.platformFee,
      netEarning: order.totalAmount - order.platformFee,
      date: new Date()
    });

    res.status(200).json({ message: 'Order marked as printed' });
  }
);

// ─── GET USER ORDER HISTORY (LAST 5 DAYS) ────────────────

export const getUserOrderHistory = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user!.id;

    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    const orders = await Order.find({
      userId,
      createdAt: { $gte: fiveDaysAgo }
    }).sort({ createdAt: -1 });

    res.status(200).json({ orders });
  }
);

// ─── GET SHOP FINANCES ────────────────────────────────────

export const getShopFinances = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { shopId } = req.params;

    const finances = await Finance.find({ shopId }).sort({ date: -1 });

    res.status(200).json({ finances });
  }
);

// ─── GET TODAY'S EARNINGS ─────────────────────────────────

export const getTodayEarnings = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { shopId } = req.params;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const finances = await Finance.find({
      shopId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    const totalEarnings = finances.reduce((sum, f) => sum + f.netEarning, 0);
    const totalOrders = finances.length;

    res.status(200).json({ totalEarnings, totalOrders, finances });
  }
);