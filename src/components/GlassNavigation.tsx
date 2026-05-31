import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MessageCircle, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function GlassNavigation() {
  const { user, isAuthenticated, logout, getDashboardPath } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password'].includes(location.pathname);

  if (isAuthPage) return null;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ${scrolled ? 'shadow-glow-strong' : ''}`}>
      <div className="glass-nav h-full border-b border-outline-variant/15">
        <div className="flex items-center justify-between h-full px-4 lg:px-6 max-w-[1440px] mx-auto">
          {/* Logo */}
          <Link to={isAuthenticated ? getDashboardPath() : '/'} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center">
              <span className="text-on-surface font-bold text-sm">D</span>
            </div>
            <span className="text-on-surface font-semibold text-lg hidden sm:block">DesignConnect</span>
          </Link>

          {/* Desktop Nav Links */}
          {isAuthenticated && (
            <div className="hidden lg:flex items-center gap-1">
              {user?.role === 'designer' && (
                <>
                  <NavLink to="/designer/dashboard" label="Dashboard" />
                  <NavLink to="/designer/portfolio" label="Portfolio" />
                  <NavLink to="/designer/requests" label="Requests" />
                </>
              )}
              {user?.role === 'client' && (
                <>
                  <NavLink to="/client/dashboard" label="Dashboard" />
                  <NavLink to="/client/browse" label="Browse" />
                  <NavLink to="/client/requests" label="Requests" />
                </>
              )}
              {user?.role === 'admin' && (
                <>
                  <NavLink to="/admin/dashboard" label="Dashboard" />
                  <NavLink to="/admin/disputes" label="Disputes" />
                  <NavLink to="/admin/users" label="Users" />
                </>
              )}
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link to="/chat" className="icon-btn relative">
                  <MessageCircle size={20} />
                </Link>
                <Link to="/notifications" className="icon-btn relative">
                  <Bell size={20} />
                </Link>
                <div className="relative">
                  <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 pl-2">
                    <img src={user?.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-outline/20" />
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-12 w-56 bg-surface-highest rounded-2xl shadow-modal p-2 border border-outline-variant/15"
                      >
                        <div className="px-3 py-2 border-b border-outline-variant/15 mb-1">
                          <p className="text-on-surface font-medium text-sm">{user?.name}</p>
                          <p className="text-on-surface-variant text-xs">{user?.email}</p>
                        </div>
                        <Link to="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-high transition-colors text-sm text-on-surface">
                          <User size={16} /> Profile Settings
                        </Link>
                        <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-error/10 transition-colors text-sm text-error w-full">
                          <LogOut size={16} /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="hidden sm:block px-4 py-2 text-sm text-on-surface hover:text-primary transition-colors">Login</Link>
                <Link to="/register" className="btn-primary px-4 py-2 rounded-full text-sm font-semibold">Get Started</Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden icon-btn">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-16 z-40 bg-background/95 backdrop-blur-lg lg:hidden"
          >
            <div className="flex flex-col p-6 gap-2">
              {!isAuthenticated ? (
                <>
                  <MobileLink to="/" label="Home" />
                  <MobileLink to="/login" label="Login" />
                  <MobileLink to="/register" label="Get Started" />
                  <MobileLink to="/about" label="About" />
                  <MobileLink to="/contact" label="Contact" />
                </>
              ) : (
                <>
                  {user?.role === 'designer' && (
                    <>
                      <MobileLink to="/designer/dashboard" label="Dashboard" />
                      <MobileLink to="/designer/portfolio" label="Portfolio" />
                      <MobileLink to="/designer/requests" label="Requests" />
                      <MobileLink to="/designer/earnings" label="Earnings" />
                    </>
                  )}
                  {user?.role === 'client' && (
                    <>
                      <MobileLink to="/client/dashboard" label="Dashboard" />
                      <MobileLink to="/client/browse" label="Browse Designers" />
                      <MobileLink to="/client/requests" label="My Requests" />
                    </>
                  )}
                  <MobileLink to="/chat" label="Messages" />
                  <MobileLink to="/notifications" label="Notifications" />
                  <MobileLink to="/settings" label="Settings" />
                  <button onClick={logout} className="text-left px-4 py-3 text-error rounded-lg hover:bg-error/10 transition-colors">Sign Out</button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavLink({ to, label }: { to: string; label: string }) {
  const location = useLocation();
  const active = location.pathname === to || location.pathname.startsWith(to + '/');
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
        active ? 'bg-surface-high text-primary' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface'
      }`}
    >
      {label}
    </Link>
  );
}

function MobileLink({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className="px-4 py-3 text-on-surface rounded-lg hover:bg-surface transition-colors">
      {label}
    </Link>
  );
}
