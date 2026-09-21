import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, Mail, Lock, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      const serverMessage = err.response?.data?.error;
      const networkMessage = (!err.response || err.code === 'ERR_NETWORK' || err.response?.status >= 500)
        ? 'Cannot connect to server. Please verify the backend server is running.'
        : 'Invalid email or password. Try a Demo account below.';
      setError(serverMessage || networkMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role) => {
    setLoading(true);
    setError(null);
    try {
      await demoLogin(role);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError('Demo login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl">
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center text-white mx-auto shadow-md shadow-brand-500/20">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="mt-4 text-2xl font-black text-slate-900 font-display tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Sign in to access your bookings and travel preferences
          </p>
        </div>

        {/* 1-Click Demo Login Bar */}
        <div className="p-3.5 rounded-2xl bg-brand-50/60 border border-brand-200/70 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-brand-700">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Instant Demo Sign-In (No signup needed)</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleDemo('user')}
              className="py-1.5 px-2 bg-white hover:bg-brand-100/50 text-slate-800 text-[11px] font-bold rounded-xl border border-brand-200 transition-colors"
            >
              Traveler
            </button>
            <button
              type="button"
              onClick={() => handleDemo('guide_partner')}
              className="py-1.5 px-2 bg-white hover:bg-brand-100/50 text-slate-800 text-[11px] font-bold rounded-xl border border-brand-200 transition-colors"
            >
              Local Guide
            </button>
            <button
              type="button"
              onClick={() => handleDemo('admin')}
              className="py-1.5 px-2 bg-white hover:bg-brand-100/50 text-slate-800 text-[11px] font-bold rounded-xl border border-brand-200 transition-colors"
            >
              Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-3 pl-10 text-slate-800 focus:outline-none focus:border-brand-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700">Password</label>
              <span className="text-[11px] text-brand-600 hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-3 pl-10 text-slate-800 focus:outline-none focus:border-brand-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Sign In to Wanderlust'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-brand-600 hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
