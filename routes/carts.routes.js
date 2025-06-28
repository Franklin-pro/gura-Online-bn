import express from 'express';
import { addToCart, deleteAllFromCart, getCarts, updateQuantity } from '../controllers/carts.controller.js';
import protectRoute from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/',protectRoute,addToCart);
router.delete('/',protectRoute,deleteAllFromCart);
router.put('/:id', protectRoute, updateQuantity);
router.get('/',protectRoute,getCarts);
export default router;