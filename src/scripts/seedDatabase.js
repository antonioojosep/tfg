import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/user.js';
import Product from '../models/product.js';
import Table from '../models/table.js';
import bcrypt from 'bcrypt';

dotenv.config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Limpiar base de datos
        await Promise.all([
            User.deleteMany({}),
            Product.deleteMany({}),
            Table.deleteMany({})
        ]);

        // Crear usuario admin
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            username: 'admin',
            password: hashedPassword,
            role: 'admin'
        });

        // Crear productos de ejemplo
        await Product.insertMany([
            { name: 'Coca Cola', price: 2.50, type: 'drink', category: 'soda' },
            { name: 'Hamburguesa', price: 10.00, type: 'food', category: 'main' }
        ]);

        // Crear mesas
        await Table.insertMany([
            { number: 1 },
            { number: 2 },
            { number: 3 }
        ]);

        console.log('✅ Database seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();