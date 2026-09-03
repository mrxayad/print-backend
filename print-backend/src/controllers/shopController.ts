import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import Shop from '../models/Shop';

// Get shop by shopId — used by user to search for a shop
export const getShopById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { shopId } = req.params;

  const shop = await Shop.findOne({ shopId, isVerified: true }).select(
    'shopId name address'
  );

  if (!shop) {
    res.status(404).json({ message: 'Shop not found or not verified' });
    return;
  }

  res.status(200).json({ shop });
});