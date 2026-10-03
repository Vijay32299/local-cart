import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Store, User as UserIcon, ShieldCheck, ArrowRight, Lock, Mail } from 'lucide-react';

export const Login: React.FC = () => {
  const { allUsers, loginAs, navigateTo } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      loginAs(found);
    } else {
      // Create user on the fly or show error
      setError('Email not found in demo records. Use one-click demo login below or register a new account.');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto space-y-8">
        
        {/* Brand header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 flex items-center justify-center text-white mx-auto shadow-sm">
            <Store className="w-7 h-7" />
          </div>
          <h2 className="mt-4 text-2xl sm:text-3xl font-bold font-display text-stone-900">
            Sign in to LocalKart
          </h2>
          <p className="mt-1 text-xs text-stone-500">
            Access your local shop dashboard, customer inquiries, or admin verification console
          </p>
        </div>

        {/* 1-Click Fast Demo Login Selector */}
        <div className="bg-amber-50/70 rounded-2xl p-5 border border-amber-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
              One-Click Demo Roles
            </h4>
            <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded font-semibold">
              Instant Access
            </span>
          </div>
          <p className="text-xs text-stone-600">
            Click any account to immediately test customer browsing, shopkeeper management, or city admin verification:
          </p>

          <div className="space-y-2 pt-1">
            {allUsers.map(user => (
              <button
                key={user.id}
                onClick={() => loginAs(user)}
                className={`w-full p-2.5 rounded-xl border text-left transition-colors flex items-center justify-between group shadow-2xs cursor-pointer ${
                  user.role === 'admin'
                    ? 'bg-amber-50/50 hover:bg-amber-100/70 border-amber-300'
                    : 'bg-white hover:bg-amber-50/60 border-stone-200 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold ${
                    user.role === 'admin' ? 'bg-amber-800' : user.role === 'vendor' ? 'bg-amber-600' : 'bg-emerald-600'
                  }`}>
                    {user.role === 'admin' ? <ShieldCheck className="w-4 h-4" /> : user.role === 'vendor' ? <Store className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900 group-hover:text-amber-800 transition-colors flex items-center gap-1.5">
                      <span>{user.name}</span>
                      {user.role === 'admin' && (
                        <span className="text-[10px] bg-amber-600 text-white px-1.5 py-0.2 rounded font-semibold">
                          Super Admin
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-stone-500">
                      {user.email} · <span className="capitalize font-medium">{user.role}</span>
                      {user.role === 'admin' ? ' (Full Platform Moderation & Verification)' : ''}
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 group-hover:text-amber-700 transition-transform" />
              </button>
            ))}
          </div>
        </div>

        {/* Regular Login Form */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-100">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Email & Password Sign In
            </h3>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@localkart.in');
                setPassword('admin123');
              }}
              className="text-[11px] text-amber-700 hover:text-amber-800 font-semibold underline cursor-pointer"
            >
              Fill Admin Email
            </button>
          </div>

          <form onSubmit={handleManualLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="rameshwar@chaupati.in"
                  className="w-full text-xs pl-9 pr-3 py-2 border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs pl-9 pr-3 py-2 border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-600"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-stone-100 text-center text-xs text-stone-600">
            <span>New shopkeeper or customer? </span>
            <button
              onClick={() => navigateTo('register')}
              className="font-bold text-amber-700 hover:underline"
            >
              Register here
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
