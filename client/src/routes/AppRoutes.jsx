import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Home from '../pages/Home';
import MainHome from '../pages/MainHome';
import MovieDetails from '../pages/movieDetails';
import ShowSeat from '../pages/showSeat';
import MyBookings from '../components/MyBookings';
import Register from '../components/auth/Register';
import Login from '../components/auth/Login';
import ForgotPassword from '../components/auth/ForgotPassword';
import ResetPassword from '../components/auth/ResetPassword';

const isAuthenticated = () =>
  Boolean(localStorage.getItem('accessToken') || localStorage.getItem('token'));

function ProtectedRoute() {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/" replace />;
}

function PublicRoute() {
  return isAuthenticated() ? <Navigate to="/main-home" replace /> : <Outlet />;
}
function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forget" element={<ForgotPassword />} />
        <Route path="/reset" element={<ResetPassword />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/main-home" element={<MainHome />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/book-show/:id" element={<ShowSeat />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to={isAuthenticated() ? '/main-home' : '/'} replace />}
      />
    </Routes>
  );
}

export default AppRoutes;
