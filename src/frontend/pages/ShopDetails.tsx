import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Star, 
  CheckCircle, 
  Share2, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Check, 
  ExternalLink,
  Info,
  Calendar,
  Sparkles,
  Camera,
  Navigation
} from 'lucide-react';
import { InquiryCartDrawer } from '../components/InquiryCartDrawer';
import { ShopLocationMap } from '../components/ShopLocationMap';
import { ShopItem } from '../../backend/models';

export const ShopDetails: React.FC = () => {
  const { 
    shops, 
    selectedShopId, 
    navigateTo, 
    inquiryCart, 
    addToInquiryCart, 
    removeFromInquiryCart, 
    updateCartQuantity,
    addReview,
    currentUser 
  } = useApp();

  const [selectedItemCategory, setSelectedItemCategory] = useState<string>('all');
  const [itemSearch, setItemSearch] = useState<string>('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const shop = shops.find(s => s.id === selectedShopId) || shops[0];

  // All photos of the shop
  const allShopPhotos = useMemo(() => {
    if (!shop) return [];
    if (shop.additionalImages && shop.additionalImages.length > 0) {
      return shop.additionalImages;
    }
    return [shop.image];
  }, [shop]);

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewName, setReviewName] = useState(currentUser?.name || '');
  const [reviewCity, setReviewCity] = useState(shop?.city || 'Indore');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewItem, setReviewItem] = useState('');

  // Item categories for this specific shop
  const itemCategories = useMemo(() => {
    if (!shop) return ['all'];
    const cats = Array.from(new Set(shop.items.map(it => it.category)));
    return ['all', ...cats];
  }, [shop]);

  // Filtered items
  const filteredItems = useMemo(() => {
    if (!shop) return [];
    return shop.items.filter(item => {
      if (selectedItemCategory !== 'all' && item.category !== selectedItemCategory) {
        return false;
      }
      if (itemSearch.trim()) {
        const q = itemSearch.toLowerCase();
        return item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [shop, selectedItemCategory, itemSearch]);

  if (!shop) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <p className="text-stone-600 mb-4">Shop details not found.</p>
        <button
          onClick={() => navigateTo('home')}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-semibold"
        >
          Return to Explore
        </button>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    addReview(shop.id, {
      userName: reviewName,
      userCity: reviewCity,
      rating: reviewRating,
      comment: reviewComment,
      recommendedItem: reviewItem || undefined
    });

    setShowReviewModal(false);
    setReviewComment('');
    setReviewItem('');
  };

  const cartTotalAmount = inquiryCart.reduce((sum, item) => sum + (item.item.price * item.quantity), 0);
  const cartItemCount = inquiryCart.reduce((sum, item) => sum + item.quantity, 0);

  // Google Maps navigation link
  const mapsSearchQuery = shop.lat && shop.lng
    ? `${shop.lat},${shop.lng}`
    : `${shop.name} ${shop.address} ${shop.city}`;
  const directMapsUrl = shop.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsSearchQuery)}`;
  const embedMapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapsSearchQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="min-h-screen bg-stone-50 pb-28">
      
      {/* Back button header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <button
          onClick={() => navigateTo('home')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Shops</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Feature 1: MULTI-PHOTO GALLERY BANNER */}
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          
          {/* Main Active Photo */}
          <div className="relative h-64 sm:h-96 bg-stone-900 overflow-hidden">
            <img
              src={allShopPhotos[selectedPhotoIndex] || shop.image}
              alt={`${shop.name} photo ${selectedPhotoIndex + 1}`}
              className="w-full h-full object-cover opacity-90 transition-all duration-300"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
            
            {/* Badges on image */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-1 rounded-md text-xs font-semibold text-white backdrop-blur-md flex items-center gap-1.5 ${
                shop.isOpen ? 'bg-emerald-700/90' : 'bg-stone-800/90'
              }`}>
                <span className={`w-2 h-2 rounded-full ${shop.isOpen ? 'bg-emerald-300' : 'bg-stone-300'}`} />
                {shop.isOpen ? 'Open Now' : 'Closed for the day'}
              </span>

              {shop.isVerified && (
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold text-white bg-sky-700/90 backdrop-blur-md flex items-center gap-1 shadow-xs">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Verified Local Vendor</span>
                </span>
              )}
            </div>

            {/* Photo Counter & Stall # */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              {allShopPhotos.length > 1 && (
                <div className="bg-stone-900/80 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5" />
                  <span>{selectedPhotoIndex + 1} / {allShopPhotos.length}</span>
                </div>
              )}
              {shop.stallNumber && (
                <div className="bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-md shadow-xs">
                  {shop.stallNumber}
                </div>
              )}
            </div>

            {/* Title & Metadata over bottom of image */}
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="flex items-center gap-2 text-xs text-amber-300 mb-1 font-medium">
                <span>{shop.city}</span>
                <span>·</span>
                <span>{shop.categoryLabel}</span>
                <span>·</span>
                <span>{shop.locality}</span>
                <span>·</span>
                <span className="text-stone-300">Managed by {shop.ownerName}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-bold font-display text-white mb-2 leading-tight">
                {shop.name}
              </h1>

              <p className="text-xs sm:text-sm text-stone-200 line-clamp-2 max-w-3xl leading-relaxed">
                {shop.tagline}
              </p>
            </div>
          </div>

          {/* Multiple Photo Thumbnails Strip (if shop has 2 or more photos) */}
          {allShopPhotos.length > 1 && (
            <div className="p-3 bg-stone-900/90 border-t border-stone-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
              <span className="text-xs text-stone-400 font-semibold pl-2 shrink-0">Stall Photos:</span>
              {allShopPhotos.map((photoUrl, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => setSelectedPhotoIndex(pIdx)}
                  className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    selectedPhotoIndex === pIdx
                      ? 'border-amber-400 scale-105 shadow-sm'
                      : 'border-stone-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={photoUrl}
                    alt={`Thumb ${pIdx + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Quick Contact & Action Strip */}
          <div className="p-4 sm:p-6 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
            
            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600">
              <div className="flex items-center gap-1.5 font-medium text-stone-900">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="font-bold text-sm tabular-nums">{shop.rating}</span>
                <span className="text-stone-400">({shop.reviewCount} customer reviews)</span>
              </div>
              <span className="hidden sm:inline text-stone-300">|</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-stone-400" />
                <span className="tabular-nums font-medium">{shop.openTime} – {shop.closeTime}</span>
              </div>
              <span className="hidden sm:inline text-stone-300">|</span>
              <div className="flex items-center gap-1.5 truncate max-w-xs">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="truncate">{shop.locality}, {shop.city}</span>
              </div>
            </div>

            {/* Direct Connect Buttons */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <a
                href={`tel:${shop.phone.replace(/[^0-9+]/g, '')}`}
                className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-stone-900 bg-white hover:bg-stone-100 border border-stone-300 rounded-lg shadow-2xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-stone-700" />
                <span>Call ({shop.phone})</span>
              </a>

              <a
                href={`https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(`Namaste ${shop.name}, I found your shop on LocalKart! I would like to inquire about your items.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>

              {/* Direct Google Maps Directions Button */}
              <a
                href={directMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-stone-700 hover:text-amber-800 bg-white border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors flex items-center gap-1 text-xs font-semibold"
                title="Open in Google Maps / Directions"
              >
                <Navigation className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Directions</span>
              </a>

              <button
                onClick={handleShare}
                className="p-2 text-stone-600 hover:text-stone-900 bg-white border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                title="Share this shop"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>

          </div>
        </div>

        {/* Feature 3: GOOGLE MAPS PREVIEW & EXACT ADDRESS (For small places, colonies, gullies) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2">
            <ShopLocationMap shop={shop} />
          </div>

          {/* Story & Ordering Guidelines */}
          <div className="bg-amber-50/60 rounded-2xl p-6 border border-amber-200/70 shadow-2xs flex flex-col justify-between space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">
                About This Stall & Craft
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {shop.story || shop.tagline}
              </p>
            </div>

            <div className="pt-3 border-t border-amber-200 text-xs text-stone-600 space-y-1">
              <p className="font-bold text-amber-900">Direct Contact & Pickup:</p>
              <p>Phone: <span className="font-semibold text-stone-900">{shop.phone}</span></p>
              <p>WhatsApp: <span className="font-semibold text-stone-900">+{shop.whatsapp}</span></p>
            </div>
          </div>

        </div>

        {/* Feature 2: MENU CATALOG WITH DISH PHOTOS (e.g. Samosa, Pav Bhaji, Chai) */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 font-display">
                Menu & Available Items ({shop.items.length})
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Every dish freshly prepared with authentic local ingredients
              </p>
            </div>

            {/* Search within menu */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={itemSearch}
                onChange={e => setItemSearch(e.target.value)}
                placeholder="Search 'Samosa', 'Chai', 'Bhaji'..."
                className="text-xs px-3 py-1.5 bg-white border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-600 w-48 sm:w-60 shadow-2xs"
              />
            </div>
          </div>

          {/* Item Category Filter Tabs */}
          {itemCategories.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {itemCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedItemCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize whitespace-nowrap transition-colors cursor-pointer ${
                    selectedItemCategory === cat
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
                  }`}
                >
                  {cat === 'all' ? 'All Items' : cat}
                </button>
              ))}
            </div>
          )}

          {/* Items Grid with Dish Photo Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map(item => {
              const inCart = inquiryCart.find(ci => ci.item.id === item.id);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs hover:border-amber-300 transition-colors flex items-center justify-between gap-4 group"
                >
                  {/* Left: Dish Photo (Samosa, Pav Bhaji, etc.) */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200 relative">
                    <img
                      src={item.image || '/src/assets/images/chaupati_food_stall_1791018535091.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    {item.isSpecialty && (
                      <span className="absolute bottom-1 left-1 bg-amber-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded shadow-2xs">
                        Specialty
                      </span>
                    )}
                  </div>

                  {/* Middle: Dish Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      {/* Veg / Non veg symbol */}
                      <span className={`w-3 h-3 rounded-xs border flex items-center justify-center shrink-0 ${
                        item.isVeg ? 'border-emerald-600' : 'border-rose-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                        }`} />
                      </span>

                      <h4 className="text-sm font-bold text-stone-900 font-display truncate">
                        {item.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 text-xs mb-1.5">
                      <span className="text-sm font-bold text-stone-900 tabular-nums">
                        ₹{item.price}
                      </span>
                      {item.unit && (
                        <>
                          <span className="text-stone-300">·</span>
                          <span className="text-stone-500">{item.unit}</span>
                        </>
                      )}
                    </div>

                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Right: Quantity / Add Action */}
                  <div className="shrink-0 flex flex-col items-end justify-center">
                    {item.isAvailable ? (
                      inCart ? (
                        <div className="flex items-center border border-amber-600 rounded-lg overflow-hidden bg-amber-50">
                          <button
                            onClick={() => updateCartQuantity(item.id, inCart.quantity - 1)}
                            className="p-1.5 text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 text-xs font-bold text-amber-900 tabular-nums">
                            {inCart.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, inCart.quantity + 1)}
                            className="p-1.5 text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToInquiryCart(item)}
                          className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shadow-2xs cursor-pointer whitespace-nowrap"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Order</span>
                        </button>
                      )
                    ) : (
                      <span className="text-xs font-medium text-stone-400 bg-stone-100 px-2.5 py-1 rounded">
                        Sold Out
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
            <div>
              <h3 className="text-xl font-bold text-stone-900 font-display">
                Customer Ratings & Verified Reviews
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Real feedback from local residents and street food explorers in {shop.city}
              </p>
            </div>

            <button
              onClick={() => setShowReviewModal(true)}
              className="px-4 py-2 text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors self-start sm:self-auto cursor-pointer"
            >
              Write a Review
            </button>
          </div>

          <div className="space-y-4">
            {shop.reviews.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-6">
                Be the first to leave a review for {shop.name}!
              </p>
            ) : (
              shop.reviews.map(rev => (
                <div key={rev.id} className="border-b border-stone-100 pb-4 last:border-b-0 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-stone-900">{rev.userName}</span>
                      <span className="text-xs text-stone-400">({rev.userCity})</span>
                    </div>
                    <span className="text-xs text-stone-400 tabular-nums">{rev.date}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-500' : 'text-stone-300'}`}
                        />
                      ))}
                    </div>
                    {rev.recommendedItem && (
                      <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-medium">
                        Recommended: {rev.recommendedItem}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed pt-1">
                    "{rev.comment}"
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

      </div>

      {/* Contiguous Purchase / Inquiry Sticky Floating Bar */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-xl mx-auto z-40 bg-stone-900 text-white rounded-2xl p-3.5 shadow-2xl flex items-center justify-between border border-stone-800 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-stone-300">
                {cartItemCount} item{cartItemCount > 1 ? 's' : ''} in inquiry cart
              </p>
              <p className="text-sm font-bold text-white tabular-nums">
                Total: ₹{cartTotalAmount}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDrawerOpen(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Proceed to Order / WhatsApp</span>
          </button>
        </div>
      )}

      {/* Inquiry Cart Drawer */}
      <InquiryCartDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Add Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200">
            <h3 className="text-lg font-bold text-stone-900 font-display mb-1">
              Review {shop.name}
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Help your neighbourhood discover the best local dishes and shop experiences.
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={reviewName}
                  onChange={e => setReviewName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg"
                  placeholder="e.g. Ramesh Joshi"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Your City / Area</label>
                <input
                  type="text"
                  value={reviewCity}
                  onChange={e => setReviewCity(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg"
                  placeholder="e.g. Jabalpur or Bhopal"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setReviewRating(num)}
                      className="p-1 text-amber-500 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${num <= reviewRating ? 'fill-amber-500' : 'text-stone-300'}`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-stone-700 ml-2">{reviewRating} Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Must-Try Recommended Item (Optional)</label>
                <input
                  type="text"
                  value={reviewItem}
                  onChange={e => setReviewItem(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg"
                  placeholder="e.g. Matar Samosa or Khoya Jalebi"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Your Review & Experience</label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg"
                  placeholder="Tell others about taste, freshness, hygiene, and timing..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs cursor-pointer"
                >
                  Post Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
