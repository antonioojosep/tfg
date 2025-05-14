import Bill from '../models/bill.js';
import Table from '../models/table.js';
import Command from '../models/command.js';
import { getIO } from '../sockets/socket.js';

export const createBill = async (req, res) => {
    try {
        const { tableId, method } = req.body;

        // Obtener todas las comandas pendientes de la mesa
        const commands = await Command.find({ 
            table: tableId,
            status: { $ne: "completed" }
        }).populate('products.product');

        // Calcular el total
        const total = commands.reduce((sum, command) => {
            return sum + command.products.reduce((subtotal, item) => {
                return subtotal + (item.product.price * item.amount);
            }, 0);
        }, 0);

        const bill = new Bill({
            table: tableId,
            total,
            method,
            status: "unpaid"
        });

        await bill.save();

        // Actualizar estado de las comandas
        await Command.updateMany(
            { table: tableId, status: { $ne: "completed" } },
            { status: "paid" }
        );

        // Actualizar estado de la mesa
        await Table.findByIdAndUpdate(tableId, { status: "available" });

        // Emitir eventos de socket
        getIO().emit('bill-paid', bill);
        getIO().emit('table-updated', { tableId, isAvailable: true });

        res.status(201).json(bill);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};