import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiShield, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const getNavItems = () => {
    if (!user) {
      return [
        { label: 'Home',      to: '/' },
        { label: 'Detection', to: '/detect' },
        { label: 'About',     to: '/about' },
      ];
    }
    
    if (user.role === 'admin') {
      return [
        { label: 'Admin HQ',  to: '/admin' },
        { label: 'Community', to: '/feed' },
        { label: 'Chat',      to: '/chat' },
      ];
    }

    return [
      { label: 'Dashboard', to: '/dashboard' },
      { label: 'Feed',      to: '/feed' },
      { label: 'Chat',      to: '/chat' },
      { label: 'Profile',   to: '/profile' },
      { label: 'Detection', to: '/detect' },
    ];
  };

  const currentNavItems = getNavItems();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0D0F1E]/95 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group" id="nav-logo">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-neon group-hover:scale-105 transition-transform">
            <FiShield className="text-white text-base" />
          </div>
          <span className="font-black text-lg tracking-tight text-white">
            Cyber<span className="gradient-text">Shield</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {currentNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              id={`nav-${item.label.toLowerCase()}`}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-neon-blue bg-neon-blue/10'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.06]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:block">
          {!user ? (
            <div className="flex gap-2">
              <Link to="/login" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Log In
              </Link>
              <Link to="/signup" className="btn-primary text-sm py-2 px-5 bg-gradient-to-r from-neon-blue to-neon-purple border-none">
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400">
                Hi, <span className="text-white font-semibold">{user.username}</span>
              </span>
              <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition-colors p-2" title="Log Out">
                <FiLogOut className="text-lg" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          id="nav-mobile-toggle"
          className="md:hidden text-slate-400 hover:text-white transition-colors p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-white/[0.06] bg-[#0D0F1E]/98 backdrop-blur-xl px-6 py-4 space-y-1"
          >
            {currentNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-neon-blue bg-neon-blue/10'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.06]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="pt-3 flex flex-col gap-2">
              {!user ? (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-sm text-center text-slate-300">
                    Log In
                  </Link>
                  <Link to="/signup" onClick={() => setMenuOpen(false)} className="btn-primary w-full text-sm bg-gradient-to-r from-neon-blue to-neon-purple border-none">
                    Sign Up
                  </Link>
                </>
              ) : (
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-red-400 flex items-center gap-2">
                  <FiLogOut /> Log Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
