import express from 'express';
import { addToCart, deleteAllFromCart, deleteOneCart, getCarts, updateQuantity } from '../controllers/carts.controller.js';
import protectRoute from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/',protectRoute,addToCart);
router.delete('/',protectRoute,deleteAllFromCart);
router.delete('/:id', protectRoute, deleteOneCart);
router.put('/:id', protectRoute, updateQuantity);
router.get('/',protectRoute,getCarts);
export default router;