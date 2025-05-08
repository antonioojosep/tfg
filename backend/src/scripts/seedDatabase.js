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
            },
            {
                name: 'Bar La Esquina',
                address: 'Avenida Central 456',
                phone: '987654321',
                email: 'laesquina@email.com'
            }
        ]);

        // Create admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create([
            {
                username: 'admin',
                password: hashedPassword,
                role: 'admin',
                company: [companies[0]._id, companies[1]._id] // Admin tiene acceso a todas las compañías
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
                company: [companies[1]._id]
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

        // Create sample commands
        const commands = await Command.insertMany([
            {
                table: tables[0]._id,
                products: [
                    { product: products[0]._id, amount: 2 },
                    { product: products[1]._id, amount: 1 }
                ],
                status: "completed",
                company: companies[0]._id
            },
            {
                table: tables[1]._id,
                products: [
                    { product: products[2]._id, amount: 1 },
                    { product: products[3]._id, amount: 2 }
                ],
                status: "completed",
                company: companies[0]._id
            },
            {
                table: tables[2]._id,
                products: [
                    { product: products[1]._id, amount: 2 },
                    { product: products[0]._id, amount: 1 }
                ],
                status: "pending",
                company: companies[0]._id
            }
        ]);

        // Create sample bills
        await Bill.insertMany([
            {
                table: tables[0]._id,
                total: 2 * 2.5 + 1 * 10.0,
                method: "cash",
                status: "paid",
                company: companies[0]._id
            },
            {
                table: tables[1]._id,
                total: 1 * 2.5 + 2 * 15.0,
                method: "card",
                status: "paid",
                company: companies[0]._id
            },
            {
                table: tables[2]._id,
                total: 2 * 10.0 + 1 * 2.5,
                method: "cash",
                status: "paid",
                company: companies[0]._id
            }
        ]);

        console.log('✅ Database seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();