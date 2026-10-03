# LocalKart – Local Shop & Chaupati Finder

Platform connecting local street food stalls, night chaupatis, kirana shops, and neighbourhood customers.

---

## 📁 Project Architecture (Frontend vs Backend)

```
localkart/
├── src/
│   ├── frontend/                    <--- FRONTEND (User Interface & Client Views)
│   │   ├── components/              # Reusable UI Components
│   │   │   ├── Navbar.tsx           # Top navigation & 1-click test role switcher
│   │   │   ├── Footer.tsx           # Vocal for local directory & links
│   │   │   └── InquiryCartDrawer.tsx # Pre-order cart & WhatsApp message generator
│   │   │
│   │   ├── pages/                   # Application Pages & Screens
│   │   │   ├── Home.tsx             # Discover shops, night chaupatis & filters
│   │   │   ├── ShopDetails.tsx      # Shop profile, menu with prices, reviews, call/WhatsApp
│   │   │   ├── ShopDashboard.tsx    # Shopkeeper portal: manage items, prices, open/closed status
│   │   │   ├── AdminDashboard.tsx   # City admin: vendor verification & featured stalls
│   │   │   ├── PriceCompare.tsx     # Price comparison tool across nearby stalls
│   │   │   ├── Login.tsx            # Sign in with 1-click demo accounts
│   │   │   └── Register.tsx         # Vendor & customer onboarding form
│   │   │
│   │   └── context/                 # Client State Management
│   │       └── AppContext.tsx       # Real-time state & localStorage persistence
│   │
│   ├── backend/                     <--- BACKEND (Data, Server & Business Logic)
│   │   ├── models/                  # Data Schemas & Types
│   │   │   └── index.ts             # User, Shop, Item, Inquiry, Review definitions
│   │   │
│   │   ├── data/                    # Database & Seed Storage
│   │   │   └── initialData.ts       # Verified chaupatis, kirana stores & price comparison seed
│   │   │
│   │   ├── controllers/             # Business Logic & CRUD Handlers
│   │   │   └── shopController.ts    # Shop management, menu items, inquiries
│   │   │
│   │   ├── routes/                  # REST API Endpoints
│   │   │   └── apiRoutes.ts         # /api/shops, /api/items, /api/inquiries
│   │   │
│   │   └── server.ts                # Express Server setup
│   │
│   ├── assets/                      # High-definition images (chaupatis, stalls, kirana)
│   ├── App.tsx                      # Root Application Controller
│   ├── main.tsx                     # React Mount Entry Point
│   └── index.css                    # Tailwind CSS & Fonts
│
├── index.html                       # HTML Entry Point & SEO Metadata
└── package.json
```

---

## 🚀 Key Features

1. **Local Shop & Night Chaupati Finder**: Discover authentic stalls (Sarafa Chaupati, 56 Dukan, Old Clock Tower).
2. **Transparent Price Comparison**: Compare food items and grocery staples side-by-side with portion details and distance.
3. **Direct Contact**: 1-tap phone calls and formatted WhatsApp pre-order inquiries.
4. **Shopkeeper Dashboard**: Vendors can update shop details, add/edit menu items with prices, and toggle open/closed status live.
5. **Admin Console**: City admins can approve newly registered vendors and award the "Verified" badge.
