import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Send, 
  Phone, 
  CheckCircle2, 
  ShoppingBag,
  ExternalLink,
  MessageCircle
} from 'lucide-react';

interface InquiryCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InquiryCartDrawer: React.FC<InquiryCartDrawerProps> = ({ isOpen, onClose }) => {
  const { 
    inquiryCart, 
    cartShopId, 
    shops, 
    currentUser, 
    updateCartQuantity, 
    removeFromInquiryCart, 
    clearInquiryCart,
    submitInquiry 
  } = useApp();

  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [note, setNote] = useState('');
  const [submittedInquiryId, setSubmittedInquiryId] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentShop = shops.find(s => s.id === cartShopId);
  const totalAmount = inquiryCart.reduce((sum, item) => sum + (item.item.price * item.quantity), 0);

  const handleWhatsAppSend = () => {
    if (!currentShop) return;
    const cleanPhone = currentShop.whatsapp.replace(/[^0-9]/g, '');
    
    // Construct pre-formatted message
    let message = `*Namaste ${currentShop.name}!* \n\nI am contacting you from LocalKart to inquire / place an order:\n\n`;
    inquiryCart.forEach((ci, idx) => {
      message += `${idx + 1}. *${ci.item.name}* x ${ci.quantity} = ₹${ci.item.price * ci.quantity}\n`;
    });
    message += `\n*Estimated Total: ₹${totalAmount}*`;
    if (customerName) message += `\n*Customer Name:* ${customerName}`;
    if (customerPhone) message += `\n*Phone:* ${customerPhone}`;
    if (note) message += `\n*Special Request:* ${note}`;
    message += `\n\n_Sent via LocalKart Finder_`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');

    // Also record it locally in app context
    submitInquiry(
      currentShop.id,
      customerName || 'Customer',
      customerPhone || 'Not provided',
      note || 'WhatsApp order initiated'
    );
    setSubmittedInquiryId('whatsapp');
  };

  const handleDirectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentShop) return;
    if (!customerName || !customerPhone) {
      alert('Please provide your name and phone number so the shopkeeper can reach you.');
      return;
    }

    const inq = submitInquiry(currentShop.id, customerName, customerPhone, note);
    setSubmittedInquiryId(inq.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-600" />
              <div>
                <h3 className="text-base font-semibold text-stone-900 font-display">
                  Order & Inquiry Cart
                </h3>
                {currentShop && (
                  <p className="text-xs text-stone-500 truncate max-w-[240px]">
                    From: {currentShop.name}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {submittedInquiryId ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-stone-900 font-display">
                  Inquiry Sent Successfully!
                </h4>
                <p className="text-sm text-stone-600 max-w-xs mx-auto">
                  Your request has reached <span className="font-semibold text-stone-800">{currentShop?.name}</span>. The shopkeeper will confirm preparation or availability shortly.
                </p>
                {currentShop && (
                  <div className="pt-2">
                    <a
                      href={`tel:${currentShop.phone.replace(/[^0-9+]/g, '')}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call Shopkeeper Directly ({currentShop.phone})</span>
                    </a>
                  </div>
                )}
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmittedInquiryId(null);
                      onClose();
                    }}
                    className="text-xs font-medium text-amber-700 hover:text-amber-800 underline"
                  >
                    Done & Continue Exploring
                  </button>
                </div>
              </div>
            ) : inquiryCart.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto" />
                <p className="text-sm font-medium text-stone-600">Your inquiry cart is empty.</p>
                <p className="text-xs text-stone-400">
                  Browse items from any local shop or chaupati stall and click "Add to Inquiry" to order or check availability.
                </p>
              </div>
            ) : (
              <>
                {/* Items List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-500 border-b border-stone-100 pb-2">
                    <span>Item ({inquiryCart.length})</span>
                    <button
                      onClick={clearInquiryCart}
                      className="text-rose-600 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Clear All
                    </button>
                  </div>

                  {inquiryCart.map(({ item, quantity }) => (
                    <div 
                      key={item.id}
                      className="flex items-start justify-between py-2 border-b border-stone-100 gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                          <h5 className="text-sm font-semibold text-stone-900 truncate">
                            {item.name}
                          </h5>
                        </div>
                        <p className="text-xs text-stone-500 tabular-nums">
                          ₹{item.price} {item.unit ? `· ${item.unit}` : ''}
                        </p>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, quantity - 1)}
                          className="px-2 py-1 text-stone-600 hover:bg-stone-200 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold tabular-nums text-stone-800">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, quantity + 1)}
                          className="px-2 py-1 text-stone-600 hover:bg-stone-200 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-stone-900 tabular-nums">
                          ₹{item.price * quantity}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Subtotal */}
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-stone-600">Estimated Total:</span>
                    <span className="text-base font-bold text-amber-700 tabular-nums">₹{totalAmount}</span>
                  </div>
                </div>

                {/* Customer Contact & Request Form */}
                <form onSubmit={handleDirectSubmit} className="space-y-3 pt-2 border-t border-stone-200">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                    Your Contact & Instructions
                  </h4>

                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Phone Number (For pickup/confirmation)</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      placeholder="e.g. +91 98260 00000"
                      className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Special Instruction or Pickup Time</label>
                    <textarea
                      rows={2}
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      placeholder="e.g. Extra spicy, pack separately, picking up at 8 PM"
                      className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-600"
                    />
                  </div>

                  {/* Actions */}
                  <div className="pt-2 space-y-2">
                    {/* Primary Option: WhatsApp Direct Chat with Shopkeeper */}
                    <button
                      type="button"
                      onClick={handleWhatsAppSend}
                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Send Order List to Shopkeeper on WhatsApp</span>
                    </button>

                    {/* Secondary Option: Store in LocalKart portal */}
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Inquiry on LocalKart</span>
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* Shopkeeper contact footer */}
          {currentShop && !submittedInquiryId && (
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs">
              <span className="text-stone-500">Need immediate help?</span>
              <a 
                href={`tel:${currentShop.phone.replace(/[^0-9+]/g, '')}`}
                className="font-semibold text-amber-700 hover:underline flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5" /> Call {currentShop.phone}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
