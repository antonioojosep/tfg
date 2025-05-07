import express from 'express';

const router = express.Router();

// Import routes
import tableRoutes from './tableRoutes.js';
import productRoutes from './productRoutes.js';
import userRoutes from './userRoutes.js';
import billRoutes from './billRoutes.js';
import commandRoutes from './commandRoutes.js';
import printerRoutes from './printerRoutes.js';

// Use routes
router.use('/tables', tableRoutes);
router.use('/products', productRoutes);
router.use('/user', userRoutes);
router.use('/bills', billRoutes);
router.use('/orders', commandRoutes);
router.use('/printers', printerRoutes);

// Export the router
export default router;