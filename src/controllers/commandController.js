import Command from '../models/command.js';
import { addToPrintQueue } from '../services/printService.js';
import { getIO } from '../sockets/socket.js';

export const createCommand = async (req, res) => {
    try {
        const { tableId, products } = req.body;
        
        const command = new Command({
            table: tableId,
            products
        });
        
        await command.save();

        // Separar productos por tipo
        const drinks = products.filter(p => p.product.type === 'drink');
        const food = products.filter(p => p.product.type === 'food');

        // Enviar a las colas de impresión correspondientes
        if (drinks.length) {
            await addToPrintQueue({ command: command._id, products: drinks }, 'bar');
        }
        if (food.length) {
            await addToPrintQueue({ command: command._id, products: food }, 'kitchen');
        }

        // Notificar por WebSocket
        getIO().emit('new-command', command);

        res.status(201).json(command);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};