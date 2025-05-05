import express from 'express';

const router = express.Router();

// Import routes
import tableRoutes from './tableRoutes.js';
import productRoutes from './productRoutes.js';
import userRoutes from './userRoutes.js';
import billRoutes from './billRoutes.js';

// Use routes
router.use('/api/tables', tableRoutes);
router.use('/api/products', productRoutes);
router.use('/api/user', userRoutes);
router.use('/api/bills', billRoutes);

// Export the router
export default router;