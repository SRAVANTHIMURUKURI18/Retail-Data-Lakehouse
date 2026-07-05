import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { Toast } from '../components/Toast';
import { Sparkles, Mail, Lock, Check, Loader2, Info } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');
  const [showForgotModal, setShowForgotModal] = useState(false);

  useEffect(() => {
    // If already logged in, redirect to dashboard
    const token = localStorage.getItem('auth_token');
    if (token) {
      navigate('/dashboard');
    }

    // Prepopulate email if remember me was enabled
    const savedEmail = localStorage.getItem('remember_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, [navigate]);

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please fill in all credentials.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await login(email, password);
      showToast('Login successful. Loading dashboard...', 'success');
      
      if (rememberMe) {
        localStorage.setItem('remember_email', email);
      } else {
        localStorage.removeItem('remember_email');
      }

      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    } catch (err) {
      showToast(err.message || 'Authentication failed. Please verify credentials.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-fabric-bg-dark transition-all duration-300">
      
      {/* Background decoration elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[20%] h-[80%] w-[60%] rounded-full bg-brand-blue/10 blur-[120px] dark:bg-brand-orange/5 animate-pulse-slow"></div>
        <div className="absolute -bottom-[30%] -right-[20%] h-[80%] w-[60%] rounded-full bg-brand-teal/10 blur-[120px] dark:bg-brand-yellow/5 animate-pulse-slow"></div>
      </div>

      {/* Glassmorphic Login Card */}
      <div className="z-10 w-full max-w-[420px] rounded-3xl border border-fabric-border-light/70 bg-white/70 p-8 shadow-2xl backdrop-blur-xl dark:border-fabric-border-dark/60 dark:bg-fabric-card-dark/40">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-teal dark:from-brand-orange dark:to-brand-yellow text-white shadow-xl shadow-brand-blue/20 dark:shadow-brand-orange/20">
            <Sparkles className="h-6 w-6 animate-pulse" />
          </div>
          <h2 className="mt-5 font-display text-2xl font-extrabold tracking-tight text-fabric-text-light dark:text-fabric-text-dark">
            Welcome back
          </h2>
          <p className="mt-1.5 font-sans text-xs font-semibold text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">
            RETAIL DATA LAKEHOUSE GATEWAY
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          {/* Email field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-xl border border-fabric-border-light bg-gray-50/50 py-3 pl-11 pr-4 text-xs font-medium text-fabric-text-light placeholder-gray-400 outline-none transition-all focus:border-brand-blue/50 focus:bg-white dark:border-fabric-border-dark dark:bg-fabric-bg-dark/40 dark:text-fabric-text-dark dark:focus:border-brand-orange/50 dark:focus:bg-fabric-bg-dark"
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs font-bold text-brand-blue hover:underline dark:text-brand-orange"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-fabric-border-light bg-gray-50/50 py-3 pl-11 pr-4 text-xs font-medium text-fabric-text-light placeholder-gray-400 outline-none transition-all focus:border-brand-blue/50 focus:bg-white dark:border-fabric-border-dark dark:bg-fabric-bg-dark/40 dark:text-fabric-text-dark dark:focus:border-brand-orange/50 dark:focus:bg-fabric-bg-dark"
                required
              />
            </div>
          </div>

          {/* Controls: Remember Me & Submit */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center space-x-2.5 cursor-pointer select-none">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="peer h-5 w-5 appearance-none rounded-lg border border-fabric-border-light bg-gray-50/50 checked:border-brand-blue checked:bg-brand-blue dark:border-fabric-border-dark dark:bg-fabric-bg-dark/40 dark:checked:border-brand-orange dark:checked:bg-brand-orange transition-all cursor-pointer"
                />
                <Check className="absolute h-3 w-3 text-white scale-0 peer-checked:scale-100 transition-transform pointer-events-none" />
              </div>
              <span className="text-xs font-semibold text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">
                Remember me
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center space-x-2 rounded-xl bg-brand-blue py-3.5 text-xs font-bold text-white shadow-lg shadow-brand-blue/10 hover:bg-brand-blue/90 dark:bg-brand-orange dark:shadow-brand-orange/10 dark:hover:bg-brand-orange/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In to Platform</span>
            )}
          </button>
        </form>

        {/* Dummy Creds Tip */}
        <div className="mt-8 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 p-3.5 border border-blue-100/50 dark:border-blue-900/40 flex items-start space-x-2.5">
          <Info className="h-4.5 w-4.5 text-brand-blue dark:text-brand-orange shrink-0 mt-0.5" />
          <div className="text-[11px] font-medium leading-relaxed text-blue-900/80 dark:text-blue-300">
            <span className="font-bold block">Developer Credentials:</span>
            Use any email and a password of at least 4 characters to log in (e.g. <code className="bg-white/60 dark:bg-black/30 px-1 rounded">admin@retail.com</code>).
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-[360px] rounded-2xl border border-fabric-border-light bg-fabric-card-light p-6 shadow-2xl dark:border-fabric-border-dark dark:bg-fabric-card-dark animate-scale-in">
            <h3 className="font-display text-base font-bold text-fabric-text-light dark:text-fabric-text-dark">Forgot Password?</h3>
            <p className="mt-2 text-xs leading-normal text-fabric-text-secondary-light dark:text-fabric-text-secondary-dark">
              Because this is a developer preview using mock authentication, password recovery is simulated. Simply enter any credentials on the login screen.
            </p>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowForgotModal(false)}
                className="rounded-lg bg-brand-blue dark:bg-brand-orange px-4 py-2 text-xs font-bold text-white shadow hover:opacity-90 transition-all"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast alert */}
      {toastMessage && (
        <Toast 
          message={toastMessage} 
          type={toastType} 
          onClose={() => setToastMessage(null)} 
        />
      )}
    </div>
  );
};
export default Login;
