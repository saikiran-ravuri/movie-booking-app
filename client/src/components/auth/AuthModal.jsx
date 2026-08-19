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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 transition-opacity">
      <div className="relative overflow-hidden w-full max-w-[clamp(280px,90vw,440px)] bg-white border border-slate-200 rounded-3xl p-[clamp(1rem,2.5vw,2rem)] shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-xl text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>

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
