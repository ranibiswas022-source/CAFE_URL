// src/components/Navbar.tsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Search, User, Coffee, X, Menu, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { itemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [prevPath, setPrevPath] = useState(location.pathname);
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setMobileOpen(false);
  }

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-bg/95 backdrop-blur-xl border-b border-border shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center
                            group-hover:bg-gold/20 transition-colors duration-300">
              <Coffee size={18} className="text-gold" />
            </div>
            <div className="leading-tight">
              <div className="text-white font-serif font-bold text-base tracking-wide">Bean & Brew</div>
              <div className="text-[10px] text-textSecondary tracking-[0.15em] uppercase">Coffee · Food · Good Vibes</div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors duration-200 relative group ${
                  isActive(link.to) ? 'text-white' : 'text-textSecondary hover:text-white'
                }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-gold"
                  />
                )}
                <div className="absolute -bottom-1 left-0 right-0 h-px bg-gold/40 scale-x-0 group-hover:scale-x-100
                                transition-transform duration-200 origin-left" />
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Search */}
            <button
              id="search-btn"
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-9 h-9 flex items-center justify-center text-textSecondary hover:text-white
                         hover:bg-white/5 rounded-sm transition-colors duration-200"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              id="cart-btn"
              className="relative w-9 h-9 flex items-center justify-center text-textSecondary hover:text-white
                         hover:bg-white/5 rounded-sm transition-colors duration-200"
              aria-label={`Cart (${itemCount} items)`}
            >
              <ShoppingCart size={18} />
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-gold text-espresso text-[10px]
                             font-bold rounded-full flex items-center justify-center min-w-[18px] min-h-[18px]
                             px-1 text-center leading-none"
                >
                  {itemCount > 9 ? '9+' : itemCount}
                </motion.span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/orders" className="flex items-center gap-2 text-sm text-textSecondary hover:text-white
                                              transition-colors duration-200">
                  <User size={16} />
                  <span className="max-w-[80px] truncate">{user?.name?.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-textSecondary hover:text-red-400 transition-colors duration-200"
                  aria-label="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                id="login-btn"
                className="hidden md:inline-flex btn-primary py-2 px-4 text-xs"
              >
                Login / Sign Up
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center text-textSecondary hover:text-white
                         hover:bg-white/5 rounded-sm transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-border"
            >
              <div className="py-3 flex items-center gap-3">
                <Search size={16} className="text-textSecondary flex-shrink-0" />
                <input
                  id="search-input"
                  type="text"
                  placeholder="Search for coffee, food..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      window.location.href = `/menu?search=${encodeURIComponent(searchQuery)}`;
                    }
                    if (e.key === 'Escape') setSearchOpen(false);
                  }}
                  className="flex-1 bg-transparent text-white placeholder-textSecondary text-sm focus:outline-none"
                  autoFocus
                />
                <button onClick={() => setSearchOpen(false)} className="text-textSecondary hover:text-white">
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-bg/98 backdrop-blur-xl border-b border-border"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`py-3 px-4 rounded-sm text-sm font-medium transition-colors duration-200 ${
                    isActive(link.to)
                      ? 'text-white bg-surface'
                      : 'text-textSecondary hover:text-white hover:bg-surface/50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-border mt-2">
                {isAuthenticated ? (
                  <div className="flex items-center justify-between px-4">
                    <Link to="/orders" className="text-sm text-textSecondary">{user?.name}</Link>
                    <button onClick={logout} className="text-sm text-red-400">Logout</button>
                  </div>
                ) : (
                  <Link to="/login" className="btn-primary w-full justify-center">
                    Login / Sign Up
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
