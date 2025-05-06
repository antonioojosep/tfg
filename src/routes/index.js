import express from 'express';

const router = express.Router();

// Import routes
import tableRoutes from './tableRoutes.js';
import productRoutes from './productRoutes.js';
import userRoutes from './userRoutes.js';
import billRoutes from './billRoutes.js';

// Use routes
router.use('/tables', tableRoutes);
router.use('/products', productRoutes);
router.use('/user', userRoutes);
router.use('/bills', billRoutes);

// Export the router
export default router;