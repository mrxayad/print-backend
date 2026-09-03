import { Router } from 'express';
import {
  getAllShops,
  getUnverifiedShops,
  verifyShop,
  suspendShop,
  deleteShop,
  getAllReviews,
  getReviewsByShop,
  getPlatformEarnings,
  getTodayPlatformEarnings,
  getAllOrders
} from '../controllers/adminController';
import authMiddleware from '../middleware/auth';
import { authorizeRoles } from '../middleware/roles';

const router = Router();

// All admin routes are protected
router.use(authMiddleware, authorizeRoles('admin'));

// Shop management
router.get('/shops', getAllShops);
router.get('/shops/unverified', getUnverifiedShops);
router.patch('/shops/:shopId/verify', verifyShop);
router.patch('/shops/:shopId/suspend', suspendShop);
router.delete('/shops/:shopId', deleteShop);

// Reviews
router.get('/reviews', getAllReviews);
router.get('/reviews/:shopId', getReviewsByShop);

// Earnings
router.get('/earnings', getPlatformEarnings);
router.get('/earnings/today', getTodayPlatformEarnings);

// Orders
router.get('/orders', getAllOrders);

export default router;