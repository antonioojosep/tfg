import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Staff from './pages/Staff';
import Window from './pages/Window';
import './index.css';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
        <Route path="/staff" element={<PrivateRoute><Staff /></PrivateRoute>} />
        <Route path='/window' element={<PrivateRoute><Window /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
  )
}

export default App;