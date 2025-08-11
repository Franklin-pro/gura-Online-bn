import express from 'express';
import {
    getProducts,
    getProductsFeatured,
    createProduct,
    deleteProduct,
    recomandationProducts,
    getProductsByCategory,
    toggleFeaturedProduct,
    getProductById,
    addRates,
    globalSearch,
    getProductRates
} from '../controllers/products.controller.js';

import protectRoute, { isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Specific/static routes first
router.get('/featured', getProductsFeatured);
router.get('/category/:category', getProductsByCategory);
router.get('/recomandation', protectRoute, recomandationProducts);

// Put /search BEFORE /:id
router.get('/search', globalSearch);

// Dynamic routes after
router.get('/:id', getProductById);
router.patch('/:id', protectRoute, isAdmin, toggleFeaturedProduct);
router.delete('/:id', protectRoute, isAdmin, deleteProduct);

// Create and list at the bottom
router.get('/', getProducts);
router.get('/rates', protectRoute,getProductRates);
router.post('/', protectRoute, isAdmin, createProduct);
router.post('/:id/rate', protectRoute, addRates);




export default router;
