import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import Navbar from '../components/Navbar';

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-xl shadow p-6">
    <div className="flex items-center">
      <div className={`p-3 rounded-full ${color}`}>
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [dailySales, setDailySales] = useState(null);
  const [monthlySales, setMonthlySales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dailyRes, monthlyRes, topRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/stats/sales`, { credentials: 'include' }),
          fetch(`${import.meta.env.VITE_API_URL}/api/stats/sales-monthly`, { credentials: 'include' }),
          fetch(`${import.meta.env.VITE_API_URL}/api/stats/top-products`, { credentials: 'include' })
        ]);

        const [dailyData, monthlyData, topData] = await Promise.all([
          dailyRes.json(),
          monthlyRes.json(),
          topRes.json()
        ]);

        setDailySales(dailyData);
        setMonthlySales(monthlyData);
        setTopProducts(topData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const chartCustomization = {
    style: {
      backgroundColor: '#fff',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    },
    colors: {
      primary: '#2563eb',
      secondary: '#10b981',
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          {dailySales && (
            <>
              <StatCard
                title="Ventas Hoy"
                value={`${dailySales.totalSales.toFixed(2)} €`}
                icon={
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                color="bg-blue-50"
              />
              <StatCard
                title="Número de Facturas"
                value={dailySales.count}
                icon={
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
                color="bg-green-50"
              />
            </>
          )}
        </div>

        <div className="grid gap-6 mb-8 lg:grid-cols-2">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Ventas Mensuales</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlySales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke={chartCustomization.colors.primary}
                    strokeWidth={2}
                    dot={{ fill: chartCustomization.colors.primary }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Productos</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="nombre" 
                    stroke="#6B7280"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Bar 
                    dataKey="cantidadVendida" 
                    fill={chartCustomization.colors.secondary}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;