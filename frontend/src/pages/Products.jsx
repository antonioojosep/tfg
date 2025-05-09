import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', type: 'food', category: '' });

  const fetchProducts = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await response.json();
    setProducts(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, price, type, category } = form;
    if (!name || !price || !category) {
      alert('Por favor, completa todos los campos.');
      return;
    }
    await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price, type, category }),
      credentials: 'include',
    });
    setForm({ name: '', price: '', type: 'food', category: '' });
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
    await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    setProducts(products.filter((p) => p._id !== id));
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
        </div>

        <div className="grid gap-8 md:grid-cols-12">
          {/* Formulario */}
          <form onSubmit={handleSubmit} className="md:col-span-4 bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Añadir Producto</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  placeholder="Nombre del producto"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="food">Comida</option>
                  <option value="drink">Bebida</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <input
                  type="text"
                  placeholder="Categoría"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-sm hover:shadow-md"
              >
                Guardar Producto
              </button>
            </div>
          </form>

          {/* Lista de productos */}
          <div className="md:col-span-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <div key={p._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">{p.name}</h3>
                  <span className="px-2 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                    {p.price} €
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600 flex items-center">
                    <span className="w-20 font-medium">Tipo:</span>
                    <span className="capitalize">{p.type}</span>
                  </p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <span className="w-20 font-medium">Categoría:</span>
                    <span className="capitalize">{p.category}</span>
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="w-full mt-4 px-4 py-2 bg-white border border-red-600 text-red-600 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2 transition-all flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;