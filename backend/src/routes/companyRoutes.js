import express from 'express';
import Company from '../models/company.js';

const router = express.Router();

// Search companies
router.get('/search', async (req, res) => {
    try {
        const { term } = req.query;
        
        if (!term) {
            // Si no hay término de búsqueda, devolver todas las empresas
            const companies = await Company.find().limit(10);
            return res.json(companies);
        }

        // Si hay término de búsqueda, realizar la búsqueda filtrada
        const regex = new RegExp(term, 'i');
        const companies = await Company.find({
            $or: [
                { name: regex },
                { address: regex },
                { email: regex }
            ]
        }).limit(10);
        
        res.json(companies);
    } catch (error) {
        console.error('Error searching companies:', error);
        res.status(500).json({ message: 'Error searching companies' });
    }
});

// Get company by email
router.get('/:email', async (req, res) => {
    try {
        const company = await Company.findOne({ email: req.params.email });
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.json(company);
    } catch (error) {
        console.error('Error fetching company:', error);
        res.status(500).json({ message: 'Error fetching company' });
    }
});

export default router;