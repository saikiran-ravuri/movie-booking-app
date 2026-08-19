import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResetPasswordAPI } from '../../api/users';
import { Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

function ResetPassword({ isModal = false, onCloseModal, onSwitchToLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    otp: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
    if (successMsg) setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.otp.trim()) {
      setError('Please enter the OTP');
      return;
    }
    if (!formData.password) {
      setError('Please enter a new password');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await ResetPasswordAPI({
        otp: formData.otp,
        password: formData.password
      });
      setLoading(false);

      if (response.success) {
        setSuccessMsg(response.message || 'Password reset successfully!');
        setTimeout(() => {
          if (onCloseModal) onCloseModal();
          if (onSwitchToLogin) {
            onSwitchToLogin();
          } else {
            navigate('/login');
          }
        }, 300);
      } else {
        setError(response.message || 'Failed to reset password');
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Something went wrong');
    }
  };

  const formContent = (
    <div className="w-full space-y-[clamp(0.75rem,1.5vw,1.25rem)] text-left">
      <h1 className="text-[clamp(1.1rem,1.8vw,1.5rem)] font-extrabold tracking-tight text-slate-950 text-center">
        Reset Password
      </h1>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-[clamp(0.6rem,1.2vw,1rem)]">
        <div>
          <label className="block text-[clamp(0.65rem,0.8vw,0.75rem)] font-semibold text-slate-700 mb-1.5 text-left">
            OTP Code
          </label>
          <input
            type="text"
            name="otp"
            value={formData.otp}
            onChange={handleChange}
            placeholder="Enter OTP"
            disabled={loading}
            className="w-full px-3.5 py-[clamp(0.45rem,0.8vw,0.625rem)] bg-white border border-slate-200 rounded-xl text-[clamp(0.75rem,0.9vw,0.875rem)] font-medium text-slate-950 placeholder-slate-400 focus:outline-none focus:border-slate-950 transition-colors text-left"
          />
        </div>

        <div>
          <label className="block text-[clamp(0.65rem,0.8vw,0.75rem)] font-semibold text-slate-700 mb-1.5 text-left">
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
              className="w-full pl-3.5 pr-10 py-[clamp(0.45rem,0.8vw,0.625rem)] bg-white border border-slate-200 rounded-xl text-[clamp(0.75rem,0.9vw,0.875rem)] font-medium text-slate-950 placeholder-slate-400 focus:outline-none focus:border-slate-950 transition-colors"
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

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[clamp(2.25rem,2.75vw,2.75rem)] px-5 rounded-xl bg-white border border-slate-300 hover:border-slate-600 text-slate-950 text-[clamp(0.68rem,0.85vw,0.875rem)] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer hover:bg-slate-50 disabled:opacity-60 group/btn shadow-xs"
          >
            <span>{loading ? 'Resetting...' : 'Reset Password'}</span>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </form>

      <div className="text-center text-[clamp(0.65rem,0.8vw,0.75rem)] font-medium text-slate-600 pt-1">
        Remembered your password?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin ? onSwitchToLogin : () => navigate('/login')}
          className="font-bold text-slate-950 hover:underline cursor-pointer"
        >
          Login
        </button>
      </div>
    </div>
  );

  if (isModal) return formContent;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans flex items-center justify-center p-6 select-none">
      <div className="relative overflow-hidden w-full max-w-[clamp(280px,90vw,440px)] bg-white border border-slate-200 rounded-3xl p-[clamp(1.25rem,2.5vw,2rem)] shadow-2xl text-left">
        {formContent}
      </div>
    </div>
  );
}

export default ResetPassword;