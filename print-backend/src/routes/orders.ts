// import { Router } from 'express';
// import {
//   createPaymentOrder,
//   verifyPaymentAndCreateOrder,
//   getShopOrders,
//   markOrderAsPrinted,
//   getUserOrderHistory,
//   getShopFinances,
//   getTodayEarnings
// } from '../controllers/orderController';
// import authMiddleware from '../middleware/auth';
// import { authorizeRoles } from '../middleware/roles';
// import upload from '../middleware/upload';
// import { calculatePrice } from '../controllers/orderController';


// const router = Router();

// // User routes

// router.post('/payment/create', createPaymentOrder);
// router.post(
//   '/create',
//   upload.fields([{ name: 'files', maxCount: 10 }]),
//   verifyPaymentAndCreateOrder
// );
// router.post('/calculate-price', calculatePrice);
// // router.get('/history',  getUserOrderHistory);

// // Shop routes
// router.get('/shop/:shopId', authMiddleware, authorizeRoles('shop'), getShopOrders);
// router.patch('/:orderId/printed', authMiddleware, authorizeRoles('shop'), markOrderAsPrinted);
// router.get('/finances/:shopId', authMiddleware, authorizeRoles('shop'), getShopFinances);
// router.get('/earnings/:shopId', authMiddleware, authorizeRoles('shop'), getTodayEarnings);

// export default router;
import { Router } from 'express';
import {
  createPaymentOrder,
  verifyPaymentAndCreateOrder,
  calculatePrice,
  getShopOrders,
  markOrderAsPrinted,
  getShopFinances,
  getTodayEarnings
} from '../controllers/orderController';
import authMiddleware from '../middleware/auth';
import customerSessionMiddleware from '../middleware/customerSession';
import { authorizeRoles } from '../middleware/roles';
import upload from '../middleware/upload';

const router = Router();

// ─── CUSTOMER ROUTES (anonymous session) ─────────────────
router.post('/calculate-price', customerSessionMiddleware, calculatePrice);
router.post('/payment/create', customerSessionMiddleware, createPaymentOrder);
router.post(
  '/create',
  customerSessionMiddleware,
  upload.fields([{ name: 'files', maxCount: 10 }]),
  verifyPaymentAndCreateOrder
);

// ─── SHOP ROUTES (shop JWT) ───────────────────────────────
router.get('/shop/:shopId', authMiddleware, authorizeRoles('shop'), getShopOrders);
router.patch('/:orderId/printed', authMiddleware, authorizeRoles('shop'), markOrderAsPrinted);
router.get('/finances/:shopId', authMiddleware, authorizeRoles('shop'), getShopFinances);
router.get('/earnings/:shopId', authMiddleware, authorizeRoles('shop'), getTodayEarnings);

export default router;