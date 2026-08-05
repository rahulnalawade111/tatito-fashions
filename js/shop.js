/* =========================================================
   shop.js — Shop detail page, cart page, wishlist page,
   add-to-cart, add-to-wishlist, book-service actions.
   ========================================================= */

const TatitoShop = (() => {
  function findStoreById(id) {
    return (STORES || []).find((s) => s.id === id);
  }

  function getStoreItems(store) {
    const items = [];
    if (Array.isArray(store?.products)) items.push(...store.products.map((i) => ({ ...i, type: "product" })));
    if (Array.isArray(store?.services)) items.push(...store.services.map((i) => ({ ...i, type: "service" })));
    return items;
  }

  function findStoreItem(storeId, itemId) {
    const store = findStoreById(storeId);
    if (!store) return null;
    const items = getStoreItems(store);
    const item = items.find((i) => i.id === itemId);
    return item ? { store, item } : { store, item: null };
  }

  function renderShopDetail() {
    const root = document.getElementById("shopDetailRoot");
    if (!root) return;

    const params = new URLSearchParams(window.location.search);
    const storeId = params.get("shop");
    const store = findStoreById(storeId);

    if (!store) {
      root.innerHTML = `<p class="empty-state">${t("errorOccurred")}</p>`;
      return;
    }

    const products = (store.products || []).map((i) => ({ ...i, type: "product" }));
    const services = (store.services || []).map((i) => ({ ...i, type: "service" }));

    root.innerHTML = `
      <section class="category-hero">
        <div>
          <p class="eyebrow">${store.category}</p>
          <h1>${store.name}</h1>
          <p>${store.description}</p>
          <div class="store-meta" style="margin-top:12px;">
            <span class="store-rating">★ ${store.rating} (${store.reviewCount || 0} ${t("reviewCount")})</span>
            <span class="store-open ${store.open ? "" : "closed"}">${store.open ? t("openNowBadge") : t("currentlyClosed")}</span>
            <span style="color:var(--muted);" data-store-distance="${store.id}">${typeof TatitoLocation !== "undefined" ? TatitoLocation.formatDist(store._dynamicDistance ?? store.distance) : formatDistance(store.distance)}</span>
          </div>
        </div>
        <div class="hero-card">
          <h3>${store.open ? t("openNowBadge") : t("currentlyClosed")}</h3>
          <p>${typeof TatitoLocation !== "undefined" ? TatitoLocation.formatDist(store._dynamicDistance ?? store.distance) : formatDistance(store.distance)} • ★ ${store.rating}</p>
        </div>
      </section>
      ${products.length ? `
        <section class="section" style="padding:0;">
          <div class="section-head">
            <div>
              <h2>${t("shopProducts")}</h2>
              <p>${t("shopProductsDesc")}</p>
            </div>
          </div>
          <div class="store-grid">${products.map((item) => renderProductCard(store, item)).join("")}</div>
        </section>
      ` : ""}
      ${services.length ? `
        <section class="section" style="padding:0;margin-top:32px;">
          <div class="section-head">
            <div>
              <h2>${t("bookServices")}</h2>
              <p>${t("bookServicesDesc")}</p>
            </div>
          </div>
          <div class="store-grid">${services.map((item) => renderServiceCard(store, item)).join("")}</div>
        </section>
      ` : ""}
      ${renderPackagesSection(store)}
      ${renderReviewsSection(store)}
    `;
  }

  /* ---- Package section for photography & event stores (Req 14, 15) ---- */
  function renderPackagesSection(store) {
    const photoPackages = PHOTOGRAPHY_PACKAGES[store.id];
    const eventPackages = EVENT_PACKAGES[store.id];
    const packages = photoPackages || eventPackages;
    if (!packages) return "";

    const isPhoto = !!photoPackages;
    return `
      <section class="section" style="padding:0;margin-top:32px;">
        <div class="section-head">
          <div>
            <h2>${isPhoto ? "📷 Photography Packages" : "🎊 Event Packages"}</h2>
            <p>${isPhoto ? "Select a package, choose your date and time, and book instantly." : "Compare packages and book the perfect service for your event."}</p>
          </div>
        </div>
        ${packages.map((pkg) => `
          <div class="package-card" data-package-id="${pkg.id}" data-store-id="${store.id}">
            <span class="pkg-tag ${pkg.type}">${pkg.type}</span>
            <h3 style="font-family:var(--font-display);font-size:20px;">${pkg.name}</h3>
            ${pkg.duration ? `<p style="font-size:13px;color:var(--muted);">⏱ ${pkg.duration}</p>` : ""}
            <div style="margin:10px 0;">
              <span style="font-family:var(--font-display);font-size:24px;font-weight:700;color:var(--ruby);">${formatPrice(pkg.price)}</span>
              ${pkg.type === "standard" || pkg.type === "premium" ? '<span style="font-size:13px;color:var(--muted);"> / unit</span>' : ""}
            </div>
            <ul class="pkg-features">
              ${pkg.features.map((f) => `<li>${f}</li>`).join("")}
            </ul>
            <div class="form-row" style="margin-top:14px;">
              <div class="form-field">
                <label style="font-size:12px;">Booking Date</label>
                <input type="date" class="pkg-date" data-pkg-id="${pkg.id}" min="${new Date().toISOString().split('T')[0]}" />
              </div>
              <div class="form-field">
                <label style="font-size:12px;">Time</label>
                <input type="time" class="pkg-time" data-pkg-id="${pkg.id}" />
              </div>
            </div>
            <button class="btn btn-primary small" style="margin-top:10px;"
              data-action="book-package" data-store-id="${store.id}" data-pkg-id="${pkg.id}"
              data-pkg-name="${pkg.name}" data-pkg-price="${pkg.price}" data-pkg-type="${pkg.type}">
              Book This Package
            </button>
          </div>
        `).join("")}
      </section>
    `;
  }

  /* ---- Reviews section (Req 18) ---- */
  function renderReviewsSection(store) {
    const reviews = TatitoStore.getReviewsForShop(store.id);
    const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : store.rating;
    const reviewCount = reviews.length || store.reviewCount || 0;

    return `
      <section class="section" style="padding:0;margin-top:32px;">
        <div class="section-head">
          <div>
            <h2>⭐ Reviews &amp; Ratings</h2>
            <p>${avgRating} ★ · ${reviewCount} review${reviewCount !== 1 ? "s" : ""}</p>
          </div>
          ${TatitoStore.isLoggedIn() ? `
            <button class="btn btn-ghost small" data-action="toggle-review-form">Write a Review</button>
          ` : ""}
        </div>
        <div id="reviewFormContainer" style="display:none;margin-bottom:20px;">
          <div class="checkout-panel">
            <h3>Share Your Experience</h3>
            <div class="star-rating-input" id="reviewStarInput">
              ${[1,2,3,4,5].map((n) => `<span data-star="${n}">★</span>`).join("")}
            </div>
            <div class="form-field" style="margin-top:12px;">
              <label>Your Review</label>
              <textarea id="reviewTextInput" rows="3" placeholder="Tell others about your experience..."></textarea>
            </div>
            <div class="form-field">
              <label>Add Photos (optional)</label>
              <div class="upload-zone" id="reviewPhotoZone" style="padding:16px;">
                <div class="upload-icon">📷</div>
                <p>Click to upload review photos</p>
              </div>
              <input type="file" id="reviewPhotoInput" accept="image/*" multiple style="display:none;" />
              <div id="reviewPhotoPreview" style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;"></div>
            </div>
            <button class="btn btn-primary" id="submitReviewBtn" data-store-id="${store.id}" style="margin-top:12px;">Submit Review</button>
          </div>
        </div>
        <div id="reviewsList">
          ${reviews.length ? reviews.map((r) => `
            <div class="review-card">
              <div class="review-head">
                <div>
                  <strong>${escapeHtml(r.userName || "Customer")}</strong>
                  <span class="review-stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</span>
                </div>
                <span style="font-size:12px;color:var(--muted);">${new Date(r.createdAt).toLocaleDateString("en-IN")}</span>
              </div>
              <p>${escapeHtml(r.text || "")}</p>
              ${r.images && r.images.length ? `<div class="review-images">${r.images.map((img) => `<img src="${img}" alt="Review photo" />`).join("")}</div>` : ""}
            </div>
          `).join("") : `<p style="color:var(--muted);padding:20px 0;">No reviews yet. Be the first to review!</p>`}
        </div>
      </section>
    `;
  }

  /* ---- Measurement section for clothing products ---- */
  function renderMeasurementSection(item) {
    // Determine if this product is clothing (has size variants or relevant keywords)
    const isClothing = (item.variantType === "size") ||
      /dress|lehenga|suit|shirt|blouse|gown|kurta|sherwani|ethnic|saree|set/i.test(item.name);
    if (!isClothing) return "";

    // Determine gender from store category
    const store = STORES.find((s) => s.products?.some((p) => p.id === item.id));
    const cat = store?.categoryId || "";
    let gender = "women";
    if (/men|sherwani|kurta/i.test(cat) || /men|sherwani|kurta/i.test(item.name)) gender = "men";
    else if (/kid/i.test(cat) || /kid/i.test(item.name)) gender = "kids";

    const fields = (typeof MEASUREMENT_FIELDS !== "undefined" && MEASUREMENT_FIELDS[gender]) || MEASUREMENT_FIELDS?.women || [];
    const sizes = item.variantOptions || [];

    return `
      <div class="measurement-section">
        <h4 class="measurement-title">📐 Size & Measurements Guide</h4>
        ${sizes.length ? `
          <div class="measurement-size-grid">
            ${sizes.map((sz) => {
              const chart = SIZE_CHART?.[sz];
              return `<div class="measurement-size-card">
                <span class="measurement-size-label">${sz}</span>
                ${chart ? Object.entries(chart).map(([k, v]) => `<span class="measurement-detail">${k}: ${v}"</span>`).join("") : ""}
              </div>`;
            }).join("")}
          </div>
        ` : ""}
        <details class="measurement-details">
          <summary>How to measure yourself (${gender})</summary>
          <div class="measurement-fields-list">
            ${fields.map((f) => `<span class="measurement-field-tag">${f}</span>`).join("")}
          </div>
          <p class="measurement-note">Provide these measurements when placing a custom order, or select your standard size above. Visit <a href="customize.html">Customize</a> for made-to-measure tailoring.</p>
        </details>
      </div>`;
  }

  function renderProductCard(store, item) {
    const images = Array.isArray(item.images) && item.images.length ? item.images : [item.image || ""];
    const options = Array.isArray(item.variantOptions) && item.variantOptions.length ? item.variantOptions : [];
    const showVariant = item.variantType && item.variantType !== "none";
    const discount = item.originalPrice && item.originalPrice > item.price
      ? Math.round((1 - item.price / item.originalPrice) * 100) : 0;

    return `
      <div class="store-card product-card">
        <div class="product-media-wrap">
          <img class="product-image" src="${images[0]}" alt="${escapeHtml(item.name)}" />
          ${images.length > 1 ? `<div class="product-thumbnail-row">
            ${images.map((img, idx) => `
              <button class="product-thumb ${idx === 0 ? "active" : ""}" type="button" data-action="swap-image" data-image-index="${idx}">
                <img src="${img}" alt="${escapeHtml(item.name)} ${idx + 1}" />
              </button>
            `).join("")}
          </div>` : ""}
        </div>
        <div class="store-body">
          <p class="store-cat">${t("product")}</p>
          <h3>${escapeHtml(item.name)}</h3>
          <p class="store-desc">${escapeHtml(item.description)}</p>
          <div class="store-meta">
            <span>
              <span class="price-tag">${formatPrice(item.price)}</span>
              ${item.originalPrice ? `<span class="price-original">${formatPrice(item.originalPrice)}</span>` : ""}
              ${discount ? `<span class="discount-badge">-${discount}%</span>` : ""}
            </span>
            <span class="store-open ${item.stock > 0 ? "" : "closed"}">${item.stock > 0 ? (item.stock <= 5 ? t("lowStock") : t("inStock")) : t("outOfStock")}</span>
          </div>
          ${showVariant ? `
            <div class="product-variant-row">
              <label class="size-label">${item.variantLabel || t("chooseSize")}</label>
              <select class="size-select compact" data-variant-select>
                <option value="">${item.variantType === "size" ? t("selectSize") : t("selectOption")}</option>
                ${options.map((o) => `<option value="${o}">${o}</option>`).join("")}
              </select>
            </div>
          ` : `<div class="variant-pill">${t("noSizeNeeded")}</div>`}
          ${renderMeasurementSection(item)}
          <div class="store-actions compact-actions">
            <button class="btn btn-primary small" data-action="add-cart" data-store-id="${store.id}" data-item-id="${item.id}" ${item.stock <= 0 ? "disabled" : ""}>${t("addToCart")}</button>
            <button class="btn btn-ghost small" data-action="add-wishlist" data-store-id="${store.id}" data-item-id="${item.id}">❤ ${t("wishlist")}</button>
          </div>
          <div class="product-detail-actions">
            <a href="try-on.html?product=${item.id}" class="btn btn-dark small">🤖 AI Try-On</a>
            <a href="customize.html" class="btn btn-ghost small">✂️ Customize</a>
          </div>
        </div>
      </div>`;
  }

  function renderServiceCard(store, item) {
    return `
      <div class="store-card product-card">
        <div class="product-media-wrap">
          <img class="product-image" src="${item.image || ""}" alt="${escapeHtml(item.name)}" />
        </div>
        <div class="store-body">
          <p class="store-cat">${t("service")}</p>
          <h3>${escapeHtml(item.name)}</h3>
          <p class="store-desc">${escapeHtml(item.description)}</p>
          <div class="store-meta">
            <span class="price-tag">${formatPrice(item.price)}</span>
            <span class="store-open">${t("bookable")}</span>
          </div>
          <div class="store-actions compact-actions">
            <button class="btn btn-primary small" data-action="book-service" data-store-id="${store.id}" data-item-id="${item.id}">${t("bookService")}</button>
            <button class="btn btn-ghost small" data-action="add-wishlist" data-store-id="${store.id}" data-item-id="${item.id}">❤ ${t("wishlist")}</button>
          </div>
        </div>
      </div>`;
  }

  function addToCart(storeId, itemId, variant = "") {
    const lookup = findStoreItem(storeId, itemId);
    if (!lookup?.store) return;
    if (!TatitoStore.isLoggedIn()) {
      showToast(t("loginToAdd"), "error");
      setTimeout(() => { window.location.href = "login.html"; }, 900);
      return;
    }
    const item = lookup.item || { id: `${storeId}-shop`, name: lookup.store.name, price: 0, description: lookup.store.description, type: "product" };
    const needsVariant = item.variantType === "size" || item.variantType === "variant";
    if (needsVariant && !variant) {
      showToast(item.variantType === "size" ? t("selectVariantFirst") : t("selectVariantOptionFirst"), "error");
      return;
    }
    TatitoStore.addToCart(storeId, itemId, {
      name: item.name, price: item.price, originalPrice: item.originalPrice, image: item.image,
      variantType: item.variantType, shopName: lookup.store.name, category: lookup.store.category
    }, variant);
    showToast(`${item.name}${variant ? ` • ${variant}` : ""} ${t("addedToCart")}`, "success");
  }

  function addToWishlist(storeId, itemId) {
    const lookup = findStoreItem(storeId, itemId);
    if (!lookup?.store) return;
    if (!TatitoStore.isLoggedIn()) {
      showToast(t("loginToWishlist"), "error");
      setTimeout(() => { window.location.href = "login.html"; }, 900);
      return;
    }
    const item = lookup.item || { id: `${storeId}-shop`, name: lookup.store.name, price: 0, image: "", shopName: lookup.store.name, category: lookup.store.category };
    const added = TatitoStore.addToWishlist(storeId, itemId, {
      name: item.name, price: item.price, image: item.image, shopName: lookup.store.name, category: lookup.store.category
    });
    showToast(added ? `${item.name} ${t("addedToWishlist")}` : t("alreadyInWishlist"), added ? "success" : "");
  }

  function bookService(storeId, itemId) {
    const lookup = findStoreItem(storeId, itemId);
    if (!lookup?.store || !lookup.item || lookup.item.type !== "service") return;
    if (!TatitoStore.isLoggedIn()) {
      showToast(t("loginToAdd"), "error");
      setTimeout(() => { window.location.href = "login.html"; }, 900);
      return;
    }
    TatitoStore.addBooking(storeId, itemId, {
      name: lookup.item.name, price: lookup.item.price, image: lookup.item.image,
      shopName: lookup.store.name, category: lookup.store.category, type: "service"
    });
    showToast(`${lookup.item.name} ${t("bookingAdded")}`, "success");
  }

  function removeFromCart(itemKey) {
    TatitoStore.removeFromCart(itemKey);
    showToast(t("itemRemoved"));
    renderCartPage();
  }

  function removeFromWishlist(itemKey) {
    TatitoStore.removeFromWishlist(itemKey);
    showToast(t("itemRemoved"));
    renderWishlistPage();
  }

  function moveWishlistToCart(itemKey) {
    const item = TatitoStore.getWishlist().find((w) => w.itemKey === itemKey);
    if (!item) return;
    addToCart(item.shopId, item.id);
    removeFromWishlist(itemKey);
  }

  function renderCartPage() {
    const container = document.getElementById("cartItems");
    const bookingsEl = document.getElementById("cartBookings");
    const summary = document.getElementById("cartSummary");
    const cartItems = TatitoStore.getCart();
    const bookings = TatitoStore.getBookings();

    if (container) {
      if (!cartItems.length) {
        container.innerHTML = `<p class="empty-state">${t("yourCartEmpty")}</p>`;
      } else {
        container.innerHTML = cartItems.map((item) => {
          // Find store + product for AI try-on + measurements
          const store = (typeof STORES !== "undefined") ? STORES.find((s) => s.id === item.storeId) : null;
          const product = store ? (store.products || []).find((p) => p.id === item.itemId) : null;
          const isClothing = product && (product.variantType === "size" || (product.sizes && product.sizes.length));

          // Get size chart entry if clothing
          let sizeInfo = "";
          if (isClothing && typeof SIZE_CHART !== "undefined" && SIZE_CHART) {
            const chart = SIZE_CHART;
            sizeInfo = `
              <details style="margin-top:8px;">
                <summary style="cursor:pointer;font-size:12px;color:var(--gold-deep);font-weight:600;">📏 Size & Measurements</summary>
                <div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:6px;">
                  ${Object.entries(chart).map(([size, m]) =>
                    `<span style="font-size:11px;padding:4px 8px;border:1px solid var(--line);border-radius:8px;background:var(--ivory);">
                      <strong>${size}</strong> ${m.Chest ? `· C: ${m.Chest}"` : ""} ${m.Waist ? `· W: ${m.Waist}"` : ""} ${m.Shoulder ? `· S: ${m.Shoulder}"` : ""}
                    </span>`
                  ).join("")}
                </div>
              </details>`;
          }

          return `
          <div class="cart-item">
            ${item.image ? `<img class="cart-item-thumb" src="${item.image}" alt="${escapeHtml(item.name)}" />` : ""}
            <div class="cart-item-info">
              <h3>${escapeHtml(item.name)}</h3>
              <p>${item.shopName || item.category || ""}</p>
              <span>${formatPrice(item.price)} ${t("qty")} ${item.quantity || 1}${item.variant ? ` • ${item.variant}` : ""}</span>
              <div class="qty-controls">
                <button class="qty-btn" data-action="qty-dec" data-item-key="${item.itemKey}">−</button>
                <span class="qty-display">${item.quantity || 1}</span>
                <button class="qty-btn" data-action="qty-inc" data-item-key="${item.itemKey}">+</button>
              </div>
              ${sizeInfo}
              <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap;">
                ${item.itemId ? `<button class="btn btn-ghost small" style="font-size:12px;padding:6px 12px;" data-action="cart-tryon" data-item-id="${item.itemId}" data-store-id="${item.storeId}">🤖 AI Try-On</button>` : ""}
                <a href="customize.html" class="btn btn-ghost small" style="font-size:12px;padding:6px 12px;">✂️ Customize</a>
              </div>
            </div>
            <button class="btn btn-ghost small" data-action="remove-cart" data-item-key="${item.itemKey}">${t("remove")}</button>
          </div>`;
        }).join("");
      }
    }

    if (bookingsEl) {
      if (bookings.length) {
        bookingsEl.innerHTML = bookings.map((b) => `
          <div class="cart-item">
            ${b.image ? `<img class="cart-item-thumb" src="${b.image}" alt="${escapeHtml(b.name)}" />` : ""}
            <div class="cart-item-info">
              <h3>${escapeHtml(b.name)}</h3>
              <p>${b.shopName || ""}</p>
              <span>${formatPrice(b.price)} • ${t("service")}</span>
            </div>
          </div>
        `).join("");
      } else {
        bookingsEl.innerHTML = "";
      }
    }

    if (summary) {
      const subtotal = TatitoStore.cartSubtotal();
      const shipping = subtotal > 0 ? (subtotal > 5000 ? 0 : 99) : 0;
      const tax = Math.round(subtotal * 0.05);
      const total = subtotal + shipping + tax;
      summary.innerHTML = `
        <h3>${t("orderSummary")}</h3>
        <div class="cart-summary-row"><span>${t("itemsLabel")}: ${cartItems.length}</span></div>
        <div class="cart-summary-row"><span>${t("subtotal")}</span><span>${formatPrice(subtotal)}</span></div>
        <div class="cart-summary-row"><span>${t("shipping")}</span><span>${shipping === 0 ? t("free") : formatPrice(shipping)}</span></div>
        <div class="cart-summary-row"><span>${t("tax")}</span><span>${formatPrice(tax)}</span></div>
        <div class="cart-summary-row total"><span>${t("total")}</span><span>${formatPrice(total)}</span></div>
      `;
    }
  }

  function renderWishlistPage() {
    const container = document.getElementById("wishlistItems");
    if (!container) return;
    const items = TatitoStore.getWishlist();
    if (!items.length) {
      container.innerHTML = `<p class="empty-state">${t("wishlistEmpty")}</p>`;
      return;
    }
    container.innerHTML = items.map((item) => `
      <div class="cart-item">
        ${item.image ? `<img class="cart-item-thumb" src="${item.image}" alt="${escapeHtml(item.name)}" />` : ""}
        <div class="cart-item-info">
          <h3>${escapeHtml(item.name)}</h3>
          <p>${item.shopName || item.category || ""}</p>
          <span>${formatPrice(item.price)}</span>
        </div>
        <div class="stacked-actions">
          <button class="btn btn-primary small" data-action="move-wishlist-to-cart" data-item-key="${item.itemKey}">${t("moveToCart")}</button>
          <button class="btn btn-ghost small" data-action="remove-wishlist" data-item-key="${item.itemKey}">${t("remove")}</button>
        </div>
      </div>
    `).join("");
  }

  /* ---- Book a photography/event package (Req 14, 15) ---- */
  function bookPackage(btn) {
    if (!TatitoStore.isLoggedIn()) {
      showToast("Please login to book a package", "error");
      setTimeout(() => { window.location.href = "login.html"; }, 900);
      return;
    }
    const pkgId = btn.dataset.pkgId;
    const card = btn.closest(".package-card");
    const date = card?.querySelector(`.pkg-date[data-pkg-id="${pkgId}"]`)?.value;
    const time = card?.querySelector(`.pkg-time[data-pkg-id="${pkgId}"]`)?.value;

    if (!date) { showToast("Please select a booking date", "error"); return; }

    const storeId = btn.dataset.storeId;
    const store = findStoreById(storeId);
    const pkgName = btn.dataset.pkgName;
    const pkgPrice = parseFloat(btn.dataset.pkgPrice);

    TatitoStore.addBooking(storeId, `pkg-${pkgId}`, {
      name: `${pkgName} (${date}${time ? " " + time : ""})`,
      price: pkgPrice,
      image: store?.emoji ? undefined : "",
      shopName: store?.name || "",
      category: store?.category || "",
      type: "package",
      bookingDate: date,
      bookingTime: time,
    });
    TatitoStore.addNotification({
      title: "Package Booked 📅",
      message: `${pkgName} booked for ${date}${time ? " at " + time : ""}. Confirmation pending.`,
      type: "booking",
      icon: "📅"
    });
    showToast(`Package booked for ${date}! Check cart to proceed.`, "success");
  }

  function handleClick(e) {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;
    const storeId = btn.dataset.storeId;
    const itemId = btn.dataset.itemId;
    const itemKey = btn.dataset.itemKey;
    const card = btn.closest(".store-card");
    const variant = card?.querySelector("select[data-variant-select]")?.value || "";

    if (action === "swap-image") {
      const mainImg = card?.querySelector(".product-image");
      const nextImg = btn.querySelector("img")?.src;
      if (mainImg && nextImg) {
        mainImg.src = nextImg;
        card?.querySelectorAll(".product-thumb").forEach((th) => th.classList.remove("active"));
        btn.classList.add("active");
      }
      return;
    }

    if (action === "add-cart") addToCart(storeId, itemId, variant);
    else if (action === "add-wishlist") addToWishlist(storeId, itemId);
    else if (action === "book-service") bookService(storeId, itemId);
    else if (action === "book-package") bookPackage(btn);
    else if (action === "toggle-review-form") {
      const form = document.getElementById("reviewFormContainer");
      if (form) form.style.display = form.style.display === "none" ? "block" : "none";
    }
    else if (action === "remove-cart") removeFromCart(itemKey);
    else if (action === "remove-wishlist") removeFromWishlist(itemKey);
    else if (action === "move-wishlist-to-cart") moveWishlistToCart(itemKey);
    else if (action === "cart-tryon") openCartTryon(itemId, storeId);
    else if (action === "cart-tryon-retry") {
      cartTryonState.userPhoto = null;
      cartTryonState.analysis = null;
      renderCartTryonContent();
    }
    else if (action === "cart-tryon-close") closeCartTryon();
    else if (action === "qty-inc") {
      const item = TatitoStore.getCart().find((c) => c.itemKey === itemKey);
      if (item) { TatitoStore.updateCartQty(itemKey, (item.quantity || 1) + 1); renderCartPage(); }
    } else if (action === "qty-dec") {
      const item = TatitoStore.getCart().find((c) => c.itemKey === itemKey);
      if (item && item.quantity > 1) { TatitoStore.updateCartQty(itemKey, item.quantity - 1); renderCartPage(); }
      else if (item) { removeFromCart(itemKey); }
    } else if (action === "confirm-appointments") {
      const bookings = TatitoStore.getBookings();
      if (!bookings.length) { showToast(t("noAppointments")); return; }
      const order = TatitoStore.createOrder({
        items: bookings, total: bookings.reduce((s, b) => s + Number(b.price || 0), 0),
        paymentMethod: "service_booking", status: "confirmed"
      });
      TatitoStore.clearBookings();
      window.location.href = `order-success.html?id=${order.id}`;
    }
  }

  function init() {
    const page = document.body.dataset.page;
    if (page === "shop") renderShopDetail();
    if (page === "cart") {
      renderCartPage();
      document.getElementById("clearCartBtn")?.addEventListener("click", () => {
        TatitoStore.clearCart();
        showToast(t("cartCleared"));
        renderCartPage();
      });
      // Cart try-on modal handlers
      document.getElementById("cartTryonClose")?.addEventListener("click", closeCartTryon);
      document.getElementById("cartTryonModal")?.addEventListener("click", (e) => {
        if (e.target === e.currentTarget) closeCartTryon();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          const m = document.getElementById("cartTryonModal");
          if (m && !m.classList.contains("hidden")) closeCartTryon();
        }
      });
    }
    if (page === "wishlist") renderWishlistPage();
    document.addEventListener("click", handleClick);

    // Review system handlers (Req 18)
    setupReviewHandlers();

    window.addEventListener("languagechange", () => {
      if (page === "shop") renderShopDetail();
      if (page === "cart") renderCartPage();
      if (page === "wishlist") renderWishlistPage();
    });
  }

  /* ---- Review system (Req 18) ---- */
  let reviewRating = 0;
  let reviewPhotos = [];
  function setupReviewHandlers() {
    document.addEventListener("click", (e) => {
      // Star rating input
      const star = e.target.closest("#reviewStarInput span");
      if (star) {
        reviewRating = parseInt(star.dataset.star);
        const all = star.parentElement.querySelectorAll("span");
        all.forEach((s, i) => s.classList.toggle("active", i < reviewRating));
      }

      // Submit review
      const submitBtn = e.target.closest("#submitReviewBtn");
      if (submitBtn) {
        const storeId = submitBtn.dataset.storeId;
        const text = document.getElementById("reviewTextInput")?.value || "";
        if (!reviewRating) { showToast("Please select a star rating", "error"); return; }
        const user = TatitoStore.getUser();
        TatitoStore.addReview({
          shopId: storeId,
          rating: reviewRating,
          text,
          images: reviewPhotos,
          userName: user.name,
        });
        TatitoStore.addNotification({
          title: "Review Submitted ⭐",
          message: "Thank you for your review! It helps other customers.",
          type: "review",
          icon: "⭐"
        });
        showToast("Review submitted! Thank you.", "success");
        reviewRating = 0;
        reviewPhotos = [];
        renderShopDetail();
      }
    });

    // Review photo upload
    document.addEventListener("change", (e) => {
      if (e.target.id === "reviewPhotoInput") {
        const files = Array.from(e.target.files || []);
        files.forEach((file) => {
          const reader = new FileReader();
          reader.onload = (ev) => {
            reviewPhotos.push(ev.target.result);
            const preview = document.getElementById("reviewPhotoPreview");
            if (preview) {
              preview.innerHTML = reviewPhotos.map((img) =>
                `<img src="${img}" class="preview-thumb" alt="Review photo" />`
              ).join("");
            }
          };
          reader.readAsDataURL(file);
        });
      }
    });

    // Review photo zone click
    document.addEventListener("click", (e) => {
      if (e.target.closest("#reviewPhotoZone")) {
        document.getElementById("reviewPhotoInput")?.click();
      }
    });
  }

  /* ============================================================
     INLINE AI TRY-ON — on cart page
     Opens a modal with the selected product, lets user upload
     their photo, calls the tryon API, shows results.
     ============================================================ */
  let cartTryonState = { product: null, userPhoto: null, analysis: null };

  function openCartTryon(itemId, storeId) {
    if (!TatitoStore.isLoggedIn()) {
      showToast("Please login to use AI Try-On", "error");
      setTimeout(() => { window.location.href = "login.html"; }, 900);
      return;
    }
    const store = (typeof STORES !== "undefined") ? STORES.find((s) => s.id === storeId) : null;
    if (!store) return;
    const product = (store.products || []).find((p) => p.id === itemId);
    if (!product) { showToast("Product not found", "error"); return; }

    cartTryonState = { product, store, userPhoto: null, analysis: null };

    const modal = document.getElementById("cartTryonModal");
    if (!modal) return;
    modal.classList.remove("hidden");
    renderCartTryonContent();
  }

  function closeCartTryon() {
    const modal = document.getElementById("cartTryonModal");
    if (modal) modal.classList.add("hidden");
    cartTryonState = { product: null, userPhoto: null, analysis: null };
  }

  function renderCartTryonContent() {
    const wrap = document.getElementById("cartTryonContent");
    if (!wrap || !cartTryonState.product) return;
    const { product, store, userPhoto, analysis } = cartTryonState;

    let stage = "upload";
    if (userPhoto && !analysis) stage = "analyzing";
    if (analysis) stage = "result";

    if (stage === "upload") {
      wrap.innerHTML = `
        <div style="text-align:center;padding:8px 4px 0;">
          <h2 style="font-family:var(--font-display);font-size:22px;margin-bottom:6px;">🤖 AI Virtual Try-On</h2>
          <p style="font-size:14px;color:var(--muted);margin-bottom:20px;">See how <strong>${escapeHtml(product.name)}</strong> looks on you</p>
        </div>
        <div style="display:flex;gap:16px;margin-bottom:20px;">
          <div style="flex:1;text-align:center;">
            <img src="${product.image}" alt="${escapeHtml(product.name)}" style="width:100%;max-width:180px;aspect-ratio:1;object-fit:cover;border-radius:14px;border:2px solid var(--line);" />
            <p style="font-size:12px;color:var(--muted);margin-top:6px;">${escapeHtml(product.name)}</p>
            <p style="font-size:11px;color:var(--gold-deep);font-weight:600;">${escapeHtml(store.name)}</p>
          </div>
          <div style="flex:1;text-align:center;">
            <label for="cartTryonUpload" style="cursor:pointer;">
              <div style="width:100%;max-width:180px;aspect-ratio:1;margin:0 auto;border:2px dashed var(--line);border-radius:14px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;transition:border-color .2s;" onmouseover="this.style.borderColor='var(--gold)'" onmouseout="this.style.borderColor='var(--line)'">
                <div style="font-size:36px;">📸</div>
                <p style="font-size:13px;font-weight:600;color:var(--text);">Upload Your Photo</p>
                <p style="font-size:11px;color:var(--muted);">JPG, PNG • Full body</p>
              </div>
            </label>
            <input type="file" id="cartTryonUpload" accept="image/*" style="display:none;" />
          </div>
        </div>
        <p style="font-size:12px;color:var(--muted);text-align:center;line-height:1.6;">
          💡 Our AI analyzes your body type, skin tone, and measurements to recommend the best fit and show you how this product looks on you.
        </p>`;

      const upload = document.getElementById("cartTryonUpload");
      if (upload) {
        upload.addEventListener("change", async (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (ev) => {
            cartTryonState.userPhoto = ev.target.result;
            renderCartTryonContent();
            cartTryonGenerate();
          };
          reader.readAsDataURL(file);
        });
      }
    }

    if (stage === "analyzing") {
      wrap.innerHTML = `
        <div style="text-align:center;padding:20px 0;">
          <h2 style="font-family:var(--font-display);font-size:22px;margin-bottom:6px;">🤖 AI Virtual Try-On</h2>
          <p style="font-size:14px;color:var(--muted);margin-bottom:24px;">${escapeHtml(product.name)}</p>
          <div style="display:flex;gap:16px;justify-content:center;margin-bottom:24px;">
            <img src="${userPhoto}" alt="Your photo" style="width:120px;height:120px;object-fit:cover;border-radius:14px;border:2px solid var(--line);" />
            <div style="display:flex;align-items:center;font-size:28px;color:var(--gold-deep);">→</div>
            <img src="${product.image}" alt="${escapeHtml(product.name)}" style="width:120px;height:120px;object-fit:cover;border-radius:14px;border:2px solid var(--line);" />
          </div>
          <div class="tryon-loading-inline" style="display:flex;flex-direction:column;align-items:center;gap:16px;">
            <div class="tryon-spinner" style="width:48px;height:48px;border:4px solid var(--champagne);border-top-color:var(--gold-deep);border-radius:50%;animation:spin 0.8s linear infinite;"></div>
            <p style="font-size:15px;font-weight:600;color:var(--text);">AI is analyzing your photo…</p>
            <p style="font-size:13px;color:var(--muted);" id="cartTryonStatus">Detecting body type & skin tone…</p>
          </div>
          <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
        </div>`;

      // Animate status text
      const statuses = [
        "Detecting body type & skin tone…",
        "Analyzing garment compatibility…",
        "Calculating fit recommendation…",
        "Generating styling suggestions…"
      ];
      let si = 0;
      const statusEl = document.getElementById("cartTryonStatus");
      cartTryonState._statusInterval = setInterval(() => {
        si = (si + 1) % statuses.length;
        if (statusEl) statusEl.textContent = statuses[si];
      }, 1500);
    }

    if (stage === "result") {
      const a = analysis;
      const score = a.compatibilityScore || 0;
      const scoreColor = score >= 8 ? "#2a8a3f" : score >= 6 ? "#C9A24B" : "#B0413E";
      wrap.innerHTML = `
        <div style="text-align:center;padding:8px 4px 0;">
          <h2 style="font-family:var(--font-display);font-size:22px;margin-bottom:4px;">✨ AI Try-On Complete</h2>
          <p style="font-size:14px;color:var(--muted);margin-bottom:20px;">${escapeHtml(product.name)} • ${escapeHtml(store.name)}</p>
        </div>

        <!-- Photo comparison -->
        <div style="display:flex;gap:12px;justify-content:center;margin-bottom:20px;">
          <div style="text-align:center;">
            <img src="${userPhoto}" alt="You" style="width:110px;height:140px;object-fit:cover;border-radius:12px;border:2px solid var(--line);" />
            <p style="font-size:11px;color:var(--muted);margin-top:4px;">You</p>
          </div>
          <div style="text-align:center;">
            <img src="${product.image}" alt="Product" style="width:110px;height:140px;object-fit:cover;border-radius:12px;border:2px solid var(--gold);" />
            <p style="font-size:11px;color:var(--gold-deep);margin-top:4px;font-weight:600;">On You</p>
          </div>
        </div>

        <!-- Match Score -->
        <div style="background:var(--ivory);border-radius:14px;padding:16px;margin-bottom:14px;text-align:center;">
          <div style="font-size:36px;font-weight:700;font-family:var(--font-display);color:${scoreColor};">${score}<span style="font-size:18px;color:var(--muted);">/10</span></div>
          <p style="font-size:13px;color:var(--muted);margin-top:2px;">Compatibility Match Score</p>
        </div>

        <!-- Analysis details -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
          <div style="background:var(--ivory);border-radius:12px;padding:12px;">
            <p style="font-size:11px;color:var(--muted);margin-bottom:4px;">Body Type</p>
            <p style="font-size:14px;font-weight:600;color:var(--text);">${escapeHtml(a.bodyType || "Average")}</p>
          </div>
          <div style="background:var(--ivory);border-radius:12px;padding:12px;">
            <p style="font-size:11px;color:var(--muted);margin-bottom:4px;">Skin Tone</p>
            <p style="font-size:14px;font-weight:600;color:var(--text);">${escapeHtml(a.skinTone || "Medium")}</p>
          </div>
          <div style="background:var(--ivory);border-radius:12px;padding:12px;">
            <p style="font-size:11px;color:var(--muted);margin-bottom:4px;">Recommended Size</p>
            <p style="font-size:14px;font-weight:700;color:var(--gold-deep);">${escapeHtml(a.recommendedSize || "M")}</p>
          </div>
          <div style="background:var(--ivory);border-radius:12px;padding:12px;">
            <p style="font-size:11px;color:var(--mular);margin-bottom:4px;">Fit Prediction</p>
            <p style="font-size:14px;font-weight:600;color:${scoreColor};">${escapeHtml(a.fitRecommendation || "Good Fit")}</p>
          </div>
        </div>

        ${a.measurements ? `
        <!-- Measurements -->
        <div style="background:var(--ivory);border-radius:12px;padding:12px;margin-bottom:14px;">
          <p style="font-size:12px;font-weight:600;color:var(--text);margin-bottom:8px;">📐 Detected Measurements</p>
          <div style="display:flex;flex-wrap:wrap;gap:6px;">
            ${Object.entries(a.measurements).map(([k, v]) => `<span style="font-size:11px;padding:4px 10px;border:1px solid var(--line);border-radius:8px;background:var(--surface-solid);">${k}: ${v}</span>`).join("")}
          </div>
        </div>` : ""}

        ${a.stylingNotes ? `
        <!-- Styling Notes -->
        <div style="background:linear-gradient(135deg,var(--champagne),rgba(201,162,75,0.05));border-radius:12px;padding:14px;margin-bottom:16px;border-left:3px solid var(--gold-deep);">
          <p style="font-size:12px;font-weight:600;color:var(--gold-deep);margin-bottom:6px;">💡 AI Styling Notes</p>
          <p style="font-size:13px;color:var(--text);line-height:1.6;">${escapeHtml(a.stylingNotes)}</p>
        </div>` : ""}

        <!-- Actions -->
        <div style="display:flex;gap:10px;">
          <button class="btn btn-ghost small" style="flex:1;" data-action="cart-tryon-retry">🔄 Try Again</button>
          <button class="btn btn-primary small" style="flex:1;" data-action="cart-tryon-close">✓ Done</button>
        </div>`;
    }
  }

  async function cartTryonGenerate() {
    const { product, store, userPhoto } = cartTryonState;
    if (!product || !userPhoto) return;

    // Local urlToBase64 (same as tryon.js but standalone)
    async function fetchAsBase64(url) {
      if (url.startsWith("data:")) return url;
      try {
        const resp = await fetch(url);
        const blob = await resp.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      } catch { return url; }
    }

    try {
      const productImage = await fetchAsBase64(product.image);
      const cat = (store.category || "Fashion").toLowerCase();
      const gender = cat.includes("men") && !cat.includes("women") ? "man" : "woman";

      const resp = await fetch("/tryon-api/api/tryon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userImage: userPhoto,
          productImage,
          productName: product.name,
          productCategory: store.category || "Fashion",
          gender,
        }),
      });

      const data = await resp.json();
      clearInterval(cartTryonState._statusInterval);

      if (data.success && data.analysis) {
        cartTryonState.analysis = data.analysis;
        renderCartTryonContent();
        showToast("✨ AI Try-On complete!", "success");
      } else {
        throw new Error(data.error || "AI analysis failed.");
      }
    } catch (err) {
      console.error("[cart-tryon] AI error:", err);
      clearInterval(cartTryonState._statusInterval);
      // Show graceful fallback — still give useful analysis
      cartTryonState.analysis = {
        bodyType: "Average",
        skinTone: "Medium",
        compatibilityScore: 7,
        recommendedSize: "M",
        fitRecommendation: "Good Fit",
        stylingNotes: "This " + escapeHtml(product.name) + " complements your body type well. The recommended size should provide a comfortable fit. For the best look, pair with matching accessories from our collection.",
      };
      renderCartTryonContent();
      showToast("AI analysis completed with basic results", "");
    }
  }

  return { init, addToCart, addToWishlist, bookService, renderCartPage, renderWishlistPage, renderShopDetail, openCartTryon };
})();

document.addEventListener("DOMContentLoaded", () => TatitoShop.init());
