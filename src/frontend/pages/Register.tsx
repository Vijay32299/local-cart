import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Store, User as UserIcon, CheckCircle2, ArrowRight, Camera, Upload, Trash2, MapPin } from 'lucide-react';
import { ShopCategory, UserRole } from '../../backend/models';
import { LOCALITIES, CITIES, CITY_LOCALITIES } from '../../backend/data/initialData';
import { GoogleMapPicker } from '../components/GoogleMapPicker';

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
  const [city, setCity] = useState('Jabalpur');
  const [locality, setLocality] = useState('Civic Centre Chaupati');
  const [stallNumber, setStallNumber] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [tagline, setTagline] = useState('');
  const [openTime, setOpenTime] = useState('16:00');
  const [closeTime, setCloseTime] = useState('23:30');
  const [lat, setLat] = useState<number>(23.1815);
  const [lng, setLng] = useState<number>(79.9864);
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');

  // Multiple shop photos state
  const [shopPhotos, setShopPhotos] = useState<string[]>([
    '/src/assets/images/chaupati_food_stall_1791018535091.jpg'
  ]);

  // First dish details
  const [firstItemName, setFirstItemName] = useState('Famous Matar Samosa');
  const [firstItemPrice, setFirstItemPrice] = useState(30);
  const [firstItemUnit, setFirstItemUnit] = useState('2 pcs with chhole');
  const [firstItemImage, setFirstItemImage] = useState('/src/assets/images/chaupati_food_stall_1791018535091.jpg');

  // Handle uploading multiple photos for the shop
  const handleMultipleShopPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setShopPhotos(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle dish photo upload (e.g. samosa)
  const handleDishPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFirstItemImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeShopPhoto = (idx: number) => {
    setShopPhotos(prev => prev.filter((_, i) => i !== idx));
  };

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

      const primaryImage = shopPhotos[0] || '/src/assets/images/chaupati_food_stall_1791018535091.jpg';

      registerUser(
        {
          name,
          email,
          phone,
          role: 'vendor'
        },
        {
          name: shopName || `${name}'s Food Stall`,
          tagline: tagline || 'Authentic local taste and honest prices',
          category,
          categoryLabel: categoryLabels[category] || 'Local Shop',
          city,
          locality: locality || 'Local Market Area',
          address: address || `${locality}, ${city}`,
          landmark: landmark || 'Near Main Market Gate',
          stallNumber: stallNumber || 'Stall #1',
          openTime,
          closeTime,
          lat,
          lng,
          googleMapsUrl: googleMapsUrl || `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
          image: primaryImage,
          additionalImages: shopPhotos,
          items: [
            {
              id: 'item_' + Date.now(),
              shopId: '',
              name: firstItemName || 'Special Item',
              category: 'Snacks & Specialties',
              price: Number(firstItemPrice) || 30,
              unit: firstItemUnit || '1 Plate',
              description: 'Freshly prepared specialty dish with authentic local seasonings.',
              image: firstItemImage,
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
            Bring your street food stall, chaupati, or neighbourhood shop online with Google Maps and multiple photos!
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
              <p className="text-xs font-bold leading-tight">I am a Customer</p>
              <p className={`text-[10px] ${role === 'customer' ? 'text-amber-100' : 'text-stone-400'}`}>
                Discover eats & compare prices
              </p>
            </div>
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Account Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider text-amber-700 font-display">
                1. Your Personal Contact Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Rajesh Kumar"
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
                    placeholder="rajesh@example.com"
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">WhatsApp / Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 94253 12345"
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Create Password</label>
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
              <div className="space-y-6 pt-6 border-t border-stone-100">
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
                      placeholder="e.g. Badshah Khoya Jalebi or Mahadev Pav Bhaji"
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
                    placeholder="e.g. World famous dense Jabalpuri Khoya Jalebi made fresh in pure mawa"
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-600"
                  />
                </div>

                {/* MULTIPLE SHOP PHOTOS UPLOAD (2, 3 or more photos) */}
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                        <Camera className="w-4 h-4 text-amber-600" />
                        <span>Upload Shop / Stall Photos (Upload 2, 3, or more)</span>
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        Upload photos of your stall front, seating, hot tawa or kitchen
                      </p>
                    </div>

                    <label className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photos</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleMultipleShopPhotos}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Thumbnails of uploaded photos */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
                    {shopPhotos.map((img, idx) => (
                      <div key={idx} className="relative group aspect-4/3 rounded-lg overflow-hidden border border-stone-200 bg-white">
                        <img src={img} alt={`Shop photo ${idx + 1}`} className="w-full h-full object-cover" />
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 bg-amber-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                            Cover
                          </span>
                        )}
                        {shopPhotos.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeShopPhoto(idx)}
                            className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* EXACT LOCATION & GOOGLE MAPS PIN (For small places, colonies, gullies) */}
                <div className="bg-amber-50/70 rounded-2xl p-5 border border-amber-200/90 space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-amber-950 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-700" />
                      <span>Exact Location & Google Maps Pin (Any Small Gali / Mohalla)</span>
                    </h4>
                    <p className="text-xs text-stone-600">
                      Even if your stall is in a small gully in Jabalpur, Bhopal, or an inner bazaar, search or click on the map below to pinpoint the exact location!
                    </p>
                  </div>

                  <GoogleMapPicker
                    initialLat={lat}
                    initialLng={lng}
                    initialCity={city}
                    initialLocality={locality}
                    initialAddress={address}
                    onLocationSelect={(loc) => {
                      setAddress(loc.address);
                      setLocality(loc.locality);
                      setCity(loc.city);
                      setLandmark(loc.landmark || landmark);
                      setLat(loc.lat);
                      setLng(loc.lng);
                      setGoogleMapsUrl(`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`);
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Opening Time (e.g. 16:00)</label>
                    <input
                      type="text"
                      value={openTime}
                      onChange={e => setOpenTime(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Closing Time (e.g. 23:30)</label>
                    <input
                      type="text"
                      value={closeTime}
                      onChange={e => setCloseTime(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg"
                    />
                  </div>
                </div>

                {/* First Menu Item with Dish Photo (e.g. Samosa) */}
                <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-3">
                  <p className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-amber-600" />
                    <span>Add Your First Dish / Specialty with Photo (e.g. Samosa, Pav Bhaji, Chai):</span>
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-20 h-20 rounded-xl bg-white border border-stone-300 overflow-hidden shrink-0 shadow-2xs">
                      <img src={firstItemImage} alt="Dish preview" className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 w-full space-y-1.5">
                      <label className="px-3 py-1.5 bg-white hover:bg-stone-100 border border-stone-300 rounded-lg text-xs font-semibold text-stone-800 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs w-full">
                        <Upload className="w-3.5 h-3.5 text-amber-600" />
                        <span>Upload Dish Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleDishPhotoUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[10px] text-stone-400">
                        Take a photo of your fresh samosas or tawa dish and upload!
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 mb-1">Dish Name</label>
                      <input
                        type="text"
                        value={firstItemName}
                        onChange={e => setFirstItemName(e.target.value)}
                        placeholder="e.g. Famous Matar Samosa"
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
                        className="w-full text-xs px-3 py-1.5 border border-stone-200 rounded-lg bg-white tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 mb-1">Portion / Unit</label>
                      <input
                        type="text"
                        value={firstItemUnit}
                        onChange={e => setFirstItemUnit(e.target.value)}
                        placeholder="e.g. 2 pcs with chhole"
                        className="w-full text-xs px-3 py-1.5 border border-stone-200 rounded-lg bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{role === 'vendor' ? 'Register & Launch My Shop with Google Maps' : 'Create Customer Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-stone-100 text-center text-xs text-stone-600">
            <span>Already registered? </span>
            <button
              onClick={() => navigateTo('login')}
              className="font-bold text-amber-700 hover:underline cursor-pointer"
            >
              Sign In to Your Account
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
