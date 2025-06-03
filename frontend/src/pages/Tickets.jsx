import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

const Tickets = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBills = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bills`, {
        credentials: 'include',
      });
      const data = await response.json();
      setBills(data);
      setLoading(false);
    };
    fetchBills();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg">Cargando facturas...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 pt-24">
        <h1 className="text-3xl font-bold mb-8">Facturas</h1>
        <div className="bg-white rounded-xl shadow p-6">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="py-2 px-4 text-left">Mesa</th>
                <th className="py-2 px-4 text-left">Total</th>
                <th className="py-2 px-4 text-left">Método</th>
                <th className="py-2 px-4 text-left">Estado</th>
                <th className="py-2 px-4 text-left">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {bills.map(bill => (
                <tr key={bill._id} className="border-t">
                  <td className="py-2 px-4">{bill.table?.number || '-'}</td>
                  <td className="py-2 px-4">{bill.total.toFixed(2)} €</td>
                  <td className="py-2 px-4 capitalize">{bill.method}</td>
                  <td className="py-2 px-4 capitalize">{bill.status}</td>
                  <td className="py-2 px-4">{new Date(bill.createdAt).toLocaleString()}</td>
                </tr>
              ))}
              {bills.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-500">
                    No hay facturas registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Tickets;