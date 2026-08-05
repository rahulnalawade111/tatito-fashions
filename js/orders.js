/* =========================================================
   orders.js — Order history, order detail (invoice + tracking),
   and order success page.
   ========================================================= */

const statusOrder = ["placed", "confirmed", "shipped", "out_for_delivery", "delivered"];

function statusLabel(status) {
  const map = {
    placed: t("statusPlaced"), confirmed: t("statusConfirmed"), shipped: t("statusShipped"),
    out_for_delivery: t("statusOutForDelivery"), delivered: t("statusDelivered"), cancelled: t("statusCancelled")
  };
  return map[status] || status;
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

/* ---------- Orders list ---------- */
function renderOrdersList() {
  const container = document.getElementById("ordersList");
  if (!container) return;
  const orders = TatitoStore.getOrders();

  if (!orders.length) {
    container.innerHTML = `<p class="empty-state">${t("noOrders")}</p>`;
    return;
  }

  container.innerHTML = orders.map((order) => `
    <div class="order-card">
      <div class="order-card-head">
        <div>
          <h3>${order.id}</h3>
          <p style="font-size:13px;color:var(--muted);">${t("orderDate")}: ${formatDate(order.createdAt)}</p>
        </div>
        <span class="order-status-badge ${order.status}">${statusLabel(order.status)}</span>
      </div>
      <div class="order-items-preview">
        ${order.items.slice(0, 5).map((item) =>
          item.image ? `<img class="order-item-thumb" src="${item.image}" alt="${escapeHtml(item.name)}" />` : ""
        ).join("")}
      </div>
      <div class="order-card-foot">
        <span class="price-tag">${formatPrice(order.total)}</span>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <a href="order-detail.html?id=${order.id}" class="btn btn-primary small">${t("viewDetails")}</a>
          ${order.status !== "delivered" && order.status !== "cancelled" ? `
            <button class="btn btn-ghost small" data-action="advance-status" data-order-id="${order.id}">→</button>
          ` : ""}
        </div>
      </div>
    </div>
  `).join("");

  // Wire up advance-status buttons (for demo tracking)
  container.querySelectorAll("[data-action='advance-status']").forEach((btn) => {
    btn.addEventListener("click", () => {
      const orderId = btn.dataset.orderId;
      const order = TatitoStore.getOrder(orderId);
      if (!order) return;
      const currentIdx = statusOrder.indexOf(order.status);
      if (currentIdx >= 0 && currentIdx < statusOrder.length - 1) {
        TatitoStore.advanceOrderStatus(orderId, statusOrder[currentIdx + 1]);
        renderOrdersList();
      }
    });
  });
}

/* ---------- Order detail ---------- */
function renderOrderDetail() {
  const root = document.getElementById("orderDetailRoot");
  if (!root) return;
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("id");
  const order = TatitoStore.getOrder(orderId);

  if (!order) {
    root.innerHTML = `<p class="empty-state">${t("errorOccurred")}</p>`;
    return;
  }

  const currentStatusIdx = statusOrder.indexOf(order.status);
  const timelineHtml = statusOrder.map((status, idx) => {
    const history = order.statusHistory?.find((h) => h.status === status);
    const isCompleted = idx <= currentStatusIdx && order.status !== "cancelled";
    const isCurrent = idx === currentStatusIdx && order.status !== "cancelled";
    return `
      <div class="tracking-step ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""}">
        <div class="tracking-dot">${isCompleted && !isCurrent ? "✓" : idx + 1}</div>
        <div class="tracking-info">
          <h4>${statusLabel(status)}</h4>
          ${history ? `<time>${formatDate(history.timestamp)}</time>` : ""}
        </div>
      </div>`;
  }).join("");

  const addr = order.address;
  root.innerHTML = `
    <div class="category-hero" style="margin-bottom:24px;">
      <div>
        <p class="eyebrow">${t("invoiceTitle")}</p>
        <h1>${order.id}</h1>
        <p>${t("orderPlacedOn")}: ${formatDate(order.createdAt)}</p>
        ${order.estimatedDelivery ? `<p style="margin-top:4px;">${t("estimatedDelivery")}: ${formatDate(order.estimatedDelivery)}</p>` : ""}
      </div>
      <div class="hero-card">
        <h3>${statusLabel(order.status)}</h3>
        <p>${order.items.length} ${t("itemsLabel")} • ${formatPrice(order.total)}</p>
      </div>
    </div>

    <div class="checkout-layout" style="grid-template-columns:1.6fr 0.4fr;align-items:start;">
      <div>
        ${order.status !== "cancelled" ? `
          <div class="checkout-panel" style="margin-bottom:20px;">
            <h2>${t("orderTracking")}</h2>
            <div class="tracking-timeline">${timelineHtml}</div>
          </div>
        ` : ""}

        <div class="checkout-panel" style="margin-bottom:20px;">
          <h2>${t("invoiceTitle")}</h2>
          <div class="invoice-table-wrap">
          <table class="invoice-table">
            <thead>
              <tr><th>${t("item")}</th><th>${t("price")}</th><th>${t("quantity")}</th><th>${t("amount")}</th></tr>
            </thead>
            <tbody>
              ${order.items.map((item) => `
                <tr>
                  <td>
                    <div class="item-cell">
                      ${item.image ? `<img src="${item.image}" alt="" />` : ""}
                      <div>${escapeHtml(item.name)}${item.variant ? `<br><small style="color:var(--muted);">${item.variant}</small>` : ""}</div>
                    </div>
                  </td>
                  <td>${formatPrice(item.price)}</td>
                  <td>${item.quantity || 1}</td>
                  <td>${formatPrice(item.price * (item.quantity || 1))}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          </div>
          <div style="max-width:280px;margin-left:auto;">
            <div class="invoice-total-row"><span>${t("subtotal")}</span><span>${formatPrice(order.subtotal || 0)}</span></div>
            <div class="invoice-total-row"><span>${t("shipping")}</span><span>${order.shipping ? formatPrice(order.shipping) : t("free")}</span></div>
            <div class="invoice-total-row"><span>${t("tax")}</span><span>${formatPrice(order.tax || 0)}</span></div>
            <div class="invoice-total-row grand"><span>${t("grandTotal")}</span><span>${formatPrice(order.total)}</span></div>
          </div>
        </div>

        ${addr ? `
          <div class="checkout-panel">
            <h2>${t("billTo")}</h2>
            <p style="font-size:14px;line-height:1.7;color:var(--text);">
              <strong>${escapeHtml(addr.fullName)}</strong><br>
              ${escapeHtml(addr.line1)}${addr.line2 ? ", " + escapeHtml(addr.line2) : ""}<br>
              ${escapeHtml(addr.city)}, ${escapeHtml(addr.state)} - ${escapeHtml(addr.pincode)}<br>
              ${escapeHtml(addr.phone)}
            </p>
          </div>
        ` : ""}
      </div>

      <div class="cart-sidebar">
        <div class="cart-summary">
          <h3>${t("orderStatus")}</h3>
          <p style="margin-bottom:12px;"><span class="order-status-badge ${order.status}">${statusLabel(order.status)}</span></p>
          <div class="cart-summary-row"><span>${t("total")}</span><span>${formatPrice(order.total)}</span></div>
        </div>
        <div style="margin-top:12px;display:flex;flex-direction:column;gap:8px;">
          <button class="btn btn-ghost small block" onclick="window.print()">${t("printInvoice")}</button>
          <a href="orders.html" class="btn btn-primary small block">${t("orders")}</a>
        </div>
      </div>
    </div>
  `;
}

/* ---------- Order success page ---------- */
function renderOrderSuccess() {
  const orderIdEl = document.getElementById("successOrderId");
  const link = document.getElementById("viewOrderLink");
  if (!orderIdEl) return;
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("id") || "—";
  orderIdEl.textContent = orderId;
  if (link) link.href = `order-detail.html?id=${orderId}`;
}

/* ---------- Page routing ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page === "orders") renderOrdersList();
  if (page === "order-detail") renderOrderDetail();
  if (page === "order-success") renderOrderSuccess();

  window.addEventListener("languagechange", () => {
    if (page === "orders") renderOrdersList();
    if (page === "order-detail") renderOrderDetail();
  });
});
