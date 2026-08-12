import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home.jsx';
import MainHome from '../pages/MainHome.jsx';
import Register from '../components/Auth/Register.jsx';
import Login from '../components/Auth/Login.jsx';

function AppRoutes() {
  return (
    <Routes>
      {/* home route */}
      <Route path="/" element={<Home />} />

      {/* main home dashboard page route */}
      <Route path="/main-home" element={<MainHome />} />

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
