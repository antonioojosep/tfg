import Command from '../models/command.js';
import { addToPrintQueue, failedPrints } from '../services/printService.js';
import { getIO } from '../sockets/socket.js';

export const createCommand = async (req, res) => {
  try {
    const { tableId, products } = req.body;
    const command = new Command({ table: tableId, products });
    await command.save();
    await command.populate('products.product');

    const drinks = command.products.filter(p => p.product.type === 'drink');
    const food = command.products.filter(p => p.product.type === 'food');

    if (drinks.length) await addToPrintQueue({ command: command._id, products: drinks }, 'bar');
    if (food.length) await addToPrintQueue({ command: command._id, products: food }, 'kitchen');

    getIO().emit('new-command', command);

    res.status(201).json({ ...command.toObject(), printFailed: failedPrints.has(command._id.toString()) });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};