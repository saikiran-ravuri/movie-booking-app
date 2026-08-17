import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Login from './Login.jsx';
import Register from './Register.jsx';
import ForgotPassword from './ForgotPassword.jsx';
import ResetPassword from './ResetPassword.jsx';

function AuthModal({ isOpen, onClose, initialView = 'login' }) {
  const [authView, setAuthView] = useState(initialView);

  useEffect(() => {
    setAuthView(initialView);
  }, [initialView, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm transition-all duration-300">

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Dynamic Auth Component Inside Modal */}
        {authView === 'login' && (
          <Login
            isModal={true}
            onCloseModal={onClose}
            onSwitchToSignUp={() => setAuthView('signup')}
            onSwitchToForgot={() => setAuthView('forget')}
          />
        )}

        {authView === 'signup' && (
          <Register
            isModal={true}
            onSwitchToLogin={() => setAuthView('login')}
          />
        )}

        {authView === 'forget' && (
          <ForgotPassword
            isModal={true}
            onCloseModal={onClose}
            onSwitchToLogin={() => setAuthView('login')}
            onSwitchToReset={() => setAuthView('reset')}
          />
        )}

        {authView === 'reset' && (
          <ResetPassword
            isModal={true}
            onCloseModal={onClose}
            onSwitchToLogin={() => setAuthView('login')}
          />
        )}

      </div>
    </div>
  );
}

export default AuthModal;
