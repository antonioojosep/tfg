import Command from '../models/command.js';
import { getIO } from '../sockets/socket.js';

export const createCommand = async (req, res) => {
  try {
    const { tableId, products } = req.body;
    const command = new Command({ table: tableId, products });
    await command.save();
    await command.populate('products.product');

    const drinks = command.products.filter(p => p.product.type === 'drink');
    const food = command.products.filter(p => p.product.type === 'food');

    getIO().emit('new-command', command);

    res.status(201).json();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};