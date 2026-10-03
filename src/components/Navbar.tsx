import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Store, 
  MapPin, 
  Search, 
  User as UserIcon, 
  LogOut, 
  ShoppingBag, 
  Scale, 
  ShieldCheck, 
  Menu, 
  X,
  PhoneCall,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    activePage, 
    navigateTo, 
    logout, 
    loginAs, 
    allUsers,
    inquiryCart,
    shops 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const cartItemCount = inquiryCart.reduce((sum, item) => sum + item.quantity, 0);

  const handleNav = (page: string, shopId?: string) => {
    navigateTo(page, shopId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top Bar strictly following Top Bar Contract: 
          [Brand wordmark, one line] — [4-6 clean text nav links] — [1-2 primary actions] */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleNav('home')} 
            className="flex items-center gap-2 text-left group focus:outline-hidden"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-600 flex items-center justify-center text-white shadow-xs group-hover:bg-amber-700 transition-colors">
              <Store className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-stone-900 font-display">
              Local<span className="text-amber-600">Kart</span>
            </span>
          </button>

          {/* Quick city tag */}
          <span className="hidden sm:inline-flex items-center gap-1 text-xs text-stone-500 border-l border-stone-200 pl-3">
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            <span>Indore & Local Chaupatis</span>
          </span>
        </div>

        {/* Zone 2: Clean 4-6 text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          <button
            onClick={() => handleNav('home')}
            className={`transition-colors hover:text-stone-900 pb-0.5 ${
              activePage === 'home' ? 'text-amber-700 font-semibold border-b-2 border-amber-600' : ''
            }`}
          >
            Explore Shops
          </button>
          
          <button
            onClick={() => {
              handleNav('home');
              // scroll to chaupatis
              setTimeout(() => {
                const el = document.getElementById('chaupatis-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="transition-colors hover:text-stone-900"
          >
            Chaupati Stalls
          </button>

          <button
            onClick={() => handleNav('compare-prices')}
            className={`transition-colors hover:text-stone-900 pb-0.5 ${
              activePage === 'compare-prices' ? 'text-amber-700 font-semibold border-b-2 border-amber-600' : ''
            }`}
          >
            Compare Prices
          </button>

          <button
            onClick={() => {
              handleNav('home');
              setTimeout(() => {
                const el = document.getElementById('localities-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="transition-colors hover:text-stone-900"
          >
            Localities
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions and user controls */}
        <div className="flex items-center gap-3">
          {/* Cart Indicator (if customer has added pre-order inquiry items) */}
          {cartItemCount > 0 && (
            <button
              onClick={() => {
                const shopId = inquiryCart[0]?.item.shopId;
                if (shopId) handleNav('shop-details', shopId);
              }}
              className="relative p-2 text-stone-700 hover:text-amber-600 rounded-lg hover:bg-stone-100 transition-colors"
              title="View Inquiry Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            </button>
          )}

          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="flex items-center gap-2 text-xs text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 px-2.5 py-1.5 rounded-lg transition-colors border border-stone-200"
              >
                <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs uppercase">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left hidden lg:block">
                  <div className="font-semibold truncate max-w-[110px] leading-tight">{currentUser.name}</div>
                  <div className="text-[10px] text-stone-500 capitalize">{currentUser.role}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {/* Dropdown Menu */}
              {showRoleSwitcher && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-2 border-b border-stone-100">
                    <p className="text-xs font-semibold text-stone-800">{currentUser.name}</p>
                    <p className="text-[11px] text-stone-500 truncate">{currentUser.email}</p>
                    <p className="text-[10px] text-amber-700 font-medium capitalize mt-0.5">Role: {currentUser.role}</p>
                  </div>

                  {currentUser.role === 'vendor' && currentUser.shopId && (
                    <button
                      onClick={() => {
                        setShowRoleSwitcher(false);
                        handleNav('shop-dashboard');
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-stone-700 hover:bg-amber-50 hover:text-amber-800 flex items-center gap-2"
                    >
                      <Store className="w-4 h-4 text-amber-600" />
                      <span>Manage My Shop Dashboard</span>
                    </button>
                  )}

                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => {
                        setShowRoleSwitcher(false);
                        handleNav('admin-dashboard');
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-stone-700 hover:bg-amber-50 hover:text-amber-800 flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      <span>Admin Verification Console</span>
                    </button>
                  )}

                  {/* Quick Role Switcher for instant demo evaluation */}
                  <div className="px-3 pt-2 pb-1 border-t border-stone-100 mt-1">
                    <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-1">Switch Demo Account</p>
                    {allUsers.map(u => (
                      <button
                        key={u.id}
                        onClick={() => {
                          loginAs(u);
                          setShowRoleSwitcher(false);
                        }}
                        className={`w-full text-left px-2 py-1 rounded text-xs transition-colors flex items-center justify-between mb-0.5 ${
                          currentUser.id === u.id ? 'bg-amber-100 font-semibold text-amber-900' : 'text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <span className="truncate">{u.name}</span>
                        <span className="text-[10px] text-stone-400 capitalize">({u.role})</span>
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-stone-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setShowRoleSwitcher(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNav('login')}
                className="px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNav('register')}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
              >
                Register Shop
              </button>
            </div>
          )}

          {/* If vendor is logged in, show direct dashboard link */}
          {currentUser && currentUser.role === 'vendor' && (
            <button
              onClick={() => handleNav('shop-dashboard')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Shop Dashboard</span>
            </button>
          )}

          {/* If admin is logged in, show direct admin link */}
          {currentUser && currentUser.role === 'admin' && (
            <button
              onClick={() => handleNav('admin-dashboard')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs transition-colors whitespace-nowrap"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </button>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-5 space-y-2">
          <button
            onClick={() => handleNav('home')}
            className="w-full text-left py-2 px-3 text-sm font-medium text-stone-700 hover:bg-stone-50 rounded-lg"
          >
            Explore Shops
          </button>
          <button
            onClick={() => {
              handleNav('home');
              setTimeout(() => {
                const el = document.getElementById('chaupatis-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="w-full text-left py-2 px-3 text-sm font-medium text-stone-700 hover:bg-stone-50 rounded-lg"
          >
            Chaupati Stalls
          </button>
          <button
            onClick={() => handleNav('compare-prices')}
            className="w-full text-left py-2 px-3 text-sm font-medium text-stone-700 hover:bg-stone-50 rounded-lg"
          >
            Compare Prices
          </button>
          
          <div className="pt-2 border-t border-stone-100 space-y-2">
            {!currentUser ? (
              <>
                <button
                  onClick={() => handleNav('register')}
                  className="w-full py-2 px-3 text-sm font-semibold text-center text-white bg-amber-600 rounded-lg block"
                >
                  Register Shop or Chaupati
                </button>
                <button
                  onClick={() => handleNav('login')}
                  className="w-full py-2 px-3 text-sm font-medium text-center text-stone-700 hover:bg-stone-100 rounded-lg block"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                {currentUser.role === 'vendor' && (
                  <button
                    onClick={() => handleNav('shop-dashboard')}
                    className="w-full text-left py-2 px-3 text-sm font-semibold text-amber-700 bg-amber-50 rounded-lg"
                  >
                    My Shop Dashboard
                  </button>
                )}
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => handleNav('admin-dashboard')}
                    className="w-full text-left py-2 px-3 text-sm font-semibold text-stone-900 bg-stone-100 rounded-lg"
                  >
                    Admin Console
                  </button>
                )}
                <button
                  onClick={logout}
                  className="w-full text-left py-2 px-3 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  Sign Out ({currentUser.name})
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
