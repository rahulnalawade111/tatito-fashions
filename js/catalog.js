/* =========================================================
   catalog.js — Category page with full hierarchical filtering.
   Sidebar: Category → Subcategory → Sort → Price → Rating
   Top:     Category chips + Subcategory chips (synced with sidebar)
   All filters apply live (no "Apply" button needed).
   URL params: ?category=men-wear&sub=formal-shirts&search=...
   ========================================================= */

const TatitoCatalog = (() => {
  const normalize = (v) => String(v || "").toLowerCase().trim();

  /* ---- Build a flat map of all category slugs → display name ---- */
  function getAllCategorySlugs() {
    const cats = [];
    if (typeof COLLECTION_SECTIONS !== "undefined") {
      COLLECTION_SECTIONS.forEach((s) => cats.push({ slug: s.slug, name: s.name, emoji: s.emoji }));
    }
    if (typeof NAV_VERTICALS !== "undefined") {
      NAV_VERTICALS.forEach((v) => {
        if (v.slug !== "collections") cats.push({ slug: v.slug, name: v.name, emoji: v.emoji });
      });
    }
    return cats;
  }

  function getCategoryBySlug(slug) {
    const s = normalize(slug);
    return getAllCategorySlugs().find((c) => normalize(c.slug) === s);
  }

  /* ---- Subcategory name ↔ slug helpers ---- */
  function subToSlug(name) { return encodeURIComponent(name.toLowerCase().replace(/\s+/g, "-")); }
  function slugToSub(slug) { return decodeURIComponent(slug || "").replace(/-/g, " ").toLowerCase().trim(); }

  function getSubcategoriesForCategory(catSlug) {
    const groups = (SUBCATEGORIES[normalize(catSlug)] || []);
    const items = [];
    groups.forEach((g) => {
      g.items.forEach((item) => {
        items.push({ name: item, slug: subToSlug(item), group: g.group });
      });
    });
    return items;
  }

  /* ---- Flatten ALL products + services into searchable items ---- */
  function getAllItems() {
    const items = [];
    STORES.forEach((store) => {
      (store.products || []).forEach((p) => {
        items.push({
          ...p,
          storeId: store.id, storeName: store.name, storeRating: store.rating,
          storeImage: store.image, storeBadge: store.badge, storeOpen: store.open,
          categoryId: store.categoryId, storeCategory: store.category,
          storeLat: store.lat, storeLng: store.lng,
          itemType: "product",
        });
      });
      (store.services || []).forEach((s) => {
        items.push({
          ...s,
          storeId: store.id, storeName: store.name, storeRating: store.rating,
          storeImage: store.image, storeBadge: store.badge, storeOpen: store.open,
          categoryId: store.categoryId, storeCategory: store.category,
          storeLat: store.lat, storeLng: store.lng,
          itemType: "service",
        });
      });
    });
    return items;
  }

  /* ============================================================
     Subcategory matching — robust multi-strategy approach
     Strategy:
       1. Exact subCategory field match (slug-normalized)
       2. Group-header match (e.g. item belongs to "Topwear" group)
       3. Keyword overlap between subcategory name and product name/desc
     ============================================================ */
  function itemMatchesSubcategory(item, catSlug, subSlug) {
    if (!subSlug) return true;

    const subName = slugToSub(subSlug);          // e.g. "formal shirts"
    const itemSub = normalize(item.subCategory);  // e.g. "topwear"
    const itemName = normalize(item.name);
    const itemDesc = normalize(item.description || "");
    const itemTags = (item.tags || []).join(" ").toLowerCase();
    const searchText = itemName + " " + itemDesc + " " + itemTags;

    // 1. Exact subCategory field match (account for plural/stem)
    if (itemSub === subName || itemSub === subName.replace(/s$/, "") ||
        itemSub.replace(/s$/, "") === subName) {
      return true;
    }

    // 2. Does this subcategory appear as a group in SUBCATEGORIES,
    //    and does the item's subCategory belong to that group?
    const groups = SUBCATEGORIES[normalize(catSlug)] || [];
    for (const g of groups) {
      const groupSlug = subToSlug(g.group);
      if (groupSlug === subSlug) {
        // Item matches if its subCategory maps to any item in this group
        const groupItemSlugs = g.items.map((i) => subToSlug(i));
        if (groupItemSlugs.includes(subToSlug(item.subCategory || ""))) return true;
        // Or if item subCategory text matches the group name
        if (itemSub === normalize(g.group)) return true;
      }
    }

    // 3. Keyword overlap — break subcategory name into words,
    //    check if all significant words appear in product name/desc/tags
    const subWords = subName.split(/\s+/).filter((w) => w.length > 2);
    if (subWords.length === 0) return false;

    const allWordsMatch = subWords.every((w) => {
      const stem = w.replace(/(s|es|ing)$/, "");
      return searchText.includes(w) || searchText.includes(stem);
    });
    if (allWordsMatch) return true;

    // 4. Single-word subcategory — match on name only (stricter)
    if (subWords.length === 1) {
      const stem = subWords[0].replace(/(s|es|ing)$/, "");
      if (itemName.includes(subWords[0]) || itemName.includes(stem)) return true;
    }

    return false;
  }

  /* ---- Get current filter state from sidebar DOM only ---- */
  function getActiveFilters() {
    const catFilter = document.getElementById("filterCategory");
    const subFilter = document.getElementById("filterSubcategory");
    const sortSelect = document.getElementById("sortSelect");
    const minPrice = parseFloat(document.getElementById("minPrice")?.value) || 0;
    const maxPrice = parseFloat(document.getElementById("maxPrice")?.value) || Infinity;
    const minRating = parseFloat(document.querySelector('input[name="rating"]:checked')?.value) || 0;
    const openNow = document.getElementById("openNowFilter")?.checked || false;
    const inStock = document.getElementById("inStockOnly")?.checked || false;
    const onSale = document.getElementById("onSaleOnly")?.checked || false;

    const category = catFilter ? catFilter.value : "all";
    const subcategory = subFilter ? subFilter.value : "all";
    const search = normalize(document.getElementById("catalogSearchInput")?.value);
    const sort = sortSelect ? sortSelect.value : "popular";

    return { category, subcategory, search, sort, minPrice, maxPrice, minRating, openNow, inStock, onSale };
  }

  /* ---- Apply filters + sort ---- */
  function getFilteredItems() {
    const f = getActiveFilters();
    let items = getAllItems();

    // Category filter
    if (f.category && f.category !== "all") {
      items = items.filter((item) => normalize(item.categoryId) === normalize(f.category));
    }

    // Subcategory filter
    if (f.subcategory && f.subcategory !== "all") {
      items = items.filter((item) => itemMatchesSubcategory(item, f.category, f.subcategory));
    }

    // Search filter
    if (f.search) {
      items = items.filter((item) => {
        const haystack = [item.name, item.storeName, item.storeCategory, item.description, item.subCategory]
          .filter(Boolean).join(" ").toLowerCase();
        return haystack.includes(f.search);
      });
    }

    // Price filter
    items = items.filter((item) => item.price >= f.minPrice && item.price <= f.maxPrice);

    // Rating filter
    if (f.minRating > 0) {
      items = items.filter((item) => (item.storeRating || 0) >= f.minRating);
    }

    // Open Now filter
    if (f.openNow) {
      items = items.filter((item) => item.storeOpen);
    }

    // In Stock filter (products only — services always available)
    if (f.inStock) {
      items = items.filter((item) => item.itemType === "service" || (item.stock || 0) > 0);
    }

    // On Sale filter
    if (f.onSale) {
      items = items.filter((item) => item.originalPrice && item.originalPrice > item.price);
    }

    // Sort
    const arr = [...items];
    switch (f.sort) {
      case "priceLow":   arr.sort((a, b) => a.price - b.price); break;
      case "priceHigh":  arr.sort((a, b) => b.price - a.price); break;
      case "rating":     arr.sort((a, b) => (b.storeRating || 0) - (a.storeRating || 0)); break;
      case "discount":
        arr.sort((a, b) =>
          (b.originalPrice ? 1 - b.price / b.originalPrice : 0) -
          (a.originalPrice ? 1 - a.price / a.originalPrice : 0));
        break;
      case "distance":
        arr.sort((a, b) => (a._dynamicDistance ?? a.storeDistance ?? 9999) - (b._dynamicDistance ?? b.storeDistance ?? 9999));
        break;
      case "popular":
      default:
        arr.sort((a, b) => (b.storeRating || 0) - (a.storeRating || 0));
    }
    return arr;
  }

  /* ---- Render the product grid ---- */
  function renderGrid() {
    const items = getFilteredItems();
    const storeGrid = document.getElementById("storeGrid");
    const resultsHeading = document.getElementById("resultsHeading");
    const resultsSummary = document.getElementById("resultsSummary");
    if (!storeGrid) return;

    // Update heading from current category/subcategory
    const f = getActiveFilters();
    const cat = getCategoryBySlug(f.category);
    let heading = "All Products";
    if (f.subcategory !== "all") {
      heading = slugToSub(f.subcategory).replace(/\b\w/g, (c) => c.toUpperCase());
    } else if (cat) {
      heading = cat.name;
    }
    if (resultsHeading) resultsHeading.textContent = heading;
    if (resultsSummary) resultsSummary.textContent =
      items.length ? `${items.length} item${items.length !== 1 ? "s" : ""} found` : "No items found";

    if (!items.length) {
      storeGrid.innerHTML = `<p class="empty-state">No items match your filters. Try adjusting your search or filters.</p>`;
      return;
    }

    storeGrid.innerHTML = items.map((item) => renderItemCard(item)).join("");
  }

  /* ---- Individual card ---- */
  function renderItemCard(item) {
    const discount = item.originalPrice ? Math.round((1 - item.price / item.originalPrice) * 100) : 0;
    const distVal = item._dynamicDistance;
    const distStr = (typeof TatitoLocation !== "undefined" && distVal !== undefined)
      ? TatitoLocation.formatDist(distVal) : "";
    const isService = item.itemType === "service";
    const outOfStock = !isService && (item.stock || 0) <= 0;
    return `
      <div class="catalog-item-card">
        <a href="shop.html?shop=${item.storeId}" class="catalog-item-media">
          ${discount > 0 ? `<span class="product-discount-badge">-${discount}%</span>` : ""}
          ${distStr ? `<span class="product-dist-badge">📍 ${distStr}</span>` : ""}
          <img src="${item.image}" alt="${escapeHtml(item.name)}" loading="lazy" />
        </a>
        <div class="catalog-item-body">
          <p class="catalog-item-store">${escapeHtml(item.storeName)} · ★${item.storeRating}</p>
          <a href="shop.html?shop=${item.storeId}"><h3>${escapeHtml(item.name)}</h3></a>
          ${item.storeBadge ? `<span class="catalog-item-badge">${escapeHtml(item.storeBadge)}</span>` : ""}
          <div class="catalog-item-price">
            <span class="price-now">${formatPrice(item.price)}</span>
            ${item.originalPrice ? `<span class="price-was">${formatPrice(item.originalPrice)}</span>` : ""}
            ${isService ? `<span class="catalog-item-type">Service</span>` : ""}
          </div>
          <div class="catalog-item-actions">
            <button class="btn btn-primary small"
              data-action="catalog-add-cart"
              data-store-id="${item.storeId}"
              data-item-id="${item.id}"
              ${outOfStock ? "disabled" : ""}>
              ${outOfStock ? "Out of Stock" : isService ? "📖 Book" : "🛒 Add"}
            </button>
            <a href="shop.html?shop=${item.storeId}" class="btn btn-ghost small">View →</a>
          </div>
        </div>
      </div>`;
  }

  /* ---- Build sidebar Category dropdown (hierarchical, like products page) ---- */
  function buildCategoryDropdown() {
    const sel = document.getElementById("filterCategory");
    if (!sel) return;

    // Top option already in HTML
    // Collection sections
    if (typeof COLLECTION_SECTIONS !== "undefined") {
      COLLECTION_SECTIONS.forEach((sec) => {
        const el = document.createElement("option");
        el.value = sec.slug;
        el.textContent = `${sec.emoji} ${sec.name}`;
        sel.appendChild(el);
      });
    }
    // Verticals
    if (typeof NAV_VERTICALS !== "undefined") {
      NAV_VERTICALS.forEach((v) => {
        if (v.slug === "collections") return;
        const el = document.createElement("option");
        el.value = v.slug;
        el.textContent = `${v.emoji} ${v.name}`;
        sel.appendChild(el);
      });
    }
  }

  /* ---- Rebuild subcategory dropdown when category changes ---- */
  function buildSubcategoryDropdown(catSlug) {
    const subSel = document.getElementById("filterSubcategory");
    const subGroup = document.getElementById("subFilterGroup");
    if (!subSel || !subGroup) return;

    // Clear existing options
    subSel.innerHTML = '<option value="all">All Subcategories</option>';

    if (!catSlug || catSlug === "all") {
      subGroup.style.display = "none";
      return;
    }

    const subs = getSubcategoriesForCategory(catSlug);
    if (!subs.length) {
      subGroup.style.display = "none";
      return;
    }

    subGroup.style.display = "block";
    let currentOptGroup = null;
    subs.forEach((s) => {
      if (!currentOptGroup || currentOptGroup.label !== s.group) {
        currentOptGroup = document.createElement("optgroup");
        currentOptGroup.label = s.group;
        subSel.appendChild(currentOptGroup);
      }
      const el = document.createElement("option");
      el.value = s.slug;
      el.textContent = s.name;
      currentOptGroup.appendChild(el);
    });
  }

  /* ---- Build top-level category chips ---- */
  function renderCategoryChips() {
    const chipsEl = document.getElementById("categoryChipList");
    if (!chipsEl) return;

    const currentCat = getActiveFilters().category;
    const cats = getAllCategorySlugs();
    chipsEl.innerHTML =
      `<a class="category-badge ${currentCat === "all" ? "active" : ""}" href="javascript:void(0)" data-cat="all">All Categories</a>` +
      cats.map((c) =>
        `<a class="category-badge ${currentCat === c.slug ? "active" : ""}" href="javascript:void(0)" data-cat="${c.slug}">${c.emoji} ${c.name}</a>`
      ).join("");

    // Wire chip clicks
    chipsEl.querySelectorAll(".category-badge").forEach((chip) => {
      chip.addEventListener("click", (e) => {
        e.preventDefault();
        const cat = chip.dataset.cat;
        setCategory(cat);
      });
    });
  }

  /* ---- Build subcategory chips (visible when category selected) ---- */
  function renderSubcategoryChips() {
    const subChipsEl = document.getElementById("subcategoryChipList");
    if (!subChipsEl) return;

    const f = getActiveFilters();
    if (!f.category || f.category === "all") {
      subChipsEl.style.display = "none";
      subChipsEl.innerHTML = "";
      return;
    }

    const subs = getSubcategoriesForCategory(f.category);
    if (!subs.length) {
      subChipsEl.style.display = "none";
      return;
    }

    const cat = getCategoryBySlug(f.category);
    const catName = cat ? cat.name : f.category;
    subChipsEl.innerHTML =
      `<a class="subcategory-badge ${f.subcategory === "all" ? "active" : ""}" href="javascript:void(0)" data-sub="all">All ${catName}</a>` +
      subs.map((s) =>
        `<a class="subcategory-badge ${f.subcategory === s.slug ? "active" : ""}" href="javascript:void(0)" data-sub="${s.slug}">${s.name}</a>`
      ).join("");
    subChipsEl.style.display = "flex";

    subChipsEl.querySelectorAll(".subcategory-badge").forEach((chip) => {
      chip.addEventListener("click", (e) => {
        e.preventDefault();
        setSubcategory(chip.dataset.sub);
      });
    });
  }

  /* ---- Sync: set category (updates dropdown, chips, sub-dropdown, URL) ---- */
  function setCategory(catSlug) {
    const catSel = document.getElementById("filterCategory");
    if (catSel) catSel.value = catSlug;

    // Reset subcategory
    buildSubcategoryDropdown(catSlug);
    const subSel = document.getElementById("filterSubcategory");
    if (subSel) subSel.value = "all";

    updateUrl();
    renderCategoryChips();
    renderSubcategoryChips();
    renderGrid();
  }

  /* ---- Sync: set subcategory ---- */
  function setSubcategory(subSlug) {
    const subSel = document.getElementById("filterSubcategory");
    if (subSel) subSel.value = subSlug;
    updateUrl();
    renderSubcategoryChips();
    renderGrid();
  }

  /* ---- Update browser URL from current filter state ---- */
  function updateUrl() {
    const f = getActiveFilters();
    const params = new URLSearchParams();
    if (f.search) params.set("search", f.search);
    if (f.category && f.category !== "all") params.set("category", f.category);
    if (f.subcategory && f.subcategory !== "all") params.set("sub", f.subcategory);
    const qs = params.toString();
    window.history.replaceState({}, "", `${window.location.pathname}${qs ? "?" + qs : ""}`);
  }

  /* ---- Update page title/description from filters ---- */
  function updatePageMeta() {
    const f = getActiveFilters();
    const titleEl = document.getElementById("categoryPageTitle");
    const descEl = document.getElementById("categoryPageDescription");
    const cat = getCategoryBySlug(f.category);
    let title = "Browse All Categories";
    let desc = "Discover premium fashion, jewellery and wedding services near you.";

    if (f.subcategory !== "all") {
      const subName = slugToSub(f.subcategory).replace(/\b\w/g, (c) => c.toUpperCase());
      title = subName;
      desc = cat ? `Browse ${subName} in ${cat.name}` : `Browse ${subName}`;
    } else if (cat) {
      title = cat.name;
      desc = `Browse all ${cat.name.toLowerCase()} products and services.`;
    } else if (f.search) {
      title = "Search Results";
      desc = `Showing results for "${f.search}"`;
    }

    if (titleEl) titleEl.textContent = title;
    if (descEl) descEl.textContent = desc;
  }

  /* ---- Master render: call all update functions ---- */
  function renderAll() {
    updatePageMeta();
    renderCategoryChips();
    renderSubcategoryChips();
    renderGrid();
  }

  /* ---- Clear all filters ---- */
  function clearAllFilters() {
    const catSel = document.getElementById("filterCategory");
    if (catSel) catSel.value = "all";
    const subSel = document.getElementById("filterSubcategory");
    if (subSel) { subSel.value = "all"; }
    const subGroup = document.getElementById("subFilterGroup");
    if (subGroup) subGroup.style.display = "none";

    const search = document.getElementById("catalogSearchInput");
    if (search) search.value = "";
    const sort = document.getElementById("sortSelect");
    if (sort) sort.value = "popular";
    const mp = document.getElementById("minPrice"); if (mp) mp.value = "";
    const xp = document.getElementById("maxPrice"); if (xp) xp.value = "";
    const on = document.getElementById("openNowFilter"); if (on) on.checked = false;
    const is = document.getElementById("inStockOnly"); if (is) is.checked = true;
    const os = document.getElementById("onSaleOnly"); if (os) os.checked = false;
    const rd = document.querySelector('input[name="rating"][value="0"]'); if (rd) rd.checked = true;

    // Clear URL completely
    window.history.replaceState({}, "", window.location.pathname);
    renderAll();
  }

  /* ============================================================
     Init: wire up all event listeners
     ============================================================ */
  function initCatalog() {
    // Build dropdowns
    buildCategoryDropdown();

    // Read URL params to set initial state
    const params = new URLSearchParams(window.location.search);
    const urlCat = params.get("category") || "all";
    const urlSub = params.get("sub") || "all";
    const urlSearch = params.get("search") || "";

    // Set sidebar from URL
    const catSel = document.getElementById("filterCategory");
    if (catSel) catSel.value = urlCat;
    buildSubcategoryDropdown(urlCat);
    const subSel = document.getElementById("filterSubcategory");
    if (subSel && urlSub !== "all") subSel.value = urlSub;
    const searchInput = document.getElementById("catalogSearchInput");
    if (searchInput) searchInput.value = urlSearch;

    // Initial render
    renderAll();

    // ---- Event listeners (live filtering) ----
    // Category dropdown
    catSel?.addEventListener("change", () => {
      buildSubcategoryDropdown(catSel.value);
      const subSel2 = document.getElementById("filterSubcategory");
      if (subSel2) subSel2.value = "all";
      updateUrl();
      renderCategoryChips();
      renderSubcategoryChips();
      renderGrid();
      updatePageMeta();
    });

    // Subcategory dropdown
    document.getElementById("filterSubcategory")?.addEventListener("change", () => {
      updateUrl();
      renderSubcategoryChips();
      renderGrid();
      updatePageMeta();
    });

    // Sort
    document.getElementById("sortSelect")?.addEventListener("change", () => {
      renderGrid();
    });

    // Price inputs (live, with debounce)
    let priceTimer;
    ["minPrice", "maxPrice"].forEach((id) => {
      document.getElementById(id)?.addEventListener("input", () => {
        clearTimeout(priceTimer);
        priceTimer = setTimeout(renderGrid, 300);
      });
    });

    // Rating radios
    document.querySelectorAll('input[name="rating"]').forEach((r) => {
      r.addEventListener("change", renderGrid);
    });

    // Checkboxes
    document.getElementById("openNowFilter")?.addEventListener("change", renderGrid);
    document.getElementById("inStockOnly")?.addEventListener("change", renderGrid);
    document.getElementById("onSaleOnly")?.addEventListener("change", renderGrid);

    // Search input (live)
    searchInput?.addEventListener("input", () => {
      clearTimeout(priceTimer);
      priceTimer = setTimeout(() => {
        updateUrl();
        renderGrid();
        updatePageMeta();
      }, 300);
    });

    // Search form submit
    document.getElementById("catalogSearchForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      updateUrl();
      renderGrid();
      updatePageMeta();
    });

    // Clear all
    document.getElementById("clearFiltersBtn")?.addEventListener("click", clearAllFilters);

    // Language change
    window.addEventListener("languagechange", renderAll);

    // Quick add-to-cart handler
    document.addEventListener("click", (e) => {
      const btn = e.target.closest('[data-action="catalog-add-cart"]');
      if (!btn) return;
      e.preventDefault();
      const storeId = btn.dataset.storeId;
      const itemId = btn.dataset.itemId;
      quickAddToCart(storeId, itemId);
    });
  }

  /* ---- Quick add to cart ---- */
  function quickAddToCart(storeId, itemId) {
    if (!TatitoStore.isLoggedIn()) {
      showToast("Please login to add items to cart", "error");
      setTimeout(() => { window.location.href = "login.html"; }, 900);
      return;
    }
    const store = (STORES || []).find((s) => s.id === storeId);
    if (!store) return;
    const products = store.products || [];
    const item = products.find((p) => p.id === itemId);
    if (!item) return;

    // Out of stock check
    if ((item.stock || 0) <= 0) {
      showToast("This item is out of stock", "error");
      return;
    }

    if (item.variantType && item.variantType !== "none") {
      showToast("Please select a size on the product page", "");
      setTimeout(() => { window.location.href = `shop.html?shop=${storeId}`; }, 800);
      return;
    }

    TatitoStore.addToCart(storeId, itemId, {
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      shopName: store.name,
      category: store.category,
      variantType: item.variantType,
      stock: item.stock
    });
    showToast(`${item.name} added to cart`, "success");
  }

  return { initCatalog, renderAll, renderGrid };
})();

/* ---- Bootstrap ---- */
document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page === "category") {
    TatitoCatalog.initCatalog();
  }
});
