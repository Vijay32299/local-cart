import { Shop, ShopItem, CustomerInquiry, ShopReview } from '../models';
import { INITIAL_SHOPS } from '../data/initialData';

// Simulated in-memory database store
let shopsDatabase: Shop[] = [...INITIAL_SHOPS];
let inquiriesDatabase: CustomerInquiry[] = [];

export const shopController = {
  // GET /api/shops - list all shops with optional locality/category filters
  getAllShops: (locality?: string, category?: string) => {
    return shopsDatabase.filter(shop => {
      if (locality && locality !== 'All Localities' && shop.locality !== locality) return false;
      if (category && category !== 'all' && shop.category !== category) return false;
      return true;
    });
  },

  // GET /api/shops/:id - get shop by ID
  getShopById: (id: string) => {
    return shopsDatabase.find(s => s.id === id) || null;
  },

  // POST /api/shops - create new shop (vendor registration)
  createShop: (shopData: Omit<Shop, 'id' | 'rating' | 'reviewCount' | 'reviews'>) => {
    const newShop: Shop = {
      ...shopData,
      id: 'shop_' + Date.now(),
      rating: 5.0,
      reviewCount: 0,
      reviews: []
    };
    shopsDatabase = [newShop, ...shopsDatabase];
    return newShop;
  },

  // PUT /api/shops/:id - update shop details
  updateShop: (id: string, updates: Partial<Shop>) => {
    shopsDatabase = shopsDatabase.map(s => s.id === id ? { ...s, ...updates } : s);
    return shopsDatabase.find(s => s.id === id) || null;
  },

  // POST /api/shops/:id/items - add new item to menu
  addItem: (shopId: string, itemData: Omit<ShopItem, 'id' | 'shopId'>) => {
    const newItem: ShopItem = {
      ...itemData,
      id: 'item_' + Date.now(),
      shopId
    };
    shopsDatabase = shopsDatabase.map(shop => {
      if (shop.id === shopId) {
        return { ...shop, items: [...shop.items, newItem] };
      }
      return shop;
    });
    return newItem;
  },

  // POST /api/inquiries - submit customer order / inquiry
  createInquiry: (inquiryData: Omit<CustomerInquiry, 'id' | 'date' | 'status'>) => {
    const newInquiry: CustomerInquiry = {
      ...inquiryData,
      id: 'inq_' + Date.now(),
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'pending'
    };
    inquiriesDatabase = [newInquiry, ...inquiriesDatabase];
    return newInquiry;
  },

  // GET /api/inquiries/:shopId - get inquiries for a vendor
  getInquiriesForShop: (shopId: string) => {
    return inquiriesDatabase.filter(inq => inq.shopId === shopId);
  }
};
