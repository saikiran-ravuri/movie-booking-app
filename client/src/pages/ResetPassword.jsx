import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

function ResetPassword() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
    if (successMsg) setSuccessMsg('');
  };

  const validateForm = () => {
    if (!formData.password) {
      setError('Please enter a new password');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      setSuccessMsg('Password reset successfully!');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans flex items-center justify-center p-6 select-none">
      <div className="w-full max-w-sm bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xl text-left space-y-5">
        
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 leading-tight text-center">
          Reset Password
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
          
          {/* New Password Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              New Password
            </label>
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

          {/* Confirm Password Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={loading}
                className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-950 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-950"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                tabIndex="-1"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
              {loading ? 'Processing...' : 'Reset Password'}
            </button>
          </div>
        </form>

        {/* Login Option */}
        <div className="text-center text-xs text-slate-600 pt-1">
          Remembered your password?{' '}
          <a
            href="#login"
            onClick={(e) => e.preventDefault()}
            className="font-semibold text-slate-950 hover:underline cursor-pointer"
          >
            Login
          </a>
        </div>

      </div>
    </div>
  );
}

export default ResetPassword;
