import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Store, 
  CheckCircle2, 
  XCircle, 
  Star, 
  Eye, 
  Trash2, 
  Plus, 
  Search, 
  SlidersHorizontal,
  Sparkles,
  Phone,
  MessageCircle,
  FileCheck
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    shops, 
    toggleShopVerification, 
    toggleShopFeatured, 
    deleteShop, 
    navigateTo, 
    inquiries 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const pendingShops = shops.filter(s => !s.isVerified);
  const verifiedShops = shops.filter(s => s.isVerified);
  const totalItems = shops.reduce((sum, s) => sum + s.items.length, 0);

  const filteredShops = shops.filter(shop => {
    if (filterCategory !== 'all' && shop.category !== filterCategory) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        shop.name.toLowerCase().includes(q) ||
        shop.ownerName.toLowerCase().includes(q) ||
        shop.locality.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      
      {/* Top Banner */}
      <div className="bg-stone-900 text-white py-6 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-600 flex items-center justify-center text-white shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-display text-white">LocalKart Administration Console</h1>
                <p className="text-xs text-stone-400">
                  Verify local vendors, moderate menus, feature authentic stalls, and audit quality
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateTo('home')}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Go to Marketplace</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-2xs">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total Registered Shops</span>
            <p className="text-2xl font-bold text-stone-900 mt-1 tabular-nums font-display">{shops.length}</p>
            <span className="text-[11px] text-stone-500">Across 6 localities</span>
          </div>

          <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-2xs">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Verified Badged</span>
            <p className="text-2xl font-bold text-emerald-700 mt-1 tabular-nums font-display">{verifiedShops.length}</p>
            <span className="text-[11px] text-stone-400 font-medium">Physical verification complete</span>
          </div>

          <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-2xs">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Pending Moderation</span>
            <p className="text-2xl font-bold text-amber-700 mt-1 tabular-nums font-display">{pendingShops.length}</p>
            <span className="text-[11px] text-amber-600 font-medium">Requires approval</span>
          </div>

          <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-2xs">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total Listed Items</span>
            <p className="text-2xl font-bold text-stone-900 mt-1 tabular-nums font-display">{totalItems}</p>
            <span className="text-[11px] text-stone-400">Street food & kirana catalog</span>
          </div>
        </div>

        {/* Verification Queue (If any shops are pending) */}
        {pendingShops.length > 0 && (
          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-amber-700" />
              <h3 className="text-base font-bold text-amber-950 font-display">
                Pending Verification Queue ({pendingShops.length})
              </h3>
            </div>
            <p className="text-xs text-amber-800">
              These vendors recently registered and are awaiting city admin approval to receive the verified badge on search.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingShops.map(shop => (
                <div key={shop.id} className="bg-white rounded-xl p-4 border border-amber-200 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-bold text-stone-900 font-display">{shop.name}</h4>
                      <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-semibold">
                        Awaiting Verification
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mb-2">{shop.tagline}</p>
                    <div className="text-xs text-stone-500 space-y-0.5">
                      <p><span className="font-semibold text-stone-700">Owner:</span> {shop.ownerName}</p>
                      <p><span className="font-semibold text-stone-700">Phone:</span> {shop.phone}</p>
                      <p><span className="font-semibold text-stone-700">Locality:</span> {shop.locality}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <button
                      onClick={() => navigateTo('shop-details', shop.id)}
                      className="text-xs text-stone-600 hover:text-stone-900 underline"
                    >
                      Inspect Profile
                    </button>

                    <button
                      onClick={() => toggleShopVerification(shop.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve & Verify</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Complete Shop Moderation & Listing Table */}
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
          <div className="p-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-stone-900 font-display">All Platform Listings</h3>
              <p className="text-xs text-stone-500">Manage verified badges, featured status, or remove duplicate stalls</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Filter shops or owners..."
                  className="text-xs pl-9 pr-3 py-1.5 border border-stone-200 rounded-lg w-48 sm:w-60 focus:outline-hidden focus:border-amber-600"
                />
              </div>

              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="text-xs px-3 py-1.5 border border-stone-200 rounded-lg focus:outline-hidden"
              >
                <option value="all">All Categories</option>
                <option value="chaupati">Chaupati & Street Food</option>
                <option value="kirana">Kirana & Spices</option>
                <option value="chai_beverages">Chai & Beverages</option>
                <option value="sweets_bakery">Sweets & Bakery</option>
                <option value="handloom_crafts">Handloom & Crafts</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 font-semibold">
                  <th className="py-3 px-4">Shop & Owner</th>
                  <th className="py-3 px-4">Locality & Category</th>
                  <th className="py-3 px-4">Menu Items</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Verification</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {filteredShops.map(shop => (
                  <tr key={shop.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-stone-900">{shop.name}</div>
                      <div className="text-[11px] text-stone-500">Owner: {shop.ownerName} · {shop.phone}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div>{shop.locality}</div>
                      <div className="text-[11px] text-stone-400">{shop.categoryLabel}</div>
                    </td>

                    <td className="py-3 px-4 font-semibold tabular-nums">
                      {shop.items.length} items
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="font-bold tabular-nums">{shop.rating}</span>
                        <span className="text-stone-400">({shop.reviewCount})</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleShopVerification(shop.id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                          shop.isVerified
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {shop.isVerified ? 'Verified ✓' : 'Unverified'}
                      </button>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleShopFeatured(shop.id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                          shop.isFeatured
                            ? 'bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-200'
                            : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                        }`}
                      >
                        {shop.isFeatured ? 'Featured ★' : 'Standard'}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigateTo('shop-details', shop.id)}
                          className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded"
                          title="View Stall"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${shop.name}" from LocalKart?`)) {
                              deleteShop(shop.id);
                            }
                          }}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                          title="Delete Stall"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
