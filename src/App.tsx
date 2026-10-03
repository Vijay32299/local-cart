/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { AppProvider, useApp } from './frontend/context/AppContext';
import { Navbar } from './frontend/components/Navbar';
import { Footer } from './frontend/components/Footer';
import { Home } from './frontend/pages/Home';
import { ShopDetails } from './frontend/pages/ShopDetails';
import { ShopDashboard } from './frontend/pages/ShopDashboard';
import { AdminDashboard } from './frontend/pages/AdminDashboard';
import { PriceCompare } from './frontend/pages/PriceCompare';
import { Login } from './frontend/pages/Login';
import { Register } from './frontend/pages/Register';

const MainContent: React.FC = () => {
  const { activePage } = useApp();
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-amber-100 selection:text-amber-900 font-sans">
      {/* Quota Defense Banner (Case A) */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      <Navbar />
      
      <main className="flex-1">
        {activePage === 'home' && <Home />}
        {activePage === 'shop-details' && <ShopDetails />}
        {activePage === 'shop-dashboard' && <ShopDashboard />}
        {activePage === 'admin-dashboard' && <AdminDashboard />}
        {activePage === 'compare-prices' && <PriceCompare />}
        {activePage === 'login' && <Login />}
        {activePage === 'register' && <Register />}
      </main>

      <Footer />
    </div>
  );
};

export default function App() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  return (
    <APIProvider apiKey={apiKey}>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </APIProvider>
  );
}

