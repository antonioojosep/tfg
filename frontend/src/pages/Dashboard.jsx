import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [dailySales, setDailySales] = useState(null);
  const [monthlySales, setMonthlySales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const dailyResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/stats/sales`, {
            method: 'GET',
            credentials: 'include',
            });
            const dailyData = await dailyResponse.json();
            setDailySales(dailyData);
    
            const monthlyResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/stats/sales-monthly`, {
            method: 'GET',
            credentials: 'include',
            });
            const monthlyData = await monthlyResponse.json();
            setMonthlySales(monthlyData);
    
            const topProductsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/stats/top-products`, {
            method: 'GET',
            credentials: 'include',
            });
            const topProductsData = await topProductsResponse.json();
            setTopProducts(topProductsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    fetchData();
  }, []);

  return (
    <div className="p-8">
        <Navbar />
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Ventas Diarias</h2>
        {dailySales && (
          <div className="bg-white p-4 shadow rounded">
            <p>Total: <strong>{dailySales.totalSales.toFixed(2)} €</strong></p>
            <p>Facturas: <strong>{dailySales.count}</strong></p>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Ventas Mensuales</h2>
        <div className="bg-white p-4 shadow rounded h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Top Productos Vendidos</h2>
        <div className="bg-white p-4 shadow rounded h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topProducts}>
              <XAxis dataKey="nombre" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cantidadVendida" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;