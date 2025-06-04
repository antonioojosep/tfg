import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/user.js';
import Product from '../models/product.js';
import Table from '../models/table.js';
import Command from '../models/command.js';
import Bill from '../models/bill.js';
import Company from '../models/company.js';
import bcrypt from 'bcrypt';

dotenv.config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear database
        await Promise.all([
            User.deleteMany({}),
            Product.deleteMany({}),
            Table.deleteMany({}),
            Command.deleteMany({}),
            Bill.deleteMany({}),
            Company.deleteMany({})
        ]);

        // Create companies
        const companies = await Company.insertMany([
            {
                name: 'Restaurante El Buen Sabor',
                address: 'Calle Principal 123',
                phone: '123456789',
                email: 'buensabor@email.com'
            }
        ]);

        // Create admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create([
            {
                username: 'admin',
                password: hashedPassword,
                role: 'admin',
                company: [companies[0]._id]
            },{
                username: 'juan',
                password: hashedPassword,
                role: 'waiter',
                company: [companies[0]._id]
            }, {
                username: 'manager',
                password: hashedPassword,
                role: 'manager',
                company: [companies[0]._id]
            }, {
                username: 'pepe',
                password: hashedPassword,
                role: 'waiter',
                company: [companies[0]._id]
            }]);

        // Create sample products
        const products = await Product.insertMany([
            { name: 'Coca Cola', price: 2.50, type: 'drink', category: 'Refrescos', company: companies[0]._id },
            { name: 'Hamburguesa', price: 10.00, type: 'food', category: 'Carne', company: companies[0]._id },
            { name: 'Fanta Naranja', price: 2.50, type: 'drink', category: 'Refrescos', company: companies[0]._id },
            { name: 'Gambas', price: 15.00, type: 'food', category: 'Pescado', company: companies[0]._id }
        ]);

        // Create tables
        const tables = await Table.insertMany([
            { number: 1, company: companies[0]._id, capacity: 4 },
            { number: 2, company: companies[0]._id, capacity: 4 },
            { number: 3, company: companies[0]._id, capacity: 6 }
        ]);
        console.log('✅ Database seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

export default seedDatabase;