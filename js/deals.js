/* =========================================================
   deals.js — Deals & offers page: renders discounted products,
   countdown timer, sorting.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page !== "deals") return;

  const grid = document.getElementById("dealsGrid");

  function getDeals() {
    const items = [];
    STORES.forEach((store) => {
      (store.products || []).forEach((p) => {
        if (p.originalPrice && p.originalPrice > p.price) {
          items.push({
            ...p,
            storeId: store.id,
            storeName: store.name,
            storeRating: store.rating,
            category: store.category,
            discount: Math.round((1 - p.price / p.originalPrice) * 100)
          });
        }
      });
    });
    return items;
  }

  function renderProductCard(p) {
    return `
      <div class="product-card">
        <a href="shop.html?shop=${p.storeId}" class="product-card-media">
          <span class="product-discount-badge">-${p.discount}%</span>
          <img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy" />
        </a>
        <div class="product-card-body">
          <p class="product-card-store">${escapeHtml(p.storeName)} · ★${p.storeRating}</p>
          <a href="shop.html?shop=${p.storeId}"><h3>${escapeHtml(p.name)}</h3></a>
          <div class="product-card-price">
            <span class="price-now">${formatPrice(p.price)}</span>
            <span class="price-was">${formatPrice(p.originalPrice)}</span>
          </div>
          <div class="deal-savings">You save ${formatPrice(p.originalPrice - p.price)}</div>
          <button class="btn btn-primary small block product-quick-add"
            data-store-id="${p.storeId}"
            data-item-id="${p.id}"
            ${p.stock <= 0 ? "disabled" : ""}>
            ${p.stock <= 0 ? "Out of Stock" : "🛒 Add to Cart"}
          </button>
        </div>
      </div>`;
  }

  function render() {
    let items = getDeals();
    const sort = document.getElementById("dealsSort").value;
    if (sort === "price-low") items.sort((a, b) => a.price - b.price);
    else if (sort === "price-high") items.sort((a, b) => b.price - a.price);
    else items.sort((a, b) => b.discount - a.discount);

    if (!items.length) {
      grid.innerHTML = `<p class="empty-state">No active deals right now. Check back soon!</p>`;
      return;
    }
    grid.innerHTML = items.map(renderProductCard).join("");
  }

  document.getElementById("dealsSort").addEventListener("change", render);
  render();

  // Countdown timer (24-hour cycle)
  const timerEl = document.getElementById("dealTimer");
  function updateTimer() {
    const now = new Date();
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const diff = end - now;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    timerEl.textContent = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  updateTimer();
  setInterval(updateTimer, 1000);
});
