import express from 'express';
import Table from '../models/table.js';

const router = express.Router();

// Get all tables
router.get('/', async (req, res) => {
    try {
        const tables = await Table.find() 
        res.json(tables);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new table
router.post('/', async (req, res) => {
    const { number } = req.body.number;

    try {
        const newTable = new Table({ number});
        await newTable.save();
        res.status(201).json(newTable);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get a table by ID
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

// Update a table
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

// Delete a table
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