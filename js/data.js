/* =========================================================
   data.js — Tatito Fashions master catalog.
   5 verticals: Collections, Wedding, Jewellery, Events, Customize
   100+ products across 15+ stores.
   ========================================================= */

const IMG = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

/* ---------- 6 VERTICALS (navbar top-level) ----------
   Per master list: Home, Collections, Wedding, Jewellery,
   Events, Customize.  Only these 6 show in the navbar. */
const NAV_VERTICALS = [
  { slug: "collections", name: "Collections", emoji: "🛍️", image: IMG("photo-1483985988355-763728e1935b") },
  { slug: "wedding",     name: "Wedding",     emoji: "👰", image: IMG("photo-1606800052052-a08af7148866") },
  { slug: "jewellery",   name: "Jewellery",     emoji: "💍", image: IMG("photo-1515562141207-7a88fb7ce338") },
  { slug: "events",      name: "Events",      emoji: "🎉", image: IMG("photo-1519671482749-fd09be7ccebf") },
  { slug: "customize",   name: "Customize",   emoji: "✂️", image: IMG("photo-1581655353564-df123a1eb820") },
];

/* Sub-sections inside the "Collections" mega-panel (Men / Women / Kids) */
const COLLECTION_SECTIONS = [
  { slug: "men-wear",   name: "Men",   emoji: "👔", image: IMG("photo-1490578474895-699cd4e2cf59") },
  { slug: "women-wear", name: "Women", emoji: "👗", image: IMG("photo-1581338834647-b0fb40704e21") },
  { slug: "kids-wear",  name: "Kids",  emoji: "🧒", image: IMG("photo-1519278409-1f56fdda7fe5") },
];

/* Flat category list for homepage grids etc. (7 items) */
const CATEGORIES = [
  { slug: "men-wear",        name: "Men",            emoji: "👔", image: IMG("photo-1490578474895-699cd4e2cf59") },
  { slug: "women-wear",      name: "Women",          emoji: "👗", image: IMG("photo-1581338834647-b0fb40704e21") },
  { slug: "kids-wear",       name: "Kids",           emoji: "🧒", image: IMG("photo-1519278409-1f56fdda7fe5") },
  { slug: "wedding",         name: "Wedding",        emoji: "👰", image: IMG("photo-1606800052052-a08af7148866") },
  { slug: "jewellery",       name: "Jewellery",        emoji: "💍", image: IMG("photo-1515562141207-7a88fb7ce338") },
  { slug: "events",          name: "Events",         emoji: "🎉", image: IMG("photo-1519671482749-fd09be7ccebf") },
  { slug: "customize",       name: "Customize",      emoji: "✂️", image: IMG("photo-1581655353564-df123a1eb820") },
];

/* ---------- SUBCATEGORIES (grouped per master list) ----------
   Each vertical has "groups" → each group has "items".
   This drives both the mega-menu panels and category pages. */
const SUBCATEGORIES = {
  /* ===== COLLECTIONS → MEN ===== */
  "men-wear": [
    { group: "Topwear", items: ["Formal Shirts","Casual Shirts","T-Shirts","Kurtas","Kurta Sets","Sweaters","Sweatshirts","Hoodies","Jackets","Blazers","Coats","Nehru Jackets","Waistcoats"] },
    { group: "Bottomwear", items: ["Formal Trousers","Casual Trousers","Chinos","Jeans","Shorts","Cargo Pants","Track Pants","Dhoti"] },
    { group: "Innerwear & Sleepwear", items: ["Vests","Briefs","Boxers","Trunks","Thermal Wear","Night Suits","Pyjama Sets","Lounge Shorts"] },
    { group: "Footwear", items: ["Formal Shoes","Casual Shoes","Sneakers","Loafers","Sandals","Slippers","Socks"] },
    { group: "Accessories", items: ["Belts","Wallets","Watches","Sunglasses","Caps","Ties","Bow-ties","Cufflinks","Pocket Squares","Backpacks","Laptop Bags","Messenger Bags"] },
    { group: "Grooming", items: ["Perfumes","Deodorants","Face Wash","Beard Oil","Trimmers","Hair Gel","Hair Wax"] },
  ],
  /* ===== COLLECTIONS → WOMEN ===== */
  "women-wear": [
    { group: "Topwear", items: ["Tops","Tunics","Blouses","Shirts","Crop Tops","T-Shirts","Sweaters","Cardigans","Jackets","Shrugs"] },
    { group: "Bottomwear", items: ["Jeans","Trousers","Palazzos","Leggings","Jeggings","Skirts","Culottes","Shorts"] },
    { group: "Ethnic & Western Dresses", items: ["Sarees","Salwar Kameez","Churidar Sets","Kurtis","Anarkalis","Lehenga Cholis","Gowns","Dresses","Jumpsuits","Co-ord Sets"] },
    { group: "Innerwear & Sleepwear", items: ["Bras","Panties","Shapewear","Camisoles","Nightgowns","Pyjama Sets","Robes"] },
    { group: "Footwear", items: ["Heels","Flats","Wedges","Sandals","Sneakers","Slippers","Stockings"] },
    { group: "Beauty & Makeup", items: ["Foundation","Compact","Concealer","Eyeliner","Kajal","Mascara","Lipstick","Lip Gloss","Nail Polish","Moisturizer","Sunscreen","Shampoo","Conditioner","Hair Oil"] },
    { group: "Accessories", items: ["Handbags","Clutches","Totes","Slings","Watches","Sunglasses","Scarves","Dupattas","Stoles","Hair Clips","Scrunchies","Belts"] },
  ],
  /* ===== COLLECTIONS → KIDS ===== */
  "kids-wear": [
    { group: "Boys", items: ["Shirts","T-Shirts","Shorts","Jeans","Trousers","Ethnic Sets","Party Wear Sets","Night Suits"] },
    { group: "Girls", items: ["Frocks","Tops","Skirts","Leggings","Ethnic Sets","Party Dresses","Gowns","Night Suits"] },
    { group: "Infants (0–2 yrs)", items: ["Rompers","Onesies","Bodysuits","Bibs","Caps","Mittens & Booties"] },
    { group: "Footwear", items: ["School Shoes","Sandals","Sneakers","Sports Shoes","Slippers","Socks"] },
    { group: "Accessories", items: ["School Bags","Lunch Bags","Water Bottles","Caps","Hair Clips","Belts","Kids Sunglasses","Kids Watches"] },
    { group: "Kids Beauty/Care", items: ["Baby Lotion","Baby Powder","Baby Shampoo","Baby Oil"] },
  ],
  /* ===== WEDDING COLLECTIONS ===== */
  "wedding": [
    { group: "Men", items: ["Sherwanis","Indo-Western Suits","Wedding Suits","Kurta Sets","Nehru Jackets","Waistcoats","Dhoti-Angavastram","Safa/Turban","Mala","Mojaris/Juttis","Brooch","Kalgi"] },
    { group: "Women", items: ["Bridal Lehengas","Wedding Sarees","Half-Sarees","Bridal Gowns","Reception Gowns","Bridal Blouses","Dupattas","Bridal Footwear"] },
    { group: "Kids", items: ["Flower Girl Dresses","Ring Bearer Sets","Mini Lehenga","Mini Sherwani"] },
    { group: "Wedding Extras", items: ["Mehendi/Haldi Outfits","Reception Wear","Bridal Accessories Sets","Return Gift Packaging"] },
  ],
  /* ===== JEWELRY ===== */
  "jewellery": [
    { group: "Metals / Materials", items: ["Gold (24K)","Gold (22K)","Gold (18K)","Silver","Diamond","Platinum","Antique/Temple","Kundan","Polki","Meenakari","AD/CZ","Pearl","Coral"] },
    { group: "Men", items: ["Chains","Bracelets","Kadas","Rings","Cufflinks","Studs","Pendants"] },
    { group: "Women", items: ["Necklaces","Earrings","Bangles","Bracelets","Rings","Anklets","Nose Pins","Maang Tikka","Matha Patti","Mangalsutra","Waist Belts","Hair Jewellery","Bridal Sets"] },
    { group: "Kids", items: ["Kids Chains","Kids Bangles","Nazariya/Evil-eye","Kids Earrings","Kids Anklets","Kids Rings"] },
  ],
  /* ===== EVENT MANAGEMENT ===== */
  "events": [
    { group: "Photography", items: ["Traditional Photography","Candid Photography","Pre-Wedding Shoots","Maternity/Baby Shoots","Album Design"] },
    { group: "Videography", items: ["Traditional Videography","Cinematic Videography","Drone Shots","Same-Day Edit","Highlight Reels"] },
    { group: "Decorations", items: ["Stage Decoration","Mandap Decoration","Entrance Decor","Lighting Design","Table Decor","Balloon Decor"] },
    { group: "Catering", items: ["Veg Menu","Non-Veg Menu","Live Counters","Buffet Service","Cake/Dessert Counters"] },
    { group: "Entertainment", items: ["DJ & Live Music","Anchoring/Emcee","Traditional Performances"] },
    { group: "Planning & Logistics", items: ["Venue Booking","Guest List Management","Invitations & E-invites","Return Gifts","Transport/Logistics"] },
  ],
  /* ===== CUSTOMIZE ===== */
  "customize": [
    { group: "Clothing", items: ["Custom Embroidery","Monograms","Fabric/Color Choice","Made-to-Measure Tailoring"] },
    { group: "Jewellery", items: ["Design-Your-Own","Engraving","Custom Gold/Silver Weight"] },
    { group: "Wedding Cards", items: ["Custom Design","Custom Wording","Digital E-invites"] },
    { group: "Cakes & Desserts", items: ["Custom Flavors","Custom Designs/Themes"] },
    { group: "Gifts & Hampers", items: ["Custom Return Gifts","Personalized Hampers"] },
    { group: "Decor Themes", items: ["Custom Theme Decoration","Concept-Based Decor"] },
    { group: "Makeup Packages", items: ["Bridal Makeup","Family Makeup Packages"] },
    { group: "Photography Packages", items: ["Custom Shoot Packages","Location Add-ons"] },
    { group: "Merchandise", items: ["Custom Printed Mugs","Custom T-shirts","Custom Frames"] },
  ],
};

/* ---------- STORES (vendors with products) ---------- */
const STORES = [
  /* === MEN === */
  {
    id: "maison-noir", name: "Maison Noir Tailors", categoryId: "men-wear", category: "Men's Fashion",
    emoji: "👔", image: IMG("photo-1581655353564-df123a1eb820"), rating: 4.7, reviewCount: 189, distance: 1.2, open: true, badge: "Verified",
    lat: 19.0760, lng: 72.8820,
    description: "Made-to-measure fits for men, women and luxury events.", tags: ["tailor","bespoke","suits"],
    products: [
      { id: "mn-formal-shirt", name: "Premium Formal Shirt", price: 3200, description: "Bespoke shirt cut to your measurements.", image: IMG("photo-1515886657613-9f3515b0c78f"), images: [IMG("photo-1515886657613-9f3515b0c78f"), IMG("photo-1603252109303-2751441dd157")], variantType: "size", variantLabel: "Choose size", variantOptions: ["S","M","L","XL","XXL"], stock: 20 },
      { id: "mn-suit-3pc", name: "Three-Piece Designer Suit", price: 14500, originalPrice: 16000, description: "Premium tailored three-piece suit.", image: IMG("photo-1594938298603-c8148c4dae35"), images: [IMG("photo-1594938298603-c8148c4dae35"), IMG("photo-1507679799987-c73779587ccf")], variantType: "size", variantLabel: "Choose size", variantOptions: ["S","M","L","XL"], stock: 8 },
      { id: "mn-blazer", name: "Velvet Blazer", price: 8900, description: "Velvet party blazer with satin lapel.", image: IMG("photo-1507679799987-c73779587ccf"), variantType: "size", variantLabel: "Choose size", variantOptions: ["M","L","XL"], stock: 6 },
      { id: "mn-tshirt", name: "Premium Polo T-Shirt", price: 1499, originalPrice: 1999, description: "Breathable cotton pique polo.", image: IMG("photo-1583743814966-8936f5b7be1a"), variantType: "size", variantLabel: "Choose size", variantOptions: ["S","M","L","XL","XXL"], stock: 35 },
      { id: "mn-trouser", name: "Slim-Fit Trousers", price: 2499, description: "Stretch comfort formal trousers.", image: IMG("photo-1473966968600-fa801b869a1a"), variantType: "size", variantLabel: "Choose size", variantOptions: ["30","32","34","36","38"], stock: 25 },
      { id: "mn-jeans", name: "Dark Wash Jeans", price: 2999, originalPrice: 3499, description: "Slim-fit dark indigo denim.", image: IMG("photo-1542272604-787c3835535d"), variantType: "size", variantLabel: "Choose size", variantOptions: ["30","32","34","36"], stock: 30 },
      { id: "mn-kurta", name: "Silk Kurta Pajama Set", price: 4999, description: "Festive silk kurta with churidar.", image: IMG("photo-1622445275576-721325763afe"), variantType: "size", variantLabel: "Choose size", variantOptions: ["S","M","L","XL","XXL"], stock: 12 },
      { id: "mn-waistcoat", name: "Nehru Jacket Waistcoat", price: 3800, description: "Brocade Nehru jacket for ethnic occasions.", image: IMG("photo-1594938298603-c8148c4dae35"), variantType: "size", variantLabel: "Choose size", variantOptions: ["M","L","XL"], stock: 9 },
      { id: "mn-hoodie", name: "Premium Fleece Hoodie", price: 2199, originalPrice: 2799, description: "Soft cotton-blend fleece hoodie.", image: IMG("photo-1556821840-3a63f95609a7"), variantType: "size", variantLabel: "Choose size", variantOptions: ["S","M","L","XL","XXL"], stock: 22 },
      { id: "mn-sneakers", name: "Classic White Sneakers", price: 3499, description: "Minimalist leather sneakers.", image: IMG("photo-1549298916-b41d501d3772"), variantType: "size", variantLabel: "Shoe size", variantOptions: ["7","8","9","10","11"], stock: 14 },
      { id: "mn-chinos", name: "Slim-Fit Chinos", price: 1999, originalPrice: 2499, description: "Versatile cotton chinos for work or weekend.", image: IMG("photo-1473966968600-fa801b869a1a"), variantType: "size", variantLabel: "Choose size", variantOptions: ["30","32","34","36","38"], stock: 28 },
      { id: "mn-casual-shirt", name: "Linen Casual Shirt", price: 1799, description: "Breathable linen-blend casual shirt.", image: IMG("photo-1602810318383-e386cc2a3ccf"), variantType: "size", variantLabel: "Choose size", variantOptions: ["S","M","L","XL","XXL"], stock: 24 },
      { id: "mn-coat", name: "Wool Overcoat", price: 12500, originalPrice: 15000, description: "Premium wool overcoat for winter.", image: IMG("photo-1594938298603-c8148c4dae35"), variantType: "size", variantLabel: "Choose size", variantOptions: ["M","L","XL"], stock: 6 },
      { id: "mn-belt", name: "Italian Leather Belt", price: 1299, description: "Classic handcrafted leather belt.", image: IMG("photo-1553062407-98eeb64c6a62"), variantType: "size", variantLabel: "Size", variantOptions: ["32","34","36","38","40"], stock: 30 },
      { id: "mn-watch", name: "Automatic Stainless Watch", price: 6500, originalPrice: 8000, description: "Sleek automatic movement dress watch.", image: IMG("photo-1523275335684-37898b6baf30"), variantType: "none", stock: 12 },
    ],
    services: [
      { id: "mn-alteration", name: "Alteration Package", price: 1500, description: "Fit adjustment and customization.", image: IMG("photo-1483985988355-763728e1935b") },
    ],
  },

  /* === WOMEN === */
  {
    id: "zaira-designer", name: "Zaira Designer Studio", categoryId: "women-wear", category: "Women's Fashion",
    emoji: "👗", image: IMG("photo-1581338834647-b0fb40704e21"), rating: 4.8, reviewCount: 256, distance: 0.5, open: true, badge: "Premium",
    lat: 19.0820, lng: 72.8720,
    description: "Designer dresses, gowns and custom ethnic wear.", tags: ["designer","gowns","ethnic"],
    products: [
      { id: "zaira-party-dress", name: "Designer Party Dress", price: 11250, originalPrice: 13000, description: "Statement cocktail dress.", image: IMG("photo-1566174053879-31528523f8ae"), images: [IMG("photo-1566174053879-31528523f8ae"), IMG("photo-1595777457583-95e059d581b8")], variantType: "size", variantLabel: "Choose size", variantOptions: ["XS","S","M","L","XL"], stock: 5 },
      { id: "zaira-gown", name: "Couture Evening Gown", price: 18500, originalPrice: 21000, description: "Red-carpet couture gown.", image: IMG("photo-1595777457583-95e059d581b8"), variantType: "size", variantLabel: "Choose size", variantOptions: ["XS","S","M","L"], stock: 2 },
      { id: "zaira-anarkali", name: "Embroidered Anarkali Suit", price: 7800, description: "Floor-length anarkali with dupatta.", image: IMG("photo-1610030469983-98e550d6193c"), variantType: "size", variantLabel: "Choose size", variantOptions: ["S","M","L","XL","XXL"], stock: 8 },
      { id: "zaira-top", name: "Floral Peplum Top", price: 1899, originalPrice: 2499, description: "Trendy peplum top for daily wear.", image: IMG("photo-1551803091-e20673f15770"), variantType: "size", variantLabel: "Choose size", variantOptions: ["S","M","L","XL"], stock: 20 },
      { id: "zaira-jeans", name: "High-Waist Skinny Jeans", price: 2799, description: "Premium stretch denim jeans.", image: IMG("photo-1541099649105-f69ad21f3246"), variantType: "size", variantLabel: "Choose size", variantOptions: ["26","28","30","32"], stock: 15 },
      { id: "zaira-saree", name: "Silk Designer Saree", price: 9500, originalPrice: 11000, description: "Pure silk saree with matching blouse piece.", image: IMG("photo-1610030469983-98e550d6193c"), variantType: "none", stock: 7 },
      { id: "zaira-kurti", name: "Cotton Straight Kurti", price: 1299, description: "Comfortable everyday cotton kurti.", image: IMG("photo-1551803091-e20673f15770"), variantType: "size", variantLabel: "Choose size", variantOptions: ["S","M","L","XL","XXL"], stock: 40 },
      { id: "zaira-lehenga", name: "Designer Lehenga Choli", price: 14200, originalPrice: 16500, description: "Elegant party-wear lehenga.", image: IMG("photo-1610030469983-98e550d6193c"), variantType: "size", variantLabel: "Choose size", variantOptions: ["XS","S","M","L","XL"], stock: 6 },
      { id: "zaira-palazzo", name: "Printed Palazzo Set", price: 2499, description: "Comfortable kurti with palazzo pants.", image: IMG("photo-1602810318383-e386cc2a3ccf"), variantType: "size", variantLabel: "Choose size", variantOptions: ["S","M","L","XL"], stock: 18 },
      { id: "zaira-skirt", name: "Pleated Maxi Skirt", price: 1599, originalPrice: 1999, description: "Flowy pleated midi/maxi skirt.", image: IMG("photo-1594633313593-bab3825d0caf"), variantType: "size", variantLabel: "Choose size", variantOptions: ["XS","S","M","L","XL"], stock: 16 },
      { id: "zaira-salwar", name: "Salwar Kameez Set", price: 4200, originalPrice: 5000, description: "Elegant salwar kameez with dupatta.", image: IMG("photo-1610030469983-98e550d6193c"), variantType: "size", variantLabel: "Choose size", variantOptions: ["S","M","L","XL","XXL"], stock: 14 },
      { id: "zaira-leggings", name: "Cotton Leggings (3-pack)", price: 799, description: "Soft stretchable cotton leggings, pack of 3.", image: IMG("photo-1594633313593-bab3825d0caf"), variantType: "size", variantLabel: "Choose size", variantOptions: ["S","M","L","XL","XXL"], stock: 50 },
      { id: "zaira-cardigan", name: "Cropped Cardigan", price: 1599, originalPrice: 1999, description: "Lightweight knit cardigan for layering.", image: IMG("photo-1551803091-e20673f15770"), variantType: "size", variantLabel: "Choose size", variantOptions: ["S","M","L","XL"], stock: 18 },
      { id: "zaira-shrug", name: "Lace Shrug", price: 1299, description: "Delicate lace shrug for summer dresses.", image: IMG("photo-1551803091-e20673f15770"), variantType: "size", variantLabel: "Choose size", variantOptions: ["S","M","L","XL"], stock: 22 },
    ],
    services: [],
  },

  /* === WEDDING === */
  {
    id: "aaraya", name: "Aaraya Bridal Studio", categoryId: "wedding", category: "Bridal Boutique",
    emoji: "👰", image: IMG("photo-1606800052052-a08af7148866"), rating: 4.9, reviewCount: 312, distance: 0.8, open: true, badge: "Premium",
    lat: 19.0700, lng: 72.8700,
    description: "Heirloom lehengas, custom blouses and bridal styling.", tags: ["bridal","lehenga","custom"],
    products: [
      { id: "aaraya-lehenga", name: "Royal Bridal Lehenga", price: 18500, originalPrice: 22000, description: "Embroidery-rich lehenga for your special day.", image: IMG("photo-1610030469983-98e550d6193c"), images: [IMG("photo-1610030469983-98e550d6193c"), IMG("photo-1529139574466-a303027c1d8b")], variantType: "size", variantLabel: "Choose size", variantOptions: ["XS","S","M","L","XL","XXL"], stock: 5 },
      { id: "aaraya-blouse", name: "Silk Bridal Blouse", price: 4800, description: "Hand-woven silk blouse for bridal ensembles.", image: IMG("photo-1594633313593-bab3825d0caf"), variantType: "size", variantLabel: "Choose size", variantOptions: ["S","M","L","XL"], stock: 12 },
      { id: "aaraya-reception", name: "Reception Gown", price: 22000, originalPrice: 25000, description: "Stunning reception gown with stone work.", image: IMG("photo-1566174053879-31528523f8ae"), variantType: "size", variantLabel: "Choose size", variantOptions: ["XS","S","M","L"], stock: 3 },
      { id: "aaraya-saree", name: "Kanjeevaram Bridal Saree", price: 15500, description: "Pure Kanjeevaram silk with temple border.", image: IMG("photo-1610030469983-98e550d6193c"), variantType: "none", stock: 6 },
      { id: "aaraya-half-saree", name: "Half-Saree Set", price: 12000, originalPrice: 14000, description: "Traditional half-saree for coming-of-age ceremonies.", image: IMG("photo-1610030469983-98e550d6193c"), variantType: "size", variantLabel: "Choose size", variantOptions: ["S","M","L","XL"], stock: 4 },
      { id: "aaraya-dupatta", name: "Embroidered Bridal Dupatta", price: 3500, description: "Net dupatta with heavy gold embroidery.", image: IMG("photo-1529139574466-a303027c1d8b"), variantType: "none", stock: 10 },
      { id: "aaraya-mehendi", name: "Mehendi Function Outfit", price: 6500, originalPrice: 7500, description: "Colorful mehendi ceremony ensemble.", image: IMG("photo-1610030469983-98e550d6193c"), variantType: "size", variantLabel: "Choose size", variantOptions: ["S","M","L","XL"], stock: 8 },
      { id: "aaraya-reception-wear", name: "Reception Designer Saree", price: 13500, description: "Stylish party-wear saree for receptions.", image: IMG("photo-1610030469983-98e550d6193c"), variantType: "none", stock: 6 },
      { id: "aaraya-bridal-footwear", name: "Bridal Embellished Heels", price: 4200, originalPrice: 5000, description: "Stone-work heels for the bride.", image: IMG("photo-1543163521-1bf539c55dd2"), variantType: "size", variantLabel: "Shoe size", variantOptions: ["5","6","7","8"], stock: 10 },
    ],
    services: [
      { id: "aaraya-styling", name: "Bridal Styling Session", price: 3200, description: "Personal styling consultation.", image: IMG("photo-1524504388940-b1c1722653e1") },
    ],
  },

  /* === MEN WEDDING === */
  {
    id: "shah-collection", name: "Shah Collection", categoryId: "wedding", category: "Groom Wear",
    emoji: "🤵", image: IMG("photo-1622445275576-721325763afe"), rating: 4.6, reviewCount: 178, distance: 1.0, open: true, badge: "Verified",
    lat: 19.0690, lng: 72.8850,
    description: "Premium sherwanis, groom accessories and ethnic wear.", tags: ["sherwani","groom","ethnic"],
    products: [
      { id: "shah-sherwani", name: "Royal Embroidered Sherwani", price: 18500, originalPrice: 21000, description: "Heavy embroidered sherwani with churidar.", image: IMG("photo-1622445275576-721325763afe"), variantType: "size", variantLabel: "Choose size", variantOptions: ["38","40","42","44","46"], stock: 5 },
      { id: "shah-kurta", name: "Festive Kurta Pajama", price: 5600, description: "Silk-blend kurta with aligarhi pajama.", image: IMG("photo-1594938298603-c8148c4dae35"), variantType: "size", variantLabel: "Choose size", variantOptions: ["S","M","L","XL","XXL"], stock: 15 },
      { id: "shah-indo-western", name: "Indo-Western Suit", price: 12500, originalPrice: 14000, description: "Modern indo-western fusion jacket set.", image: IMG("photo-1507679799987-c73779587ccf"), variantType: "size", variantLabel: "Choose size", variantOptions: ["M","L","XL"], stock: 7 },
      { id: "shah-mojari", name: "Designer Mojaris", price: 2200, description: "Hand-crafted leather wedding mojaris.", image: IMG("photo-1449505278894-297fdb3edbc1"), variantType: "size", variantLabel: "Choose size", variantOptions: ["7","8","9","10","11"], stock: 20 },
      { id: "shah-safa", name: "Royal Wedding Safa/Turban", price: 1800, description: "Decorative groom turban with kalgi.", image: IMG("photo-1606800052052-a08af7148866"), variantType: "none", stock: 8 },
      { id: "shah-nehru", name: "Brocade Nehru Jacket", price: 4500, originalPrice: 5500, description: "Wedding-ready brocade Nehru jacket.", image: IMG("photo-1594938298603-c8148c4dae35"), variantType: "size", variantLabel: "Choose size", variantOptions: ["M","L","XL","XXL"], stock: 10 },
      { id: "shah-wedding-suit", name: "Designer Wedding Suit (3-piece)", price: 16000, originalPrice: 18500, description: "Premium 3-piece wedding suit with accessories.", image: IMG("photo-1507679799987-c73779587ccf"), variantType: "size", variantLabel: "Choose size", variantOptions: ["38","40","42","44","46"], stock: 5 },
      { id: "shah-kurta-set", name: "Groom Kurta Pajama Set", price: 5600, originalPrice: 6500, description: "Premium silk kurta with aligarhi pajama for grooms.", image: IMG("photo-1622445275576-721325763afe"), variantType: "size", variantLabel: "Choose size", variantOptions: ["S","M","L","XL","XXL"], stock: 12 },
      { id: "shah-dhoti", name: "Dhoti-Angavastram Set", price: 4200, description: "Traditional dhoti with angavastram for ceremonies.", image: IMG("photo-1606800052052-a08af7148866"), variantType: "size", variantLabel: "Choose size", variantOptions: ["M","L","XL","XXL"], stock: 8 },
      { id: "shah-brooch", name: "Diamond Brooch & Kalgi Set", price: 3200, originalPrice: 4000, description: "Elegant groom brooch and kalgi pin set.", image: IMG("photo-1605100804763-247f67b3557e"), variantType: "none", stock: 15 },
    ],
    services: [],
  },

  /* === JEWELRY === */
  {
    id: "gold-thread", name: "The Gold Thread", categoryId: "jewellery", category: "Jewellery",
    emoji: "💍", image: IMG("photo-1515562141207-7a88fb7ce338"), rating: 4.8, reviewCount: 425, distance: 1.5, open: true, badge: "Premium",
    lat: 19.0850, lng: 72.8800,
    description: "Fine jewellery, bridal sets and gift-worthy pieces.", tags: ["jewellery","bridal","gift"],
    products: [
      { id: "gt-ring", name: "Diamond Solitaire Ring", price: 9800, originalPrice: 12000, description: "0.3ct diamond solitaire in 18K gold.", image: IMG("photo-1605100804763-247f67b3557e"), variantType: "size", variantLabel: "Ring size", variantOptions: ["14","16","18","20"], stock: 10 },
      { id: "gt-necklace", name: "Gold Temple Necklace", price: 12500, description: "Antique temple design gold-plated necklace.", image: IMG("photo-1599643478518-a784e5dc4c8f"), variantType: "none", stock: 6 },
      { id: "gt-earrings", name: "Kundan Jhumka Earrings", price: 3500, originalPrice: 4200, description: "Hand-crafted Kundan jhumkas.", image: IMG("photo-1535632787350-4e68ef0ac584"), variantType: "none", stock: 15 },
      { id: "gt-bangles", name: "Gold-Plated Kada Set", price: 5800, description: "Pair of intricately designed kadas.", image: IMG("photo-1611652022419-a9419f74343d"), variantType: "size", variantLabel: "Bangle size", variantOptions: ["2.4","2.6","2.8"], stock: 8 },
      { id: "gt-mangalsutra", name: "Designer Mangalsutra", price: 4500, originalPrice: 5500, description: "Modern mangalsutra with black bead chain.", image: IMG("photo-1599643477877-530eb83abc8e"), variantType: "none", stock: 12 },
      { id: "gt-bridal-set", name: "Bridal Jewellery Set", price: 28500, originalPrice: 32000, description: "Complete bridal set: necklace, earrings, maang tikka.", image: IMG("photo-1515562141207-7a88fb7ce338"), variantType: "none", stock: 3 },
      { id: "gt-chain", name: "22K Gold Chain", price: 8200, description: "Classic 22K gold chain necklace.", image: IMG("photo-1605100804763-247f67b3557e"), variantType: "none", stock: 9 },
      { id: "gt-bracelet", name: "Diamond Tennis Bracelet", price: 15500, originalPrice: 18000, description: "Elegant line diamond bracelet.", image: IMG("photo-1611652022419-a9419f74343d"), variantType: "none", stock: 5 },
      { id: "gt-bangle", name: "Gold Bangles (pair)", price: 8500, description: "Intricately designed gold-plated bangles.", image: IMG("photo-1599643478518-a784e5dc4c8f"), variantType: "size", variantLabel: "Bangle size", variantOptions: ["2.4","2.6","2.8"], stock: 10 },
      { id: "gt-anklet", name: "Silver Anklet Pair", price: 1800, originalPrice: 2200, description: "Delicate silver anklets for daily wear.", image: IMG("photo-1599643478518-a784e5dc4c8f"), variantType: "none", stock: 20 },
      { id: "gt-kids-earrings", name: "Kids Diamond Stud Earrings", price: 2200, description: "Tiny diamond studs for children.", image: IMG("photo-1605100804763-247f67b3557e"), variantType: "none", stock: 15 },
      { id: "gt-pendant", name: "Gold Pendant with Chain", price: 5200, originalPrice: 6200, description: "Designer pendant on 22K gold chain.", image: IMG("photo-1605100804763-247f67b3557e"), variantType: "none", stock: 8 },
      { id: "gt-maang-tikka", name: "Polki Maang Tikka", price: 2800, description: "Traditional polki maang tikka.", image: IMG("photo-1535632787350-4e68ef0ac584"), variantType: "none", stock: 12 },
    ],
    services: [],
  },

  /* === KIDS === */
  {
    id: "tiny-twist", name: "Tiny Twist Kids", categoryId: "kids-wear", category: "Kids Fashion",
    emoji: "🧒", image: IMG("photo-1519278409-1f56fdda7fe5"), rating: 4.5, reviewCount: 98, distance: 2.0, open: true, badge: "Verified",
    lat: 19.0900, lng: 72.8650,
    description: "Trendy and comfortable clothing for kids of all ages.", tags: ["kids","boys","girls"],
    products: [
      { id: "tt-boys-set", name: "Boys Party Set", price: 2200, originalPrice: 2800, description: "Stylish shirt and trouser set for boys.", image: IMG("photo-1503944583220-79d8926ad5e2"), variantType: "size", variantLabel: "Age", variantOptions: ["2-3","4-5","6-7","8-9","10-11"], stock: 20 },
      { id: "tt-girls-frock", name: "Floral Princess Frock", price: 1900, description: "Cute floral frock for everyday wear.", image: IMG("photo-1518831959646-742c3a14ebf7"), variantType: "size", variantLabel: "Age", variantOptions: ["2-3","4-5","6-7","8-9"], stock: 25 },
      { id: "tt-ethnic", name: "Kids Ethnic Set", price: 2500, originalPrice: 3000, description: "Festive ethnic kurta and lehenga set.", image: IMG("photo-1518831959646-742c3a14ebf7"), variantType: "size", variantLabel: "Age", variantOptions: ["2-3","4-5","6-7","8-9","10-11"], stock: 15 },
      { id: "tt-infant", name: "Newborn Romper Set", price: 999, description: "Soft cotton romper pack of 3.", image: IMG("photo-1519689680058-324335c77eba"), variantType: "size", variantLabel: "Age", variantOptions: ["0-3m","3-6m","6-12m"], stock: 40 },
      { id: "tt-boys-tshirt", name: "Boys Graphic T-Shirt", price: 699, originalPrice: 899, description: "Fun printed cotton t-shirt.", image: IMG("photo-1503944583220-79d8926ad5e2"), variantType: "size", variantLabel: "Age", variantOptions: ["2-3","4-5","6-7","8-9","10-11"], stock: 30 },
      { id: "tt-girls-leggings", name: "Girls Cotton Leggings", price: 599, description: "Soft stretchy leggings, pack of 2.", image: IMG("photo-1518831959646-742c3a14ebf7"), variantType: "size", variantLabel: "Age", variantOptions: ["2-3","4-5","6-7","8-9"], stock: 35 },
      { id: "tt-girls-top", name: "Girls Stylish Top", price: 799, originalPrice: 999, description: "Trendy everyday top for girls.", image: IMG("photo-1518831959646-742c3a14ebf7"), variantType: "size", variantLabel: "Age", variantOptions: ["4-5","6-7","8-9","10-11"], stock: 25 },
      { id: "tt-boys-jeans", name: "Boys Slim-Fit Jeans", price: 1199, description: "Durable denim jeans for active kids.", image: IMG("photo-1503944583220-79d8926ad5e2"), variantType: "size", variantLabel: "Age", variantOptions: ["4-5","6-7","8-9","10-11"], stock: 20 },
      { id: "tt-boys-night", name: "Boys Cotton Night Suit", price: 899, originalPrice: 1100, description: "Comfortable cotton pyjama set for boys.", image: IMG("photo-1519689680058-324335c77eba"), variantType: "size", variantLabel: "Age", variantOptions: ["4-5","6-7","8-9","10-11"], stock: 30 },
      { id: "tt-school-shoes", name: "Kids School Shoes", price: 999, description: "Durable black school shoes.", image: IMG("photo-1551107696-a4b0c5a0d9a2"), variantType: "size", variantLabel: "Age", variantOptions: ["2-3","4-5","6-7","8-9","10-11"], stock: 35 },
    ],
    services: [],
  },

  /* === ETHNIC FUSION === */
  {
    id: "nivi-studio", name: "Nivi Studio", categoryId: "women-wear", category: "Ethnic Fusion",
    emoji: "🥻", image: IMG("photo-1610030469983-98e550d6193c"), rating: 4.4, reviewCount: 134, distance: 1.8, open: true, badge: "Verified",
    lat: 19.0650, lng: 72.8900,
    description: "Fusion ethnic and contemporary Indian wear.", tags: ["ethnic","fusion","sarees"],
    products: [
      { id: "nivi-ethnic", name: "Fusion Ethnic Dress", price: 3900, originalPrice: 4500, description: "Comfort-forward outfit for parties and brunches.", image: IMG("photo-1551803091-e20673f15770"), variantType: "size", variantLabel: "Choose size", variantOptions: ["S","M","L","XL","XXL"], stock: 18 },
      { id: "nivi-palazzo", name: "Palazzo Suit Set", price: 4200, description: "Flowy palazzo with printed kurti and dupatta.", image: IMG("photo-1602810318383-e386cc2a3ccf"), variantType: "size", variantLabel: "Choose size", variantOptions: ["S","M","L","XL","XXL"], stock: 12 },
      { id: "nivi-saree", name: "Chiffon Print Saree", price: 2800, description: "Lightweight printed chiffon saree.", image: IMG("photo-1610030469983-98e550d6193c"), variantType: "none", stock: 20 },
      { id: "nivi-coord", name: "Indo-Western Co-ord Set", price: 3200, originalPrice: 3999, description: "Trendy crop top and skirt co-ord set.", image: IMG("photo-1551803091-e20673f15770"), variantType: "size", variantLabel: "Choose size", variantOptions: ["S","M","L","XL"], stock: 14 },
      { id: "nivi-jumpsuit", name: "Ethnic Print Jumpsuit", price: 2500, description: "Fusion jumpsuit with ethnic print.", image: IMG("photo-1551803091-e20673f15770"), variantType: "size", variantLabel: "Choose size", variantOptions: ["S","M","L","XL"], stock: 10 },
      { id: "nivi-blouse", name: "Designer Stitched Blouse", price: 1800, originalPrice: 2200, description: "Custom-fitted blouse for sarees.", image: IMG("photo-1594633313593-bab3825d0caf"), variantType: "size", variantLabel: "Choose size", variantOptions: ["S","M","L","XL"], stock: 16 },
      { id: "nivi-churidar", name: "Churidar Suit Set", price: 3200, description: "Traditional churidar with kameez and dupatta.", image: IMG("photo-1610030469983-98e550d6193c"), variantType: "size", variantLabel: "Choose size", variantOptions: ["S","M","L","XL","XXL"], stock: 12 },
      { id: "nivi-dupatta", name: "Chiffon Printed Dupatta", price: 699, description: "Lightweight printed chiffon dupatta.", image: IMG("photo-1529139574466-a303027c1d8b"), variantType: "none", stock: 30 },
    ],
    services: [],
  },

  /* === RENTALS === */
  {
    id: "veil-rentals", name: "Veil & Vows Rentals", categoryId: "wedding", category: "Wedding Rentals",
    emoji: "🎩", image: IMG("photo-1519741497674-611481863552"), rating: 4.3, reviewCount: 67, distance: 3.2, open: false, badge: "",
    lat: 19.0500, lng: 72.9000,
    description: "Rent premium wedding wear and accessories.", tags: ["rentals","wedding"],
    products: [
      { id: "veil-accessory", name: "Crystal Bridal Veil", price: 1800, description: "Rental — crystal-embellished cathedral veil.", image: IMG("photo-1465495976277-4387d4b0b4c6"), variantType: "none", stock: 8 },
      { id: "veil-tuxedo", name: "Groom Tuxedo (Rental)", price: 3500, description: "Premium rental tuxedo with accessories.", image: IMG("photo-1507679799987-c73779587ccf"), variantType: "size", variantLabel: "Choose size", variantOptions: ["38","40","42","44"], stock: 5 },
      { id: "veil-lehenga", name: "Designer Lehenga (Rental)", price: 5500, originalPrice: 6500, description: "Rent a premium designer lehenga for the day.", image: IMG("photo-1610030469983-98e550d6193c"), variantType: "size", variantLabel: "Choose size", variantOptions: ["S","M","L","XL"], stock: 4 },
      { id: "veil-groom-accessory", name: "Groom Accessory Kit (Rental)", price: 2000, description: "Complete rental accessory set: safa, mojaris, brooch.", image: IMG("photo-1606800052052-a08af7148866"), variantType: "none", stock: 6 },
      { id: "veil-reception", name: "Reception Gown (Rental)", price: 4500, description: "Rent an elegant evening gown for receptions.", image: IMG("photo-1566174053879-31528523f8ae"), variantType: "size", variantLabel: "Choose size", variantOptions: ["S","M","L","XL"], stock: 5 },
    ],
    services: [],
  },

  /* === PHOTOGRAPHY === */
  {
    id: "lens-light", name: "Lens & Light Studios", categoryId: "events", category: "Photography",
    emoji: "📷", image: IMG("photo-1530103862676-de8c9debad1d"), rating: 4.7, reviewCount: 203, distance: 2.5, open: true, badge: "Premium",
    lat: 19.1000, lng: 72.8750,
    description: "Candid, traditional, drone and cinematic photography.", tags: ["photography","wedding","events"],
    products: [
      { id: "ll-album", name: "Premium Wedding Album (50 pages)", price: 8500, description: "Lay-flat premium photo album with leather cover.", image: IMG("photo-1519741497674-611481863552"), variantType: "none", stock: 50 },
      { id: "ll-frames", name: "Canvas Frame Set (5 pcs)", price: 4500, originalPrice: 5500, description: "Set of 5 canvas photo frames.", image: IMG("photo-1583939003579-730e3918a45a"), variantType: "none", stock: 30 },
      { id: "ll-prints", name: "Fine Art Prints (pack of 10)", price: 2000, description: "High-resolution archival prints.", image: IMG("photo-1530103862676-de8c9debad1d"), variantType: "none", stock: 100 },
    ],
    services: [
      { id: "ll-traditional", name: "Traditional Photography", price: 15000, description: "Full-day traditional wedding photography.", image: IMG("photo-1519741497674-611481863552") },
      { id: "ll-candid", name: "Candid Photography", price: 25000, description: "Artistic candid coverage of your event.", image: IMG("photo-1519225421980-715cb0215aed") },
      { id: "ll-pre-wed", name: "Pre-Wedding Shoot", price: 18000, description: "Romantic pre-wedding photoshoot at 2 locations.", image: IMG("photo-1583939003579-730e3918a45a") },
      { id: "ll-maternity", name: "Maternity/Baby Shoot", price: 12000, description: "Beautiful maternity and newborn photography.", image: IMG("photo-1519689680058-324335c77eba") },
      { id: "ll-drone", name: "Drone Photography Package", price: 15000, description: "Aerial drone shots for your event venue.", image: IMG("photo-1530103862676-de8c9debad1d") },
    ],
  },

  /* === DECORATION === */
  {
    id: "petal-affairs", name: "Petal Affairs Decorators", categoryId: "events", category: "Event Decoration",
    emoji: "🌸", image: IMG("photo-1519225421980-715cb0215aed"), rating: 4.6, reviewCount: 145, distance: 4.0, open: true, badge: "Verified",
    lat: 19.0400, lng: 72.9200,
    description: "Stage, mandap and floral decoration for all events.", tags: ["decor","wedding","events"],
    products: [
      { id: "pa-centerpiece", name: "Floral Centerpiece Set (10)", price: 8000, description: "Set of 10 elegant floral table centerpieces.", image: IMG("photo-1519225421980-715cb0215aed"), variantType: "none", stock: 20 },
      { id: "pa-backdrop", name: "Custom Photo Backdrop", price: 6500, originalPrice: 8000, description: "Personalized backdrop for photo moments.", image: IMG("photo-1465495976277-4387d4b0b4c6"), variantType: "none", stock: 15 },
      { id: "pa-lights", name: "Fairy Light Decoration Kit", price: 3000, description: "Warm fairy lights for ambient decor.", image: IMG("photo-1530103862676-de8c9debad1d"), variantType: "none", stock: 40 },
    ],
    services: [
      { id: "pa-stage", name: "Stage Decoration", price: 35000, description: "Complete stage floral and theme decor.", image: IMG("photo-1465495976277-4387d4b0b4c6") },
      { id: "pa-mandap", name: "Mandap Decoration", price: 45000, description: "Traditional or contemporary mandap setup.", image: IMG("photo-1519225421980-715cb0215aed") },
      { id: "pa-entry", name: "Entrance Decor", price: 12000, description: "Grand entrance floral and lighting setup.", image: IMG("photo-1530103862676-de8c9debad1d") },
      { id: "pa-table", name: "Table Decor Package", price: 8000, originalPrice: 10000, description: "Complete table centerpieces and runners for all tables.", image: IMG("photo-1519225421980-715cb0215aed") },
      { id: "pa-balloon", name: "Balloon Decor Package", price: 5000, description: "Themed balloon decorations for birthdays and parties.", image: IMG("photo-1530103862676-de8c9debad1d") },
    ],
  },

  /* === CATERING === */
  {
    id: "saffron-bites", name: "Saffron Bites Catering", categoryId: "events", category: "Catering",
    emoji: "🍽️", image: IMG("photo-1555244162-803834f70033"), rating: 4.5, reviewCount: 112, distance: 5.0, open: true, badge: "Verified",
    lat: 19.0300, lng: 72.9500,
    description: "Veg, non-veg, live counters and dessert bars.", tags: ["catering","food","events"],
    products: [
      { id: "sb-thali", name: "Premium Thali Set (100 pcs)", price: 12000, description: "Eco-friendly premium thali set for 100 guests.", image: IMG("photo-1555244162-803834f70033"), variantType: "none", stock: 50 },
      { id: "sb-dessert", name: "Dessert Counter Setup", price: 15000, originalPrice: 18000, description: "Complete dessert station with variety of sweets.", image: IMG("photo-1551218808-94e220e084d2"), variantType: "none", stock: 10 },
      { id: "sb-cake", name: "Custom Wedding Cake (3-tier)", price: 8500, description: "Multi-tier custom designed wedding cake.", image: IMG("photo-1535141192574-5d4897c12636"), variantType: "none", stock: 8 },
    ],
    services: [
      { id: "sb-veg", name: "Veg Catering (per plate)", price: 350, description: "Complete vegetarian menu, 25 items.", image: IMG("photo-1555244162-803834f70033") },
      { id: "sb-nonveg", name: "Non-Veg Catering (per plate)", price: 550, description: "Premium non-veg spread with biryani.", image: IMG("photo-1567620832903-9fc6debc209f") },
      { id: "sb-live", name: "Live Counter (per counter)", price: 8000, description: "Live chaat, dosa or pasta counter.", image: IMG("photo-1551218808-94e220e084d2") },
    ],
  },

  /* === MEN ACCESSORIES === */
  {
    id: "urban-craft", name: "Urban Craft Accessories", categoryId: "men-wear", category: "Men Accessories",
    emoji: "⌚", image: IMG("photo-1523275335684-37898b6baf30"), rating: 4.5, reviewCount: 87, distance: 1.5, open: true, badge: "",
    lat: 19.0780, lng: 72.8650,
    description: "Watches, wallets, belts and grooming essentials.", tags: ["accessories","grooming"],
    products: [
      { id: "uc-watch", name: "Minimalist Leather Watch", price: 4500, originalPrice: 5500, description: "Premium leather-strap analog watch.", image: IMG("photo-1523275335684-37898b6baf30"), variantType: "none", stock: 15 },
      { id: "uc-wallet", name: "Handcrafted Leather Wallet", price: 1200, description: "Genuine leather bifold wallet.", image: IMG("photo-1627123424574-724758594e93"), variantType: "none", stock: 30 },
      { id: "uc-belt", name: "Reversible Leather Belt", price: 899, originalPrice: 1299, description: "Black/brown reversible dress belt.", image: IMG("photo-1553062407-98eeb64c6a62"), variantType: "size", variantLabel: "Size", variantOptions: ["32","34","36","38","40"], stock: 25 },
      { id: "uc-perfume", name: "Oud Wood Perfume", price: 2800, description: "Long-lasting oud fragrance 100ml.", image: IMG("photo-1541643600914-78b084683601"), variantType: "none", stock: 18 },
      { id: "uc-sunglasses", name: "Aviator Sunglasses", price: 1800, originalPrice: 2200, description: "Polarized aviator sunglasses with UV protection.", image: IMG("photo-1572635196237-14b3f281503f"), variantType: "none", stock: 20 },
      { id: "uc-tie", name: "Silk Tie & Pocket Square Set", price: 1500, description: "Premium silk tie with matching pocket square.", image: IMG("photo-1589756823695-278bc923f962"), variantType: "none", stock: 22 },
      { id: "uc-backpack", name: "Leather Laptop Backpack", price: 3500, originalPrice: 4200, description: "Premium waterproof laptop backpack.", image: IMG("photo-1553062407-98eeb64c6a62"), variantType: "none", stock: 15 },
      { id: "uc-cufflinks", name: "Silver Cufflinks", price: 1200, description: "Elegant silver-tone cufflinks.", image: IMG("photo-1611652022419-a9419f74343d"), variantType: "none", stock: 20 },
      { id: "uc-cap", name: "Premium Cotton Cap", price: 699, originalPrice: 899, description: "Adjustable cotton baseball cap.", image: IMG("photo-1588850561407-ed78c282e89b"), variantType: "none", stock: 25 },
    ],
    services: [],
  },

  /* === WOMEN ACCESSORIES === */
  {
    id: "bloom-boutique", name: "Bloom Boutique", categoryId: "women-wear", category: "Women Accessories",
    emoji: "👜", image: IMG("photo-1584917865442-de89df76afd3"), rating: 4.6, reviewCount: 156, distance: 1.3, open: true, badge: "Verified",
    lat: 19.0750, lng: 72.8780,
    description: "Handbags, clutches, scarves and fashion accessories.", tags: ["bags","accessories"],
    products: [
      { id: "bb-tote", name: "Leather Tote Bag", price: 3800, originalPrice: 4500, description: "Spacious genuine leather tote.", image: IMG("photo-1584917865442-de89df76afd3"), variantType: "none", stock: 12 },
      { id: "bb-clutch", name: "Embellished Evening Clutch", price: 1800, description: "Stone-studded party clutch.", image: IMG("photo-1566150905458-1bf1fc113f0d"), variantType: "none", stock: 20 },
      { id: "bb-sling", name: "Crossbody Sling Bag", price: 2200, originalPrice: 2800, description: "Compact everyday sling bag.", image: IMG("photo-1591561954557-26941169b49e"), variantType: "none", stock: 16 },
      { id: "bb-sunglasses", name: "Designer Sunglasses", price: 1500, description: "UV-protection cat-eye sunglasses.", image: IMG("photo-1572635196237-14b3f281503f"), variantType: "none", stock: 25 },
      { id: "bb-scarf", name: "Silk Print Scarf", price: 999, originalPrice: 1499, description: "Luxurious silk printed scarf.", image: IMG("photo-1601924994987-69e26d50dc26"), variantType: "none", stock: 28 },
      { id: "bb-watch", name: "Rose Gold Women's Watch", price: 3200, description: "Elegant rose gold bracelet watch.", image: IMG("photo-1523275335684-37898b6baf30"), variantType: "none", stock: 10 },
      { id: "bb-handbag", name: "Quilted Handbag", price: 2800, originalPrice: 3500, description: "Designer-inspired quilted shoulder bag.", image: IMG("photo-1584917865442-de89df76afd3"), variantType: "none", stock: 14 },
      { id: "bb-scrunchie", name: "Silk Scrunchie Set (5 pcs)", price: 499, description: "Soft silk scrunchies, assorted colors.", image: IMG("photo-1601924994987-69e26d50dc26"), variantType: "none", stock: 40 },
      { id: "bb-hair-clip", name: "Pearl Hair Clip Set", price: 399, originalPrice: 599, description: "Elegant pearl-embellished hair clips.", image: IMG("photo-1518831959646-742c3a14ebf7"), variantType: "none", stock: 30 },
    ],
    services: [],
  },

  /* === ROYAL LOOM (Jewellery 2) === */
  {
    id: "royal-loom", name: "Royal Loom Jewellers", categoryId: "jewellery", category: "Jewellery",
    emoji: "✨", image: IMG("photo-1605100804763-247f67b3557e"), rating: 4.7, reviewCount: 234, distance: 2.0, open: true, badge: "Verified",
    lat: 19.0920, lng: 72.8700,
    description: "Gold, silver and diamond jewellery for every occasion.", tags: ["jewellery","rings","silver"],
    products: [
      { id: "rl-set", name: "Everyday Gold Set", price: 4200, description: "Minimal gold-plated necklace and earring set.", image: IMG("photo-1611652022419-a9419f74343d"), variantType: "none", stock: 10 },
      { id: "rl-silver-anklet", name: "Silver Payal Anklet", price: 1800, originalPrice: 2200, description: "Handmade silver anklet pair.", image: IMG("photo-1599643478518-a784e5dc4c8f"), variantType: "none", stock: 18 },
      { id: "rl-nose-pin", name: "Diamond Nose Pin", price: 2500, description: "Single stone diamond nose pin.", image: IMG("photo-1599643477877-530eb83abc8e"), variantType: "none", stock: 12 },
      { id: "rl-maang", name: "Maang Tikka", price: 1900, originalPrice: 2400, description: "Kundan maang tikka for occasions.", image: IMG("photo-1535632787350-4e68ef0ac584"), variantType: "none", stock: 14 },
      { id: "rl-pearl-set", name: "Pearl Necklace Set", price: 3500, originalPrice: 4200, description: "Freshwater pearl necklace with earrings.", image: IMG("photo-1599643478518-a784e5dc4c8f"), variantType: "none", stock: 8 },
      { id: "rl-kids-chain", name: "Kids Gold Chain", price: 2200, description: "Delicate gold chain for children.", image: IMG("photo-1605100804763-247f67b3557e"), variantType: "none", stock: 15 },
      { id: "rl-evil-eye", name: "Nazariya Evil-Eye Bracelet", price: 899, originalPrice: 1200, description: "Traditional evil-eye protection bracelet for kids.", image: IMG("photo-1599643478518-a784e5dc4c8f"), variantType: "none", stock: 20 },
      { id: "rl-kids-bangles", name: "Kids Silver Bangles", price: 1500, description: "Lightweight silver bangles for toddlers.", image: IMG("photo-1611652022419-a9419f74343d"), variantType: "none", stock: 12 },
      { id: "rl-platinum-ring", name: "Platinum Wedding Band", price: 12000, originalPrice: 14000, description: "Classic platinum wedding band ring.", image: IMG("photo-1605100804763-247f67b3557e"), variantType: "size", variantLabel: "Ring size", variantOptions: ["14","16","18","20"], stock: 8 },
      { id: "rl-coral-necklace", name: "Coral Bead Necklace", price: 4500, description: "Red coral bead necklace, traditional design.", image: IMG("photo-1599643478518-a784e5dc4c8f"), variantType: "none", stock: 7 },
    ],
    services: [],
  },

  /* === DJ / ENTERTAINMENT === */
  {
    id: "beat-drop", name: "Beat Drop Entertainment", categoryId: "events", category: "DJ & Music",
    emoji: "🎧", image: IMG("photo-1493225457124-a3eb161ffa5f"), rating: 4.4, reviewCount: 78, distance: 3.5, open: true, badge: "",
    lat: 19.0600, lng: 72.9100,
    description: "DJ, live music, anchoring and sound systems.", tags: ["dj","music","entertainment"],
    products: [
      { id: "bd-speaker", name: "Sound System Rental (per event)", price: 8000, description: "Professional PA system with 2 speakers + mixer.", image: IMG("photo-1493225457124-a3eb161ffa5f"), variantType: "none", stock: 8 },
      { id: "bd-lights", name: "LED Dance Floor Lights", price: 5000, originalPrice: 6500, description: "Set of programmable LED party lights.", image: IMG("photo-1516280440614-37939bbacd81"), variantType: "none", stock: 12 },
    ],
    services: [
      { id: "bd-dj", name: "Professional DJ (per event)", price: 20000, description: "Experienced DJ with full sound and lighting.", image: IMG("photo-1493225457124-a3eb161ffa5f") },
      { id: "bd-live", name: "Live Band Performance", price: 35000, description: "4-piece live band for your event.", image: IMG("photo-1516280440614-37939bbacd81") },
      { id: "bd-emcee", name: "Professional Emcee", price: 12000, description: "Bilingual event anchor for 4 hours.", image: IMG("photo-1517457373958-b7bdd4587205") },
      { id: "bd-dance-floor", name: "LED Dance Floor Setup", price: 25000, originalPrice: 30000, description: "Interactive LED dance floor with lighting.", image: IMG("photo-1516280440614-37939bbacd81") },
      { id: "bd-sound-rental", name: "Sound System + Lighting Rental", price: 12000, description: "Complete PA system with stage lighting.", image: IMG("photo-1493225457124-a3eb161ffa5f") },
    ],
  },

  /* === CUSTOMIZE — Tailoring Atelier === */
  {
    id: "stitch-art", name: "Stitch Art Atelier", categoryId: "customize", category: "Custom Tailoring",
    emoji: "✂️", image: IMG("photo-1581655353564-df123a1eb820"), rating: 4.8, reviewCount: 167, distance: 1.7, open: true, badge: "Verified",
    lat: 19.0720, lng: 72.8830,
    description: "Made-to-measure tailoring, custom embroidery and monogramming.", tags: ["custom","tailoring","embroidery"],
    products: [
      { id: "sa-custom-shirt", name: "Custom Tailored Shirt", price: 3500, description: "Made-to-measure shirt with fabric of your choice.", image: IMG("photo-1603252109303-2751441dd157"), variantType: "none", stock: 999 },
      { id: "sa-custom-suit", name: "Bespoke Suit (2-piece)", price: 22000, originalPrice: 25000, description: "Full canvas bespoke suit, multiple fittings included.", image: IMG("photo-1594938298603-c8148c4dae35"), variantType: "none", stock: 999 },
      { id: "sa-embroidery", name: "Custom Embroidery Service", price: 1500, description: "Add names, monograms or custom designs.", image: IMG("photo-1581655353564-df123a1eb820"), variantType: "none", stock: 999 },
      { id: "sa-blouse", name: "Custom Stitched Blouse", price: 1800, description: "Perfect fit blouse stitched to your measurements.", image: IMG("photo-1594633313593-bab3825d0caf"), variantType: "none", stock: 999 },
      { id: "sa-alteration", name: "Professional Alteration", price: 500, description: "Expert alteration for any garment.", image: IMG("photo-1483985988355-763728e1935b"), variantType: "none", stock: 999 },
      { id: "sa-monogram", name: "Custom Monogram Service", price: 800, description: "Personalized monogram embroidery on any garment.", image: IMG("photo-1581655353564-df123a1eb820"), variantType: "none", stock: 999 },
      { id: "sa-custom-blouse", name: "Custom Bridal Blouse Stitching", price: 3500, originalPrice: 4000, description: "Custom-stitched bridal blouse with embroidery.", image: IMG("photo-1594633313593-bab3825d0caf"), variantType: "none", stock: 999 },
      { id: "sa-fabric", name: "Premium Fabric Selection", price: 2000, description: "Choose from imported premium fabrics for your custom outfit.", image: IMG("photo-1603252109303-2751441dd157"), variantType: "none", stock: 999 },
    ],
    services: [],
  },

  /* === CUSTOMIZE — Design Studio === */
  {
    id: "design-house", name: "Tatito Design House", categoryId: "customize", category: "Custom Design",
    emoji: "🎨", image: IMG("photo-1542435503-956c469947f6"), rating: 4.6, reviewCount: 92, distance: 2.8, open: true, badge: "Verified",
    lat: 19.0550, lng: 72.8850,
    description: "Custom design services: wedding cards, cakes, gifts, decor themes.", tags: ["custom","design","personalized"],
    products: [
      { id: "dh-cards", name: "Custom Wedding Cards (100 pcs)", price: 5500, originalPrice: 7000, description: "Designer invitation cards with custom wording.", image: IMG("photo-1542435503-956c469947f6"), variantType: "none", stock: 100 },
      { id: "dh-cake", name: "Custom Themed Cake (2-tier)", price: 6500, description: "Fully customizable 2-tier cake for any occasion.", image: IMG("photo-1535141192574-5d4897c12636"), variantType: "none", stock: 20 },
      { id: "dh-hamper", name: "Personalized Gift Hamper", price: 2500, description: "Curated gift hamper with custom items.", image: IMG("photo-1513885535751-8b9238bd345a"), variantType: "none", stock: 50 },
      { id: "dh-mug", name: "Custom Printed Mugs (Set of 4)", price: 999, originalPrice: 1299, description: "Photo or text printed ceramic mugs.", image: IMG("photo-1514228742587-6b1558fcca3d"), variantType: "none", stock: 80 },
      { id: "dh-tshirt", name: "Custom Printed T-Shirt", price: 699, description: "Design your own printed t-shirt.", image: IMG("photo-1583743814966-8936f5b7be1a"), variantType: "size", variantLabel: "Choose size", variantOptions: ["S","M","L","XL","XXL"], stock: 200 },
      { id: "dh-frame", name: "Custom Photo Frame", price: 899, originalPrice: 1199, description: "Personalized engraved photo frame.", image: IMG("photo-1514228742587-6b1558fcca3d"), variantType: "none", stock: 60 },
      { id: "dh-e-invite", name: "Digital E-Invitation Design", price: 1500, description: "Custom animated digital invitation for WhatsApp.", image: IMG("photo-1542435503-956c469947f6"), variantType: "none", stock: 100 },
      { id: "dh-lipstick", name: "Custom Lipstick Shade", price: 599, description: "Create your own custom lipstick shade.", image: IMG("photo-1586495777744-4413f21062fa"), variantType: "none", stock: 50 },
      { id: "dh-skincare", name: "Personalized Skincare Kit", price: 2500, originalPrice: 3000, description: "Custom-curated skincare routine for your skin type.", image: IMG("photo-1556228720-195a672e8a03"), variantType: "none", stock: 30 },
    ],
    services: [],
  },

  /* === MEN FOOTWEAR === */
  {
    id: "step-luxe", name: "Step Luxe Footwear", categoryId: "men-wear", category: "Men's Footwear",
    emoji: "👟", image: IMG("photo-1542291026-7eec264c27ff"), rating: 4.4, reviewCount: 112, distance: 2.2, open: true, badge: "Verified",
    lat: 19.0680, lng: 72.8700,
    description: "Premium formal shoes, sneakers and ethnic footwear for men.", tags: ["footwear","shoes","sneakers"],
    products: [
      { id: "sl-oxford", name: "Oxford Leather Formal Shoes", price: 4500, originalPrice: 5500, description: "Handcrafted leather oxford shoes.", image: IMG("photo-1614252369475-531eba835eb1"), variantType: "size", variantLabel: "Shoe size", variantOptions: ["7","8","9","10","11"], stock: 14 },
      { id: "sl-loafer", name: "Suede Loafers", price: 3200, description: "Comfortable slip-on suede loafers.", image: IMG("photo-1533681904393-9ab6eee7e408"), variantType: "size", variantLabel: "Shoe size", variantOptions: ["7","8","9","10","11"], stock: 18 },
      { id: "sl-boots", name: "Chelsea Boots", price: 5800, originalPrice: 6500, description: "Premium leather Chelsea boots.", image: IMG("photo-1542272604-787c3835535d"), variantType: "size", variantLabel: "Shoe size", variantOptions: ["7","8","9","10","11"], stock: 10 },
      { id: "sl-mojaris", name: "Ethnic Velvet Mojaris", price: 1800, description: "Traditional embroidered mojaris for ethnic wear.", image: IMG("photo-1449505278894-297fdb3edbc1"), variantType: "size", variantLabel: "Shoe size", variantOptions: ["7","8","9","10"], stock: 22 },
      { id: "sl-sliders", name: "Casual Sliders", price: 899, originalPrice: 1299, description: "Comfortable everyday sliders.", image: IMG("photo-1606107557195-0e29a4b5b4aa"), variantType: "size", variantLabel: "Shoe size", variantOptions: ["7","8","9","10","11"], stock: 30 },
      { id: "sl-sneakers", name: "Designer Sneakers", price: 3500, description: "Trendy sneakers for everyday wear.", image: IMG("photo-1549298916-b41d501d3772"), variantType: "size", variantLabel: "Shoe size", variantOptions: ["7","8","9","10","11"], stock: 20 },
      { id: "sl-sandals", name: "Leather Sandals", price: 1500, originalPrice: 1800, description: "Comfortable leather sandals for daily wear.", image: IMG("photo-1603487742131-4160ec999306"), variantType: "size", variantLabel: "Shoe size", variantOptions: ["7","8","9","10","11"], stock: 25 },
      { id: "sl-slippers", name: "Indoor Comfort Slippers", price: 699, description: "Soft memory foam slippers.", image: IMG("photo-1606107557195-0e29a4b5b4aa"), variantType: "size", variantLabel: "Shoe size", variantOptions: ["7","8","9","10","11"], stock: 30 },
      { id: "sl-socks", name: "Premium Cotton Socks (5-pack)", price: 599, originalPrice: 799, description: "Breathable cotton blend socks.", image: IMG("photo-1582897085656-c636d006a246"), variantType: "none", stock: 40 },
    ],
    services: [],
  },

  /* === MEN INNERWEAR & GROOMING === */
  {
    id: "urban-edge", name: "Urban Edge Essentials", categoryId: "men-wear", category: "Men's Essentials",
    emoji: "🩲", image: IMG("photo-1521572163474-6864f9cf17ab"), rating: 4.2, reviewCount: 65, distance: 3.0, open: true, badge: "",
    lat: 19.0620, lng: 72.8620,
    description: "Premium innerwear, undershirts and grooming products.", tags: ["innerwear","grooming","essentials"],
    products: [
      { id: "ue-boxer", name: "Premium Cotton Boxer (3-pack)", price: 999, originalPrice: 1299, description: "Soft cotton blend boxer shorts.", image: IMG("photo-1521572163474-6864f9cf17ab"), variantType: "size", variantLabel: "Size", variantOptions: ["S","M","L","XL","XXL"], stock: 50 },
      { id: "ue-vest", name: "Ribbed Tank Undershirt", price: 599, description: "Breathable cotton vest, pack of 2.", image: IMG("photo-1622445275576-721325763afe"), variantType: "size", variantLabel: "Size", variantOptions: ["S","M","L","XL"], stock: 40 },
      { id: "ue-brief", name: "Cotton Briefs (5-pack)", price: 799, description: "Comfortable cotton briefs multipack.", image: IMG("photo-1521572163474-6864f9cf17ab"), variantType: "size", variantLabel: "Size", variantOptions: ["S","M","L","XL","XXL"], stock: 45 },
      { id: "ue-beard", name: "Beard Grooming Kit", price: 1800, originalPrice: 2200, description: "Complete beard care: oil, balm, brush, comb.", image: IMG("photo-1503951914875-452162b0f3f1"), variantType: "none", stock: 25 },
      { id: "ue-trimmer", name: "Cordless Beard Trimmer", price: 2500, description: "Rechargeable waterproof trimmer.", image: IMG("photo-1503951914875-452162b0f3f1"), variantType: "none", stock: 18 },
      { id: "ue-perfume", name: "Oud Cologne 100ml", price: 2200, originalPrice: 2800, description: "Long-lasting masculine fragrance.", image: IMG("photo-1541643600914-78b084683601"), variantType: "none", stock: 22 },
      { id: "ue-trunk", name: "Trunks (3-pack)", price: 899, description: "Soft cotton-blend trunks for everyday comfort.", image: IMG("photo-1521572163474-6864f9cf17ab"), variantType: "size", variantLabel: "Size", variantOptions: ["S","M","L","XL","XXL"], stock: 40 },
      { id: "ue-thermal", name: "Thermal Wear Set", price: 1500, originalPrice: 1800, description: "Warm thermal innerwear for winter.", image: IMG("photo-1521572163474-6864f9cf17ab"), variantType: "size", variantLabel: "Size", variantOptions: ["S","M","L","XL","XXL"], stock: 20 },
      { id: "ue-night", name: "Cotton Night Suit", price: 1299, description: "Comfortable cotton pyjama and t-shirt set.", image: IMG("photo-1503944583220-79d8926ad5e2"), variantType: "size", variantLabel: "Size", variantOptions: ["S","M","L","XL","XXL"], stock: 25 },
      { id: "ue-deodorant", name: "Deodorant Stick", price: 350, description: "48-hour protection deodorant.", image: IMG("photo-1541643600914-78b084683601"), variantType: "none", stock: 50 },
      { id: "ue-face-wash", name: "Men's Face Wash", price: 450, originalPrice: 550, description: "Charcoal-infused daily face wash.", image: IMG("photo-1556228720-195a672e8a03"), variantType: "none", stock: 35 },
    ],
    services: [],
  },

  /* === WOMEN FOOTWEAR === */
  {
    id: "heel-heaven", name: "Heel Heaven", categoryId: "women-wear", category: "Women's Footwear",
    emoji: "👠", image: IMG("photo-1543163521-1bf539c55dd2"), rating: 4.5, reviewCount: 143, distance: 1.6, open: true, badge: "Verified",
    lat: 19.0730, lng: 72.8740,
    description: "Designer heels, flats and ethnic footwear for women.", tags: ["footwear","heels","women"],
    products: [
      { id: "hh-stiletto", name: "Pointed Stiletto Heels", price: 3200, originalPrice: 3999, description: "Elegant party-wear stiletto heels.", image: IMG("photo-1543163521-1bf539c55dd2"), variantType: "size", variantLabel: "Shoe size", variantOptions: ["5","6","7","8","9"], stock: 12 },
      { id: "hh-wedges", name: "Comfort Wedge Sandals", price: 1800, description: "Everyday comfortable wedge sandals.", image: IMG("photo-1603487742131-4160ec999306"), variantType: "size", variantLabel: "Shoe size", variantOptions: ["5","6","7","8","9"], stock: 20 },
      { id: "hh-jutti", name: "Embroidered Punjabi Jutti", price: 1200, originalPrice: 1500, description: "Hand-embroidered ethnic jutti pair.", image: IMG("photo-1533681904393-9ab6eee7e408"), variantType: "size", variantLabel: "Shoe size", variantOptions: ["5","6","7","8"], stock: 25 },
      { id: "hh-flats", name: "Ballet Flats", price: 999, description: "Comfortable everyday ballet flats.", image: IMG("photo-1535043934128-cf0b28d52f95"), variantType: "size", variantLabel: "Shoe size", variantOptions: ["5","6","7","8","9"], stock: 30 },
      { id: "hh-block-heel", name: "Block Heel Sandals", price: 2200, description: "Stylish block heel sandals for parties.", image: IMG("photo-1535043934128-cf0b28d52f95"), variantType: "size", variantLabel: "Shoe size", variantOptions: ["5","6","7","8"], stock: 15 },
      { id: "hh-sneakers", name: "Women's White Sneakers", price: 2500, originalPrice: 3000, description: "Trendy minimalist white sneakers for women.", image: IMG("photo-1549298916-b41d501d3772"), variantType: "size", variantLabel: "Shoe size", variantOptions: ["5","6","7","8","9"], stock: 18 },
      { id: "hh-slippers", name: "Comfort Slippers", price: 599, description: "Soft indoor-outdoor slippers.", image: IMG("photo-1606107557195-0e29a4b5b4aa"), variantType: "size", variantLabel: "Shoe size", variantOptions: ["5","6","7","8","9"], stock: 25 },
      { id: "hh-stockings", name: "Sheer Stockings (3-pack)", price: 499, description: "Nude sheer stockings for formal occasions.", image: IMG("photo-1594633313593-bab3825d0caf"), variantType: "none", stock: 30 },
    ],
    services: [],
  },

  /* === WOMEN BEAUTY & MAKEUP === */
  {
    id: "glow-studio", name: "Glow Studio Beauty", categoryId: "women-wear", category: "Beauty & Makeup",
    emoji: "💄", image: IMG("photo-1487412947147-5cebf100ffc2"), rating: 4.7, reviewCount: 198, distance: 1.9, open: true, badge: "Premium",
    lat: 19.0710, lng: 72.8780,
    description: "Professional makeup, beauty products and cosmetics.", tags: ["makeup","beauty","cosmetics"],
    products: [
      { id: "gs-lipstick", name: "Luxury Matte Lipstick Set", price: 1800, originalPrice: 2200, description: "Set of 5 long-lasting matte lipsticks.", image: IMG("photo-1586495777744-4413f21062fa"), variantType: "none", stock: 30 },
      { id: "gs-skincare", name: "Bridal Skincare Kit", price: 3500, description: "Pre-bridal skincare essentials kit.", image: IMG("photo-1556228720-195a672e8a03"), variantType: "none", stock: 20 },
      { id: "gs-foundation", name: "HD Foundation", price: 1200, description: "Full coverage HD foundation for all skin types.", image: IMG("photo-1522335789203-aabd1fc54bc9"), variantType: "none", stock: 35 },
      { id: "gs-eyeshadow", name: "Nude Eyeshadow Palette (12 shades)", price: 1500, originalPrice: 1800, description: "Highly pigmented matte and shimmer palette.", image: IMG("photo-1487412947147-5cebf100ffc2"), variantType: "none", stock: 25 },
      { id: "gs-mascara", name: "Volumizing Mascara", price: 750, description: "Waterproof volume and length mascara.", image: IMG("photo-1596704017254-9b121068fb31"), variantType: "none", stock: 40 },
      { id: "gs-kajal", name: "Black Kajal Pencil", price: 250, description: "Smooth-gliding black kajal for eyes.", image: IMG("photo-1522335789203-aabd1fc54bc9"), variantType: "none", stock: 50 },
      { id: "gs-concealer", name: "Full Coverage Concealer", price: 650, originalPrice: 800, description: "Long-lasting cream concealer.", image: IMG("photo-1522335789203-aabd1fc54bc9"), variantType: "none", stock: 30 },
      { id: "gs-nail-polish", name: "Gel Nail Polish Set (6 shades)", price: 899, description: "Long-wear gel nail polish collection.", image: IMG("photo-1596704017254-9b121068fb31"), variantType: "none", stock: 25 },
      { id: "gs-sunscreen", name: "SPF50 Sunscreen", price: 550, description: "Lightweight daily sun protection.", image: IMG("photo-1556228720-195a672e8a03"), variantType: "none", stock: 35 },
      { id: "gs-shampoo", name: "Sulfate-Free Shampoo", price: 450, originalPrice: 550, description: "Gentle cleansing shampoo for all hair types.", image: IMG("photo-1556228720-195a672e8a03"), variantType: "none", stock: 40 },
    ],
    services: [],
  },

  /* === KIDS FOOTWEAR & ACCESSORIES === */
  {
    id: "little-stars", name: "Little Stars Kids World", categoryId: "kids-wear", category: "Kids Accessories",
    emoji: "⭐", image: IMG("photo-1518831959646-742c3a14ebf7"), rating: 4.3, reviewCount: 76, distance: 2.5, open: true, badge: "",
    lat: 19.0870, lng: 72.8700,
    description: "Kids footwear, accessories and ethnic wear.", tags: ["kids","accessories","ethnic"],
    products: [
      { id: "ls-kids-shoes", name: "Kids Light-Up Sneakers", price: 1299, originalPrice: 1599, description: "LED light-up sneakers for kids.", image: IMG("photo-1551107696-a4b0c5a0d9a2"), variantType: "size", variantLabel: "Age", variantOptions: ["4-5","6-7","8-9","10-11"], stock: 20 },
      { id: "ls-kids-sandals", name: "Kids Summer Sandals", price: 799, description: "Comfortable breathable sandals.", image: IMG("photo-1525966222134-fcfa99b8ae77"), variantType: "size", variantLabel: "Age", variantOptions: ["2-3","4-5","6-7","8-9"], stock: 25 },
      { id: "ls-kids-cap", name: "Kids Sun Protection Hat", price: 499, originalPrice: 699, description: "UV protection wide-brim hat.", image: IMG("photo-1503944583220-79d8926ad5e2"), variantType: "size", variantLabel: "Age", variantOptions: ["2-3","4-5","6-7","8-9"], stock: 30 },
      { id: "ls-kids-ethnic", name: "Kids Sherwani Set", price: 3200, originalPrice: 3800, description: "Mini sherwani for wedding functions.", image: IMG("photo-1518831959646-742c3a14ebf7"), variantType: "size", variantLabel: "Age", variantOptions: ["2-3","4-5","6-7","8-9","10-11"], stock: 12 },
      { id: "ls-kids-lehenga", name: "Kids Lehenga Choli", price: 2800, description: "Adorable festive lehenga for girls.", image: IMG("photo-1518831959646-742c3a14ebf7"), variantType: "size", variantLabel: "Age", variantOptions: ["2-3","4-5","6-7","8-9"], stock: 15 },
      { id: "ls-school-bag", name: "Kids School Backpack", price: 899, originalPrice: 1199, description: "Durable colorful school bag with compartments.", image: IMG("photo-1553062407-98eeb64c6a62"), variantType: "none", stock: 25 },
      { id: "ls-water-bottle", name: "Kids Water Bottle", price: 349, description: "BPA-free spill-proof water bottle.", image: IMG("photo-1551107696-a4b0c5a0d9a2"), variantType: "none", stock: 40 },
      { id: "ls-kids-watch", name: "Kids Digital Watch", price: 599, originalPrice: 799, description: "Fun waterproof digital watch for kids.", image: IMG("photo-1523275335684-37898b6baf30"), variantType: "none", stock: 20 },
      { id: "ls-baby-shampoo", name: "Baby Gentle Shampoo", price: 299, description: "Tear-free gentle shampoo for babies.", image: IMG("photo-1556228720-195a672e8a03"), variantType: "none", stock: 35 },
    ],
    services: [],
  },

  /* === EVENTS — Planning === */
  {
    id: "grand-gala", name: "Grand Gala Planners", categoryId: "events", category: "Event Planning",
    emoji: "🎪", image: IMG("photo-1519671482749-fd09be7ccebf"), rating: 4.6, reviewCount: 89, distance: 3.5, open: true, badge: "Verified",
    lat: 19.0450, lng: 72.9300,
    description: "Complete event planning, venue booking and logistics management.", tags: ["planning","logistics","events"],
    products: [
      { id: "gg-wedding-plan", name: "Complete Wedding Planning Package", price: 150000, originalPrice: 180000, description: "End-to-end wedding planning including vendor management.", image: IMG("photo-1519671482749-fd09be7ccebf"), variantType: "none", stock: 10 },
      { id: "gg-venue", name: "Venue Sourcing & Booking Service", price: 25000, description: "Find and book the perfect venue for your event.", image: IMG("photo-1519167758481-83f550bb49b3"), variantType: "none", stock: 20 },
      { id: "gg-coordinator", name: "Event Day Coordinator", price: 15000, originalPrice: 18000, description: "Professional day-of event coordination.", image: IMG("photo-1530103862676-de8c9debad1d"), variantType: "none", stock: 15 },
    ],
    services: [
      { id: "gg-full-plan", name: "Full Event Management", price: 200000, description: "Complete event planning from concept to execution.", image: IMG("photo-1519671482749-fd09be7ccebf") },
      { id: "gg-e-invite", name: "Digital E-Invitations", price: 3000, description: "Custom designed e-invitations with RSVP tracking.", image: IMG("photo-1542435503-956c469947f6") },
      { id: "gg-gifts", name: "Return Gifts Management", price: 15000, description: "Source, package and distribute return gifts.", image: IMG("photo-1513885535751-8b9238bd345a") },
      { id: "gg-transport", name: "Guest Transport & Logistics", price: 20000, originalPrice: 25000, description: "Complete guest transportation and logistics management.", image: IMG("photo-1519671482749-fd09be7ccebf") },
    ],
  },
];

/* ---------- Auto-tag products with subCategory ---------- */
/* Tags each product with a subCategory slug based on product name keywords,
   so the navbar/filter system can filter by subcategory correctly. */
(function autoTagSubCategories() {
  const KEYWORD_MAP = {
    "topwear": ["shirt", "tshirt", "t-shirt", "tee", "polo", "kurta", "kurti", "hoodie", "sweater", "jacket", "blazer", "top", "peplum", "tank", "vest", "waistcoat", "nehru", "sherwani", "indo-western", "crop top", "coord"],
    "bottomwear": ["trouser", "jeans", "pant", "pajama", "churidar", "legging", "palazzo", "skirt", "short", "jogger", "aligarhi"],
    "innerwear": ["boxer", "undershirt", "brief", "trunk", "romper", "innerwear", "sleepwear", "lingerie", "bra", "thermal", "night suit", "pyjama", "panties", "shapewear", "camisole", "nightgown", "robe"],
    "footwear": ["shoe", "sneaker", "loafer", "boot", "mojari", "sandal", "slipper", "slider", "jutti", "heel", "stiletto", "wedge", "flat", "mojaris", "socks", "stockings"],
    "accessories": ["watch", "wallet", "belt", "sunglass", "tie", "pocket square", "bag", "tote", "clutch", "sling", "scarf", "cap", "hat", "safa", "turban", "handbag", "backpack", "cufflinks", "scrunchie", "hair clip", "water bottle"],
    "grooming": ["perfume", "fragrance", "beard", "trimmer", "grooming", "cologne", "after shave", "deodorant", "face wash", "hair gel", "hair wax"],
    "dresses": ["dress", "gown", "frock", "jumpsuit", "anarkali", "lehenga", "coord", "party dress", "evening gown", "cocktail", "frock", "cardigan", "shrug"],
    "ethnic": ["saree", "suit", "dupatta", "half-saree", "blouse", "ethnic", "anarkali suit", "palazzo suit", "churidar", "salwar"],
    "jewelry": ["ring", "necklace", "earring", "jhumka", "bangle", "kada", "mangalsutra", "chain", "bracelet", "anklet", "payal", "nose pin", "nose-pin", "maang", "tikka", "pearl", "solitaire", "bridal set", "jewellery set", "gold set", "pendant", "brooch", "kalgi", "evil-eye", "nazariya", "wedding band"],
    "men": ["sherwani", "groom", "tuxedo", "indo-western", "nehru jacket", "kurta pajama", "men's", "dhoti"],
    "women": ["bridal", "lehenga", "reception gown", "bridal blouse", "half-saree", "bridal dupatta", "mehendi", "bridal footwear"],
    "wedding-extras": ["veil", "wedding cake", "candle", "favor", "reception wear", "return gift"],
    "boys": ["boys", "kurta set", "boys party", "boys graphic", "school shoes", "night suit"],
    "girls": ["girls", "frock", "lehenga", "girls legging", "girls cotton", "princess", "top"],
    "infants": ["newborn", "infant", "romper", "baby", "0-3", "3-6", "6-12", "onesie", "bib", "mitten"],
    "kids-beauty": ["kids skincare", "kids lotion", "baby shampoo", "kids sunscreen", "baby shampoo", "baby powder", "baby oil"],
    "photography": ["album", "frame", "print", "canvas", "photography", "photo", "shoot"],
    "videography": ["video", "film", "cinematic", "videography", "reel", "highlight", "drone"],
    "decorations": ["backdrop", "centerpiece", "fairy light", "light", "decor", "mandap", "stage", "entrance", "floral", "balloon", "table decor"],
    "catering": ["thali", "dessert", "cake", "catering", "counter", "food", "menu", "plate"],
    "entertainment": ["dj", "speaker", "sound", "band", "emcee", "music", "led", "dance floor"],
    "planning": ["planning", "coordinator", "event management", "wedding plan", "planner", "venue", "transport", "logistics", "e-invite", "return gift"],
    "logistics": ["venue", "logistics", "transport", "rental"],
    "clothing": ["custom shirt", "bespoke", "tailored", "alteration", "embroidery", "stitched", "custom suit", "tailoring", "monogram", "fabric"],
    "jewelry-custom": ["custom jewellery", "engraving", "personalized jewellery"],
    "wedding-cards": ["wedding card", "invitation", "card", "invite", "e-invite"],
    "cakes-desserts": ["themed cake", "custom cake", "dessert", "2-tier", "3-tier"],
    "gifts-hampers": ["gift hamper", "hamper", "gift"],
    "decor-themes": ["decor theme", "theme decor", "theme setup", "balloon"],
    "makeup-packages": ["makeup", "bridal makeup", "party makeup", "pre-bridal", "beauty package", "lipstick", "skincare kit"],
    "photography-packages": ["photography package", "photo package", "shoot package"],
    "merchandise": ["mug", "printed t-shirt", "custom printed", "merchandise", "lipstick", "skincare kit", "frame", "e-invite", "nail polish", "kajal", "concealer", "mascara", "sunscreen", "shampoo", "foundation", "eyeshadow", "compact", "eyeliner"],
  };

  // Reverse map: keyword → subCategory slug
  const KW_TO_SUB = {};
  for (const subCat in KEYWORD_MAP) {
    KEYWORD_MAP[subCat].forEach(function(kw) { KW_TO_SUB[kw] = subCat; });
  }

  STORES.forEach(function(store) {
    (store.products || []).forEach(function(p) {
      if (p.subCategory) return;
      var name = ((p.name || "") + " " + (p.description || "")).toLowerCase();
      // Check longer keywords first for accuracy
      var keys = Object.keys(KW_TO_SUB).sort(function(a,b){ return b.length - a.length; });
      for (var i = 0; i < keys.length; i++) {
        if (name.indexOf(keys[i]) !== -1) {
          p.subCategory = KW_TO_SUB[keys[i]];
          break;
        }
      }
      // Default to a generic subCategory based on store category
      if (!p.subCategory) {
        var defaults = {
          "men-wear": "topwear", "women-wear": "dresses", "kids-wear": "boys",
          "wedding": "women", "jewellery": "jewelry", "events": "photography", "customize": "clothing"
        };
        p.subCategory = defaults[store.categoryId] || "misc";
      }
    });
    // Also tag services
    (store.services || []).forEach(function(s) {
      if (s.subCategory) return;
      var name = ((s.name || "") + " " + (s.description || "")).toLowerCase();
      var keys = Object.keys(KW_TO_SUB).sort(function(a,b){ return b.length - a.length; });
      for (var i = 0; i < keys.length; i++) {
        if (name.indexOf(keys[i]) !== -1) {
          s.subCategory = KW_TO_SUB[keys[i]];
          break;
        }
      }
      if (!s.subCategory) {
        var defaults = {
          "men-wear": "topwear", "women-wear": "dresses", "kids-wear": "boys",
          "wedding": "women", "jewellery": "jewelry", "events": "photography", "customize": "clothing"
        };
        s.subCategory = defaults[store.categoryId] || "misc";
      }
    });
  });
})();

/* ---------- POPULAR CITIES (fallback / always-visible list) ---------- */
const POPULAR_CITIES = [
  "Mumbai", "Delhi", "Bengaluru", "Pune", "Hyderabad",
  "Chennai", "Kolkata", "Ahmedabad", "Jaipur", "Surat",
  "Lucknow", "Kochi", "Chandigarh", "Indore", "Dubai",
  "Singapore", "London", "New York", "Sydney", "Toronto",
];

/* ---------- WORLD CITIES (for global location search + nearest-city) ----------
   Each entry: { city, country, lat, lng }
   Covers major cities across India, Asia, Middle East, Europe, Americas, Africa, Oceania. */
const WORLD_CITIES = [
  /* India */
  { city: "Mumbai", country: "India", lat: 19.0760, lng: 72.8777 },
  { city: "Delhi", country: "India", lat: 28.6139, lng: 77.2090 },
  { city: "Bengaluru", country: "India", lat: 12.9716, lng: 77.5946 },
  { city: "Pune", country: "India", lat: 18.5204, lng: 73.8567 },
  { city: "Hyderabad", country: "India", lat: 17.3850, lng: 78.4867 },
  { city: "Chennai", country: "India", lat: 13.0827, lng: 80.2707 },
  { city: "Kolkata", country: "India", lat: 22.5726, lng: 88.3639 },
  { city: "Ahmedabad", country: "India", lat: 23.0225, lng: 72.5714 },
  { city: "Jaipur", country: "India", lat: 26.9124, lng: 75.7873 },
  { city: "Surat", country: "India", lat: 21.1702, lng: 72.8311 },
  { city: "Lucknow", country: "India", lat: 26.8467, lng: 80.9462 },
  { city: "Kochi", country: "India", lat: 9.9312, lng: 76.2673 },
  { city: "Goa", country: "India", lat: 15.2993, lng: 74.1240 },
  { city: "Chandigarh", country: "India", lat: 30.7333, lng: 76.7794 },
  { city: "Indore", country: "India", lat: 22.7196, lng: 75.8577 },
  { city: "Nagpur", country: "India", lat: 21.1458, lng: 79.0882 },
  { city: "Coimbatore", country: "India", lat: 11.0168, lng: 76.9558 },
  { city: "Visakhapatnam", country: "India", lat: 17.6868, lng: 83.2185 },
  { city: "Bhopal", country: "India", lat: 23.2599, lng: 77.4126 },
  { city: "Patna", country: "India", lat: 25.5941, lng: 85.1376 },
  { city: "Vadodara", country: "India", lat: 22.3072, lng: 73.1812 },
  { city: "Ghaziabad", country: "India", lat: 28.6692, lng: 77.4538 },
  { city: "Noida", country: "India", lat: 28.5355, lng: 77.3910 },
  { city: "Gurugram", country: "India", lat: 28.4595, lng: 77.0266 },
  { city: "Thiruvananthapuram", country: "India", lat: 8.5241, lng: 76.9366 },
  { city: "Bhubaneswar", country: "India", lat: 20.2961, lng: 85.8245 },
  { city: "Amritsar", country: "India", lat: 31.6340, lng: 74.8723 },
  { city: "Varanasi", country: "India", lat: 25.3176, lng: 82.9739 },
  { city: "Ranchi", country: "India", lat: 23.3441, lng: 85.3096 },
  { city: "Raipur", country: "India", lat: 21.2514, lng: 81.6296 },
  { city: "Guwahati", country: "India", lat: 26.1445, lng: 91.7362 },
  { city: "Mysuru", country: "India", lat: 12.2958, lng: 76.6394 },
  { city: "Mangaluru", country: "India", lat: 12.9141, lng: 74.8560 },
  { city: "Vijayawada", country: "India", lat: 16.5062, lng: 80.6480 },
  { city: "Madurai", country: "India", lat: 9.9252, lng: 78.1198 },
  { city: "Nashik", country: "India", lat: 19.9975, lng: 73.7898 },
  { city: "Aurangabad", country: "India", lat: 19.8762, lng: 75.3433 },
  { city: "Rajkot", country: "India", lat: 22.3039, lng: 70.8022 },
  { city: "Jodhpur", country: "India", lat: 26.2389, lng: 73.0243 },
  { city: "Udaipur", country: "India", lat: 24.5854, lng: 73.7125 },
  { city: "Agra", country: "India", lat: 27.1767, lng: 78.0081 },
  { city: "Kanpur", country: "India", lat: 26.4499, lng: 80.3319 },
  { city: "Dehradun", country: "India", lat: 30.3165, lng: 78.0322 },
  { city: "Shimla", country: "India", lat: 31.1048, lng: 77.1734 },
  { city: "Jammu", country: "India", lat: 32.7266, lng: 74.8570 },
  { city: "Srinagar", country: "India", lat: 34.0837, lng: 74.7973 },
  { city: "Puducherry", country: "India", lat: 11.9416, lng: 79.8083 },
  { city: "Tirupati", country: "India", lat: 13.6288, lng: 79.4192 },
  { city: "Gwalior", country: "India", lat: 26.2183, lng: 78.1828 },
  { city: "Faridabad", country: "India", lat: 28.4089, lng: 77.3178 },
  { city: "Meerut", country: "India", lat: 28.9845, lng: 77.7064 },
  { city: "Rajkot", country: "India", lat: 22.3039, lng: 70.8022 },
  { city: "Jabalpur", country: "India", lat: 23.1815, lng: 79.9864 },
  { city: "Bareilly", country: "India", lat: 28.3670, lng: 79.4304 },
  { city: "Aligarh", country: "India", lat: 27.8974, lng: 78.0880 },
  { city: "Moradabad", country: "India", lat: 28.8386, lng: 78.7733 },
  { city: "Saharanpur", country: "India", lat: 29.9680, lng: 77.5552 },
  { city: "Gorakhpur", country: "India", lat: 26.7606, lng: 83.3732 },
  { city: "Shillong", country: "India", lat: 25.5788, lng: 91.8933 },
  { city: "Gangtok", country: "India", lat: 27.3389, lng: 88.6065 },
  { city: "Itanagar", country: "India", lat: 27.0844, lng: 93.6053 },
  { city: "Kohima", country: "India", lat: 25.6751, lng: 94.1086 },
  { city: "Aizawl", country: "India", lat: 23.7271, lng: 92.7176 },
  { city: "Imphal", country: "India", lat: 24.8170, lng: 93.9368 },
  { city: "Agartala", country: "India", lat: 23.8315, lng: 91.2868 },
  { city: "Panaji", country: "India", lat: 15.4909, lng: 73.8278 },
  { city: "Gandhinagar", country: "India", lat: 23.2156, lng: 72.6369 },
  { city: "Dispur", country: "India", lat: 26.1433, lng: 91.7898 },
  { city: "Kullu", country: "India", lat: 31.9578, lng: 77.1095 },
  { city: "Manali", country: "India", lat: 32.2432, lng: 77.1892 },
  { city: "Mussoorie", country: "India", lat: 30.4598, lng: 78.0664 },
  { city: "Darjeeling", country: "India", lat: 27.0410, lng: 88.2663 },
  { city: "Ooty", country: "India", lat: 11.4102, lng: 76.6950 },
  { city: "Mahabaleshwar", country: "India", lat: 17.9307, lng: 73.6530 },
  { city: "Mount Abu", country: "India", lat: 24.5925, lng: 72.7156 },
  { city: "Haridwar", country: "India", lat: 29.9457, lng: 78.1642 },
  { city: "Rishikesh", country: "India", lat: 30.0869, lng: 78.2676 },
  { city: "Vrindavan", country: "India", lat: 27.5655, lng: 77.6587 },
  { city: "Mathura", country: "India", lat: 27.4924, lng: 77.6737 },
  { city: "Allahabad (Prayagraj)", country: "India", lat: 25.4358, lng: 81.8463 },
  { city: "Gurgaon", country: "India", lat: 28.4595, lng: 77.0266 },
  /* South Asia */
  { city: "Karachi", country: "Pakistan", lat: 24.8607, lng: 67.0011 },
  { city: "Lahore", country: "Pakistan", lat: 31.5204, lng: 74.3587 },
  { city: "Islamabad", country: "Pakistan", lat: 33.6844, lng: 73.0479 },
  { city: "Dhaka", country: "Bangladesh", lat: 23.8103, lng: 90.4125 },
  { city: "Chittagong", country: "Bangladesh", lat: 22.3569, lng: 91.7832 },
  { city: "Colombo", country: "Sri Lanka", lat: 6.9271, lng: 79.8612 },
  { city: "Kandy", country: "Sri Lanka", lat: 7.2906, lng: 80.6337 },
  { city: "Kathmandu", country: "Nepal", lat: 27.7172, lng: 85.3240 },
  { city: "Pokhara", country: "Nepal", lat: 28.2096, lng: 83.9856 },
  { city: "Thimphu", country: "Bhutan", lat: 27.4728, lng: 89.6390 },
  { city: "Male", country: "Maldives", lat: 4.1755, lng: 73.5093 },
  /* Middle East */
  { city: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708 },
  { city: "Abu Dhabi", country: "UAE", lat: 24.4539, lng: 54.3773 },
  { city: "Sharjah", country: "UAE", lat: 25.3463, lng: 55.4209 },
  { city: "Doha", country: "Qatar", lat: 25.2854, lng: 51.5310 },
  { city: "Riyadh", country: "Saudi Arabia", lat: 24.7136, lng: 46.6753 },
  { city: "Jeddah", country: "Saudi Arabia", lat: 21.4858, lng: 39.1925 },
  { city: "Mecca", country: "Saudi Arabia", lat: 21.3891, lng: 39.8579 },
  { city: "Medina", country: "Saudi Arabia", lat: 24.5247, lng: 39.5692 },
  { city: "Muscat", country: "Oman", lat: 23.5880, lng: 58.3829 },
  { city: "Kuwait City", country: "Kuwait", lat: 29.3759, lng: 47.9774 },
  { city: "Manama", country: "Bahrain", lat: 26.2285, lng: 50.5860 },
  { city: "Tel Aviv", country: "Israel", lat: 32.0853, lng: 34.7818 },
  { city: "Jerusalem", country: "Israel", lat: 31.7683, lng: 35.2137 },
  { city: "Amman", country: "Jordan", lat: 31.9454, lng: 35.9284 },
  { city: "Beirut", country: "Lebanon", lat: 33.8938, lng: 35.5018 },
  { city: "Damascus", country: "Syria", lat: 33.5138, lng: 36.2765 },
  { city: "Baghdad", country: "Iraq", lat: 33.3152, lng: 44.3661 },
  { city: "Istanbul", country: "Turkey", lat: 41.0082, lng: 28.9784 },
  { city: "Ankara", country: "Turkey", lat: 39.9334, lng: 32.8597 },
  { city: "Tehran", country: "Iran", lat: 35.6892, lng: 51.3890 },
  /* Southeast Asia */
  { city: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198 },
  { city: "Kuala Lumpur", country: "Malaysia", lat: 3.1390, lng: 101.6869 },
  { city: "Penang", country: "Malaysia", lat: 5.4141, lng: 100.3288 },
  { city: "Bangkok", country: "Thailand", lat: 13.7563, lng: 100.5018 },
  { city: "Chiang Mai", country: "Thailand", lat: 18.7883, lng: 98.9853 },
  { city: "Phuket", country: "Thailand", lat: 7.8804, lng: 98.3923 },
  { city: "Jakarta", country: "Indonesia", lat: -6.2088, lng: 106.8456 },
  { city: "Bali", country: "Indonesia", lat: -8.3405, lng: 115.0920 },
  { city: "Manila", country: "Philippines", lat: 14.5995, lng: 120.9842 },
  { city: "Cebu", country: "Philippines", lat: 10.3157, lng: 123.8854 },
  { city: "Ho Chi Minh City", country: "Vietnam", lat: 10.8231, lng: 106.6297 },
  { city: "Hanoi", country: "Vietnam", lat: 21.0285, lng: 105.8542 },
  { city: "Phnom Penh", country: "Cambodia", lat: 11.5564, lng: 104.9282 },
  { city: "Vientiane", country: "Laos", lat: 17.9757, lng: 102.6331 },
  { city: "Yangon", country: "Myanmar", lat: 16.8409, lng: 96.1735 },
  { city: "Hong Kong", country: "Hong Kong", lat: 22.3193, lng: 114.1694 },
  { city: "Macau", country: "Macau", lat: 22.1987, lng: 113.5439 },
  /* East Asia */
  { city: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503 },
  { city: "Osaka", country: "Japan", lat: 34.6937, lng: 135.5023 },
  { city: "Kyoto", country: "Japan", lat: 35.0116, lng: 135.7681 },
  { city: "Yokohama", country: "Japan", lat: 35.4437, lng: 139.6380 },
  { city: "Nagoya", country: "Japan", lat: 35.1815, lng: 136.9066 },
  { city: "Sapporo", country: "Japan", lat: 43.0642, lng: 141.3469 },
  { city: "Fukuoka", country: "Japan", lat: 33.5904, lng: 130.4017 },
  { city: "Seoul", country: "South Korea", lat: 37.5665, lng: 126.9780 },
  { city: "Busan", country: "South Korea", lat: 35.1796, lng: 129.0756 },
  { city: "Incheon", country: "South Korea", lat: 37.4563, lng: 126.7052 },
  { city: "Beijing", country: "China", lat: 39.9042, lng: 116.4074 },
  { city: "Shanghai", country: "China", lat: 31.2304, lng: 121.4737 },
  { city: "Shenzhen", country: "China", lat: 22.5431, lng: 114.0579 },
  { city: "Guangzhou", country: "China", lat: 23.1291, lng: 113.2644 },
  { city: "Chengdu", country: "China", lat: 30.5728, lng: 104.0668 },
  { city: "Hangzhou", country: "China", lat: 30.2741, lng: 120.1551 },
  { city: "Xi'an", country: "China", lat: 34.3416, lng: 108.9398 },
  { city: "Chongqing", country: "China", lat: 29.4316, lng: 106.9123 },
  { city: "Taipei", country: "Taiwan", lat: 25.0330, lng: 121.5654 },
  { city: "Kaohsiung", country: "Taiwan", lat: 22.6273, lng: 120.3014 },
  { city: "Ulaanbaatar", country: "Mongolia", lat: 47.8864, lng: 106.9057 },
  { city: "Pyongyang", country: "North Korea", lat: 39.0392, lng: 125.7625 },
  /* Central Asia */
  { city: "Almaty", country: "Kazakhstan", lat: 43.2220, lng: 76.8512 },
  { city: "Tashkent", country: "Uzbekistan", lat: 41.2995, lng: 69.2401 },
  { city: "Bishkek", country: "Kyrgyzstan", lat: 42.8746, lng: 74.5698 },
  { city: "Dushanbe", country: "Tajikistan", lat: 38.5598, lng: 68.7870 },
  { city: "Ashgabat", country: "Turkmenistan", lat: 37.9601, lng: 58.3261 },
  { city: "Kabul", country: "Afghanistan", lat: 34.5553, lng: 69.2075 },
  /* Europe — Western */
  { city: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278 },
  { city: "Manchester", country: "United Kingdom", lat: 53.4808, lng: -2.2426 },
  { city: "Birmingham", country: "United Kingdom", lat: 52.4862, lng: -1.8904 },
  { city: "Edinburgh", country: "United Kingdom", lat: 55.9533, lng: -3.1883 },
  { city: "Glasgow", country: "United Kingdom", lat: 55.8642, lng: -4.2518 },
  { city: "Liverpool", country: "United Kingdom", lat: 53.4084, lng: -2.9916 },
  { city: "Dublin", country: "Ireland", lat: 53.3498, lng: -6.2603 },
  { city: "Cork", country: "Ireland", lat: 51.8985, lng: -8.4756 },
  { city: "Paris", country: "France", lat: 48.8566, lng: 2.3522 },
  { city: "Marseille", country: "France", lat: 43.2965, lng: 5.3698 },
  { city: "Lyon", country: "France", lat: 45.7640, lng: 4.8357 },
  { city: "Nice", country: "France", lat: 43.7102, lng: 7.2620 },
  { city: "Berlin", country: "Germany", lat: 52.5200, lng: 13.4050 },
  { city: "Munich", country: "Germany", lat: 48.1351, lng: 11.5820 },
  { city: "Frankfurt", country: "Germany", lat: 50.1109, lng: 8.6821 },
  { city: "Hamburg", country: "Germany", lat: 53.5511, lng: 9.9937 },
  { city: "Cologne", country: "Germany", lat: 50.9375, lng: 6.9603 },
  { city: "Amsterdam", country: "Netherlands", lat: 52.3676, lng: 4.9041 },
  { city: "Rotterdam", country: "Netherlands", lat: 51.9244, lng: 4.4777 },
  { city: "Brussels", country: "Belgium", lat: 50.8503, lng: 4.3517 },
  { city: "Antwerp", country: "Belgium", lat: 51.2194, lng: 4.4025 },
  { city: "Luxembourg", country: "Luxembourg", lat: 49.6116, lng: 6.1319 },
  { city: "Zurich", country: "Switzerland", lat: 47.3769, lng: 8.5417 },
  { city: "Geneva", country: "Switzerland", lat: 46.2044, lng: 6.1432 },
  { city: "Basel", country: "Switzerland", lat: 47.5596, lng: 7.5886 },
  /* Europe — Southern */
  { city: "Madrid", country: "Spain", lat: 40.4168, lng: -3.7038 },
  { city: "Barcelona", country: "Spain", lat: 41.3851, lng: 2.1734 },
  { city: "Valencia", country: "Spain", lat: 39.4699, lng: -0.3763 },
  { city: "Seville", country: "Spain", lat: 37.3891, lng: -5.9845 },
  { city: "Lisbon", country: "Portugal", lat: 38.7223, lng: -9.1393 },
  { city: "Porto", country: "Portugal", lat: 41.1579, lng: -8.6291 },
  { city: "Rome", country: "Italy", lat: 41.9028, lng: 12.4964 },
  { city: "Milan", country: "Italy", lat: 45.4642, lng: 9.1900 },
  { city: "Naples", country: "Italy", lat: 40.8518, lng: 14.2681 },
  { city: "Florence", country: "Italy", lat: 43.7696, lng: 11.2558 },
  { city: "Venice", country: "Italy", lat: 45.4408, lng: 12.3155 },
  { city: "Athens", country: "Greece", lat: 37.9838, lng: 23.7275 },
  { city: "Thessaloniki", country: "Greece", lat: 40.6401, lng: 22.9444 },
  { city: "Vienna", country: "Austria", lat: 48.2082, lng: 16.3738 },
  { city: "Ljubljana", country: "Slovenia", lat: 46.0569, lng: 14.5058 },
  { city: "Zagreb", country: "Croatia", lat: 45.8150, lng: 15.9819 },
  { city: "Belgrade", country: "Serbia", lat: 44.7866, lng: 20.4489 },
  { city: "Sarajevo", country: "Bosnia", lat: 43.8563, lng: 18.4131 },
  { city: "Sofia", country: "Bulgaria", lat: 42.6977, lng: 23.3219 },
  { city: "Bucharest", country: "Romania", lat: 44.4268, lng: 26.1025 },
  { city: "Budapest", country: "Hungary", lat: 47.4979, lng: 19.0402 },
  /* Europe — Nordic & Baltic */
  { city: "Stockholm", country: "Sweden", lat: 59.3293, lng: 18.0686 },
  { city: "Gothenburg", country: "Sweden", lat: 57.7089, lng: 11.9746 },
  { city: "Copenhagen", country: "Denmark", lat: 55.6761, lng: 12.5683 },
  { city: "Oslo", country: "Norway", lat: 59.9139, lng: 10.7522 },
  { city: "Bergen", country: "Norway", lat: 60.3913, lng: 5.3221 },
  { city: "Helsinki", country: "Finland", lat: 60.1699, lng: 24.9384 },
  { city: "Reykjavik", country: "Iceland", lat: 64.1466, lng: -21.9426 },
  { city: "Tallinn", country: "Estonia", lat: 59.4370, lng: 24.7536 },
  { city: "Riga", country: "Latvia", lat: 56.9496, lng: 24.1052 },
  { city: "Vilnius", country: "Lithuania", lat: 54.6872, lng: 25.2797 },
  /* Europe — Central & Eastern */
  { city: "Warsaw", country: "Poland", lat: 52.2297, lng: 21.0122 },
  { city: "Krakow", country: "Poland", lat: 50.0647, lng: 19.9450 },
  { city: "Prague", country: "Czech Republic", lat: 50.0755, lng: 14.4378 },
  { city: "Bratislava", country: "Slovakia", lat: 48.1486, lng: 17.1077 },
  { city: "Moscow", country: "Russia", lat: 55.7558, lng: 37.6173 },
  { city: "Saint Petersburg", country: "Russia", lat: 59.9311, lng: 30.3609 },
  { city: "Kyiv", country: "Ukraine", lat: 50.4501, lng: 30.5234 },
  { city: "Minsk", country: "Belarus", lat: 53.9006, lng: 27.5590 },
  { city: "Chisinau", country: "Moldova", lat: 47.0105, lng: 28.8638 },
  { city: "Tbilisi", country: "Georgia", lat: 41.7151, lng: 44.8271 },
  { city: "Yerevan", country: "Armenia", lat: 40.1792, lng: 44.4991 },
  { city: "Baku", country: "Azerbaijan", lat: 40.4093, lng: 49.8671 },
  /* North America */
  { city: "New York", country: "USA", lat: 40.7128, lng: -74.0060 },
  { city: "Los Angeles", country: "USA", lat: 34.0522, lng: -118.2437 },
  { city: "Chicago", country: "USA", lat: 41.8781, lng: -87.6298 },
  { city: "San Francisco", country: "USA", lat: 37.7749, lng: -122.4194 },
  { city: "Houston", country: "USA", lat: 29.7604, lng: -95.3698 },
  { city: "Miami", country: "USA", lat: 25.7617, lng: -80.1918 },
  { city: "Seattle", country: "USA", lat: 47.6062, lng: -122.3321 },
  { city: "Boston", country: "USA", lat: 42.3601, lng: -71.0589 },
  { city: "Dallas", country: "USA", lat: 32.7767, lng: -96.7970 },
  { city: "Atlanta", country: "USA", lat: 33.7490, lng: -84.3880 },
  { city: "Denver", country: "USA", lat: 39.7392, lng: -104.9903 },
  { city: "Las Vegas", country: "USA", lat: 36.1699, lng: -115.1398 },
  { city: "Phoenix", country: "USA", lat: 33.4484, lng: -112.0740 },
  { city: "Portland", country: "USA", lat: 45.5152, lng: -122.6784 },
  { city: "San Diego", country: "USA", lat: 32.7157, lng: -117.1611 },
  { city: "Washington DC", country: "USA", lat: 38.9072, lng: -77.0369 },
  { city: "Philadelphia", country: "USA", lat: 39.9526, lng: -75.1652 },
  { city: "Detroit", country: "USA", lat: 42.3314, lng: -83.0458 },
  { city: "Minneapolis", country: "USA", lat: 44.9778, lng: -93.2650 },
  { city: "Austin", country: "USA", lat: 30.2672, lng: -97.7431 },
  { city: "Orlando", country: "USA", lat: 28.5383, lng: -81.3792 },
  { city: "Honolulu", country: "USA", lat: 21.3099, lng: -157.8581 },
  { city: "Toronto", country: "Canada", lat: 43.6532, lng: -79.3832 },
  { city: "Vancouver", country: "Canada", lat: 49.2827, lng: -123.1207 },
  { city: "Montreal", country: "Canada", lat: 45.5017, lng: -73.5673 },
  { city: "Calgary", country: "Canada", lat: 51.0447, lng: -114.0719 },
  { city: "Ottawa", country: "Canada", lat: 45.4215, lng: -75.6972 },
  { city: "Edmonton", country: "Canada", lat: 53.5461, lng: -113.4938 },
  { city: "Mexico City", country: "Mexico", lat: 19.4326, lng: -99.1332 },
  { city: "Guadalajara", country: "Mexico", lat: 20.6597, lng: -103.3496 },
  { city: "Monterrey", country: "Mexico", lat: 25.6866, lng: -100.3161 },
  { city: "Cancun", country: "Mexico", lat: 21.1619, lng: -86.8515 },
  /* Central America & Caribbean */
  { city: "Panama City", country: "Panama", lat: 8.9824, lng: -79.5199 },
  { city: "San Jose", country: "Costa Rica", lat: 9.9281, lng: -84.0907 },
  { city: "Havana", country: "Cuba", lat: 23.1136, lng: -82.3666 },
  { city: "Santo Domingo", country: "Dominican Republic", lat: 18.4861, lng: -69.9312 },
  { city: "San Juan", country: "Puerto Rico", lat: 18.4655, lng: -66.1057 },
  { city: "Kingston", country: "Jamaica", lat: 17.9714, lng: -76.7928 },
  { city: "Port-au-Prince", country: "Haiti", lat: 18.5944, lng: -72.3074 },
  /* South America */
  { city: "São Paulo", country: "Brazil", lat: -23.5505, lng: -46.6333 },
  { city: "Rio de Janeiro", country: "Brazil", lat: -22.9068, lng: -43.1729 },
  { city: "Brasília", country: "Brazil", lat: -15.8267, lng: -47.9218 },
  { city: "Salvador", country: "Brazil", lat: -12.9714, lng: -38.5014 },
  { city: "Fortaleza", country: "Brazil", lat: -3.7319, lng: -38.5267 },
  { city: "Buenos Aires", country: "Argentina", lat: -34.6037, lng: -58.3816 },
  { city: "Córdoba", country: "Argentina", lat: -31.4201, lng: -64.1888 },
  { city: "Lima", country: "Peru", lat: -12.0464, lng: -77.0428 },
  { city: "Bogotá", country: "Colombia", lat: 4.7110, lng: -74.0721 },
  { city: "Medellín", country: "Colombia", lat: 6.2442, lng: -75.5812 },
  { city: "Santiago", country: "Chile", lat: -33.4489, lng: -70.6693 },
  { city: "Valparaíso", country: "Chile", lat: -33.0472, lng: -71.6127 },
  { city: "Caracas", country: "Venezuela", lat: 10.4806, lng: -66.9036 },
  { city: "Quito", country: "Ecuador", lat: -0.1807, lng: -78.4678 },
  { city: "Guayaquil", country: "Ecuador", lat: -2.1709, lng: -79.9224 },
  { city: "La Paz", country: "Bolivia", lat: -16.4897, lng: -68.1193 },
  { city: "Montevideo", country: "Uruguay", lat: -34.9011, lng: -56.1645 },
  { city: "Asunción", country: "Paraguay", lat: -25.2637, lng: -57.5759 },
  { city: "Paramaribo", country: "Suriname", lat: 5.8520, lng: -55.2038 },
  /* Africa */
  { city: "Cairo", country: "Egypt", lat: 30.0444, lng: 31.2357 },
  { city: "Alexandria", country: "Egypt", lat: 31.2001, lng: 29.9187 },
  { city: "Lagos", country: "Nigeria", lat: 6.5244, lng: 3.3792 },
  { city: "Abuja", country: "Nigeria", lat: 9.0765, lng: 7.3986 },
  { city: "Nairobi", country: "Kenya", lat: -1.2921, lng: 36.8219 },
  { city: "Mombasa", country: "Kenya", lat: -4.0435, lng: 39.6682 },
  { city: "Johannesburg", country: "South Africa", lat: -26.2041, lng: 28.0473 },
  { city: "Cape Town", country: "South Africa", lat: -33.9249, lng: 18.4241 },
  { city: "Durban", country: "South Africa", lat: -29.8587, lng: 31.0218 },
  { city: "Pretoria", country: "South Africa", lat: -25.7479, lng: 28.2293 },
  { city: "Casablanca", country: "Morocco", lat: 33.5731, lng: -7.5898 },
  { city: "Marrakech", country: "Morocco", lat: 31.6295, lng: -7.9811 },
  { city: "Rabat", country: "Morocco", lat: 34.0209, lng: -6.8416 },
  { city: "Addis Ababa", country: "Ethiopia", lat: 9.0249, lng: 38.7469 },
  { city: "Accra", country: "Ghana", lat: 5.6037, lng: -0.1870 },
  { city: "Dakar", country: "Senegal", lat: 14.7167, lng: -17.4677 },
  { city: "Abidjan", country: "Ivory Coast", lat: 5.3600, lng: -4.0083 },
  { city: "Dar es Salaam", country: "Tanzania", lat: -6.7924, lng: 39.2083 },
  { city: "Kampala", country: "Uganda", lat: 0.3476, lng: 32.5825 },
  { city: "Kigali", country: "Rwanda", lat: -1.9706, lng: 30.1044 },
  { city: "Lusaka", country: "Zambia", lat: -15.3875, lng: 28.3228 },
  { city: "Harare", country: "Zimbabwe", lat: -17.8252, lng: 31.0335 },
  { city: "Maputo", country: "Mozambique", lat: -25.9692, lng: 32.5732 },
  { city: "Luanda", country: "Angola", lat: -8.8390, lng: 13.2894 },
  { city: "Windhoek", country: "Namibia", lat: -22.5609, lng: 17.0658 },
  { city: "Tunis", country: "Tunisia", lat: 36.8065, lng: 10.1815 },
  { city: "Algiers", country: "Algeria", lat: 36.7372, lng: 3.0865 },
  { city: "Tripoli", country: "Libya", lat: 32.8872, lng: 13.1913 },
  { city: "Khartoum", country: "Sudan", lat: 15.5007, lng: 32.5599 },
  /* Oceania */
  { city: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093 },
  { city: "Melbourne", country: "Australia", lat: -37.8136, lng: 144.9631 },
  { city: "Brisbane", country: "Australia", lat: -27.4698, lng: 153.0251 },
  { city: "Perth", country: "Australia", lat: -31.9505, lng: 115.8605 },
  { city: "Adelaide", country: "Australia", lat: -34.9285, lng: 138.6007 },
  { city: "Canberra", country: "Australia", lat: -35.2809, lng: 149.1300 },
  { city: "Gold Coast", country: "Australia", lat: -28.0167, lng: 153.4000 },
  { city: "Hobart", country: "Australia", lat: -42.8821, lng: 147.3272 },
  { city: "Darwin", country: "Australia", lat: -12.4634, lng: 130.8456 },
  { city: "Auckland", country: "New Zealand", lat: -36.8485, lng: 174.7633 },
  { city: "Wellington", country: "New Zealand", lat: -41.2865, lng: 174.7762 },
  { city: "Christchurch", country: "New Zealand", lat: -43.5320, lng: 172.6306 },
  { city: "Suva", country: "Fiji", lat: -18.1416, lng: 178.4419 },
  { city: "Port Moresby", country: "Papua New Guinea", lat: -9.4438, lng: 147.1803 },
  { city: "Honiara", country: "Solomon Islands", lat: -9.4456, lng: 159.9729 },
  { city: "Apia", country: "Samoa", lat: -13.8506, lng: -171.7513 },
  { city: "Nuku'alofa", country: "Tonga", lat: -21.1789, lng: -175.1982 },
];

/* ---------- TRY-ON CATEGORY MAP ----------
   Normalizes inconsistent store category strings into clean groups
   so the try-on page's type tabs work properly. */
const TRYON_CATEGORY_MAP = {
  "men's fashion": "Men",
  "men accessories": "Men",
  "men's accessories": "Men",
  "groom wear": "Men",
  "women's fashion": "Women",
  "women accessories": "Women",
  "women's accessories": "Women",
  "ethnic fusion": "Women",
  "kids fashion": "Kids",
  "bridal boutique": "Wedding",
  "wedding rentals": "Wedding",
  "jewelry": "Jewellery",
};

/* Haversine distance (km) between two lat/lng points */
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius km
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* Find nearest world cities to a given lat/lng */
function findNearestCities(lat, lng, count) {
  count = count || 5;
  return WORLD_CITIES
    .map((c) => ({ ...c, distance: haversineDistance(lat, lng, c.lat, c.lng) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, count);
}

/* ---------- SELLER CATEGORIES ---------- */
const SELLER_CATEGORIES = [
  { id: "fashion-seller", emoji: "👗", label: "Fashion Seller", description: "Sell clothing, ethnic wear & apparel" },
  { id: "boutique-owner", emoji: "🏬", label: "Boutique Owner", description: "Curated multi-brand boutique store" },
  { id: "designer", emoji: "✏️", label: "Fashion Designer", description: "Custom couture & designer collections" },
  { id: "tailor", emoji: "🧵", label: "Tailor / Masterji", description: "Custom stitching & alterations" },
  { id: "jewellery-store", emoji: "💍", label: "Jewellery Store", description: "Gold, diamond & traditional jewellery" },
  { id: "photographer", emoji: "📸", label: "Photographer", description: "Wedding, fashion & event photography" },
  { id: "videographer", emoji: "🎥", label: "Videographer", description: "Cinematic films & event coverage" },
  { id: "event-manager", emoji: "🎪", label: "Event Manager", description: "Complete event planning & coordination" },
  { id: "caterer", emoji: "🍽️", label: "Caterer", description: "Wedding & event catering services" },
  { id: "decorator", emoji: "🌸", label: "Decorator", description: "Stage, mandap & venue decoration" },
  { id: "makeup-artist", emoji: "💄", label: "Makeup Artist", description: "Bridal & fashion makeup services" },
  { id: "dj", emoji: "🎧", label: "DJ / Music", description: "DJ, sound & entertainment services" },
];

/* ---------- PHOTOGRAPHY PACKAGES ---------- */
const PHOTOGRAPHY_PACKAGES = {
  "lens-light": [
    { id: "ll-pkg1", name: "Silver Package", price: 35000, hours: 8, deliverables: "500+ photos, 2 photographers", features: ["Traditional + Candid", "Same-day highlights", "Online gallery"] },
    { id: "ll-pkg2", name: "Gold Package", price: 55000, hours: 12, deliverables: "800+ photos, 1 cinematic film, drone shots", features: ["3 photographers", "Cinematic film (3 min)", "Drone coverage", "Premium album"] },
    { id: "ll-pkg3", name: "Platinum Package", price: 85000, hours: 24, deliverables: "1500+ photos, 2 films, pre-wed shoot", features: ["4 photographers", "2 cinematographers", "Pre-wedding shoot", "Same-day edit", "Luxury album set"] },
  ],
};

/* ---------- EVENT PACKAGES ---------- */
const EVENT_PACKAGES = {
  "petal-affairs": [
    { id: "pa-pkg1", name: "Classic Decor", price: 75000, items: "Stage + entrance + lighting", features: ["Floral stage backdrop", "Entrance arch", "LED lighting", "Table centerpieces"] },
    { id: "pa-pkg2", name: "Premium Decor", price: 150000, items: "Full venue transformation", features: ["Custom theme stage", "Mandap decor", "Ceiling florals", "VIP seating", "Lighting design"] },
  ],
  "saffron-bites": [
    { id: "sb-pkg1", name: "Standard Menu (100 pax)", price: 45000, items: "Veg buffet for 100 guests", features: ["2 starters", "5 main course", "3 sides", "Dessert", "Live chaat counter"] },
    { id: "sb-pkg2", name: "Premium Menu (100 pax)", price: 65000, items: "Non-veg buffet for 100 guests", features: ["4 starters (2 non-veg)", "7 main course", "4 sides", "Dessert counter", "Live counters (2)"] },
  ],
};

/* ---------- MOCK DESIGNERS ---------- */
const MOCK_DESIGNERS = [
  { id: "d1", name: "Priya Kapoor", specialty: "Bridal Couture", rating: 4.9, experience: "12 years", location: "Mumbai", image: IMG("photo-1438761681033-6461ffad8d80") },
  { id: "d2", name: "Rahul Verma", specialty: "Indo-Western", rating: 4.7, experience: "8 years", location: "Delhi", image: IMG("photo-1500648767791-00dcc994a43e") },
  { id: "d3", name: "Ananya Reddy", specialty: "Designer Sarees", rating: 4.8, experience: "10 years", location: "Hyderabad", image: IMG("photo-1544005313-94ddf0286df2") },
];

/* ---------- TRY-ON PRODUCTS ---------- */
const TRYON_PRODUCTS = [
  { id: "to1", name: "Silk Saree", category: "Women", price: 8500, image: IMG("photo-1610030469983-98e550d6193c"), colors: ["Red", "Royal Blue", "Green", "Maroon"] },
  { id: "to2", name: "Sherwani", category: "Men", price: 12000, image: IMG("photo-1622445275576-721325763afe"), colors: ["Cream", "Maroon", "Navy", "Gold"] },
  { id: "to3", name: "Party Dress", category: "Women", price: 6500, image: IMG("photo-1566174053879-31528523f8ae"), colors: ["Black", "Red", "Emerald", "Wine"] },
  { id: "to4", name: "Formal Suit", category: "Men", price: 14500, image: IMG("photo-1594938298603-c8148c4dae35"), colors: ["Charcoal", "Navy", "Black", "Grey"] },
  { id: "to5", name: "Lehenga Choli", category: "Women", price: 18500, image: IMG("photo-1610030469983-98e550d6193c"), colors: ["Pink", "Orange", "Teal", "Purple"] },
];

/* ---------- CLOTH TYPES ---------- */
const CLOTH_TYPES = [
  "Silk", "Cotton Silk", "Chiffon", "Georgette", "Velvet",
  "Brocade", "Linen", "Crepe", "Net", "Satin",
];

/* ---------- MEASUREMENT FIELDS ---------- */
const MEASUREMENT_FIELDS = {
  men: ["Chest (in)", "Waist (in)", "Shoulder (in)", "Sleeve Length (in)", "Shirt Length (in)", "Neck (in)"],
  women: ["Bust (in)", "Waist (in)", "Hip (in)", "Shoulder (in)", "Blouse Length (in)", "Sleeve Length (in)"],
  kids: ["Chest (in)", "Waist (in)", "Height (in)", "Shoulder (in)"],
};

/* ---------- SIZE CHART (inches) ---------- */
const SIZE_CHART = {
  XS: { Chest: 32, Waist: 26, Shoulder: 14.5 },
  S:  { Chest: 34, Waist: 28, Shoulder: 15 },
  M:  { Chest: 36, Waist: 30, Shoulder: 15.5 },
  L:  { Chest: 38, Waist: 32, Shoulder: 16 },
  XL: { Chest: 40, Waist: 34, Shoulder: 16.5 },
  XXL:{ Chest: 42, Waist: 36, Shoulder: 17 },
};

/* ---------- UTILITY ---------- */
function formatDistance(km) { return `${km} km`; }
