import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ForgetPasswordAPI } from '../../api/users';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

function ForgotPassword({ isModal = false, onCloseModal, onSwitchToLogin, onSwitchToReset }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      const response = await ForgetPasswordAPI({ email });
      setLoading(false);

      if (response.success) {
        setSuccessMsg(response.message || 'OTP sent successfully!');
        setTimeout(() => {
          if (onSwitchToReset) {
            onSwitchToReset();
          } else {
            navigate('/reset');
          }
        }, 300);
      } else {
        setError(response.message || 'Failed to send OTP');
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Something went wrong');
    }
  };

  const formContent = (
    <div className="w-full space-y-5">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 leading-tight text-center">
        Forgot Password
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
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            placeholder="name@example.com"
            disabled={loading}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-950 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-950"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-white text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm disabled:opacity-60"
          >
            {loading ? 'Processing...' : 'Send OTP'}
          </button>
        </div>
      </form>

      {/* Login Option */}
      <div className="text-center text-xs text-slate-600 pt-1">
        Remembered your password?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin ? onSwitchToLogin : () => navigate('/login')}
          className="font-semibold text-slate-950 hover:underline cursor-pointer"
        >
          Login
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

export default ForgotPassword;
