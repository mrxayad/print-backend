import { Router } from 'express';
import authMiddleware from '../middleware/auth';
import { authorizeRoles } from '../middleware/roles';
import asyncHandler from '../utils/asyncHandler';
import { Request, Response } from 'express';
import Review from '../models/Review';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// Submit a review
router.post(
  '/',
  authMiddleware,
  authorizeRoles('user'),
  asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { shopId, orderCode, rating, comment } = req.body;

    if (!shopId || !orderCode || !rating) {
      res.status(400).json({ message: 'shopId, orderCode and rating are required' });
      return;
    }

    // Check if user already reviewed this order
    const existing = await Review.findOne({
      userId: req.user!.id,
      orderCode
    });

    if (existing) {
      res.status(400).json({ message: 'You have already reviewed this order' });
      return;
    }

    const review = await Review.create({
      userId: req.user!.id,
      shopId,
      orderCode,
      rating,
      comment: comment || ''
    });

    res.status(201).json({ message: 'Review submitted successfully', review });
  })
);

// Get reviews for a specific shop
router.get(
  '/:shopId',
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const reviews = await Review.find({ shopId: req.params.shopId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ reviews });
  })
);

export default router;