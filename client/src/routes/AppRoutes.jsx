import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home.jsx';
import Register from '../components/Register.jsx';
import Login from '../components/Login.jsx';

function AppRoutes() {
  return (
    <Routes>
      {/* home route */}
      <Route path="/" element={<Home />} />

      {/* register page route */}
      <Route path="/register" element={<Register />} />

      {/* login page route */}
      <Route path="/login" element={<Login />} />

      {/* fallback route */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default AppRoutes;
