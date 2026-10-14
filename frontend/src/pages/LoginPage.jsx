import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Compass, Lock, Mail, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMsg('');
      await login(email, password);
      navigate('/explore');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail) => {
    try {
      setLoading(true);
      setErrorMsg('');
      await login(demoEmail, 'password123');
      navigate('/explore');
    } catch (err) {
      setErrorMsg(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-sky-400 p-0.5 shadow-glow flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Compass className="w-6 h-6 text-brand-400" />
              </div>
            </div>
          </Link>
          <h2 className="text-2xl font-black text-white">Welcome Back to TripSync</h2>
          <p className="text-xs text-slate-400 mt-1">
            Access multi-modal journeys, proof-of-travel telemetry, and offline guides.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 text-center">
            {errorMsg}
          </div>
        )}

        {/* Quick Demo Logins Bar */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block text-center">
            ⚡ Quick Demo Accounts (One-Click Sign In)
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin('traveler@tripsync.com')}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-white font-bold text-center transition-colors"
            >
              🧭 Traveler
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('ananya.creator@tripsync.com')}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-purple-300 font-bold text-center transition-colors"
            >
              📸 Creator
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('raghuraj.guide@tripsync.com')}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-emerald-300 font-bold text-center transition-colors"
            >
              🗺️ Local Expert
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@tripsync.com')}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-amber-300 font-bold text-center transition-colors"
            >
              👑 Admin Master
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-700/80 space-y-4 shadow-xl">
          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <Button type="submit" variant="primary" size="md" loading={loading} className="w-full py-3 font-bold mt-2 shadow-glow">
            Sign In to TripSync
          </Button>

          <p className="text-xs text-slate-400 text-center pt-2">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-brand-400 hover:underline font-bold">
              Register Free
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
