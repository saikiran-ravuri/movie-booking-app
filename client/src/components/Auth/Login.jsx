import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginUser } from '../../api/users';

import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

function Login({ isModal = false, onCloseModal, onSwitchToSignUp, onSwitchToForgot }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
    if (successMsg) setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!formData.password) {
      setError('Please enter your password');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // call backend login user api
      const response = await LoginUser(formData);
      setLoading(false);

      if (response.success) {
        setSuccessMsg(response.message);
        // save logged-in user name in localStorage
        if (response.data) {
          localStorage.setItem('userName', response.data);
        }
        // fast smooth redirect on login success
        setTimeout(() => {
          if (onCloseModal) onCloseModal();
          navigate('/main-home');
        }, 300);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  const formContent = (
    <div className="w-full space-y-5">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 leading-tight text-center">
        Login
      </h1>

      {/* Error Alert */}
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Alert */}
      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Email Field */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@example.com"
            disabled={loading}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-950 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-950"
          />
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-700">
              Password
            </label>
            <button
              type="button"
              onClick={onSwitchToForgot}
              className="text-xs text-red-600 hover:underline font-medium cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={loading}
              className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-950 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-950"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              tabIndex="-1"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-white text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm disabled:opacity-60"
          >
            {loading ? 'Processing...' : 'Login'}
          </button>
        </div>
      </form>

      {/* Sign Up Option */}
      <div className="text-center text-xs text-slate-600 pt-1">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="font-semibold text-slate-950 hover:underline cursor-pointer"
        >
          Sign Up
        </button>
      </div>
    </div>
  );

  if (isModal) return formContent;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans flex items-center justify-center p-6 select-none">
      <div className="w-full max-w-sm bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xl text-left">
        {formContent}
      </div>
    </div>
  );
}

export default Login;
