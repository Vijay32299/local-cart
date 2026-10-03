import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Store, User as UserIcon, CheckCircle2, ArrowRight } from 'lucide-react';
import { ShopCategory, UserRole } from '../types';
import { LOCALITIES } from '../data/initialData';

export const Register: React.FC = () => {
  const { registerUser, navigateTo } = useApp();
  
  const [role, setRole] = useState<UserRole>('vendor');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Shop details for vendors
  const [shopName, setShopName] = useState('');
  const [category, setCategory] = useState<ShopCategory>('chaupati');
  const [locality, setLocality] = useState(LOCALITIES[1] || 'Sarafa Night Chaupati');
  const [stallNumber, setStallNumber] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [tagline, setTagline] = useState('');
  const [openTime, setOpenTime] = useState('18:00');
  const [closeTime, setCloseTime] = useState('02:00');
  const [firstItemName, setFirstItemName] = useState('Signature Special Dish');
  const [firstItemPrice, setFirstItemPrice] = useState(120);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (role === 'vendor') {
      const categoryLabels: Record<string, string> = {
        chaupati: 'Chaupati & Street Food',
        street_food: 'Chaupati & Street Food',
        kirana: 'Kirana & Spices',
        sweets_bakery: 'Sweets & Bakery',
        chai_beverages: 'Chai & Beverages',
        handloom_crafts: 'Handloom & Crafts',
        fruits_veggies: 'Fresh Produce'
      };

      registerUser(
        {
          name,
          email,
          phone,
          role: 'vendor'
        },
        {
          name: shopName || `${name}'s Shop`,
          tagline: tagline || 'Authentic local taste and honest prices',
          category,
          categoryLabel: categoryLabels[category] || 'Local Shop',
          locality,
          address: address || `${locality}, Local Market`,
          landmark: landmark || 'Near Main Market Gate',
          stallNumber: stallNumber || 'Stall #1',
          openTime,
          closeTime,
          image: category === 'kirana' 
            ? '/src/assets/images/kirana_spice_shop_1791018551909.jpg' 
            : category === 'chai_beverages' || category === 'sweets_bakery'
            ? '/src/assets/images/sweets_chai_corner_1791018569694.jpg'
            : '/src/assets/images/chaupati_food_stall_1791018535091.jpg',
          items: [
            {
              id: 'item_' + Date.now(),
              shopId: '',
              name: firstItemName || 'Special Item',
              category: 'Main Menu',
              price: Number(firstItemPrice) || 100,
              unit: '1 Plate / Pack',
              description: 'Freshly prepared specialty dish with premium ingredients.',
              isVeg: true,
              isAvailable: true,
              isSpecialty: true
            }
          ]
        }
      );
    } else {
      registerUser({
        name,
        email,
        phone,
        role: 'customer'
      });
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 flex items-center justify-center text-white mx-auto shadow-sm">
            <Store className="w-7 h-7" />
          </div>
          <h2 className="mt-4 text-2xl sm:text-3xl font-bold font-display text-stone-900">
            Join LocalKart
          </h2>
          <p className="mt-1 text-xs text-stone-500 max-w-md mx-auto">
            Bring your street food stall or neighbourhood shop online, or discover authentic local eats as a customer.
          </p>
        </div>

        {/* Role Toggle */}
        <div className="bg-white rounded-2xl p-2 border border-stone-200 shadow-2xs grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setRole('vendor')}
            className={`p-3 rounded-xl text-left transition-all flex items-center gap-3 cursor-pointer ${
              role === 'vendor'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              role === 'vendor' ? 'bg-amber-700 text-white' : 'bg-white text-stone-700 shadow-2xs'
            }`}>
              <Store className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">Shop / Stall Owner</p>
              <p className={`text-[10px] ${role === 'vendor' ? 'text-amber-100' : 'text-stone-400'}`}>
                List stall & receive orders
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`p-3 rounded-xl text-left transition-all flex items-center gap-3 cursor-pointer ${
              role === 'customer'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              role === 'customer' ? 'bg-amber-700 text-white' : 'bg-white text-stone-700 shadow-2xs'
            }`}>
              <UserIcon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">Customer / Foodie</p>
              <p className={`text-[10px] ${role === 'customer' ? 'text-amber-100' : 'text-stone-400'}`}>
                Explore & compare prices
              </p>
            </div>
          </button>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-2xs">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Basic User Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider text-amber-700 font-display">
                1. Account Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Rameshwar Dayal"
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="owner@chaupati.in"
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Phone / WhatsApp Number (For customer orders)
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98260 00000"
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-600"
                  />
                </div>
              </div>
            </div>

            {/* Shop Details for Vendors */}
            {role === 'vendor' && (
              <div className="space-y-4 pt-4 border-t border-stone-100">
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider text-amber-700 font-display">
                  2. Shop or Chaupati Stall Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Shop / Stall Name</label>
                    <input
                      type="text"
                      required
                      value={shopName}
                      onChange={e => setShopName(e.target.value)}
                      placeholder="e.g. Mahadev Special Pav Bhaji"
                      className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value as ShopCategory)}
                      className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-hidden"
                    >
                      <option value="chaupati">Chaupati & Street Food</option>
                      <option value="kirana">Kirana, Spices & Dry Fruits</option>
                      <option value="chai_beverages">Chai & Cold Beverages</option>
                      <option value="sweets_bakery">Traditional Sweets & Bakery</option>
                      <option value="handloom_crafts">Handloom & Local Crafts</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Catchy Tagline / Famous For</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={e => setTagline(e.target.value)}
                    placeholder="e.g. Famous butter pav bhaji simmered in pure Amul butter on iron tawa"
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Locality</label>
                    <select
                      value={locality}
                      onChange={e => setLocality(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-hidden"
                    >
                      {LOCALITIES.filter(l => l !== 'All Localities').map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Stall Number (Optional)</label>
                    <input
                      type="text"
                      value={stallNumber}
                      onChange={e => setStallNumber(e.target.value)}
                      placeholder="e.g. Stall #42"
                      className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Landmark</label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={e => setLandmark(e.target.value)}
                      placeholder="e.g. Near Rajwada Palace Arch"
                      className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Full Shop Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="e.g. Stall 42, Sarafa Night Bazar, Bartan Gali, Indore"
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Opening Time (e.g. 18:00)</label>
                    <input
                      type="text"
                      value={openTime}
                      onChange={e => setOpenTime(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Closing Time (e.g. 02:30)</label>
                    <input
                      type="text"
                      value={closeTime}
                      onChange={e => setCloseTime(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg"
                    />
                  </div>
                </div>

                {/* First Item */}
                <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-3">
                  <p className="text-xs font-bold text-stone-800">Add Your First Featured Dish / Item:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 mb-1">Dish / Product Name</label>
                      <input
                        type="text"
                        value={firstItemName}
                        onChange={e => setFirstItemName(e.target.value)}
                        placeholder="e.g. Special Butter Pav Bhaji"
                        className="w-full text-xs px-3 py-1.5 border border-stone-200 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 mb-1">Price in ₹</label>
                      <input
                        type="number"
                        min={1}
                        value={firstItemPrice}
                        onChange={e => setFirstItemPrice(Number(e.target.value))}
                        className="w-full text-xs px-3 py-1.5 border border-stone-200 rounded-lg bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{role === 'vendor' ? 'Register & Launch My Shop Free' : 'Create Customer Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-stone-100 text-center text-xs text-stone-600">
            <span>Already registered? </span>
            <button
              onClick={() => navigateTo('login')}
              className="font-bold text-amber-700 hover:underline"
            >
              Sign In to Your Account
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
