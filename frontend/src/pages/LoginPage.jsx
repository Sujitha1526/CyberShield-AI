import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShieldOff, FiAlertOctagon, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function SuspendedModal({ onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.85, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.85, y: 30 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          className="w-full max-w-sm bg-[#0F1525] border-2 border-red-600/70 rounded-2xl shadow-[0_0_60px_rgba(220,38,38,0.25)] overflow-hidden"
        >
          {/* Red gradient header bar */}
          <div className="w-full h-1.5 bg-gradient-to-r from-red-700 via-red-500 to-rose-400" />

          <div className="p-8 flex flex-col items-center text-center">
            {/* Icon */}
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-red-600/20 blur-2xl scale-150" />
              <div className="relative w-16 h-16 rounded-full bg-red-600/10 border border-red-600/40 flex items-center justify-center">
                <FiShieldOff className="text-red-400 text-3xl" />
              </div>
            </div>

            <h3 className="text-2xl font-black text-white mb-1">Account Suspended</h3>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-red-500 mb-4">
              <FiAlertOctagon className="text-sm" />
              Access Permanently Revoked
            </div>

            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Your account has been <span className="text-red-400 font-semibold">suspended by an administrator</span> due to multiple violations of our community guidelines. You are no longer permitted to access this platform.
            </p>

            <div className="w-full p-3 bg-red-950/50 border border-red-800/40 rounded-lg text-xs text-red-300 leading-relaxed mb-6">
              If you believe this is a mistake, please contact support at <span className="font-medium text-red-200">support@cybershield.ai</span>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-lg bg-red-600/20 border border-red-600/40 text-red-300 font-semibold hover:bg-red-600/30 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [suspended, setSuspended] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const justRegistered = location.state?.registered === true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      login(data, data.token);
      navigate(data.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      const errData = err.response?.data;
      if (errData?.error === 'account_suspended') {
        setSuspended(true);
      } else {
        setError(errData?.error || 'Failed to login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {suspended && <SuspendedModal onClose={() => setSuspended(false)} />}

      <div className="min-h-[80vh] flex items-center justify-center pt-20 pb-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue to-neon-purple shadow-[0_0_15px_rgba(0,240,255,0.8)]" />
            
            <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              Welcome Back
            </h2>

            {justRegistered && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-emerald-300 text-sm text-center flex items-center justify-center gap-2"
              >
                <FiCheckCircle className="text-emerald-400 text-base shrink-0" />
                Account created successfully! Please log in to continue.
              </motion.div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon-blue transition-colors"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon-blue transition-colors"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple text-white font-medium hover:opacity-90 transition-opacity flex justify-center items-center"
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </form>

            <p className="mt-6 text-center text-slate-400 text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-neon-blue hover:text-neon-purple transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
