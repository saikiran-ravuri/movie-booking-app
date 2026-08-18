import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/home';
import MainHome from '../pages/mainHome';
import MovieDetails from '../pages/movieDetails';
import ShowSeat from '../pages/showSeat';
import MyBookings from '../components/MyBookings';
import Register from '../components/auth/Register';
import Login from '../components/auth/Login';
import ForgotPassword from '../components/auth/ForgotPassword';
import ResetPassword from '../components/auth/ResetPassword';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/main-home"
        element={
          <ProtectedRoute>
            <MainHome />
          </ProtectedRoute>
        }
      />

      <Route path="/movies/:id" element={<MovieDetails />} />

      <Route
        path="/book-show/:id"
        element={
          <ProtectedRoute>
            <ShowSeat />
          </ProtectedRoute>
        }
      />

      <Route path="/my-bookings" element={<MyBookings />} />

      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forget" element={<ForgotPassword />} />
      <Route path="/reset" element={<ResetPassword />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
