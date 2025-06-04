import express from 'express';
import seedDatabase from '../scripts/seedDatabase.js';

const router = express.Router();

// Import routes
import tableRoutes from './tableRoutes.js';
import productRoutes from './productRoutes.js';
import userRoutes from './userRoutes.js';
import billRoutes from './billRoutes.js';
import commandRoutes from './commandRoutes.js';
import statsRoutes from './statsRoutes.js';
import companyRoutes from './companyRoutes.js';

// Use routes
router.use('/tables', tableRoutes);
router.use('/products', productRoutes);
router.use('/user', userRoutes);
router.use('/bills', billRoutes);
router.use('/orders', commandRoutes);
router.use('/stats', statsRoutes);
router.use('/company', companyRoutes);
router.get('/seed', seedDatabase);

// Export the router
export default router;