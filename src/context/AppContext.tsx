import React, { createContext, useContext, useState, useEffect } from 'react';
import { Shop, ShopItem, ShopReview, User, CartInquiryItem, CustomerInquiry } from '../types';
import { INITIAL_SHOPS, INITIAL_USERS } from '../data/initialData';

interface AppContextType {
  currentUser: User | null;
  shops: Shop[];
  inquiries: CustomerInquiry[];
  activePage: string;
  selectedShopId: string | null;
  inquiryCart: CartInquiryItem[];
  cartShopId: string | null;
  // Filters
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedLocality: string;
  setSelectedLocality: (loc: string) => void;
  onlyOpenNow: boolean;
  setOnlyOpenNow: (open: boolean) => void;
  onlyVerified: boolean;
  setOnlyVerified: (ver: boolean) => void;
  
  // Navigation
  navigateTo: (page: string, shopId?: string) => void;
  
  // Auth
  loginAs: (user: User) => void;
  registerUser: (userData: Omit<User, 'id'>, initialShop?: Partial<Shop>) => void;
  logout: () => void;
  allUsers: User[];
  
  // Shopkeeper Actions
  addShop: (shopData: Omit<Shop, 'id' | 'rating' | 'reviewCount' | 'reviews'>) => Shop;
  updateShop: (shopId: string, shopData: Partial<Shop>) => void;
  deleteShop: (shopId: string) => void;
  
  // Menu Item Actions
  addItemToShop: (shopId: string, itemData: Omit<ShopItem, 'id' | 'shopId'>) => void;
  updateItemInShop: (shopId: string, itemId: string, itemData: Partial<ShopItem>) => void;
  deleteItemFromShop: (shopId: string, itemId: string) => void;
  
  // Review Actions
  addReview: (shopId: string, review: Omit<ShopReview, 'id' | 'shopId' | 'date'>) => void;
  
  // Admin Actions
  toggleShopVerification: (shopId: string) => void;
  toggleShopFeatured: (shopId: string) => void;
  
  // Inquiry & Cart Actions
  addToInquiryCart: (item: ShopItem) => void;
  removeFromInquiryCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, qty: number) => void;
  clearInquiryCart: () => void;
  submitInquiry: (shopId: string, customerName: string, customerPhone: string, message: string) => CustomerInquiry;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('localkart_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_USERS[0]; // Default as customer
  });

  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('localkart_users');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_USERS;
  });

  const [shops, setShops] = useState<Shop[]>(() => {
    const saved = localStorage.getItem('localkart_shops');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_SHOPS;
  });

  const [inquiries, setInquiries] = useState<CustomerInquiry[]>(() => {
    const saved = localStorage.getItem('localkart_inquiries');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        id: 'inq_1',
        shopId: 'shop_sarafa_pav_bhaji',
        shopName: 'Shree Mahadev Special Pav Bhaji & Dosa',
        customerName: 'Aarav Sharma',
        customerPhone: '+91 98260 12345',
        message: 'Please keep 3 plates Special Butter Pav Bhaji ready for takeaway at 8:30 PM.',
        items: [
          { name: 'Special Amul Butter Pav Bhaji', quantity: 3, price: 130 }
        ],
        totalAmount: 390,
        date: '2026-10-02 20:15',
        status: 'acknowledged'
      }
    ];
  });

  const [activePage, setActivePage] = useState<string>('home');
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);

  // Cart / Pre-order state
  const [inquiryCart, setInquiryCart] = useState<CartInquiryItem[]>([]);
  const [cartShopId, setCartShopId] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocality, setSelectedLocality] = useState('All Localities');
  const [onlyOpenNow, setOnlyOpenNow] = useState(false);
  const [onlyVerified, setOnlyVerified] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('localkart_shops', JSON.stringify(shops));
  }, [shops]);

  useEffect(() => {
    localStorage.setItem('localkart_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('localkart_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('localkart_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('localkart_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  const navigateTo = (page: string, shopId?: string) => {
    setActivePage(page);
    if (shopId) {
      setSelectedShopId(shopId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loginAs = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'vendor' && user.shopId) {
      setActivePage('shop-dashboard');
    } else if (user.role === 'admin') {
      setActivePage('admin-dashboard');
    } else {
      setActivePage('home');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setActivePage('home');
  };

  const registerUser = (
    userData: Omit<User, 'id'>, 
    initialShop?: Partial<Shop>
  ) => {
    const newUserId = 'user_' + Date.now();
    let shopId: string | undefined = undefined;

    if (userData.role === 'vendor' && initialShop) {
      shopId = 'shop_' + Date.now();
      const newShop: Shop = {
        id: shopId,
        name: initialShop.name || 'My Local Shop',
        tagline: initialShop.tagline || 'Fresh quality local items and warm service',
        ownerName: userData.name,
        ownerId: newUserId,
        category: initialShop.category || 'street_food',
        categoryLabel: initialShop.categoryLabel || 'Street Food',
        locality: initialShop.locality || 'Sarafa Night Chaupati',
        city: initialShop.city || 'Indore',
        address: initialShop.address || 'Local Market Road',
        landmark: initialShop.landmark || 'Near Main Gate',
        phone: userData.phone || '+91 98000 00000',
        whatsapp: (userData.phone || '919800000000').replace(/[^0-9]/g, ''),
        openTime: initialShop.openTime || '10:00',
        closeTime: initialShop.closeTime || '22:00',
        isOpen: true,
        rating: 5.0,
        reviewCount: 0,
        image: initialShop.image || '/src/assets/images/kirana_spice_shop_1791018551909.jpg',
        isVerified: false, // requires admin verification
        isFeatured: false,
        stallNumber: initialShop.stallNumber || '',
        story: initialShop.story || 'Welcome to our shop! We take pride in serving high-quality products to our neighborhood.',
        items: initialShop.items || [
          {
            id: 'item_' + Date.now(),
            shopId: shopId,
            name: 'Featured Special Dish / Product',
            category: 'Specials',
            price: 100,
            unit: '1 Plate / Pack',
            description: 'Our signature local recipe prepared with genuine ingredients.',
            isVeg: true,
            isAvailable: true,
            isSpecialty: true
          }
        ],
        reviews: []
      };

      setShops(prev => [newShop, ...prev]);
    }

    const newUser: User = {
      ...userData,
      id: newUserId,
      shopId,
    };

    setAllUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);

    if (newUser.role === 'vendor') {
      setActivePage('shop-dashboard');
    } else if (newUser.role === 'admin') {
      setActivePage('admin-dashboard');
    } else {
      setActivePage('home');
    }
  };

  const addShop = (shopData: Omit<Shop, 'id' | 'rating' | 'reviewCount' | 'reviews'>): Shop => {
    const newShop: Shop = {
      ...shopData,
      id: 'shop_' + Date.now(),
      rating: 5.0,
      reviewCount: 0,
      reviews: []
    };
    setShops(prev => [newShop, ...prev]);
    return newShop;
  };

  const updateShop = (shopId: string, shopData: Partial<Shop>) => {
    setShops(prev => prev.map(s => s.id === shopId ? { ...s, ...shopData } : s));
  };

  const deleteShop = (shopId: string) => {
    setShops(prev => prev.filter(s => s.id !== shopId));
  };

  const addItemToShop = (shopId: string, itemData: Omit<ShopItem, 'id' | 'shopId'>) => {
    const newItem: ShopItem = {
      ...itemData,
      id: 'item_' + Date.now(),
      shopId,
    };
    setShops(prev => prev.map(shop => {
      if (shop.id === shopId) {
        return {
          ...shop,
          items: [...shop.items, newItem]
        };
      }
      return shop;
    }));
  };

  const updateItemInShop = (shopId: string, itemId: string, itemData: Partial<ShopItem>) => {
    setShops(prev => prev.map(shop => {
      if (shop.id === shopId) {
        return {
          ...shop,
          items: shop.items.map(it => it.id === itemId ? { ...it, ...itemData } : it)
        };
      }
      return shop;
    }));
  };

  const deleteItemFromShop = (shopId: string, itemId: string) => {
    setShops(prev => prev.map(shop => {
      if (shop.id === shopId) {
        return {
          ...shop,
          items: shop.items.filter(it => it.id !== itemId)
        };
      }
      return shop;
    }));
  };

  const addReview = (shopId: string, review: Omit<ShopReview, 'id' | 'shopId' | 'date'>) => {
    const newReview: ShopReview = {
      ...review,
      id: 'rev_' + Date.now(),
      shopId,
      date: new Date().toISOString().split('T')[0]
    };
    setShops(prev => prev.map(shop => {
      if (shop.id === shopId) {
        const updatedReviews = [newReview, ...shop.reviews];
        const avgRating = Number((updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1));
        return {
          ...shop,
          reviews: updatedReviews,
          reviewCount: updatedReviews.length,
          rating: avgRating
        };
      }
      return shop;
    }));
  };

  const toggleShopVerification = (shopId: string) => {
    setShops(prev => prev.map(s => s.id === shopId ? { ...s, isVerified: !s.isVerified } : s));
  };

  const toggleShopFeatured = (shopId: string) => {
    setShops(prev => prev.map(s => s.id === shopId ? { ...s, isFeatured: !s.isFeatured } : s));
  };

  // Cart / Pre-order logic
  const addToInquiryCart = (item: ShopItem) => {
    // If cart has items from different shop, reset
    if (cartShopId && cartShopId !== item.shopId) {
      setInquiryCart([{ item, quantity: 1 }]);
      setCartShopId(item.shopId);
      return;
    }

    setCartShopId(item.shopId);
    setInquiryCart(prev => {
      const existing = prev.find(p => p.item.id === item.id);
      if (existing) {
        return prev.map(p => p.item.id === item.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeFromInquiryCart = (itemId: string) => {
    setInquiryCart(prev => {
      const updated = prev.filter(p => p.item.id !== itemId);
      if (updated.length === 0) setCartShopId(null);
      return updated;
    });
  };

  const updateCartQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromInquiryCart(itemId);
      return;
    }
    setInquiryCart(prev => prev.map(p => p.item.id === itemId ? { ...p, quantity: qty } : p));
  };

  const clearInquiryCart = () => {
    setInquiryCart([]);
    setCartShopId(null);
  };

  const submitInquiry = (
    shopId: string,
    customerName: string,
    customerPhone: string,
    message: string
  ): CustomerInquiry => {
    const shop = shops.find(s => s.id === shopId);
    const shopName = shop ? shop.name : 'Local Shop';
    const totalAmount = inquiryCart.reduce((sum, p) => sum + (p.item.price * p.quantity), 0);
    
    const newInquiry: CustomerInquiry = {
      id: 'inq_' + Date.now(),
      shopId,
      shopName,
      customerName,
      customerPhone,
      message,
      items: inquiryCart.map(p => ({
        name: p.item.name,
        quantity: p.quantity,
        price: p.item.price
      })),
      totalAmount,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'pending'
    };

    setInquiries(prev => [newInquiry, ...prev]);
    clearInquiryCart();
    return newInquiry;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        shops,
        inquiries,
        activePage,
        selectedShopId,
        inquiryCart,
        cartShopId,
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        selectedLocality,
        setSelectedLocality,
        onlyOpenNow,
        setOnlyOpenNow,
        onlyVerified,
        setOnlyVerified,
        navigateTo,
        loginAs,
        registerUser,
        logout,
        allUsers,
        addShop,
        updateShop,
        deleteShop,
        addItemToShop,
        updateItemInShop,
        deleteItemFromShop,
        addReview,
        toggleShopVerification,
        toggleShopFeatured,
        addToInquiryCart,
        removeFromInquiryCart,
        updateCartQuantity,
        clearInquiryCart,
        submitInquiry,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
