import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Scale, 
  ArrowLeft, 
  Check, 
  Star, 
  MapPin, 
  Phone, 
  MessageCircle, 
  ArrowRight,
  TrendingDown,
  Sparkles,
  Search
} from 'lucide-react';
import { PRICE_COMPARISON_ITEMS } from '../data/initialData';

export const PriceCompare: React.FC = () => {
  const { navigateTo, shops } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract items from real current shops to allow dynamic comparison
  const dynamicCategories = ['all', 'Chaupati Food', 'Beverages', 'Kirana Essentials', 'Sweets'];

  const filteredItems = useMemo(() => {
    return PRICE_COMPARISON_ITEMS.filter(item => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      
      {/* Top Header */}
      <div className="bg-stone-900 text-white py-12 border-b border-stone-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigateTo('home')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Explorer</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
            <Scale className="w-4 h-4" />
            <span>Transparent Neighbourhood Pricing</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold font-display text-white mb-2">
            Compare Local Shop & Chaupati Prices
          </h1>
          <p className="text-sm text-stone-300 max-w-2xl leading-relaxed">
            See real menu prices, portion sizes, distance, and customer ratings across nearby stalls before you step out or order.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Search & Category Filter Bar */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 w-full sm:w-80">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search dish or staple to compare..."
                className="w-full text-xs pl-9 pr-3 py-2 border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
            {dynamicCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-stone-50 text-stone-600 hover:text-stone-900 border border-stone-200'
                }`}
              >
                {cat === 'all' ? 'All Comparisons' : cat}
              </button>
            ))}
          </div>

        </div>

        {/* Comparison Cards */}
        <div className="space-y-6">
          {filteredItems.map((comp, idx) => {
            const sortedVendors = [...comp.vendors].sort((a, b) => a.price - b.price);
            const bestPrice = sortedVendors[0]?.price;

            return (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
                  <div>
                    <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                      {comp.category}
                    </span>
                    <h3 className="text-xl font-bold text-stone-900 font-display">
                      {comp.name}
                    </h3>
                  </div>
                  <div className="text-xs text-stone-500 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-100 self-start sm:self-auto">
                    <span className="font-semibold text-stone-700">Standard Comparison Unit:</span> {comp.standardUnit}
                  </div>
                </div>

                {/* Vendors comparison grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {comp.vendors.map((vendor, vIdx) => {
                    const isLowest = vendor.price === bestPrice;
                    const matchingShop = shops.find(s => s.id === vendor.shopId);

                    return (
                      <div
                        key={vIdx}
                        className={`rounded-xl p-4 border transition-all flex flex-col justify-between ${
                          isLowest 
                            ? 'border-emerald-300 bg-emerald-50/30 ring-1 ring-emerald-400' 
                            : 'border-stone-200 bg-white hover:border-amber-200'
                        }`}
                      >
                        <div>
                          {/* Value tag */}
                          <div className="flex items-center justify-between mb-2">
                            {isLowest ? (
                              <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                                <TrendingDown className="w-3 h-3" />
                                <span>Best Value Rate</span>
                              </span>
                            ) : (
                              <span className="text-[10px] text-stone-400 font-medium">
                                Standard Rate
                              </span>
                            )}

                            <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-amber-600" />
                              <span className="tabular-nums">{vendor.distance}</span>
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-stone-900 mb-1 font-display">
                            {vendor.shopName}
                          </h4>

                          <p className="text-xs text-stone-500 mb-3 truncate">
                            {vendor.locality}
                          </p>

                          {/* Price Display */}
                          <div className="bg-stone-50 rounded-lg p-3 border border-stone-100 mb-4 flex items-center justify-between">
                            <span className="text-xs text-stone-600 font-medium">Price:</span>
                            <span className={`text-xl font-extrabold tabular-nums ${isLowest ? 'text-emerald-700' : 'text-stone-900'}`}>
                              ₹{vendor.price}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-xs text-stone-600 mb-4">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span className="font-bold tabular-nums">{vendor.rating}</span>
                            <span className="text-stone-400">Rating</span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="pt-2 border-t border-stone-100 flex items-center gap-2">
                          {matchingShop ? (
                            <button
                              onClick={() => navigateTo('shop-details', matchingShop.id)}
                              className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                            >
                              <span>View Stall & Menu</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => navigateTo('home')}
                              className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                            >
                              <span>Find Nearby Stall</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
