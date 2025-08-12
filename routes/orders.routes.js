import express from 'express';
import { 
  getAllOrders, 
  getOrderById, 
  updateOrderStatus,
  cancelOrder,
  stripeWebhook,
  getAllOrdersAsAdmin
} from '../controllers/order.controller.js';
import protectRoute from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Regular user routes (protected)
router.get('/', protectRoute, getAllOrders);
router.get('/:id', protectRoute, getOrderById);
router.put('/:id/cancel', protectRoute, cancelOrder);

// Admin routes (protected + admin check)
router.get('/admin/all', protectRoute, isAdmin, getAllOrdersAsAdmin);
router.put('/admin/:id/status', protectRoute, isAdmin, updateOrderStatus);

// Stripe webhook (no authentication)
router.post('/webhook', express.raw({type: 'application/json'}), stripeWebhook);

export default router;