import { Router } from 'express';
import {
  verifyUserOtp,
  registerShop,
  loginShop,
  loginAdmin,
  forgotPassword,
  resetPassword
} from '../controllers/authController';


const router = Router();

// User routes
// router.post('/user/verify-otp', verifyUserOtp);

// Shop routes
router.post('/shop/register', registerShop);
router.post('/shop/login', loginShop);
router.post('/shop/forgot-password', forgotPassword);
router.post('/shop/reset-password', resetPassword);

// Admin routes
router.post('/admin/login', loginAdmin);

export default router;