import { Router } from 'express';
import {
  createCustomerSession,
  getCustomerOrderStatus,
  validateSession
} from '../controllers/customerController';
import customerSessionMiddleware from '../middleware/customerSession';

const router = Router();

// Public — create anonymous session by scanning QR / entering shop ID
router.post('/session', createCustomerSession);

// Protected by customer session
router.get('/session/validate', customerSessionMiddleware, validateSession);
router.get('/orders/:orderId/status', customerSessionMiddleware, getCustomerOrderStatus);

export default router;