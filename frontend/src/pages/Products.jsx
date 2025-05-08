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
    <div className="p-8">
        <Navbar />
      <h1 className="text-3xl font-bold mb-6">Gestión de Productos</h1>

      <form onSubmit={handleSubmit} className="mb-8 bg-white p-4 rounded shadow max-w-md">
        <h2 className="text-xl font-semibold mb-4">Añadir Producto</h2>
        <input
          type="text"
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Precio"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        >
          <option value="food">Comida</option>
          <option value="drink">Bebida</option>
        </select>
        <input
          type="text"
          placeholder="Categoría"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <button className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">Guardar</button>
      </form>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <div key={p._id} className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold">{p.name}</h3>
            <p className="text-sm">Precio: {p.price} €</p>
            <p className="text-sm">Tipo: {p.type}</p>
            <p className="text-sm">Categoría: {p.category}</p>
            <button
              onClick={() => handleDelete(p._id)}
              className="mt-2 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;