/* =========================================================
   checkout.js — Multi-step checkout: shipping → payment → review.
   Creates the order on completion and redirects to success page.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page !== "checkout") return;

  let selectedAddressId = null;
  let selectedPayment = "cod";
  let currentStep = 1;

  const cart = TatitoStore.getCart();
  if (!cart.length) {
    showToast("Your cart is empty");
    setTimeout(() => { window.location.href = "cart.html"; }, 1000);
    return;
  }

  function calcTotals() {
    const subtotal = TatitoStore.cartSubtotal();
    const shipping = subtotal > 5000 ? 0 : 99;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total };
  }

  function renderSummary() {
    const el = document.getElementById("checkoutSummary");
    if (!el) return;
    const { subtotal, shipping, tax, total } = calcTotals();
    el.innerHTML = `
      <h3>${t("orderSummary")}</h3>
      <div class="cart-summary-row"><span>${t("itemsLabel")}: ${cart.length}</span></div>
      <div class="cart-summary-row"><span>${t("subtotal")}</span><span>${formatPrice(subtotal)}</span></div>
      <div class="cart-summary-row"><span>${t("shipping")}</span><span>${shipping === 0 ? t("free") : formatPrice(shipping)}</span></div>
      <div class="cart-summary-row"><span>${t("tax")}</span><span>${formatPrice(tax)}</span></div>
      <div class="cart-summary-row total"><span>${t("total")}</span><span>${formatPrice(total)}</span></div>
    `;
  }

  function renderAddressList() {
    const el = document.getElementById("addressList");
    if (!el) return;
    const addresses = TatitoStore.getAddresses();
    if (!addresses.length) {
      el.innerHTML = `<p class="empty-state" style="margin-bottom:12px;">${t("noAddressesFound")}</p>`;
      return;
    }
    el.innerHTML = addresses.map((addr) => `
      <div class="address-option ${selectedAddressId === addr.id ? "selected" : ""}" data-address-id="${addr.id}">
        <div class="address-option-label">
          <div>
            <h4>${escapeHtml(addr.fullName)} <span class="address-badge">${t(addr.type || "home")}</span> ${addr.isDefault ? `<span class="address-badge" style="background:var(--gold);color:var(--black);">${t("defaultAddress")}</span>` : ""}</h4>
            <p style="font-size:13px;color:var(--muted);margin-top:4px;">${escapeHtml(addr.line1)}${addr.line2 ? ", " + escapeHtml(addr.line2) : ""}, ${escapeHtml(addr.city)}, ${escapeHtml(addr.state)} - ${escapeHtml(addr.pincode)} · ${escapeHtml(addr.phone)}</p>
          </div>
        </div>
      </div>
    `).join("");

    el.querySelectorAll(".address-option").forEach((opt) => {
      opt.addEventListener("click", () => {
        selectedAddressId = opt.dataset.addressId;
        renderAddressList();
      });
    });

    // Auto-select default
    if (!selectedAddressId) {
      const def = addresses.find((a) => a.isDefault) || addresses[0];
      if (def) selectedAddressId = def.id;
      renderAddressList();
    }
  }

  function renderPaymentOptions() {
    const el = document.getElementById("paymentOptions");
    if (!el) return;
    const options = [
      { id: "card", icon: "💳", title: t("cardPayment"), desc: "Visa, Mastercard, RuPay" },
      { id: "upi", icon: "📱", title: t("upiPayment"), desc: "GPay, PhonePe, Paytm" },
      { id: "cod", icon: "💵", title: t("codPayment"), desc: t("codPayment") }
    ];
    el.innerHTML = options.map((opt) => `
      <div class="payment-option ${selectedPayment === opt.id ? "selected" : ""}" data-payment="${opt.id}">
        <span class="payment-option-icon">${opt.icon}</span>
        <div class="payment-option-info">
          <h4>${opt.title}</h4>
          <p>${opt.desc}</p>
        </div>
      </div>
    `).join("");

    el.querySelectorAll(".payment-option").forEach((opt) => {
      opt.addEventListener("click", () => {
        selectedPayment = opt.dataset.payment;
        renderPaymentOptions();
        renderPaymentFields();
      });
    });
  }

  function renderPaymentFields() {
    const el = document.getElementById("paymentFields");
    if (!el) return;
    if (selectedPayment === "card") {
      el.innerHTML = `
        <div class="payment-fields">
          <div class="form-field full"><label>${t("cardNumber")}</label><input type="text" placeholder="1234 5678 9012 3456" maxlength="19" /></div>
          <div class="form-field full"><label>${t("cardName")}</label><input type="text" /></div>
          <div class="form-field"><label>${t("expiry")}</label><input type="text" placeholder="MM/YY" maxlength="5" /></div>
          <div class="form-field"><label>${t("cvv")}</label><input type="text" placeholder="•••" maxlength="4" /></div>
        </div>
      `;
    } else if (selectedPayment === "upi") {
      el.innerHTML = `
        <div class="payment-fields">
          <div class="form-field full"><label>${t("upiId")}</label><input type="text" placeholder="yourname@upi" /></div>
        </div>
      `;
    } else {
      el.innerHTML = "";
    }
  }

  function renderReview() {
    const el = document.getElementById("reviewItems");
    if (!el) return;
    const items = TatitoStore.getCart();
    const addr = TatitoStore.getAddresses().find((a) => a.id === selectedAddressId);
    el.innerHTML = `
      ${items.map((item) => `
        <div class="cart-item" style="margin-bottom:10px;">
          ${item.image ? `<img class="cart-item-thumb" src="${item.image}" alt="${escapeHtml(item.name)}" />` : ""}
          <div class="cart-item-info">
            <h3 style="font-size:15px;">${escapeHtml(item.name)}</h3>
            <p>${item.shopName || ""}</p>
            <span>${formatPrice(item.price)} × ${item.quantity || 1}</span>
          </div>
        </div>
      `).join("")}
      ${addr ? `
        <div style="margin-top:16px;padding:16px;background:var(--ivory);border-radius:12px;">
          <strong>${t("shippingAddress")}:</strong>
          <p style="font-size:13px;color:var(--muted);margin-top:4px;">${escapeHtml(addr.fullName)}, ${escapeHtml(addr.line1)}, ${escapeHtml(addr.city)}, ${escapeHtml(addr.state)} - ${escapeHtml(addr.pincode)}</p>
          <p style="font-size:13px;color:var(--muted);">${t("paymentMethod")}: <strong>${selectedPayment === "card" ? t("cardPayment") : selectedPayment === "upi" ? t("upiPayment") : t("codPayment")}</strong></p>
        </div>
      ` : ""}
    `;
  }

  function updateSteps() {
    const dots = [1, 2, 3].map((n) => document.getElementById(`stepDot${n}`));
    const labels = document.querySelectorAll(".step-label");
    const panels = [
      document.getElementById("stepShippingPanel"),
      document.getElementById("stepPaymentPanel"),
      document.getElementById("stepReviewPanel")
    ];

    dots.forEach((dot, i) => {
      dot.classList.remove("active", "completed");
      if (i + 1 < currentStep) dot.classList.add("completed");
      else if (i + 1 === currentStep) dot.classList.add("active");
      if (i + 1 < currentStep) dot.textContent = "✓";
      else dot.textContent = i + 1;
    });

    labels.forEach((label, i) => {
      label.classList.toggle("active", i + 1 === currentStep);
    });

    panels.forEach((panel, i) => {
      panel.classList.toggle("hidden", i + 1 !== currentStep);
    });
  }

  function goToStep(step) {
    currentStep = step;
    updateSteps();
    renderSummary();
    if (step === 2) { renderPaymentOptions(); renderPaymentFields(); }
    if (step === 3) renderReview();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Init
  renderAddressList();
  renderSummary();
  updateSteps();

  // Inline address form toggle
  document.getElementById("toggleAddrFormBtn")?.addEventListener("click", () => {
    const form = document.getElementById("inlineAddrForm");
    if (form) form.style.display = form.style.display === "none" ? "block" : "none";
  });
  document.getElementById("cancelInlineAddrBtn")?.addEventListener("click", () => {
    const form = document.getElementById("inlineAddrForm");
    if (form) form.style.display = "none";
  });

  // Quick address save
  document.getElementById("quickAddrForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    const addr = TatitoStore.addAddress({
      fullName: data.fullName,
      phone: data.phone,
      line1: data.line1,
      line2: data.line2 || "",
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      type: "home",
      isDefault: TatitoStore.getAddresses().length === 0
    });
    selectedAddressId = addr.id;
    document.getElementById("inlineAddrForm").style.display = "none";
    e.target.reset();
    renderAddressList();
    showToast("Address saved!", "success");
  });

  // Wire up navigation
  document.getElementById("toPaymentBtn")?.addEventListener("click", () => {
    if (!selectedAddressId) { showToast(t("selectAddress"), "error"); return; }
    goToStep(2);
  });
  document.getElementById("backToShippingBtn")?.addEventListener("click", () => goToStep(1));
  document.getElementById("toReviewBtn")?.addEventListener("click", () => goToStep(3));
  document.getElementById("backToPaymentBtn")?.addEventListener("click", () => goToStep(2));

  document.getElementById("placeOrderBtn")?.addEventListener("click", () => {
    const btn = document.getElementById("placeOrderBtn");
    if (btn) { btn.textContent = t("processingPayment"); btn.disabled = true; }

    const { subtotal, shipping, tax, total } = calcTotals();
    const addr = TatitoStore.getAddresses().find((a) => a.id === selectedAddressId);
    const eta = new Date();
    eta.setDate(eta.getDate() + 5);

    const order = TatitoStore.createOrder({
      items: TatitoStore.getCart(),
      subtotal, shipping, tax, total,
      address: addr,
      paymentMethod: selectedPayment,
      status: "placed",
      estimatedDelivery: eta.toISOString()
    });

    TatitoStore.clearCart();
    setTimeout(() => { window.location.href = `order-success.html?id=${order.id}`; }, 800);
  });

  window.addEventListener("languagechange", () => {
    renderSummary();
    if (currentStep === 1) renderAddressList();
    if (currentStep === 2) { renderPaymentOptions(); renderPaymentFields(); }
    if (currentStep === 3) renderReview();
  });
});
