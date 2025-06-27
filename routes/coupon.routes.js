import express from 'express';
import protectRoute from '../middleware/auth.middleware.js';
import { validateCoupons, getCoupons } from '../controllers/coupons.controller.js';

const router = express.Router();

router.get('/',protectRoute,getCoupons);
router.get('/validate',protectRoute,validateCoupons)

export default router;