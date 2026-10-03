import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Shop } from '../../backend/models';
import { 
  Search, 
  X, 
  Store, 
  MapPin, 
  Star, 
  UtensilsCrossed, 
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface ShopSearchAutocompleteProps {
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  showCategoryFilters?: boolean;
  onSelectShop?: (shop: Shop) => void;
}

export const ShopSearchAutocomplete: React.FC<ShopSearchAutocompleteProps> = ({
  placeholder = "Search shop name (e.g. Mahadev, Badshah, Gupta Ji, Kailash)...",
  className = "",
  inputClassName = "",
  onSelectShop
}) => {
  const { shops, searchTerm, setSearchTerm, navigateTo, setSelectedCity } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filter matching shops and items in real time
  const searchResults = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return { matchingShops: [], matchingDishes: [] };
    }

    // 1. Matching by Shop Name, Owner, Tagline, or Locality
    const matchingShops = shops.filter(shop => {
      const matchName = shop.name.toLowerCase().includes(query);
      const matchOwner = shop.ownerName.toLowerCase().includes(query);
      const matchTag = shop.tagline.toLowerCase().includes(query);
      const matchLocality = shop.locality.toLowerCase().includes(query);
      const matchCity = shop.city.toLowerCase().includes(query);
      return matchName || matchOwner || matchTag || matchLocality || matchCity;
    }).slice(0, 5);

    // 2. Matching specific dishes across all shops (e.g. Samosa, Pav Bhaji, Jalebi)
    const dishes: { dishName: string; shopName: string; price: number; shopId: string; image?: string; isVeg: boolean }[] = [];
    shops.forEach(shop => {
      shop.items.forEach(item => {
        if (item.name.toLowerCase().includes(query) || item.category.toLowerCase().includes(query)) {
          if (dishes.length < 4 && !dishes.some(d => d.dishName === item.name && d.shopId === shop.id)) {
            dishes.push({
              dishName: item.name,
              shopName: shop.name,
              price: item.price,
              shopId: shop.id,
              image: item.image || shop.image,
              isVeg: item.isVeg
            });
          }
        }
      });
    });

    return { matchingShops, matchingDishes: dishes };
  }, [shops, searchTerm]);

  const totalResultsCount = searchResults.matchingShops.length + searchResults.matchingDishes.length;

  const handleSelectShop = (shop: Shop) => {
    setSearchTerm(shop.name);
    setIsOpen(false);
    if (onSelectShop) {
      onSelectShop(shop);
    } else {
      navigateTo('shop-details', shop.id);
    }
  };

  const handleSelectDish = (shopId: string, dishName: string) => {
    setSearchTerm(dishName);
    setIsOpen(false);
    navigateTo('shop-details', shopId);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < totalResultsCount - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : totalResultsCount - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      if (activeIndex < searchResults.matchingShops.length) {
        handleSelectShop(searchResults.matchingShops[activeIndex]);
      } else {
        const dishIndex = activeIndex - searchResults.matchingShops.length;
        const d = searchResults.matchingDishes[dishIndex];
        if (d) handleSelectDish(d.shopId, d.dishName);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-amber-600 absolute left-3 pointer-events-none" />
        
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => {
            if (searchTerm.trim().length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-white border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all ${inputClassName}`}
        />

        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-2.5 p-1 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown Popup */}
      {isOpen && searchTerm.trim().length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-stone-200 py-2.5 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 max-h-[460px] overflow-y-auto">
          
          {/* Header indicator */}
          <div className="px-3.5 py-1.5 flex items-center justify-between text-[11px] font-semibold text-stone-400 uppercase tracking-wider border-b border-stone-100">
            <span>Live Search Results for "{searchTerm}"</span>
            {totalResultsCount > 0 && (
              <span className="text-amber-700 lowercase font-bold">{totalResultsCount} found</span>
            )}
          </div>

          {/* 1. MATCHING SHOPS SECTION */}
          {searchResults.matchingShops.length > 0 && (
            <div className="py-1">
              <div className="px-3.5 py-1 text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-amber-600" />
                <span>Matching Shops & Stalls</span>
              </div>

              {searchResults.matchingShops.map((shop, idx) => {
                const isSelected = activeIndex === idx;
                return (
                  <div
                    key={shop.id}
                    onClick={() => handleSelectShop(shop)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`px-3.5 py-2.5 flex items-center gap-3 cursor-pointer transition-colors ${
                      isSelected ? 'bg-amber-50/80' : 'hover:bg-stone-50'
                    }`}
                  >
                    {/* Shop Thumbnail */}
                    <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-stone-200 bg-stone-100">
                      <img
                        src={shop.image}
                        alt={shop.name}
                        className="w-full h-full object-cover"
                      />
                      <span className={`absolute bottom-0 inset-x-0 text-[8px] font-bold text-center text-white ${
                        shop.isOpen ? 'bg-emerald-600' : 'bg-stone-600'
                      }`}>
                        {shop.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </div>

                    {/* Shop Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-stone-900 truncate">
                          {shop.name}
                        </h4>
                        {shop.isVerified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                        <span className="text-amber-700 font-semibold">{shop.categoryLabel}</span>
                        <span>·</span>
                        <span className="flex items-center gap-0.5 truncate text-stone-600">
                          <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                          {shop.locality}, {shop.city}
                        </span>
                      </div>
                    </div>

                    {/* Rating & Arrow */}
                    <div className="shrink-0 flex items-center gap-2">
                      <div className="flex items-center gap-0.5 text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{shop.rating}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 2. MATCHING DISHES & MENU ITEMS */}
          {searchResults.matchingDishes.length > 0 && (
            <div className="py-1 border-t border-stone-100">
              <div className="px-3.5 py-1 text-[11px] font-bold text-stone-700 flex items-center gap-1.5">
                <UtensilsCrossed className="w-3.5 h-3.5 text-orange-600" />
                <span>Dishes & Specialties Available</span>
              </div>

              {searchResults.matchingDishes.map((dish, i) => {
                const itemIdx = searchResults.matchingShops.length + i;
                const isSelected = activeIndex === itemIdx;

                return (
                  <div
                    key={`${dish.shopId}-${dish.dishName}`}
                    onClick={() => handleSelectDish(dish.shopId, dish.dishName)}
                    onMouseEnter={() => setActiveIndex(itemIdx)}
                    className={`px-3.5 py-2 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                      isSelected ? 'bg-amber-50/80' : 'hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {dish.image && (
                        <img
                          src={dish.image}
                          alt={dish.dishName}
                          className="w-8 h-8 rounded-lg object-cover shrink-0 border border-stone-200"
                        />
                      )}
                      <div className="truncate">
                        <div className="text-xs font-semibold text-stone-800 truncate flex items-center gap-1.5">
                          <span>{dish.dishName}</span>
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1 rounded">
                            ₹{dish.price}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-500 truncate">
                          at {dish.shopName}
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] text-amber-700 font-semibold shrink-0 flex items-center gap-1">
                      <span>View Menu</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* 3. EMPTY STATE: NO SHOP FOUND WITH THIS NAME */}
          {totalResultsCount === 0 && (
            <div className="p-6 text-center">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-2">
                <Store className="w-5 h-5 text-amber-600" />
              </div>
              <h4 className="text-sm font-bold text-stone-800">
                No shop found matching "{searchTerm}"
              </h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1 mb-3 leading-relaxed">
                Check spelling or search for popular dishes like <em>"Pav Bhaji"</em>, <em>"Samose"</em>, <em>"Kulhad Chai"</em>, or switch city (Bhopal, Jabalpur, Indore).
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                <span className="text-[11px] text-stone-400 mr-1">Quick suggestions:</span>
                {['Pav Bhaji', 'Matar Samosa', 'Kulhad Chai', 'Khoya Jalebi', 'Shahpura'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setSearchTerm(t);
                    }}
                    className="text-xs bg-stone-100 hover:bg-amber-100 text-stone-700 px-2.5 py-1 rounded-md transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer suggestion banner */}
          <div className="px-3.5 py-2 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <span>Press <kbd className="px-1 py-0.5 bg-white border border-stone-300 rounded font-mono text-[10px]">↑</kbd> <kbd className="px-1 py-0.5 bg-white border border-stone-300 rounded font-mono text-[10px]">↓</kbd> to navigate, <kbd className="px-1 py-0.5 bg-white border border-stone-300 rounded font-mono text-[10px]">Enter</kbd> to select</span>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigateTo('register');
              }}
              className="text-amber-700 hover:underline font-semibold"
            >
              + Register Your Shop
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
