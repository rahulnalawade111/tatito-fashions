# 🛍️ Tatito Fashions — E-Commerce Marketplace

> **Custom Fashion For Everyone** — A premium multi-vendor fashion marketplace connecting customers with boutiques, designers, jewellers, and wedding service providers across India.

![Tatito Fashions](assets/images/tatito-logo-official.jpg)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Pages](#pages)
- [AI Virtual Try-On](#ai-virtual-try-on)
- [Data Management](#data-management)
- [Design System](#design-system)
- [Responsive Design](#responsive-design)
- [Browser Support](#browser-support)

---

## 🌟 Overview

Tatito Fashions is a front-end e-commerce marketplace built with vanilla HTML, CSS, and JavaScript. It features 22+ marketplace requirements including multi-vendor stores, AI-powered virtual try-on, fashion customization, wedding collections, jewellery marketplace, event management services, and a complete shopping flow from cart to checkout to order tracking.

### Brand Identity
- **Name:** Tatito Fashions
- **Tagline:** Custom Fashion For Everyone
- **Colors:** Ivory `#FAF7F1`, Gold `#C9A24B`, Dark Ruby `#5A0A18`, Espresso `#1A120F`
- **Fonts:** Playfair Display (headings), Inter (body)
- **Logo:** Dark Ruby Maroon background (#5A0A18)

---

## ✨ Features

### Core Marketplace (22 Requirements)

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Multi-Vendor Marketplace** | 15+ stores across 7 categories with individual store pages |
| 2 | **User Authentication** | Register, Login, Logout with localStorage session management |
| 3 | **Seller Registration** | 4-step wizard for vendors to apply |
| 4 | **Location Services** | Auto-detect city via Geolocation API + manual city selection |
| 5 | **Fashion Marketplace** | Men, Women, Kids collections with 50+ products |
| 6 | **Wedding Collection** | Bridal lehengas, sherwanis, groom wear, wedding extras |
| 7 | **Jewellery** | Necklaces, earrings, bangles, bridal sets, mangalsutras |
| 8 | **AI Virtual Try-On** | Upload photo → AI analyzes body + recommends size + fit prediction |
| 9 | **Fashion Customization** | 4-step customization wizard with live cost estimation |
| 10 | **Designer Quotations** | Request custom quotes from designers |
| 11 | **Nearby Boutique Selection** | Location-based store recommendations |
| 12 | **Call Consultation** | Schedule consultations with boutiques/designers |
| 13 | **Translator Toggle** | 7 languages (English, Hindi, Marathi, Tamil, Telugu, Kannada, Gujarati) |
| 14 | **Photography & Videography** | Service packages for events and weddings |
| 15 | **Event Management** | Photography, catering, decorations, entertainment, planning |
| 16 | **Shopping & Booking Flow** | Multi-step checkout (Address → Payment → Review → Order) |
| 17 | **Live Order Tracking** | 5-stage timeline (Placed → Confirmed → Shipped → Out for Delivery → Delivered) |
| 18 | **Reviews & Ratings** | Star ratings, review forms, photo uploads |
| 19 | **Referral Program** | 4-level referral tree with rewards |
| 20 | **Notifications** | 11 notification categories with read/unread state |
| 21 | **Payment System** | Card, UPI, Cash on Delivery |
| 22 | **Address Management** | Add, edit, delete, set default addresses |

### Additional Features

- 🔥 **Hot Deals** page with live countdown timer and discount badges
- 📦 **Products** browsing page with search, filters, and 6 sort options
- 📊 **Browse Categories** with hierarchical filtering (Category → Subcategory → Group)
- 📏 **Measurement Guide** — Size chart (XS–XXL) on product detail and cart pages
- 🎨 **Full-Width Mega Menu** — Manyavar-style navbar with category images and brand colors
- 🦶 **Premium Footer** — Dark background image with ruby/gold gradient overlay
- 🌙 **Dark/Light Theme** toggle
- 📱 **Fully Responsive** — Desktop, tablet, mobile, and small phones
- 🖼️ **Welcome Splash Screen** — "Welcome to Tatito Fashions" before homepage

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| **State Management** | localStorage via `TatitoStore` IIFE |
| **AI Try-On** | Node.js proxy server → OpenAI-compatible Vision API (GLM-4.6V) |
| **Images** | Unsplash (products, stores, backgrounds) |
| **Icons** | Emoji + inline SVG |
| **Fonts** | Google Fonts (Playfair Display + Inter) |
| **No build step** | No bundlers, no frameworks, no dependencies |

---

## 📁 Project Structure

```
tatito-fashions/
├── index.html              # Homepage (hero, trending, deals, categories, stores)
├── category.html           # Browse Categories / Marketplace (hierarchical filters)
├── products.html           # All Products (search, filter, sort)
├── deals.html              # Hot Deals (countdown timer, discounts)
├── shop.html               # Store detail page (products, services, reviews)
├── try-on.html             # AI Virtual Try-On
├── customize.html          # Fashion Customization wizard
├── quotations.html         # Designer quotation requests
├── consultations.html      # Call consultation scheduling
├── cart.html               # Shopping cart (items, measurements, try-on links)
├── checkout.html           # 3-step checkout (address + payment + review)
├── order-success.html      # Order confirmation
├── orders.html             # Order history
├── order-detail.html       # Order detail with tracking timeline
├── login.html              # Login page (with auth tabs)
├── register.html           # Registration page (with auth tabs)
├── seller-register.html    # Seller registration wizard
├── profile.html            # User profile
├── addresses.html          # Saved addresses management
├── wishlist.html           # Wishlist
├── notifications.html      # Notification center
├── referral.html           # Referral program
├── about.html              # About Us
├── careers.html            # Careers (job listings + application)
├── contact.html            # Contact Us (form + info + FAQ)
├── 404.html                # Not found page
│
├── css/
│   └── style.css           # Complete stylesheet (2500+ lines)
│
├── js/
│   ├── data.js             # Catalog: categories, subcategories, stores, products, services
│   ├── store.js            # TatitoStore — localStorage state (cart, orders, auth, etc.)
│   ├── app.js              # Navbar, footer, homepage rendering, shared utilities
│   ├── catalog.js          # Browse Categories page (hierarchical filtering)
│   ├── products.js         # Products page (search, filter, sort)
│   ├── shop.js             # Store detail, cart, wishlist rendering
│   ├── checkout.js         # Multi-step checkout flow
│   ├── orders.js           # Order history, detail, tracking
│   ├── tryon.js            # AI Try-On client logic
│   ├── customize.js        # Customization wizard
│   ├── auth.js             # Login/Register logic
│   ├── profile.js          # Profile + address management
│   ├── contact.js          # Contact form + FAQ
│   ├── careers.js          # Job listings + filters
│   ├── about.js            # About page content
│   ├── deals.js            # Deals page + countdown
│   ├── notifications.js    # Notification center
│   ├── referral.js         # Referral program
│   ├── seller.js           # Seller registration
│   ├── translations.js     # 7-language i18n
│   ├── location.js         # Location detection + city selection
│   └── location-gmaps.js   # Google Maps integration
│
├── assets/
│   └── images/
│       ├── tatito-logo-official.jpg   # Official logo (500×500px)
│       ├── favicon.jpg                # Favicon
│       ├── tatito-logo.svg            # SVG logo
│       └── favicon.svg                # SVG favicon
│
├── tryon-server.js         # AI Try-On proxy server (Node.js, port 3100)
└── README.md               # This file
```

---

## 🚀 Getting Started

### Option 1: Open Directly
1. Download and extract the zip file
2. Open `index.html` in any modern browser
3. The site works immediately — no server required for basic browsing

### Option 2: With AI Try-On (Full Features)
The AI Try-On feature requires the proxy server:

```bash
# Install Node.js (v18+)
# Set your API keys in a .env file:
OPENAI_API_KEY=your_key_here
OPENAI_BASE_URL=https://llm.drytis.ai

# Start the try-on server
node tryon-server.js
# Server runs on http://localhost:3100
```

### Option 3: With Caddy (Production)
Configure Caddy reverse proxy:
- Route `/` → PHP/Static file server
- Route `/tryon-api/` → `localhost:3100`

---

## 📄 Pages

| Page | URL | Description |
|------|-----|-------------|
| **Home** | `index.html` | Hero, trending products, deals, categories, stores |
| **Browse Categories** | `category.html` | Full marketplace with hierarchical filters |
| **All Products** | `products.html` | Product grid with search, category filter, sort |
| **Hot Deals** | `deals.html` | Discounted products with live countdown |
| **Store Detail** | `shop.html?shop={id}` | Individual store with products, services, reviews |
| **AI Try-On** | `try-on.html` | Upload photo → AI body analysis + size recommendation |
| **Customize** | `customize.html` | 4-step fashion customization wizard |
| **Cart** | `cart.html` | Shopping cart with measurements + try-on links |
| **Checkout** | `checkout.html` | 3-step checkout with inline address form |
| **Order Success** | `order-success.html` | Order confirmation with order number |
| **Order Detail** | `order-detail.html?id={id}` | Tracking timeline + invoice |
| **My Orders** | `orders.html` | Order history list |
| **Login** | `login.html` | Login with auth tab switcher |
| **Register** | `register.html` | Registration with auth tab switcher |
| **Seller Register** | `seller-register.html` | 4-step vendor application |
| **Profile** | `profile.html` | User profile management |
| **Addresses** | `addresses.html` | Saved address management |
| **Wishlist** | `wishlist.html` | Saved favorite items |
| **Notifications** | `notifications.html` | 11-category notification center |
| **Referral** | `referral.html` | 4-level referral tree |
| **Quotations** | `quotations.html` | Designer quotation requests |
| **Consultations** | `consultations.html` | Call consultation booking |
| **About** | `about.html` | Company story, values, team |
| **Careers** | `careers.html` | Job listings with filters + application |
| **Contact** | `contact.html` | Contact form + info + FAQ |

---

## 🤖 AI Virtual Try-On

The AI Try-On feature uses a vision-language model to provide realistic styling analysis:

### How It Works
1. **User uploads** a full-body photo
2. **Product is selected** from the catalog (or pre-selected via `?product=` URL param)
3. **AI Vision Model** (GLM-4.6V) analyzes both images simultaneously
4. **Results displayed** with canvas compositing + detailed analysis card

### AI Analysis Includes
- **Body Analysis**: Body type, skin tone, estimated height, chest/waist/hips/shoulder measurements
- **Garment Analysis**: Dominant color, garment type, fabric, pattern
- **Size Recommendation**: XS/S/M/L/XL/XXL based on body proportions
- **Fit Prediction**: Perfect Fit / Slightly Loose / Slightly Tight / Needs Alteration
- **Styling Notes**: 3-4 sentence personalized styling advice
- **Compatibility Score**: 1-10 match rating with color-coded display

### Architecture
```
Browser → tryon.js (client)
               ↓ POST /tryon-api/api/tryon
         tryon-server.js (Node.js proxy, port 3100)
               ↓ Vision API call
         GLM-4.6V model (OpenAI-compatible)
               ↓ JSON analysis
         Client renders analysis card + canvas composite
```

The proxy server keeps the API key server-side — it's never exposed to the browser.

---

## 💾 Data Management

All state is managed via `localStorage` through the `TatitoStore` IIFE module:

| Key | Purpose |
|-----|---------|
| `tatito_cart` | Shopping cart items |
| `tatito_wishlist` | Saved favorite items |
| `tatito_orders` | Placed orders with tracking |
| `tatito_bookings` | Service bookings (photography, consultations) |
| `tatito_auth` | Authentication session |
| `tatito_user` | User profile data |
| `tatito_addresses` | Saved delivery addresses |
| `tatito_reviews` | Product/store reviews |
| `tatito_notifications` | User notifications |
| `tatito_location` | Selected city/location |
| `tatito_consultations` | Consultation bookings |
| `tatito_seller_apps` | Seller applications |
| `tatito_custom_requests` | Customization requests |
| `tatito_referrals` | Referral program data |
| `tatito_referral_code` | User's referral code |

### Pub/Sub System
`TatitoStore.subscribe(callback)` allows real-time UI updates (e.g., cart badge count) when data changes — no page reload needed.

---

## 🎨 Design System

### Color Palette
```css
--ivory:     #FAF7F1   /* Page background */
--champagne: #F5E6CE   /* Accent background */
--gold:      #C9A24B   /* Primary accent */
--gold-deep: #8B6F2E   /* Hover/dark accent */
--gold-soft: #E8D5A3   /* Light accent */
--ruby:      #7D1128   /* Secondary accent */
--ruby-deep: #5A0A18   /* Logo background, deep accent */
--espresso:  #1A120F   /* Dark sections, footer */
--text:      #2B2822   /* Body text */
--muted:     #7A736A   /* Secondary text */
--line:      #E8E0D5   /* Borders */
```

### Typography
- **Headings**: Playfair Display (500–700)
- **Body**: Inter (400–700)
- **Size scale**: 48px → 36px → 26px → 19px → 16px → 14px → 12px

### Components
- Buttons: `.btn-primary` (ruby gradient), `.btn-ghost` (outline), `.btn-gold`
- Cards: Rounded 16-20px radius with soft shadows
- Inputs: 12px radius, 44px height, gold focus ring
- Badges: Pill-shaped (999px radius) for categories, discounts, counts

---

## 📱 Responsive Design

Four breakpoints ensure the site looks perfect on all devices:

| Breakpoint | Target | Key Changes |
|-----------|--------|-------------|
| `≤1024px` | Tablet landscape | Desktop nav → hamburger, hero 1-col |
| `≤860px` | Tablet portrait | Footer 2-col, feature strips stack |
| `≤600px` | Mobile | Product grid 2-col, category 3-col, simplified nav |
| `≤380px` | Small phones | Reduced font sizes, single-column grids |

### Mega Menu
- **Desktop**: Full-width dropdown panels with category images and grouped subcategories
- **Mobile**: Collapsible hamburger menu with all categories listed

---

## 🌐 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ Requires JavaScript enabled
- ⚠️ Geolocation API requires HTTPS or localhost

---

## 📝 Notes

- **No backend required** — All data is stored in localStorage
- **No build step** — Pure HTML/CSS/JS, open and run
- **AI Try-On server** is optional — site works without it (try-on page shows fallback)
- **Product images** are loaded from Unsplash — requires internet connection
- **Demo accounts**: Register with any email/password to test the full flow

---

## 📄 License

© 2026 Tatito Fashions. All rights reserved.

---

**Built with ❤️ for the Tatito Fashions marketplace.**
