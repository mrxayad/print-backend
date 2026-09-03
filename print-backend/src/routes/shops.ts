import { Router } from 'express';
import { getShopById } from '../controllers/shopController';
import authMiddleware from '../middleware/auth';
import { authorizeRoles } from '../middleware/roles';

const router = Router();

router.get('/:shopId', getShopById);

export default router;