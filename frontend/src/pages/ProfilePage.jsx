import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiAlertOctagon } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const [violations, setViolations] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/auth/profile');
        setViolations(data.violationsCount || 0);
        updateUser({ credibilityScore: data.credibilityScore });
      } catch (err) {
        console.error('Failed to fetch profile', err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="max-w-2xl mx-auto pt-24 px-4 pb-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500" />
        
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center text-4xl font-bold text-white mb-4 border-4 border-slate-700">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">{user?.username}</h1>
          <p className="text-slate-400 mb-8">{user?.email}</p>

          <div className="w-full bg-slate-900/50 rounded-xl p-6 border border-white/5 mb-6 text-center">
            <h3 className="text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Credibility Score</h3>
            <div className="flex items-end justify-center gap-2">
              <span className={`text-5xl font-black ${user?.credibilityScore > 75 ? 'text-emerald-400' : user?.credibilityScore > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                {user?.credibilityScore}
              </span>
              <span className="text-xl text-slate-500 font-medium pb-1">/ 100</span>
            </div>
            
            <div className="w-full bg-slate-800 rounded-full h-3 mb-2 mt-6 overflow-hidden">
              <div 
                className={`h-3 rounded-full ${user?.credibilityScore > 75 ? 'bg-emerald-400' : user?.credibilityScore > 40 ? 'bg-yellow-400' : 'bg-red-400'}`}
                style={{ width: `${user?.credibilityScore}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Maintain a high credibility score by keeping your interactions positive and safe.
            </p>
          </div>

          {/* Violation Counter */}
          <div className="w-full bg-red-500/5 rounded-xl p-5 border border-red-500/10 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-500/10 rounded-lg text-red-400">
                <FiAlertOctagon className="text-xl" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-medium text-slate-300">Policy Violations</h3>
                <p className="text-xs text-slate-500">Recorded instances of abusive language</p>
              </div>
            </div>
            <div className="text-3xl font-black text-red-400 tabular-nums">
              {violations}
            </div>
          </div>

          <button 
            onClick={logout}
            className="px-6 py-2.5 rounded-lg border border-red-500/50 text-red-400 font-medium hover:bg-red-500/10 transition-colors w-full"
          >
            Sign Out
          </button>
        </div>
      </motion.div>
    </div>
  );
}
