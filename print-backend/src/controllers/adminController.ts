import { Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { AuthRequest } from '../middleware/auth';
import Shop from '../models/Shop';
import Review from '../models/Review';
import Finance from '../models/Finance';
import Order from '../models/Order';

// ─── GET ALL SHOPS ────────────────────────────────────────

export const getAllShops = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const shops = await Shop.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({ shops });
  }
);

// ─── GET UNVERIFIED SHOPS ─────────────────────────────────

export const getUnverifiedShops = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const shops = await Shop.find({ isVerified: false })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({ shops });
  }
);

// ─── VERIFY A SHOP ────────────────────────────────────────

export const verifyShop = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { shopId } = req.params;

    const shop = await Shop.findById(shopId);

    if (!shop) {
      res.status(404).json({ message: 'Shop not found' });
      return;
    }

    if (shop.isVerified) {
      res.status(400).json({ message: 'Shop is already verified' });
      return;
    }

    shop.isVerified = true;
    await shop.save();

    res.status(200).json({ message: 'Shop verified successfully' });
  }
);

// ─── SUSPEND A SHOP ───────────────────────────────────────

export const suspendShop = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { shopId } = req.params;

    const shop = await Shop.findById(shopId);

    if (!shop) {
      res.status(404).json({ message: 'Shop not found' });
      return;
    }

    shop.isVerified = false;
    await shop.save();

    res.status(200).json({ message: 'Shop suspended successfully' });
  }
);

// ─── DELETE A SHOP ────────────────────────────────────────

export const deleteShop = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { shopId } = req.params;

    const shop = await Shop.findById(shopId);

    if (!shop) {
      res.status(404).json({ message: 'Shop not found' });
      return;
    }

    await shop.deleteOne();

    res.status(200).json({ message: 'Shop deleted successfully' });
  }
);

// ─── GET ALL REVIEWS ──────────────────────────────────────

export const getAllReviews = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const reviews = await Review.find()
      .populate('userId', 'name phone')
      .sort({ createdAt: -1 });

    res.status(200).json({ reviews });
  }
);

// ─── GET REVIEWS BY SHOP ──────────────────────────────────

export const getReviewsByShop = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { shopId } = req.params;

    const reviews = await Review.find({ shopId })
      .populate('userId', 'name phone')
      .sort({ createdAt: -1 });

    res.status(200).json({ reviews });
  }
);

// ─── GET PLATFORM EARNINGS ────────────────────────────────

export const getPlatformEarnings = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const finances = await Finance.find().sort({ date: -1 });

    const totalPlatformEarnings = finances.reduce(
      (sum, f) => sum + f.platformFee,
      0
    );

    const totalShopEarnings = finances.reduce(
      (sum, f) => sum + f.netEarning,
      0
    );

    const totalRevenue = finances.reduce(
      (sum, f) => sum + f.totalAmount,
      0
    );

    res.status(200).json({
      totalRevenue,
      totalPlatformEarnings,
      totalShopEarnings,
      finances
    });
  }
);

// ─── GET TODAY'S PLATFORM EARNINGS ───────────────────────

export const getTodayPlatformEarnings = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const finances = await Finance.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    const todayPlatformEarnings = finances.reduce(
      (sum, f) => sum + f.platformFee,
      0
    );

    const todayRevenue = finances.reduce(
      (sum, f) => sum + f.totalAmount,
      0
    );

    const todayOrders = finances.length;

    res.status(200).json({
      todayRevenue,
      todayPlatformEarnings,
      todayOrders
    });
  }
);

// ─── GET ALL ORDERS ───────────────────────────────────────

export const getAllOrders = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const orders = await Order.find()
      .populate('userId', 'name phone')
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  }
);