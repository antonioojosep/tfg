import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-6">
      <h1 className="text-4xl font-bold mb-4">Bienvenido a RestaurantManager</h1>
      <p className="text-lg mb-6 text-center max-w-lg">
        Administra tu restaurante con facilidad. Control de ventas, comandas, personal y mucho más desde un solo lugar.
      </p>
      <button
        onClick={() => navigate('/login')}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Iniciar sesión
      </button>
    </div>
  );
};

export default Home;