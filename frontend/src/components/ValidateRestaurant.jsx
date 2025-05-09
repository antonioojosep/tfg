import React, { useState, useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';

const Window = () => {
  const [isValidRestaurant, setIsValidRestaurant] = useState(false);
  const { restaurant } = useParams();

  useEffect(() => {
    const validateRestaurant = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/company/${restaurant}`,
          { credentials: 'include' }
        );
        setIsValidRestaurant(response.ok);
      } catch (error) {
        setIsValidRestaurant(false);
      }
    };

    validateRestaurant();
  }, [restaurant]);

  if (!isValidRestaurant) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Restaurante no encontrado
          </h2>
          <p className="mt-2 text-gray-600">
            Por favor verifica la URL o contacta al administrador.
          </p>
        </div>
      </div>
    );
  }

  if (isValidRestaurant === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800">Cargando...</h2>
          <p className="mt-2 text-gray-600">
            Por favor espera mientras verificamos la información.
          </p>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default Window;