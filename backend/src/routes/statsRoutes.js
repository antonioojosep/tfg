import express from 'express';
import { getDailySales, getMonthlySales, getTopProducts } from '../controllers/statsController.js';

const router = express.Router();

router.get('/sales', getDailySales);
router.get('/top-products', getTopProducts);
router.get('/sales-monthly', getMonthlySales);

export default router;