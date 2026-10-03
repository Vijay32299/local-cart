import React from 'react';
import { useApp } from '../context/AppContext';
import { Store, Heart, MapPin, Phone, ShieldCheck, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, setSelectedLocality, setSelectedCategory } = useApp();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white">
                <Store className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-display">
                Local<span className="text-amber-500">Kart</span>
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              Empowering local street food vendors, night chaupatis, kirana shops, and neighbourhood artisans with a digital storefront. Discover, compare prices, and connect directly.
            </p>
            <div className="text-xs text-stone-400 flex items-center gap-1.5 pt-2">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
              <span>for Local Shopkeepers & Chaupati Culture</span>
            </div>
          </div>

          {/* Popular Chaupatis & Localities */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-100 mb-4">
              Explore Localities
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              {[
                'Sarafa Night Chaupati',
                'Chhappan Dukan (56 Shops)',
                'Old Clock Tower Market',
                'Heritage Market, Rajwada',
                'Vijay Nagar Street Stalls'
              ].map(loc => (
                <li key={loc}>
                  <button
                    onClick={() => {
                      setSelectedLocality(loc);
                      navigateTo('home');
                    }}
                    className="hover:text-amber-400 transition-colors text-left"
                  >
                    {loc}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-100 mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('chaupati');
                    navigateTo('home');
                  }}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Night Chaupatis & Street Food
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('kirana');
                    navigateTo('home');
                  }}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Kirana, Spices & Dry Fruits
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('chai_beverages');
                    navigateTo('home');
                  }}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Chai Tapris & Cold Drinks
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('sweets_bakery');
                    navigateTo('home');
                  }}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Traditional Sweets & Bakeries
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('handloom_crafts');
                    navigateTo('home');
                  }}
                  className="hover:text-amber-400 transition-colors text-left"
                >
                  Handloom & Regional Pottery
                </button>
              </li>
            </ul>
          </div>

          {/* Shopkeepers & Admin */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-100 mb-4">
              For Shopkeepers
            </h4>
            <p className="text-sm text-stone-400 mb-4 leading-relaxed">
              Are you a shopkeeper, tea stall, or chaupati cart owner? Bring your menu online in under 2 minutes for free.
            </p>
            <button
              onClick={() => navigateTo('register')}
              className="w-full py-2.5 px-4 text-xs font-semibold text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors font-sans text-center"
            >
              Register Your Shop Free
            </button>
            <div className="mt-4 pt-4 border-t border-stone-800 text-xs text-stone-500 flex items-center justify-between">
              <span>Admin Verification: Active</span>
              <button 
                onClick={() => navigateTo('login')}
                className="text-stone-400 hover:text-stone-200 underline"
              >
                Admin Sign In
              </button>
            </div>
          </div>
        </div>

        {/* Quiet Bottom Copyright */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© 2026 LocalKart. Promoting Neighborhood Businesses & Street Food Heritage.</p>
          <div className="flex items-center gap-4">
            <span className="text-stone-400">Zero Commission Marketplace</span>
            <span>·</span>
            <span className="text-stone-400">Direct WhatsApp Ordering</span>
            <span>·</span>
            <span className="text-stone-400">Verified Local Vendors</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
