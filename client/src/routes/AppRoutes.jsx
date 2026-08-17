import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/home';
import MainHome from '../pages/mainHome';
import MovieDetails from '../pages/movieDetails';
import ShowSeat from '../pages/showSeat';
import Register from '../components/auth/Register';
import Login from '../components/auth/Login';
import ForgotPassword from '../components/auth/ForgotPassword';
import ResetPassword from '../components/auth/ResetPassword';

// protected route: redirects to home page if user is not logged in
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* public home route */}
      <Route path="/" element={<Home />} />

      {/* protected main home dashboard route */}
      <Route
        path="/main-home"
        element={
          <ProtectedRoute>
            <MainHome />
          </ProtectedRoute>
        }
      />

      {/*protected movie details route */}
      <Route path="/movies/:id" element={<MovieDetails />} />

      {/* protected seat booking route */}
      <Route
        path="/book-show/:id"
        element={
          <ProtectedRoute>
            <ShowSeat />
          </ProtectedRoute>
        }
      />

      {/* register page route */}
      <Route path="/register" element={<Register />} />

      {/* login page route */}
      <Route path="/login" element={<Login />} />

      {/* forgot password page route */}
      <Route path="/forget" element={<ForgotPassword />} />

      {/* reset password page route */}
      <Route path="/reset" element={<ResetPassword />} />

      {/* fallback route: redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
