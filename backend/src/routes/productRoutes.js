import express from 'express';
import Product from '../models/product.js';

const router = express.Router();

// Get all products by type
router.get('/type/:type', async (req, res) => {
    try {
        const products = await Product.find({ type: req.params.type });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all types
router.get('/types', async (req, res) => {
    try {
        const products = await Product.find();
        const types = [...new Set(products.map(product => product.type))];
        res.json(types);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all products by category
router.get('/category/:category', async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.category });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all categories
router.get('/categories', async (req, res) => {
    try {
        const products = await Product.find();
        const categories = [...new Set(products.map(product => product.category))];
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// Create a new product
router.post('/', async (req, res) => {
    const { name, price, type, category } = req.body;

    try {
        const newProduct = new Product({ name, price, type, category });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get a product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a product
router.put('/:id', async (req, res) => {
    try {
        const { name, price, type, category } = req.body;
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { name, price, type, category },
            { new: true }
        );
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a product
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Export the router
export default router;