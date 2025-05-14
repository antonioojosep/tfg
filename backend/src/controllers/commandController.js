import Command from '../models/command.js';
import { getIO } from '../sockets/socket.js';

export const createCommand = async (req, res) => {
  try {
    const { table, products, company } = req.body;

    // Separar productos por tipo
    const foodProducts = products.filter(item => item.product.type === 'food');
    const drinkProducts = products.filter(item => item.product.type === 'drink');

    const commands = [];

    // Crear comanda de comida si hay productos de comida
    if (foodProducts.length > 0) {
      const foodCommand = new Command({
        table,
        products: foodProducts,
        company
      });
      await foodCommand.save();
      await foodCommand.populate('products.product');
      commands.push(foodCommand);
    }

    // Crear comanda de bebida si hay productos de bebida
    if (drinkProducts.length > 0) {
      const drinkCommand = new Command({
        table,
        products: drinkProducts,
        company
      });
      await drinkCommand.save();
      await drinkCommand.populate('products.product');
      commands.push(drinkCommand);
    }

    // Emitir eventos para cada comanda
    commands.forEach(command => {
      getIO().emit('new-command', command);
    });
    
    res.status(201).json(commands);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};