import Bill from '../models/bill.js';
import Command from '../models/command.js';

export const getDailyStats = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = {
        totalSales: 0,
        cashPayments: 0,
        cardPayments: 0,
        averageTicket: 0,
        totalCommands: 0
    };

    // Obtener facturas del día
    const bills = await Bill.find({
        createdAt: { $gte: today },
        status: "paid"
    });

    stats.totalSales = bills.reduce((sum, bill) => sum + bill.total, 0);
    stats.cashPayments = bills.filter(b => b.method === "cash").length;
    stats.cardPayments = bills.filter(b => b.method === "card").length;
    stats.averageTicket = bills.length ? stats.totalSales / bills.length : 0;
    
    // Obtener comandas del día
    stats.totalCommands = await Command.countDocuments({
        createdAt: { $gte: today }
    });

    return stats;
};