import Bill from '../models/bill.js';
import Table from '../models/table.js';
import Command from '../models/command.js';
import { getIO } from '../sockets/socket.js';

export const createBill = async (req, res) => {
    try {
        const { tableId, method } = req.body;
        const company = req.user.company;

        // Buscar comandas NO pagadas para la mesa y compañía
        const commands = await Command.find({ 
            table: tableId,
            status: { $ne: "paid" },
            company
        }).populate('products.product');

        if (!commands.length) {
            return res.status(400).json({ message: "No hay comandas pendientes para esta mesa" });
        }

        // Calcular el total
        const total = commands.reduce((sum, command) => {
            return sum + command.products.reduce((subtotal, item) => {
                return subtotal + (item.product.price * item.amount);
            }, 0);
        }, 0);

        // Crear factura como pagada
        const bill = new Bill({
            table: tableId,
            total,
            method,
            status: "paid", // SIEMPRE pagada
            company
        });

        await bill.save();

        // Marcar todas las comandas como pagadas
        await Command.updateMany(
            { table: tableId, status: { $ne: "paid" }, company },
            { status: "paid" }
        );

        // Actualizar estado de la mesa
        await Table.findByIdAndUpdate(tableId, { status: "available" });

        // Emitir eventos de socket
        getIO().emit('bill-paid', bill);
        getIO().emit('table-updated', { tableId, isAvailable: true });

        res.status(201).json({ success: true, bill });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};