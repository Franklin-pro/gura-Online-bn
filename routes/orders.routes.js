import express from 'express';
import { 
  getAllOrders, 
  getOrderById, 
  updateOrderStatus,
  cancelOrder,
  stripeWebhook,
  getAllOrdersAsAdmin
} from '../controllers/order.controller.js';
import protectRoute, { isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// User routes
router.get('/alls', getAllOrdersAsAdmin);
router.get('/all', getAllOrders);
router.get('/:id', protectRoute, getOrderById);
router.put('/:id/cancel', protectRoute, cancelOrder);

// Admin routes
router.put('/orders/:id/status', protectRoute, isAdmin, updateOrderStatus);

// Webhook (no auth needed)
router.post('/orders/webhook', express.raw({type: 'application/json'}), stripeWebhook);

export default router;