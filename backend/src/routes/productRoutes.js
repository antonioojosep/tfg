import express from 'express';
import Product from '../models/product.js';
import { auth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Product listing routes
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Category routes
router.get('/categories', async (req, res) => {
  try {
    const products = await Product.find();
    const categories = [...new Set(products.map(product => product.category))];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/category/:category', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Type routes
router.get('/types', async (req, res) => {
  try {
    const products = await Product.find();
    const types = [...new Set(products.map(product => product.type))];
    res.json(types);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/type/:type', async (req, res) => {
  try {
    const products = await Product.find({ type: req.params.type });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Product CRUD operations
router.post('/', auth, async (req, res) => {
  try {
    const { name, price, type, category } = req.body;
    const company = req.user.company._id || req.user.company;
    const newProduct = new Product({ name, price, type, category, company });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

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

export default router;