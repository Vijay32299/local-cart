export type UserRole = 'customer' | 'vendor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  shopId?: string; // if vendor
  avatar?: string;
}

export type ShopCategory = 
  | 'chaupati' 
  | 'street_food' 
  | 'kirana' 
  | 'sweets_bakery' 
  | 'chai_beverages' 
  | 'handloom_crafts' 
  | 'fruits_veggies';

export interface ShopItem {
  id: string;
  shopId: string;
  name: string;
  category: string;
  price: number;
  unit?: string; // e.g. "plate", "cup", "kg", "500g", "pc"
  description: string;
  image?: string;
  isVeg: boolean;
  isAvailable: boolean;
  isSpecialty?: boolean;
}

export interface ShopReview {
  id: string;
  shopId: string;
  userName: string;
  userCity: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  recommendedItem?: string;
}

export interface Shop {
  id: string;
  name: string;
  tagline: string;
  ownerName: string;
  ownerId: string;
  category: ShopCategory;
  categoryLabel: string;
  locality: string;
  city: string;
  address: string;
  landmark: string;
  phone: string;
  whatsapp: string;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
  rating: number;
  reviewCount: number;
  image: string;
  additionalImages?: string[];
  isVerified: boolean;
  isFeatured: boolean;
  stallNumber?: string;
  lat?: number;
  lng?: number;
  story?: string;
  items: ShopItem[];
  reviews: ShopReview[];
}

export interface CartInquiryItem {
  item: ShopItem;
  quantity: number;
}

export interface CustomerInquiry {
  id: string;
  shopId: string;
  shopName: string;
  customerName: string;
  customerPhone: string;
  message: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  date: string;
  status: 'pending' | 'acknowledged' | 'completed';
}
