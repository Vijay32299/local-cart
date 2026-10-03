import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  MapPin, 
  Clock, 
  Phone, 
  MessageCircle, 
  Star, 
  CheckCircle, 
  ArrowRight, 
  Scale, 
  Store, 
  UtensilsCrossed, 
  Coffee, 
  Sparkles, 
  HeartHandshake, 
  ShoppingBag,
  SlidersHorizontal,
  ChevronRight,
  Map as MapIcon,
  List as ListIcon
} from 'lucide-react';
import { LOCALITIES, PRICE_COMPARISON_ITEMS, CITIES, CITY_LOCALITIES } from '../../backend/data/initialData';
import { Shop } from '../../backend/models';
import { ShopMapView } from '../components/ShopMapView';
import { ShopSearchAutocomplete } from '../components/ShopSearchAutocomplete';

export const Home: React.FC = () => {
  const { 
    shops, 
    searchTerm, 
    setSearchTerm, 
    selectedCity,
    setSelectedCity,
    selectedCategory, 
    setSelectedCategory,
    selectedLocality,
    setSelectedLocality,
    onlyOpenNow,
    setOnlyOpenNow,
    onlyVerified,
    setOnlyVerified,
    navigateTo 
  } = useApp();

  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'name'>('rating');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const currentLocalities = useMemo(() => {
    return CITY_LOCALITIES[selectedCity] || CITY_LOCALITIES['All Cities'] || LOCALITIES;
  }, [selectedCity]);

  const categories = [
    { id: 'all', label: 'All Listings' },
    { id: 'chaupati', label: 'Chaupati & Street Food' },
    { id: 'kirana', label: 'Kirana & Spices' },
    { id: 'chai_beverages', label: 'Chai & Beverages' },
    { id: 'sweets_bakery', label: 'Sweets & Bakeries' },
    { id: 'handloom_crafts', label: 'Handloom & Crafts' },
  ];

  // Filtered & sorted shops
  const filteredShops = useMemo(() => {
    return shops.filter(shop => {
      // City filter
      if (selectedCity !== 'All Cities' && shop.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'chaupati') {
          if (shop.category !== 'chaupati' && shop.category !== 'street_food') return false;
        } else if (shop.category !== selectedCategory) {
          return false;
        }
      }

      // Locality filter
      if (selectedLocality !== 'All Localities') {
        const cleanLoc = selectedLocality.split(' (')[0];
        if (!shop.locality.toLowerCase().includes(cleanLoc.toLowerCase())) {
          return false;
        }
      }

      // Open now filter
      if (onlyOpenNow && !shop.isOpen) {
        return false;
      }

      // Verified filter
      if (onlyVerified && !shop.isVerified) {
        return false;
      }

      // Search term (shop name, description, items, locality, city, owner)
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = shop.name.toLowerCase().includes(query);
        const matchesTagline = shop.tagline.toLowerCase().includes(query);
        const matchesLocality = shop.locality.toLowerCase().includes(query);
        const matchesCity = shop.city.toLowerCase().includes(query);
        const matchesItems = shop.items.some(it => it.name.toLowerCase().includes(query) || it.category.toLowerCase().includes(query));
        const matchesOwner = shop.ownerName.toLowerCase().includes(query);

        if (!matchesName && !matchesTagline && !matchesLocality && !matchesCity && !matchesItems && !matchesOwner) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
      return a.name.localeCompare(b.name);
    });
  }, [shops, selectedCity, selectedCategory, selectedLocality, onlyOpenNow, onlyVerified, searchTerm, sortBy]);

  // Featured Chaupati Stalls
  const featuredChaupatis = useMemo(() => {
    return shops.filter(s => {
      const isChaupati = s.category === 'chaupati' || s.category === 'street_food';
      if (!isChaupati) return false;
      if (selectedCity !== 'All Cities' && s.city.toLowerCase() !== selectedCity.toLowerCase()) return false;
      return true;
    });
  }, [shops, selectedCity]);

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      
      {/* 1. Hero Section with high-fidelity background image & measured scrim */}
      <section className="relative bg-stone-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_local_market_1791018516060.jpg"
            alt="Lively local market and night chaupati stalls"
            className="w-full h-full object-cover opacity-35"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/70 to-stone-900/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">
              <span>Vocal for Local</span>
              <span>·</span>
              <span>Direct Shopkeeper Contact</span>
              <span>·</span>
              <span>Authentic Flavors</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-5 font-display text-balance">
              Find Authentic Local Shops & Evening Chaupatis
            </h1>

            <p className="text-base sm:text-lg text-stone-300 mb-8 leading-relaxed max-w-2xl">
              Explore your neighbourhood’s famous night food stalls, artisanal kirana shops, traditional sweets, and regional craftsmen. Browse menus, compare local prices, and connect directly on WhatsApp or Call.
            </p>

            {/* City Quick Switcher Tabs */}
            <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-semibold text-stone-300 shrink-0">City:</span>
              {CITIES.map(city => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCity === city
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                      : 'bg-stone-800/80 hover:bg-stone-800 text-stone-300 border border-stone-700'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>

            {/* Interactive Search & Locality Filter Box */}
            <div className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-xl border border-stone-200 text-stone-900">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                
                {/* Search Input with Live Shop Name Dropdown */}
                <div className="sm:col-span-5 relative">
                  <ShopSearchAutocomplete
                    placeholder="Search shop name (e.g. Mahadev, Badshah, Gupta Ji)..."
                    inputClassName="bg-stone-50 border-stone-200 focus:bg-white"
                  />
                </div>

                {/* City Selector */}
                <div className="sm:col-span-3 flex items-center gap-1.5 px-3 py-2 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-xs font-bold text-amber-700 shrink-0">City:</span>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-transparent border-none focus:outline-hidden text-stone-800 font-semibold cursor-pointer"
                  >
                    {CITIES.map(c => (
                      <option key={c} value={c} className="text-stone-900 bg-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dynamic Locality Selector */}
                <div className="sm:col-span-4 flex items-center gap-2 px-3 py-2 bg-stone-50 rounded-xl border border-stone-200">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                  <select
                    value={selectedLocality}
                    onChange={(e) => setSelectedLocality(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-transparent border-none focus:outline-hidden text-stone-800 cursor-pointer"
                  >
                    {currentLocalities.map(loc => (
                      <option key={loc} value={loc} className="text-stone-900 bg-white">
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

              </div>
            </div>

            {/* Quick Suggestions & Map View shortcut */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-2 text-stone-300">
                <span className="text-stone-400">Popular:</span>
                {['Pav Bhaji', 'Kulhad Chai', 'Poha Jalebi', 'Khoya Jalebi (Jabalpur)', 'Shahpura Chaupati (Bhopal)'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSearchTerm(tag)}
                    className="hover:text-amber-400 underline underline-offset-2 transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setViewMode('map');
                  document.getElementById('listings-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 rounded-lg text-xs font-semibold backdrop-blur-sm cursor-pointer transition-colors"
              >
                <MapIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>🗺️ View on Google Map ({filteredShops.length} stalls)</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Vocal for Local Trust Banner */}
      <section className="bg-white border-b border-stone-200 py-4 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-stone-200">
            <div className="py-2 px-2">
              <p className="text-sm font-bold text-stone-900 tabular-nums">0% Platform Fee</p>
              <p className="text-xs text-stone-500">100% money stays with vendors</p>
            </div>
            <div className="py-2 px-2">
              <p className="text-sm font-bold text-stone-900 tabular-nums">Direct WhatsApp & Call</p>
              <p className="text-xs text-stone-500">Contact stall owners with one tap</p>
            </div>
            <div className="py-2 px-2">
              <p className="text-sm font-bold text-stone-900 tabular-nums">Price Comparison</p>
              <p className="text-xs text-stone-500">Transparent rates across stalls</p>
            </div>
            <div className="py-2 px-2">
              <p className="text-sm font-bold text-stone-900 tabular-nums">Verified Neighbourhood Shops</p>
              <p className="text-xs text-stone-500">Community vetted local gems</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Night Chaupatis & Street Food Stalls */}
      <section id="chaupatis-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
              <UtensilsCrossed className="w-4 h-4" />
              <span>Iconic Evening Food Culture</span>
            </div>
            <h2 className="text-2xl font-bold text-stone-900 font-display">
              Famous Chaupatis & Street Food Stalls
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('chaupati');
              const el = document.getElementById('listings-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>View all street food stalls</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredChaupatis.slice(0, 3).map(stall => (
            <div
              key={stall.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col group"
            >
              {/* Image */}
              <div className="relative h-48 bg-stone-100 overflow-hidden">
                <img
                  src={stall.image}
                  alt={stall.name}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                {/* Status indicator */}
                <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${stall.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-stone-400'}`} />
                  <span>{stall.isOpen ? 'Open Now' : 'Closed'}</span>
                  <span>·</span>
                  <span className="tabular-nums">{stall.openTime} - {stall.closeTime}</span>
                </div>

                {stall.stallNumber && (
                  <div className="absolute top-3 right-3 bg-amber-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-xs">
                    {stall.stallNumber}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Clean unboxed metadata with dot separators */}
                  <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                    <span className="text-amber-700 font-semibold">{stall.locality}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 text-stone-800 font-medium">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="tabular-nums">{stall.rating}</span>
                      <span className="text-stone-400 tabular-nums">({stall.reviewCount})</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-stone-900 mb-1.5 font-display group-hover:text-amber-700 transition-colors">
                    {stall.name}
                  </h3>

                  <p className="text-xs text-stone-600 line-clamp-2 mb-4 leading-relaxed">
                    {stall.tagline}
                  </p>

                  {/* Famous item highlights */}
                  <div className="bg-stone-50 rounded-xl p-3 border border-stone-100 mb-4">
                    <p className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold mb-1.5">
                      Must Try Specialties:
                    </p>
                    <div className="space-y-1">
                      {stall.items.slice(0, 2).map(it => (
                        <div key={it.id} className="flex items-center justify-between text-xs">
                          <span className="text-stone-800 font-medium truncate max-w-[190px]">
                            {it.name}
                          </span>
                          <span className="font-bold text-stone-900 tabular-nums">₹{it.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`tel:${stall.phone.replace(/[^0-9+]/g, '')}`}
                      title="Direct Call"
                      className="p-2 text-stone-700 hover:text-amber-700 bg-stone-100 hover:bg-amber-50 rounded-lg transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                    <a
                      href={`https://wa.me/${stall.whatsapp}?text=${encodeURIComponent(`Hello, I saw your stall "${stall.name}" on LocalKart!`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Chat on WhatsApp"
                      className="p-2 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  </div>

                  <button
                    onClick={() => navigateTo('shop-details', stall.id)}
                    className="px-3.5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>View Menu & Stall</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Price Comparison Spotlight Module */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50 rounded-2xl p-6 sm:p-8 border border-amber-200/80 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">
                <Scale className="w-4 h-4" />
                <span>Smart Local Shopping</span>
              </div>
              <h2 className="text-2xl font-bold text-stone-900 font-display">
                Compare Prices Across Nearby Stalls & Shops
              </h2>
              <p className="text-sm text-stone-600 mt-1">
                Know where you get the best value, authentic quality, and shortest distance.
              </p>
            </div>
            <button
              onClick={() => navigateTo('compare-prices')}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-xl shadow-xs transition-colors whitespace-nowrap self-start md:self-auto flex items-center gap-2"
            >
              <span>Explore All Price Comparisons</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRICE_COMPARISON_ITEMS.map((comp, idx) => {
              const sortedVendors = [...comp.vendors].sort((a, b) => a.price - b.price);
              const best = sortedVendors[0];
              const highest = sortedVendors[sortedVendors.length - 1];
              return (
                <div 
                  key={idx} 
                  className="bg-white rounded-xl p-4 border border-stone-200 shadow-2xs hover:border-amber-300 transition-colors"
                >
                  <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
                    {comp.category}
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 mb-1 font-display">
                    {comp.name}
                  </h4>
                  <p className="text-xs text-stone-500 mb-3">Unit: {comp.standardUnit}</p>

                  <div className="bg-stone-50 rounded-lg p-2.5 border border-stone-100 mb-3 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-600 truncate max-w-[120px]">{best.shopName}</span>
                      <span className="font-bold text-emerald-700 tabular-nums">₹{best.price}</span>
                    </div>
                    {highest && highest.price !== best.price && (
                      <div className="flex items-center justify-between text-xs text-stone-400">
                        <span className="truncate max-w-[120px]">{highest.shopName}</span>
                        <span className="tabular-nums line-through">₹{highest.price}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-100">
                    <span className="text-emerald-700 font-semibold text-[11px]">Best: ₹{best.price}</span>
                    <button
                      onClick={() => navigateTo('compare-prices')}
                      className="text-stone-600 hover:text-amber-700 font-medium text-[11px] underline"
                    >
                      Compare {comp.vendors.length} stalls
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Complete Listings Section with Real-time Filters */}
      <section id="listings-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Section Header & Interactive Filter Bar */}
        <div className="space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 font-display">
                All Local Shops & Vendors ({filteredShops.length})
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Showing verified community shops in {selectedLocality}
              </p>
            </div>

            {/* View Mode Toggle (List / Google Map) & Sort Dropdown */}
            <div className="flex items-center gap-3">
              <div className="bg-stone-100 p-0.5 rounded-lg border border-stone-200 flex items-center">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                  title="List View"
                >
                  <ListIcon className="w-3.5 h-3.5" />
                  <span>List</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('map')}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    viewMode === 'map'
                      ? 'bg-amber-600 text-white shadow-xs font-bold'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                  title="Google Map View"
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  <span>Google Map</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-stone-500 hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-xs bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 font-medium text-stone-700 focus:outline-hidden focus:border-amber-600 cursor-pointer shadow-2xs"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviews</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Interactive Category Filter Tabs (Compliant: Functional buttons, clean segmented style) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Secondary Quick Toggles: Open Now & Verified Only */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
            <label className="flex items-center gap-2 cursor-pointer bg-white border border-stone-200 px-3 py-1.5 rounded-lg hover:bg-stone-50 transition-colors">
              <input
                type="checkbox"
                checked={onlyOpenNow}
                onChange={(e) => setOnlyOpenNow(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500"
              />
              <span className="font-medium text-stone-700">Open Now Only</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer bg-white border border-stone-200 px-3 py-1.5 rounded-lg hover:bg-stone-50 transition-colors">
              <input
                type="checkbox"
                checked={onlyVerified}
                onChange={(e) => setOnlyVerified(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500"
              />
              <span className="font-medium text-stone-700">Verified Vendors Only</span>
            </label>

            {(searchTerm || selectedCategory !== 'all' || selectedLocality !== 'All Localities' || onlyOpenNow || onlyVerified) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedLocality('All Localities');
                  setOnlyOpenNow(false);
                  setOnlyVerified(false);
                }}
                className="text-xs text-amber-700 hover:underline font-medium ml-auto"
              >
                Reset all filters
              </button>
            )}
          </div>
        </div>

        {/* Map View or Listings Grid */}
        {viewMode === 'map' ? (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-amber-700" />
                <span>Showing <strong>{filteredShops.length}</strong> shops & stalls on Google Map in <strong>{selectedCity}</strong></span>
              </span>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="text-amber-800 hover:text-amber-950 font-bold underline cursor-pointer"
              >
                Switch to List View
              </button>
            </div>
            <ShopMapView shops={filteredShops} selectedCity={selectedCity} />
          </div>
        ) : filteredShops.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-lg mx-auto">
            <Store className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-800 font-display mb-1">
              No shops match your criteria
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Try adjusting your locality, search term, or clearing filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedLocality('All Localities');
                setOnlyOpenNow(false);
                setOnlyVerified(false);
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 rounded-lg hover:bg-amber-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShops.map(shop => (
              <div
                key={shop.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group"
              >
                <div>
                  {/* Image with fallback container */}
                  <div className="relative h-44 bg-stone-100 overflow-hidden">
                    <img
                      src={shop.image}
                      alt={shop.name}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />

                    {/* Verified & Live indicator */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold text-white backdrop-blur-xs flex items-center gap-1 ${
                        shop.isOpen ? 'bg-emerald-700/90' : 'bg-stone-800/80'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${shop.isOpen ? 'bg-emerald-300' : 'bg-stone-300'}`} />
                        {shop.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </div>

                    {shop.isVerified && (
                      <div className="absolute top-2.5 right-2.5 bg-sky-600/90 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
                        <CheckCircle className="w-3 h-3" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    {/* Unboxed metadata with typographic dot separators */}
                    <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                      <span className="font-semibold text-stone-700">{shop.categoryLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate max-w-[120px]">{shop.locality}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 text-stone-800 font-medium">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="tabular-nums">{shop.rating}</span>
                        <span className="text-stone-400 tabular-nums">({shop.reviewCount})</span>
                      </span>
                    </div>

                    <h3 
                      onClick={() => navigateTo('shop-details', shop.id)}
                      className="text-base font-bold text-stone-900 mb-1.5 font-display group-hover:text-amber-700 transition-colors cursor-pointer"
                    >
                      {shop.name}
                    </h3>

                    <p className="text-xs text-stone-600 line-clamp-2 mb-3 leading-relaxed">
                      {shop.tagline}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-stone-500 mb-3">
                      <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="tabular-nums">Hours: {shop.openTime} – {shop.closeTime}</span>
                    </div>

                    {/* Item count & sample price */}
                    <div className="bg-stone-50 rounded-lg p-2.5 border border-stone-100 text-xs">
                      <div className="flex items-center justify-between text-stone-600 mb-1">
                        <span className="font-medium">{shop.items.length} items on menu</span>
                        <span className="text-stone-400">Owner: {shop.ownerName}</span>
                      </div>
                      <div className="text-[11px] text-stone-500 truncate">
                        Popular: {shop.items.slice(0, 2).map(it => `${it.name} (₹${it.price})`).join(', ')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-5 pb-5 pt-2 flex items-center justify-between gap-2 border-t border-stone-100">
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`tel:${shop.phone.replace(/[^0-9+]/g, '')}`}
                      title="Direct Phone Call"
                      className="p-2 text-stone-700 hover:text-amber-700 bg-stone-100 hover:bg-amber-50 rounded-lg transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                    <a
                      href={`https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(`Namaste ${shop.name}, I am contacting you from LocalKart!`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="WhatsApp Inquiry"
                      className="p-2 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  </div>

                  <button
                    onClick={() => navigateTo('shop-details', shop.id)}
                    className="px-3.5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition-colors flex items-center gap-1"
                  >
                    <span>View Menu & Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </section>

      {/* 6. Localities & Street Food Zones Section */}
      <section id="localities-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-10 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Heritage Food Hubs
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1 mb-3">
              Explore {selectedCity === 'All Cities' ? 'Iconic MP Food Hubs' : `${selectedCity}’s Renowned Food Lanes`}
            </h2>
            <p className="text-sm text-stone-300 leading-relaxed mb-6">
              {selectedCity === 'Bhopal'
                ? 'From sunset snacks at Shahpura Lake Chaupati to shopping bites at New Market and Sulemani chai at historic Iqbal Maidan.'
                : selectedCity === 'Jabalpur'
                ? 'From world-famous hot Khoya Jalebis at Civic Centre to Sadar Cantt flaky samosas and Gwarighat kulhad lassi.'
                : 'From the midnight jewel stalls of Sarafa Chaupati to the morning aroma of 56 Dukan and the stone-ground spices of the Old Clock Tower.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(selectedCity === 'Bhopal' ? [
                { name: 'Shahpura Lake Chaupati', desc: 'Scenic evening lakefront chaupati famous for tawa pav bhaji & kulfi falooda.' },
                { name: 'New Market Food Street', desc: 'Central TT Nagar walkway celebrated for Raj Kachori, Dahi Gujiya & snacks.' },
                { name: 'Sarafa Bazar, Old Bhopal', desc: 'Heritage Nawabi lanes for Sulemani salt chai, bun maska & kebabs.' },
                { name: 'MP Nagar Fast Food Zone', desc: 'Youth & student hotspot for rolls, momos, and fresh fruit shakes.' }
              ] : selectedCity === 'Jabalpur' ? [
                { name: 'Civic Centre Chaupati', desc: 'Celebrated for hot Jabalpuri Khoya Jalebi, spongy dahi bada & chaat.' },
                { name: 'Sadar Bazar Street Stalls', desc: 'Flaky triangular peas samosas with spicy chhole and kulhad lassi.' },
                { name: 'Sarafa Chaupati, Jabalpur', desc: 'Night jewel market famous for rabdi falooda, kulfi & desserts.' },
                { name: 'Gwarighat Road Stalls', desc: 'Narmada riverfront stalls for fresh snacks, roasted corn & peda.' }
              ] : [
                { name: 'Sarafa Night Chaupati', desc: 'World famous night street food bazaar opening at 7 PM till 2:30 AM in Indore.' },
                { name: 'Chhappan Dukan (56 Shops)', desc: 'Clean food walkway celebrated for poha jalebi, kulhad chai and chaats.' },
                { name: 'Old Clock Tower Market', desc: 'Generations of trusted kirana, stone-ground spices and organic pulses.' },
                { name: 'Heritage Market, Rajwada', desc: 'Traditional weavers, Maheshwari sarees and handloom handicrafts.' }
              ]).map(zone => (
                <button
                  key={zone.name}
                  onClick={() => {
                    setSelectedLocality(zone.name);
                    const el = document.getElementById('listings-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="p-3 bg-stone-800/80 hover:bg-stone-800 rounded-xl text-left border border-stone-700/60 hover:border-amber-500/50 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                      {zone.name}
                    </h4>
                    <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-xs text-stone-400 mt-1 line-clamp-2">{zone.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Call To Action for Shopkeepers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="bg-amber-600 rounded-2xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mb-2">
              Are you a local shopkeeper or chaupati stall owner?
            </h2>
            <p className="text-sm text-amber-100 leading-relaxed">
              Create your online presence in under 2 minutes. Add your photos, items, and prices, and receive direct phone calls & WhatsApp orders from customers in your city.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => navigateTo('register')}
              className="px-6 py-3 text-xs font-bold text-amber-900 bg-white hover:bg-amber-50 rounded-xl shadow-xs transition-colors font-sans whitespace-nowrap"
            >
              List Your Shop Free
            </button>
            <button
              onClick={() => navigateTo('login')}
              className="px-5 py-3 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-xl transition-colors whitespace-nowrap"
            >
              Shopkeeper Login
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
