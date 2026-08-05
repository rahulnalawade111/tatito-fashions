/* =========================================================
   store.js — Centralized localStorage state management
   Single source of truth for cart, wishlist, auth, orders,
   addresses, and profile. Pub/sub for nav badge updates.
   ========================================================= */

const TatitoStore = (() => {
  const KEYS = {
    CART: "tatito_cart",
    WISHLIST: "tatito_wishlist",
    ORDERS: "tatito_orders",
    BOOKINGS: "tatito_bookings",
    AUTH: "tatito_auth",
    USER: "tatito_user",
    ADDRESSES: "tatito_addresses"
  };

  const listeners = [];

  /* ---------- Core helpers ---------- */
  function read(key) {
    try {
      const val = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(val) ? val : [];
    } catch { return []; }
  }

  function readObj(key, fallback) {
    try {
      const val = JSON.parse(localStorage.getItem(key));
      return val && typeof val === "object" ? val : fallback;
    } catch { return fallback; }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
    notify();
  }

  function notify() {
    listeners.forEach((fn) => {
      try { fn(); } catch (e) { /* noop */ }
    });
  }

  /* ---------- Cart ---------- */
  function getCart() { return read(KEYS.CART); }

  function addToCart(storeId, itemId, itemData, variant = "", qty = 1) {
    const cart = getCart();
    const itemKey = `${storeId}:${itemId}:${variant || "standard"}`;
    const existing = cart.find((c) => c.itemKey === itemKey);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + qty;
    } else {
      cart.push({
        ...itemData,
        itemKey,
        storeId,
        itemId,
        shopId: storeId,
        quantity: qty,
        variant: variant || (itemData.variantType && itemData.variantType !== "none" ? "Standard" : "")
      });
    }
    write(KEYS.CART, cart);
    return cart;
  }

  function updateCartQty(itemKey, qty) {
    const cart = getCart();
    const item = cart.find((c) => c.itemKey === itemKey);
    if (item) {
      item.quantity = Math.max(1, qty);
      write(KEYS.CART, cart);
    }
  }

  function removeFromCart(itemKey) {
    write(KEYS.CART, getCart().filter((c) => c.itemKey !== itemKey));
  }

  function clearCart() {
    write(KEYS.CART, []);
  }

  function cartCount() { return getCart().length; }

  function cartSubtotal() {
    return getCart().reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0);
  }

  /* ---------- Wishlist ---------- */
  function getWishlist() { return read(KEYS.WISHLIST); }

  function addToWishlist(storeId, itemId, itemData) {
    const wl = getWishlist();
    const itemKey = `${storeId}:${itemId}`;
    if (!wl.some((w) => w.itemKey === itemKey)) {
      wl.push({ ...itemData, itemKey, shopId: storeId });
      write(KEYS.WISHLIST, wl);
      return true;
    }
    return false;
  }

  function removeFromWishlist(itemKey) {
    write(KEYS.WISHLIST, getWishlist().filter((w) => w.itemKey !== itemKey));
  }

  function isInWishlist(storeId, itemId) {
    return getWishlist().some((w) => w.itemKey === `${storeId}:${itemId}`);
  }

  function wishlistCount() { return getWishlist().length; }

  /* ---------- Bookings (services) ---------- */
  function getBookings() { return read(KEYS.BOOKINGS); }

  function addBooking(storeId, itemId, itemData) {
    const bookings = getBookings();
    const itemKey = `${storeId}:${itemId}`;
    if (!bookings.some((b) => b.itemKey === itemKey)) {
      bookings.push({ ...itemData, itemKey, shopId: storeId, bookedAt: new Date().toLocaleString() });
      write(KEYS.BOOKINGS, bookings);
    }
  }

  function clearBookings() {
    write(KEYS.BOOKINGS, []);
  }

  /* ---------- Auth ---------- */
  function isLoggedIn() {
    return localStorage.getItem(KEYS.AUTH) === "true";
  }

  function login(userData) {
    localStorage.setItem(KEYS.AUTH, "true");
    if (userData) writeUser(userData);
    notify();
  }

  function logout() {
    localStorage.removeItem(KEYS.AUTH);
    notify();
  }

  function getUser() {
    return readObj(KEYS.USER, { name: "", email: "", phone: "", createdAt: new Date().toISOString() });
  }

  function writeUser(data) {
    localStorage.setItem(KEYS.USER, JSON.stringify(data));
    notify();
  }

  function updateUser(updates) {
    const user = { ...getUser(), ...updates };
    writeUser(user);
    return user;
  }

  /* ---------- Orders ---------- */
  function getOrders() { return read(KEYS.ORDERS); }

  function getOrder(orderId) {
    return getOrders().find((o) => String(o.id) === String(orderId));
  }

  function createOrder(orderData) {
    const orders = getOrders();
    const orderId = `TF${Date.now().toString().slice(-8)}`;
    const order = {
      id: orderId,
      items: orderData.items || [],
      total: orderData.total || 0,
      subtotal: orderData.subtotal || 0,
      shipping: orderData.shipping || 0,
      tax: orderData.tax || 0,
      discount: orderData.discount || 0,
      couponCode: orderData.couponCode || "",
      address: orderData.address || null,
      paymentMethod: orderData.paymentMethod || "cod",
      status: orderData.status || "placed",
      statusHistory: [
        { status: "placed", timestamp: new Date().toISOString() }
      ],
      estimatedDelivery: orderData.estimatedDelivery || null,
      createdAt: new Date().toISOString()
    };
    orders.unshift(order);
    write(KEYS.ORDERS, orders);
    return order;
  }

  function advanceOrderStatus(orderId, status) {
    const orders = getOrders();
    const order = orders.find((o) => String(o.id) === String(orderId));
    if (order) {
      order.status = status;
      order.statusHistory.push({ status, timestamp: new Date().toISOString() });
      write(KEYS.ORDERS, orders);
    }
  }

  /* ---------- Addresses ---------- */
  function getAddresses() { return read(KEYS.ADDRESSES); }

  function addAddress(address) {
    const addresses = getAddresses();
    const newAddr = { ...address, id: `addr_${Date.now()}` };
    if (addresses.length === 0) newAddr.isDefault = true;
    if (newAddr.isDefault) {
      addresses.forEach((a) => a.isDefault = false);
    }
    addresses.push(newAddr);
    write(KEYS.ADDRESSES, addresses);
    return newAddr;
  }

  function updateAddress(id, updates) {
    const addresses = getAddresses();
    const addr = addresses.find((a) => a.id === id);
    if (addr) {
      Object.assign(addr, updates);
      if (updates.isDefault) {
        addresses.forEach((a) => { if (a.id !== id) a.isDefault = false; });
      }
      write(KEYS.ADDRESSES, addresses);
    }
  }

  function removeAddress(id) {
    const addresses = getAddresses();
    const filtered = addresses.filter((a) => a.id !== id);
    if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
      filtered[0].isDefault = true;
    }
    write(KEYS.ADDRESSES, filtered);
  }

  function getDefaultAddress() {
    const addresses = getAddresses();
    return addresses.find((a) => a.isDefault) || addresses[0] || null;
  }

  /* ---------- Seller Registrations ---------- */
  function getSellerApps() {
    try { return JSON.parse(localStorage.getItem("tatito_seller_apps") || "[]"); }
    catch { return []; }
  }
  function addSellerApp(appData) {
    const apps = getSellerApps();
    const app = { ...appData, id: `sell_${Date.now()}`, status: "pending", submittedAt: new Date().toISOString() };
    apps.unshift(app);
    localStorage.setItem("tatito_seller_apps", JSON.stringify(apps));
    notify();
    return app;
  }

  /* ---------- Customization Requests ---------- */
  function getCustomRequests() {
    try { return JSON.parse(localStorage.getItem("tatito_custom_requests") || "[]"); }
    catch { return []; }
  }
  function addCustomRequest(data) {
    const reqs = getCustomRequests();
    const req = { ...data, id: `cr_${Date.now()}`, status: "pending", quotations: [], createdAt: new Date().toISOString() };
    reqs.unshift(req);
    localStorage.setItem("tatito_custom_requests", JSON.stringify(reqs));
    notify();
    return req;
  }
  function updateCustomRequest(id, updates) {
    const reqs = getCustomRequests();
    const req = reqs.find((r) => r.id === id);
    if (req) { Object.assign(req, updates); localStorage.setItem("tatito_custom_requests", JSON.stringify(reqs)); notify(); }
  }
  function getCustomRequest(id) { return getCustomRequests().find((r) => r.id === id); }

  /* ---------- Quotations ---------- */
  function addQuotation(requestId, quoteData) {
    const reqs = getCustomRequests();
    const req = reqs.find((r) => r.id === requestId);
    if (req) {
      if (!req.quotations) req.quotations = [];
      req.quotations.push({ ...quoteData, id: `q_${Date.now()}`, receivedAt: new Date().toISOString() });
      req.status = "quoted";
      localStorage.setItem("tatito_custom_requests", JSON.stringify(reqs));
      notify();
    }
  }

  /* ---------- Consultations ---------- */
  function getConsultations() {
    try { return JSON.parse(localStorage.getItem("tatito_consultations") || "[]"); }
    catch { return []; }
  }
  function addConsultation(data) {
    const cons = getConsultations();
    const c = { ...data, id: `con_${Date.now()}`, status: "scheduled", createdAt: new Date().toISOString() };
    cons.unshift(c);
    localStorage.setItem("tatito_consultations", JSON.stringify(cons));
    notify();
    return c;
  }

  /* ---------- Reviews ---------- */
  function getReviews() {
    try { return JSON.parse(localStorage.getItem("tatito_reviews") || "[]"); }
    catch { return []; }
  }
  function getReviewsForShop(shopId) { return getReviews().filter((r) => r.shopId === shopId); }
  function addReview(reviewData) {
    const reviews = getReviews();
    const review = { ...reviewData, id: `rev_${Date.now()}`, createdAt: new Date().toISOString() };
    reviews.unshift(review);
    localStorage.setItem("tatito_reviews", JSON.stringify(reviews));
    notify();
    return review;
  }

  /* ---------- Referral ---------- */
  function getReferralCode() {
    let code = localStorage.getItem("tatito_referral_code");
    if (!code) {
      const name = (getUser().name || "TF").substring(0, 3).toUpperCase();
      code = `${name}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      localStorage.setItem("tatito_referral_code", code);
    }
    return code;
  }
  function getReferrals() {
    try { return JSON.parse(localStorage.getItem("tatito_referrals") || "[]"); }
    catch { return []; }
  }
  function addReferral(data) {
    const refs = getReferrals();
    const ref = { ...data, id: `ref_${Date.now()}`, joinedAt: new Date().toISOString(), status: "completed" };
    refs.unshift(ref);
    localStorage.setItem("tatito_referrals", JSON.stringify(refs));
    notify();
    return ref;
  }
  function getReferralRewards() {
    const refs = getReferrals();
    const rewards = [];
    const levels = [
      { level: 1, rate: 0.10, label: "Level 1 (Direct)" },
      { level: 2, rate: 0.05, label: "Level 2" },
      { level: 3, rate: 0.03, label: "Level 3" },
      { level: 4, rate: 0.01, label: "Level 4" },
    ];
    refs.forEach((ref) => {
      levels.forEach((lvl) => {
        if (ref.level === lvl.level) {
          const reward = ref.orderValue ? Math.round(ref.orderValue * lvl.rate) : 100 * lvl.rate;
          rewards.push({ ...ref, ...lvl, amount: Math.round(reward) });
        }
      });
    });
    return rewards;
  }

  /* ---------- Notifications ---------- */
  function getNotifications() {
    try { return JSON.parse(localStorage.getItem("tatito_notifications") || "[]"); }
    catch { return []; }
  }
  function addNotification(data) {
    const notifs = getNotifications();
    const n = { ...data, id: `ntf_${Date.now()}`, read: false, createdAt: new Date().toISOString() };
    notifs.unshift(n);
    localStorage.setItem("tatito_notifications", JSON.stringify(notifs));
    notify();
    return n;
  }
  function markNotificationRead(id) {
    const notifs = getNotifications();
    const n = notifs.find((x) => x.id === id);
    if (n) { n.read = true; localStorage.setItem("tatito_notifications", JSON.stringify(notifs)); notify(); }
  }
  function markAllNotificationsRead() {
    const notifs = getNotifications();
    notifs.forEach((n) => n.read = true);
    localStorage.setItem("tatito_notifications", JSON.stringify(notifs));
    notify();
  }
  function unreadNotificationCount() { return getNotifications().filter((n) => !n.read).length; }

  /* ---------- Location ---------- */
  const LOC_KEY = "tatito_location";

  function getLocation() {
    try {
      return JSON.parse(localStorage.getItem(LOC_KEY)) || null;
    } catch { return null; }
  }

  function setLocation(city, lat, lng) {
    const loc = { city, lat, lng, setAt: new Date().toISOString() };
    localStorage.setItem(LOC_KEY, JSON.stringify(loc));
    notify();
    return loc;
  }

  function detectLocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = setLocation("", pos.coords.latitude, pos.coords.longitude);
          resolve(loc);
        },
        () => resolve(null),
        { timeout: 8000, enableHighAccuracy: false }
      );
    });
  }

  /* ---------- Pub/sub ---------- */
  function subscribe(fn) {
    listeners.push(fn);
    return () => {
      const idx = listeners.indexOf(fn);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }

  return {
    KEYS,
    // Cart
    getCart, addToCart, updateCartQty, removeFromCart, clearCart, cartCount, cartSubtotal,
    // Wishlist
    getWishlist, addToWishlist, removeFromWishlist, isInWishlist, wishlistCount,
    // Bookings
    getBookings, addBooking, clearBookings,
    // Auth
    isLoggedIn, login, logout, getUser, updateUser,
    // Orders
    getOrders, getOrder, createOrder, advanceOrderStatus,
    // Addresses
    getAddresses, addAddress, updateAddress, removeAddress, getDefaultAddress,
    // Seller Applications
    getSellerApps, addSellerApp,
    // Customization Requests
    getCustomRequests, addCustomRequest, updateCustomRequest, getCustomRequest,
    // Quotations
    addQuotation,
    // Consultations
    getConsultations, addConsultation,
    // Reviews
    getReviews, getReviewsForShop, addReview,
    // Referral
    getReferralCode, getReferrals, addReferral, getReferralRewards,
    // Notifications
    getNotifications, addNotification, markNotificationRead, markAllNotificationsRead, unreadNotificationCount,
    // Location
    getLocation, setLocation, detectLocation,
    // Pub/sub
    subscribe
  };
})();
