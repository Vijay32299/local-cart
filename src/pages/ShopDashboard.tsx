import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Store, 
  Plus, 
  Edit3, 
  Trash2, 
  Phone, 
  MessageCircle, 
  Clock, 
  MapPin, 
  Eye, 
  ShoppingBag, 
  CheckCircle2, 
  Star, 
  Save, 
  Image as ImageIcon,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { ShopItem, ShopCategory } from '../types';

export const ShopDashboard: React.FC = () => {
  const { 
    currentUser, 
    shops, 
    inquiries, 
    updateShop, 
    addItemToShop, 
    updateItemInShop, 
    deleteItemFromShop,
    navigateTo 
  } = useApp();

  // Find user's shop
  const userShop = shops.find(s => s.id === currentUser?.shopId) || shops[0];

  const [activeTab, setActiveTab] = useState<'menu' | 'profile' | 'inquiries'>('menu');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: userShop?.name || '',
    tagline: userShop?.tagline || '',
    category: userShop?.category || 'chaupati',
    categoryLabel: userShop?.categoryLabel || 'Chaupati & Street Food',
    locality: userShop?.locality || 'Sarafa Night Chaupati',
    address: userShop?.address || '',
    landmark: userShop?.landmark || '',
    phone: userShop?.phone || '',
    whatsapp: userShop?.whatsapp || '',
    openTime: userShop?.openTime || '18:00',
    closeTime: userShop?.closeTime || '02:00',
    isOpen: userShop?.isOpen ?? true,
    image: userShop?.image || '/src/assets/images/chaupati_food_stall_1791018535091.jpg',
    story: userShop?.story || '',
    stallNumber: userShop?.stallNumber || ''
  });

  // Item Form / Modal state
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemForm, setItemForm] = useState<{
    name: string;
    category: string;
    price: number;
    unit: string;
    description: string;
    isVeg: boolean;
    isAvailable: boolean;
    isSpecialty: boolean;
  }>({
    name: '',
    category: 'Main Specialties',
    price: 100,
    unit: '1 Plate',
    description: '',
    isVeg: true,
    isAvailable: true,
    isSpecialty: false
  });

  if (!userShop) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <Store className="w-12 h-12 text-stone-300 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-stone-800">No shop found for your account</h2>
        <p className="text-xs text-stone-500 mb-4">Please register your shop or select a vendor account.</p>
        <button
          onClick={() => navigateTo('register')}
          className="px-4 py-2 bg-amber-600 text-white text-xs font-semibold rounded-lg"
        >
          Register Shop Now
        </button>
      </div>
    );
  }

  // Shop inquiries
  const shopInquiries = inquiries.filter(inq => inq.shopId === userShop.id);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateShop(userShop.id, profileForm);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleToggleShopOpen = () => {
    const nextState = !userShop.isOpen;
    updateShop(userShop.id, { isOpen: nextState });
    setProfileForm(prev => ({ ...prev, isOpen: nextState }));
  };

  const openAddItemModal = () => {
    setEditingItemId(null);
    setItemForm({
      name: '',
      category: 'Main Menu',
      price: 80,
      unit: '1 Plate',
      description: '',
      isVeg: true,
      isAvailable: true,
      isSpecialty: false
    });
    setShowItemModal(true);
  };

  const openEditItemModal = (item: ShopItem) => {
    setEditingItemId(item.id);
    setItemForm({
      name: item.name,
      category: item.category,
      price: item.price,
      unit: item.unit || '1 Plate',
      description: item.description,
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
      isSpecialty: !!item.isSpecialty
    });
    setShowItemModal(true);
  };

  const handleItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItemId) {
      updateItemInShop(userShop.id, editingItemId, itemForm);
    } else {
      addItemToShop(userShop.id, itemForm);
    }
    setShowItemModal(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      
      {/* Top Banner & Shop Status Bar */}
      <div className="bg-stone-900 text-white py-6 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-600 flex items-center justify-center text-white shrink-0">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold font-display text-white">{userShop.name}</h1>
                  {userShop.isVerified && (
                    <span className="text-[10px] bg-sky-900 text-sky-200 border border-sky-700 px-1.5 py-0.5 rounded">
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-400">
                  {userShop.locality} · {userShop.stallNumber || 'Permanent Stall'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Live Open / Closed Switcher */}
              <button
                onClick={handleToggleShopOpen}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                  userShop.isOpen 
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700 hover:bg-emerald-900' 
                    : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${userShop.isOpen ? 'bg-emerald-400' : 'bg-stone-400'}`} />
                <span>Shop Status: {userShop.isOpen ? 'Open for Orders' : 'Marked Closed'}</span>
              </button>

              <button
                onClick={() => navigateTo('shop-details', userShop.id)}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Public Profile</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Metric Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-2xs">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total Items</span>
            <p className="text-2xl font-bold text-stone-900 mt-1 tabular-nums font-display">{userShop.items.length}</p>
            <span className="text-[11px] text-emerald-700 font-medium">All with active pricing</span>
          </div>

          <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-2xs">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Customer Inquiries</span>
            <p className="text-2xl font-bold text-stone-900 mt-1 tabular-nums font-display">{shopInquiries.length}</p>
            <span className="text-[11px] text-amber-700 font-medium">Pre-orders & questions</span>
          </div>

          <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-2xs">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Rating</span>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span className="text-2xl font-bold text-stone-900 tabular-nums font-display">{userShop.rating}</span>
            </div>
            <span className="text-[11px] text-stone-400 font-medium">From {userShop.reviewCount} reviews</span>
          </div>

          <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-2xs">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Est. Monthly Views</span>
            <p className="text-2xl font-bold text-stone-900 mt-1 tabular-nums font-display">1,840</p>
            <span className="text-[11px] text-stone-500">Neighbourhood footfall</span>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-200">
          <button
            onClick={() => setActiveTab('menu')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'menu'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Menu & Price Inventory ({userShop.items.length})
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'inquiries'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <span>Customer Inquiries</span>
            {shopInquiries.length > 0 && (
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {shopInquiries.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Shop Details & Timings
          </button>
        </div>

        {/* Tab 1: Menu & Price Manager */}
        {activeTab === 'menu' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900 font-display">Manage Menu Items & Prices</h3>
                <p className="text-xs text-stone-500">Add new street food dishes or kirana products with prices in ₹</p>
              </div>

              <button
                onClick={openAddItemModal}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Item</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs divide-y divide-stone-100">
              {userShop.items.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-xs text-stone-500">No items added yet. Click 'Add New Item' to start your menu.</p>
                </div>
              ) : (
                userShop.items.map(item => (
                  <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/60 transition-colors">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className={`w-3 h-3 mt-1 rounded-xs border flex items-center justify-center shrink-0 ${
                        item.isVeg ? 'border-emerald-600' : 'border-rose-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-stone-900 font-display">{item.name}</h4>
                          {item.isSpecialty && (
                            <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded font-semibold">
                              Specialty
                            </span>
                          )}
                          {!item.isAvailable && (
                            <span className="text-[10px] text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded font-semibold">
                              Sold Out
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">{item.description}</p>
                        <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-1">
                          <span>Category: {item.category}</span>
                          <span>·</span>
                          <span>Unit: {item.unit || '1 portion'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                      <div className="text-right">
                        <span className="text-base font-bold text-stone-900 tabular-nums">₹{item.price}</span>
                        <div className="text-[11px] text-stone-400">per {item.unit || 'unit'}</div>
                      </div>

                      {/* Quick stock toggle */}
                      <button
                        onClick={() => updateItemInShop(userShop.id, item.id, { isAvailable: !item.isAvailable })}
                        className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${
                          item.isAvailable 
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {item.isAvailable ? 'In Stock' : 'Mark In-Stock'}
                      </button>

                      {/* Edit item */}
                      <button
                        onClick={() => openEditItemModal(item)}
                        className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                        title="Edit Item"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Delete item */}
                      <button
                        onClick={() => {
                          if (confirm(`Remove "${item.name}" from menu?`)) {
                            deleteItemFromShop(userShop.id, item.id);
                          }
                        }}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Customer Inquiries & Pre-Orders */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-stone-900 font-display">Customer Pre-Orders & WhatsApp Inquiries</h3>
              <p className="text-xs text-stone-500">Respond directly to customers who submitted takeaway inquiries via LocalKart</p>
            </div>

            {shopInquiries.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
                <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-stone-700">No customer inquiries yet</p>
                <p className="text-xs text-stone-400 max-w-sm mx-auto mt-1">
                  When customers browse your menu and submit pre-order requests or click WhatsApp, they will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {shopInquiries.map(inq => (
                  <div key={inq.id} className="bg-white rounded-xl p-5 border border-stone-200 shadow-2xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-stone-900">{inq.customerName}</h4>
                          <span className="text-xs text-stone-500">({inq.customerPhone})</span>
                        </div>
                        <p className="text-[11px] text-stone-400 tabular-nums">Received: {inq.date}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${inq.customerPhone.replace(/[^0-9+]/g, '')}`}
                          className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg flex items-center gap-1"
                        >
                          <Phone className="w-3.5 h-3.5" /> Call Customer
                        </a>
                        <a
                          href={`https://wa.me/${inq.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${inq.customerName}, this is ${userShop.name}. Regarding your order on LocalKart:`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1"
                        >
                          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Reply
                        </a>
                      </div>
                    </div>

                    {/* Ordered Items summary */}
                    <div className="bg-stone-50 rounded-lg p-3 border border-stone-100 space-y-1.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">Requested Items:</p>
                      {inq.items.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <span className="text-stone-800">{it.name} <span className="font-bold">x {it.quantity}</span></span>
                          <span className="font-bold text-stone-900 tabular-nums">₹{it.price * it.quantity}</span>
                        </div>
                      ))}
                      <div className="pt-1.5 border-t border-stone-200 flex items-center justify-between text-xs font-bold text-stone-900">
                        <span>Total Estimated:</span>
                        <span className="text-amber-700 tabular-nums">₹{inq.totalAmount}</span>
                      </div>
                    </div>

                    {inq.message && (
                      <p className="text-xs text-stone-600 bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
                        <span className="font-semibold text-stone-700">Customer Note:</span> {inq.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Shop Profile & Timings Editor */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-2xs">
            <div className="flex items-center justify-between mb-6 border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-stone-900 font-display">Edit Shop Profile & Timings</h3>
                <p className="text-xs text-stone-500">Keep your address, phone, and opening hours updated for customers</p>
              </div>

              {saveSuccess && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Profile updated successfully!</span>
                </div>
              )}
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Shop / Stall Name</label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={e => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:border-amber-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={profileForm.category}
                    onChange={e => {
                      const cat = e.target.value as ShopCategory;
                      const labels: Record<string, string> = {
                        chaupati: 'Chaupati & Street Food',
                        street_food: 'Chaupati & Street Food',
                        kirana: 'Kirana & Spices',
                        sweets_bakery: 'Sweets & Bakery',
                        chai_beverages: 'Chai & Beverages',
                        handloom_crafts: 'Handloom & Crafts'
                      };
                      setProfileForm(prev => ({ ...prev, category: cat, categoryLabel: labels[cat] || 'Local Shop' }));
                    }}
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:border-amber-600 focus:outline-hidden"
                  >
                    <option value="chaupati">Chaupati & Street Food</option>
                    <option value="kirana">Kirana & Spices</option>
                    <option value="chai_beverages">Chai & Beverages</option>
                    <option value="sweets_bakery">Sweets & Bakery</option>
                    <option value="handloom_crafts">Handloom & Crafts</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Tagline / Famous Specialty Catchphrase</label>
                <input
                  type="text"
                  value={profileForm.tagline}
                  onChange={e => setProfileForm(prev => ({ ...prev, tagline: e.target.value }))}
                  className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:border-amber-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Locality</label>
                  <input
                    type="text"
                    required
                    value={profileForm.locality}
                    onChange={e => setProfileForm(prev => ({ ...prev, locality: e.target.value }))}
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:border-amber-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Stall Number / Shop Number</label>
                  <input
                    type="text"
                    value={profileForm.stallNumber}
                    onChange={e => setProfileForm(prev => ({ ...prev, stallNumber: e.target.value }))}
                    placeholder="e.g. Stall #42"
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:border-amber-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Nearby Landmark</label>
                  <input
                    type="text"
                    value={profileForm.landmark}
                    onChange={e => setProfileForm(prev => ({ ...prev, landmark: e.target.value }))}
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:border-amber-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Full Address</label>
                <input
                  type="text"
                  required
                  value={profileForm.address}
                  onChange={e => setProfileForm(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:border-amber-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number (For Calls)</label>
                  <input
                    type="text"
                    required
                    value={profileForm.phone}
                    onChange={e => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:border-amber-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">WhatsApp Number (e.g. 919827054321)</label>
                  <input
                    type="text"
                    required
                    value={profileForm.whatsapp}
                    onChange={e => setProfileForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:border-amber-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Opening Time (24h format)</label>
                  <input
                    type="text"
                    value={profileForm.openTime}
                    onChange={e => setProfileForm(prev => ({ ...prev, openTime: e.target.value }))}
                    placeholder="18:00"
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:border-amber-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Closing Time (24h format)</label>
                  <input
                    type="text"
                    value={profileForm.closeTime}
                    onChange={e => setProfileForm(prev => ({ ...prev, closeTime: e.target.value }))}
                    placeholder="02:30"
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:border-amber-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Stall Photo Preset or Image Path</label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {[
                    { label: 'Chaupati Tawa', path: '/src/assets/images/chaupati_food_stall_1791018535091.jpg' },
                    { label: 'Kirana & Spices', path: '/src/assets/images/kirana_spice_shop_1791018551909.jpg' },
                    { label: 'Chai & Sweets', path: '/src/assets/images/sweets_chai_corner_1791018569694.jpg' }
                  ].map(p => (
                    <button
                      type="button"
                      key={p.path}
                      onClick={() => setProfileForm(prev => ({ ...prev, image: p.path }))}
                      className={`text-xs p-2 rounded-lg border text-left flex items-center justify-between ${
                        profileForm.image === p.path ? 'border-amber-600 bg-amber-50 font-bold text-amber-800' : 'border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <span>{p.label}</span>
                      {profileForm.image === p.path && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={profileForm.image}
                  onChange={e => setProfileForm(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:border-amber-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Our Story / Heritage (Displayed on profile)</label>
                <textarea
                  rows={3}
                  value={profileForm.story}
                  onChange={e => setProfileForm(prev => ({ ...prev, story: e.target.value }))}
                  className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:border-amber-600 focus:outline-hidden"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile Changes</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* Add / Edit Item Modal */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200">
            <h3 className="text-lg font-bold text-stone-900 font-display mb-1">
              {editingItemId ? 'Edit Menu Item' : 'Add New Item to Menu'}
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Enter dish or product details. Customers can view and add this to their inquiry cart.
            </p>

            <form onSubmit={handleItemSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  value={itemForm.name}
                  onChange={e => setItemForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Cheese Pav Bhaji or Shahi Garam Masala"
                  className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={itemForm.price}
                    onChange={e => setItemForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Unit / Portion</label>
                  <input
                    type="text"
                    value={itemForm.unit}
                    onChange={e => setItemForm(prev => ({ ...prev, unit: e.target.value }))}
                    placeholder="e.g. 2 Pavs, 250g, 1 Cup"
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Category / Grouping</label>
                <input
                  type="text"
                  required
                  value={itemForm.category}
                  onChange={e => setItemForm(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="e.g. Main Snacks, Chai, Pulses"
                  className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Description / Ingredients</label>
                <textarea
                  rows={2}
                  value={itemForm.description}
                  onChange={e => setItemForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Fresh ingredients, taste profile, special spices..."
                  className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg"
                />
              </div>

              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemForm.isVeg}
                    onChange={e => setItemForm(prev => ({ ...prev, isVeg: e.target.checked }))}
                    className="rounded text-emerald-600"
                  />
                  <span>100% Pure Vegetarian</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemForm.isSpecialty}
                    onChange={e => setItemForm(prev => ({ ...prev, isSpecialty: e.target.checked }))}
                    className="rounded text-amber-600"
                  />
                  <span>Mark as Chaupati Specialty / Bestseller</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemForm.isAvailable}
                    onChange={e => setItemForm(prev => ({ ...prev, isAvailable: e.target.checked }))}
                    className="rounded text-amber-600"
                  />
                  <span>Currently In Stock & Available for Order</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs"
                >
                  {editingItemId ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
