import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Train,
  Calendar,
  Sparkles,
  AlertTriangle,
  User,
  LogOut,
  Shield,
  Layers,
  Menu,
  X,
  CreditCard,
  Newspaper
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTrip } from '../../context/TripContext';
import Button from './Button';
import Badge from './Badge';

const Navbar = ({ onOpenSos }) => {
  const { user, isAuthenticated, logout, isPro, isAdmin } = useAuth();
  const { activeTrip } = useTrip();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Explore Map', path: '/explore', icon: MapPin },
    { label: 'Transport', path: '/transport', icon: Train },
    { label: 'AI Planner', path: '/planner', icon: Sparkles },
    { label: 'My Trips', path: '/trips', icon: Calendar },
    { label: 'Travel News', path: '/news', icon: Newspaper },
    { label: 'Local Guides', path: '/experts', icon: Compass },
    { label: 'Compare', path: '/compare', icon: Layers },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200 text-charcoal shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-terracotta-600 via-terracotta-500 to-amber-400 p-0.5 shadow-glow-terracotta group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Compass className="w-5 h-5 text-terracotta-500 group-hover:rotate-45 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-charcoal">
                TripSync
              </span>
              <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                🇮🇳 India Edition
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all ${
                    isActive
                      ? 'bg-charcoal text-white font-black shadow-card-warm'
                      : 'text-stone-600 hover:text-charcoal hover:bg-stone-200/60 font-bold border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            
            {/* Active Trip Quick Access */}
            {activeTrip && (
              <Link
                to={`/itinerary/${activeTrip._id}`}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-xs font-bold text-terracotta-600 hover:bg-orange-100 transition-colors shadow-sm"
              >
                <div className="w-2 h-2 rounded-full bg-terracotta-500 animate-ping" />
                <span className="max-w-[120px] truncate">{activeTrip.title}</span>
              </Link>
            )}

            {/* Refined Emergency SOS Button */}
            <button
              onClick={onOpenSos}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-black transition-all shadow-sm active:scale-95"
              title="One-Tap Emergency SOS Alert"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="tracking-wide">SOS</span>
              <span className="hidden sm:inline text-[11px] text-red-700 font-bold">Safety</span>
            </button>

            {/* User Profile / Auth State */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-2.5 rounded-2xl bg-white border border-stone-200 hover:border-stone-300 shadow-sm transition-colors"
                >
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-black text-charcoal max-w-[100px] truncate">
                      {user?.name?.split(' ')[0] || 'Doraemon'}
                    </span>
                    <span className="text-[10px] text-amber-600 font-extrabold tracking-wide flex items-center gap-1">
                      {user?.explorerLevel || 'GOLD'} Explorer
                    </span>
                  </div>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/b/bd/Doraemon_character.png"
                    alt={user?.name || 'Doraemon'}
                    className="w-8 h-8 rounded-full object-contain ring-1 ring-amber-400/30 bg-orange-50/50 p-0.5"
                  />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-stone-200 shadow-card-float py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-xs text-stone-400 font-medium">Signed in as</p>
                      <p className="text-sm font-bold text-charcoal truncate">{user?.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="gold" size="sm">{user?.explorerLevel || 'GOLD'} Explorer</Badge>
                        {isPro && <Badge variant="primary" size="sm">PRO</Badge>}
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-stone-700 hover:text-charcoal hover:bg-stone-50"
                    >
                      <User className="w-4 h-4 text-stone-400" />
                      Traveler Profile & Badges
                    </Link>

                    <Link
                      to="/packing"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-stone-700 hover:text-charcoal hover:bg-stone-50"
                    >
                      <Layers className="w-4 h-4 text-stone-400" />
                      Packing Checklist
                    </Link>

                    <Link
                      to="/emergency"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-stone-700 hover:text-charcoal hover:bg-stone-50"
                    >
                      <Shield className="w-4 h-4 text-emerald-600" />
                      Safety Hub & SOS Contacts
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-black text-amber-700 hover:bg-amber-50"
                      >
                        <Shield className="w-4 h-4 text-amber-600" />
                        Admin Operations Center
                      </Link>
                    )}

                    <div className="border-t border-stone-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* Always-visible Doraemon Profile Preview */}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 p-1 pl-2.5 rounded-2xl bg-white border border-stone-200 hover:border-stone-300 shadow-sm transition-colors"
                  title="Traveler Profile (Doraemon)"
                >
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-black text-charcoal">Doraemon</span>
                    <span className="text-[10px] text-amber-600 font-extrabold tracking-wide flex items-center gap-0.5">
                      EXPLORER
                    </span>
                  </div>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/b/bd/Doraemon_character.png"
                    alt="Doraemon"
                    className="w-8 h-8 rounded-full object-contain ring-1 ring-amber-400/30 bg-orange-50/50 p-0.5"
                  />
                </Link>

                <Link to="/login">
                  <button className="px-3 py-1.5 rounded-xl text-xs font-bold text-stone-600 hover:text-charcoal hover:bg-stone-200/50 transition-colors">
                    Sign In
                  </button>
                </Link>
                <Link to="/register">
                  <button className="px-3.5 py-1.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-black shadow-glow-terracotta transition-all">
                    Join Free
                  </button>
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-stone-600 hover:text-charcoal hover:bg-stone-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F5] border-b border-stone-200 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors ${
                  isActive
                    ? 'bg-charcoal text-white font-black shadow-sm'
                    : 'text-stone-600 hover:text-charcoal hover:bg-stone-100 font-bold'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
