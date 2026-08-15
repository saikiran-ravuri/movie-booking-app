import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/home';
import MainHome from '../pages/mainHome';
import MovieDetails from '../pages/movieDetails';
import Register from '../components/auth/Register';
import Login from '../components/auth/Login';

function AppRoutes() {
  return (
    <Routes>
      {/* home route */}
      <Route path="/" element={<Home />} />

      {/* main home dashboard page route */}
      <Route path="/main-home" element={<MainHome />} />

      {/* movie details page route */}
      <Route path="/movies/:id" element={<MovieDetails />} />

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

