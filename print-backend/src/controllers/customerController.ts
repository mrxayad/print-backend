import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import CustomerSession from '../models/CustomerSession';
import Order from '../models/Order';
import Shop from '../models/Shop';
import { signToken } from '../config/jwt';
import crypto from 'crypto';
import { CustomerSessionRequest } from '../middleware/customerSession';

// ─── CREATE ANONYMOUS CUSTOMER SESSION ───────────────────

export const createCustomerSession = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { shopId } = req.body;

    if (!shopId) {
      res.status(400).json({ message: 'shopId is required' });
      return;
    }

    // Verify shop exists and is verified
    const shop = await Shop.findOne({ shopId, isVerified: true });
    if (!shop) {
      res.status(404).json({ message: 'Shop not found or not verified' });
      return;
    }

    // Generate cryptographically secure session ID
    const sessionId = crypto.randomBytes(32).toString('hex');

    // Session expires in 4 hours
    const expiresAt = new Date(Date.now() + 4 * 60 * 60 * 1000);

    // Save session to DB
    await CustomerSession.create({
      sessionId,
      shopId,
      expiresAt
    });

    // Sign JWT with session info
    const token = signToken({
      role: 'customer',
      sessionId,
      shopId
    } as any);

    res.status(201).json({
      message: 'Session created',
      token,
      shopId,
      sessionId,
      shop: {
        name: shop.name,
        address: shop.address,
        shopId: shop.shopId
      },
      expiresAt
    });
  }
);

// ─── GET ORDER STATUS (for polling) ──────────────────────

export const getCustomerOrderStatus = asyncHandler(
  async (req: CustomerSessionRequest, res: Response): Promise<void> => {
    const { orderId } = req.params;

    // Always enforce session + shop ownership
    const order = await Order.findOne({
      _id: orderId,
      customerSessionId: req.customerSessionId,
      shopId: req.shopId
    });

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    res.status(200).json({
      orderId: order._id,
      orderCode: order.orderCode,
      orderStatus: order.orderStatus,
      totalAmount: order.totalAmount,
      platformFee: order.platformFee,
      createdAt: order.createdAt
    });
  }
);

// ─── VALIDATE SESSION ─────────────────────────────────────

export const validateSession = asyncHandler(
  async (req: CustomerSessionRequest, res: Response): Promise<void> => {
    // Check session exists in DB and is not expired
    const session = await CustomerSession.findOne({
      sessionId: req.customerSessionId,
      shopId: req.shopId
    });

    if (!session) {
      res.status(401).json({ message: 'Session expired or invalid' });
      return;
    }

    if (session.expiresAt < new Date()) {
      res.status(401).json({ message: 'Session expired' });
      return;
    }

    res.status(200).json({
      valid: true,
      sessionId: req.customerSessionId,
      shopId: req.shopId,
      expiresAt: session.expiresAt
    });
  }
);