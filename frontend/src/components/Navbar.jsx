// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/user/logout`, {
      method: 'GET',
      credentials: 'include',
    });
    navigate('/home');
  };

  return (
    <nav className="bg-blue-600 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-white text-xl font-semibold">
          Dashboard
        </Link>
        <div className="space-x-4 flex items-center">
          <Link to="/products" className="text-white text-lg">
            Productos
          </Link>
          <Link to="/staff" className="text-white text-lg">
            Personal
          </Link>
          <button
            onClick={handleLogout}
            className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
