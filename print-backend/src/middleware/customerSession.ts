import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/jwt';

export interface CustomerSessionRequest extends Request {
  customerSessionId?: string;
  shopId?: string;
}

const customerSessionMiddleware = (
  req: CustomerSessionRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No session token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];

    // Verify token using existing JWT infrastructure
    const decoded = verifyToken(token) as any;

    // Must be a customer session token
    if (decoded.role !== 'customer') {
      res.status(401).json({ message: 'Invalid session token' });
      return;
    }

    // Attach session info to request
    req.customerSessionId = decoded.sessionId;
    req.shopId = decoded.shopId;

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired session' });
  }
};

export default customerSessionMiddleware;   