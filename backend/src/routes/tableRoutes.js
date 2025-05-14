import express from 'express';
import Table from '../models/table.js';
import Command from '../models/command.js';

const router = express.Router();

// Table listing routes
router.get('/', async (req, res) => {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/availability', async (req, res) => {
  try {
    const tables = await Table.find().sort({ number: 1 });
    
    const tablesWithStatus = await Promise.all(tables.map(async (table) => {
      const activeCommands = await Command.find({
        table: table._id,
        status: { $ne: "paid" }
      });
      
      return {
        ...table.toObject(),
        isAvailable: activeCommands.length === 0
      };
    }));
    
    res.json(tablesWithStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Table CRUD operations
router.post('/', async (req, res) => {
  try {
    const { number } = req.body;
    const newTable = new Table({ number });
    await newTable.save();
    res.status(201).json(newTable);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const table = await Table.findById(req.params.id).populate('commands');
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    res.json(table);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    res.json(table);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    res.json({ message: 'Table deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;