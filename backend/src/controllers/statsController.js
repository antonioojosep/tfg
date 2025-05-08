import Bill from "../models/bill.js";
import Command from "../models/command.js";

// 🗓 Ingresos de hoy
export const getDailySales = async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const result = await Bill.aggregate([
      { $match: { createdAt: { $gte: today }, status: "paid" } },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$total" },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(result[0] || { totalSales: 0, count: 0 });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener ventas diarias" });
  }
};

// 📅 Ingresos por mes (últimos 6 meses)
export const getMonthlySales = async (req, res) => {
  try {
    const result = await Bill.aggregate([
      { $match: { status: "paid" } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          total: { $sum: "$total" }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 6 }
    ]);

    res.json(result.reverse());
  } catch (error) {
    res.status(500).json({ error: "Error al obtener ventas mensuales" });
  }
};

// 🍔 Top productos más vendidos
export const getTopProducts = async (req, res) => {
  try {
    const result = await Command.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.product",
          cantidadVendida: { $sum: "$products.amount" }
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "producto"
        }
      },
      { $unwind: "$producto" },
      {
        $project: {
          nombre: "$producto.name",
          cantidadVendida: 1,
          precio: "$producto.price",
          totalIngresos: {
            $multiply: ["$cantidadVendida", "$producto.price"]
          }
        }
      },
      { $sort: { cantidadVendida: -1 } },
      { $limit: 10 }
    ]);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos más vendidos" });
  }
};
