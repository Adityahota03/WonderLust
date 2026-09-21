import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, Calendar, User, LogOut, Menu, X, Hotel, Plane, MapPin, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout, demoLogin } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleQuickDemo = async () => {
    try {
      await demoLogin('user');
      navigate('/bookings');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3'
          : 'bg-white/70 backdrop-blur-sm py-4 border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <span className="text-xl font-bold font-display tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                WANDERLUST
              </span>
              <span className="hidden sm:inline-block ml-1.5 px-1.5 py-0.5 text-[10px] font-semibold bg-brand-50 text-brand-700 rounded-md border border-brand-200/60 uppercase tracking-wider">
                Travel Hub
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/60 text-sm font-medium">
            <Link
              to="/search?type=hotel"
              className={`px-3.5 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                location.pathname === '/search' && location.search.includes('type=hotel')
                  ? 'bg-white text-brand-600 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Hotel className="w-4 h-4" />
              Hotels
            </Link>
            <Link
              to="/search?type=ticket"
              className={`px-3.5 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                location.pathname === '/search' && location.search.includes('type=ticket')
                  ? 'bg-white text-brand-600 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Plane className="w-4 h-4" />
              Transport
            </Link>
            <Link
              to="/search?type=guide"
              className={`px-3.5 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                location.pathname === '/search' && location.search.includes('type=guide')
                  ? 'bg-white text-brand-600 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <MapPin className="w-4 h-4" />
              Local Guides
            </Link>
            <Link
              to="/about"
              className={`px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                location.pathname === '/about'
                  ? 'bg-white text-brand-600 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                location.pathname === '/contact'
                  ? 'bg-white text-brand-600 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right Action Menu */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-3 rounded-full bg-slate-100 hover:bg-slate-200/80 transition-colors border border-slate-200 text-sm font-medium"
                >
                  <span className="text-slate-700">{user?.name?.split(' ')[0]}</span>
                  <img
                    src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                    alt={user?.name}
                    className="w-7 h-7 rounded-full object-cover border border-brand-500 bg-white"
                  />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-medium text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold uppercase rounded-full bg-brand-50 text-brand-600 border border-brand-200">
                        {user?.role}
                      </span>
                    </div>

                    <Link
                      to="/bookings"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Calendar className="w-4 h-4 text-brand-600" />
                      My Bookings & Trips
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors border-t border-slate-100"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleQuickDemo}
                  title="One-click test as Demo Traveler"
                  className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Quick Demo User
                </button>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-full text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-full text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-500/20 transition-all hover:shadow-md"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-3 gap-2 pb-3 border-b border-slate-100">
            <Link
              to="/search?type=hotel"
              className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-slate-50 text-xs font-medium text-slate-700 text-center"
            >
              <Hotel className="w-5 h-5 text-brand-600" />
              Hotels
            </Link>
            <Link
              to="/search?type=ticket"
              className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-slate-50 text-xs font-medium text-slate-700 text-center"
            >
              <Plane className="w-5 h-5 text-brand-600" />
              Transport
            </Link>
            <Link
              to="/search?type=guide"
              className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-slate-50 text-xs font-medium text-slate-700 text-center"
            >
              <MapPin className="w-5 h-5 text-brand-600" />
              Guides
            </Link>
          </div>

          <div className="space-y-1">
            <Link
              to="/about"
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              About Platform
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Customer Support & Contact
            </Link>
          </div>

          {isAuthenticated ? (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <Link
                to="/bookings"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-brand-50 text-brand-700 text-sm font-medium"
              >
                <Calendar className="w-4 h-4" />
                My Bookings & Trips
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-xl"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={handleQuickDemo}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Quick Demo Login (Traveler)
              </button>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  className="py-2.5 text-center text-sm font-medium text-slate-700 border border-slate-200 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="py-2.5 text-center text-sm font-semibold bg-brand-600 text-white rounded-xl"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
