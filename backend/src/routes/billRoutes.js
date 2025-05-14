import express from 'express';
import { auth, checkRole } from '../middlewares/authMiddleware.js';
import { createBill } from '../controllers/billController.js';
import Bill from '../models/bill.js';
import { getIO } from '../sockets/socket.js';

const router = express.Router();

// Crear nueva factura
router.post('/', auth, createBill);

// Obtener todas las facturas (solo admin y manager)
router.get('/', [auth, checkRole(['admin', 'manager'])], async (req, res) => {
    try {
        const bills = await Bill.find()
            .populate('table')
            .sort({ createdAt: -1 });
        res.json(bills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Marcar factura como pagada
router.patch('/:id/pay', auth, async (req, res) => {
    try {
        const bill = await Bill.findByIdAndUpdate(
            req.params.id,
            { status: "paid" },
            { new: true }
        );
        
        if (!bill) {
            return res.status(404).json({ message: "Bill not found" });
        }

        // Liberar la mesa
        await Table.findByIdAndUpdate(bill.table, { status: "available" });
        
        getIO().emit('bill-paid', bill);
        
        res.json(bill);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;