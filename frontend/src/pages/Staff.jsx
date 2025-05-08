import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const Staff = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: '', password: '', role: 'waiter' });

  const fetchUsers = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/list`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await response.json();
    setUsers(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password, role } = form;
    if (!username || !password) {
      alert('Por favor, completa todos los campos.');
      return;
    }
    await fetch(`${import.meta.env.VITE_API_URL}/api/user/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
        credentials: 'include',
    });
    setForm({ username: '', password: '', role: 'waiter' });
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;
    await fetch(`${import.meta.env.VITE_API_URL}/api/user/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    setUsers(users.filter((u) => u._id !== id));
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-8">
        <Navbar />
      <h1 className="text-3xl font-bold mb-6">Gestión de Personal</h1>

      <form onSubmit={handleSubmit} className="mb-8 bg-white p-4 rounded shadow max-w-md">
        <h2 className="text-xl font-semibold mb-4">Añadir Empleado</h2>
        <input
          type="text"
          placeholder="Usuario"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="admin">Administrador</option>
          <option value="manager">Encargado</option>
          <option value="waiter">Camarero</option>
        </select>
        <button className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">Guardar</button>
      </form>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((u) => (
          <div key={u._id} className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold">{u.username}</h3>
            <p className="text-sm">Rol: {u.role}</p>
            <button
              onClick={() => handleDelete(u._id)}
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

export default Staff;