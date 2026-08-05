/* =========================================================
   seller.js — Seller Registration (Sell on Tatito)
   5-step premium flow:
   1. Category Selection
   2. Business Profile
   3. Bank & Tax Details
   4. Document Upload
   5. Review & Submit
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page !== "seller-register") return;

  let currentStep = 1;
  const totalSteps = 5;
  const stepLabels = ["Category", "Business", "Banking", "Documents", "Review"];
  const formData = { selectedCategory: null, documents: [] };

  /* ---- Step indicator ---- */
  function renderStepIndicator() {
    const el = document.getElementById("sellerStepIndicator");
    if (!el) return;
    let html = "";
    for (let i = 1; i <= totalSteps; i++) {
      const cls = i === currentStep ? "active" : i < currentStep ? "completed" : "";
      const txt = i < currentStep ? "✓" : i;
      html += `<div class="form-step-dot ${cls}" title="${stepLabels[i - 1]}">${txt}</div>`;
      if (i < totalSteps) {
        html += `<div class="form-step-connector ${i < currentStep ? "completed" : ""}" style="width:28px;"></div>`;
      }
    }
    el.innerHTML = html;
  }

  function renderForm() {
    const container = document.getElementById("sellerFormContainer");
    if (!container) return;
    renderStepIndicator();
    if (currentStep === 1) renderStep1(container);
    else if (currentStep === 2) renderStep2(container);
    else if (currentStep === 3) renderStep3(container);
    else if (currentStep === 4) renderStep4(container);
    else if (currentStep === 5) renderStep5(container);
  }

  function navButtons(backLabel, nextLabel, nextId, backId) {
    return `
      <div style="margin-top:24px;display:flex;gap:10px;">
        ${backLabel ? `<button type="button" class="btn btn-ghost" id="${backId || "sellerBackBtn"}">${backLabel}</button>` : ""}
        <button type="${nextId === "sellerSubmitBtn" ? "button" : "submit"}" class="btn btn-primary" id="${nextId}" style="flex:1;">${nextLabel}</button>
      </div>`;
  }

  /* ============================================================
     STEP 1: Category Selection
     ============================================================ */
  function renderStep1(el) {
    el.innerHTML = `
      <div class="checkout-panel">
        <h2 style="font-family:var(--font-display);font-size:22px;margin-bottom:4px;">Select Your Business Category</h2>
        <p style="color:var(--muted);margin-bottom:20px;font-size:14px;">Choose the category that best describes your business or service.</p>
        <div class="category-select-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;">
          ${SELLER_CATEGORIES.map((cat) => `
            <div class="category-select-card ${formData.selectedCategory === cat.id ? "selected" : ""}" data-cat-id="${cat.id}" style="padding:16px 12px;">
              <span class="emoji">${cat.emoji}</span>
              <h4 style="font-size:13px;">${cat.label}</h4>
              <p style="font-size:10.5px;line-height:1.4;">${cat.description}</p>
            </div>
          `).join("")}
        </div>
        ${navButtons(null, formData.selectedCategory ? "Continue →" : "Select a category to continue", "sellerNextBtn")}
      </div>
    `;

    el.querySelectorAll(".category-select-card").forEach((card) => {
      card.addEventListener("click", () => {
        formData.selectedCategory = card.dataset.catId;
        renderForm();
      });
    });

    el.querySelector("#sellerNextBtn")?.addEventListener("click", () => {
      if (formData.selectedCategory) { currentStep++; renderForm(); }
    });
  }

  /* ============================================================
     STEP 2: Business Profile
     ============================================================ */
  function renderStep2(el) {
    const user = TatitoStore.getUser();
    const cat = SELLER_CATEGORIES.find((c) => c.id === formData.selectedCategory);
    el.innerHTML = `
      <div class="checkout-panel">
        <h2 style="font-family:var(--font-display);font-size:22px;margin-bottom:4px;">Business Profile</h2>
        <p style="color:var(--muted);margin-bottom:20px;font-size:14px;">Category: <strong style="color:var(--gold-deep);">${cat?.emoji} ${cat?.label}</strong></p>
        <form id="businessProfileForm" style="display:flex;flex-direction:column;gap:14px;">
          <div class="seller-field">
            <label>Business / Shop Name *</label>
            <input type="text" class="seller-input" name="businessName" value="${escapeHtml(formData.businessName || "")}" required  />
          </div>
          <div class="seller-field">
            <label>Owner Full Name *</label>
            <input type="text" class="seller-input" name="ownerName" value="${escapeHtml(formData.ownerName || user.name || "")}" required  />
          </div>
          <div class="seller-field">
            <label>Email *</label>
            <input type="email" class="seller-input" name="email" value="${escapeHtml(formData.email || user.email || "")}" required  />
          </div>
          <div class="seller-field">
            <label>Mobile Number *</label>
            <div style="display:flex;gap:8px;">
              <select class="seller-select" name="countryCode" style="flex-shrink:0;width:auto;">
                <option value="+91">🇮🇳 +91</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+971">🇦🇪 +971</option>
                <option value="+65">🇸🇬 +65</option>
                <option value="+61">🇦🇺 +61</option>
              </select>
              <input type="tel" class="seller-input" name="phone" value="${escapeHtml(formData.phone || "")}" placeholder="98765 43210" maxlength="10" required style="flex:1;" />
            </div>
          </div>
          <div class="seller-form-row">
            <div class="seller-field">
              <label>District / City *</label>
              <input type="text" class="seller-input" name="city" value="${escapeHtml(formData.city || "")}" placeholder="e.g. Mumbai" required  />
            </div>
            <div class="seller-field">
              <label>State *</label>
              <input type="text" class="seller-input" name="state" value="${escapeHtml(formData.state || "")}" placeholder="e.g. Maharashtra" required  />
            </div>
          </div>
          <div class="seller-field">
            <label>Business Address *</label>
            <textarea class="seller-textarea" name="address" rows="2" required placeholder="Full shop/studio address" >${escapeHtml(formData.address || "")}</textarea>
          </div>
          <div class="seller-field">
            <label>Business Description</label>
            <textarea class="seller-textarea" name="description" rows="3" placeholder="Tell customers about your business, specialties, and experience..." >${escapeHtml(formData.description || "")}</textarea>
          </div>
          <div class="seller-field">
            <label>Years in Business</label>
            <input type="number" class="seller-input" name="experience" value="${escapeHtml(formData.experience || "")}" placeholder="e.g. 5" min="0"  />
          </div>
          <div class="seller-field">
            <label>Website / Instagram (optional)</label>
            <input type="text" class="seller-input" name="social" value="${escapeHtml(formData.social || "")}" placeholder="@yourbrand or URL"  />
          </div>
          ${navButtons("← Back", "Continue →", "sellerNextBtn")}
        </form>
      </div>
    `;

    el.querySelector("#sellerBackBtn")?.addEventListener("click", () => { currentStep--; renderForm(); });
    el.querySelector("#businessProfileForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      Object.assign(formData, Object.fromEntries(new FormData(e.target).entries()));
      currentStep++;
      renderForm();
    });
  }

  /* ============================================================
     STEP 3: Bank & Tax Details
     ============================================================ */
  function renderStep3(el) {
    el.innerHTML = `
      <div class="checkout-panel">
        <h2 style="font-family:var(--font-display);font-size:22px;margin-bottom:4px;">Bank &amp; Tax Details</h2>
        <p style="color:var(--muted);margin-bottom:20px;font-size:14px;">For secure payouts when you make sales. Your data is encrypted and never shared.</p>
        <form id="bankDetailsForm" style="display:flex;flex-direction:column;gap:14px;">
          <div class="seller-form-row">
            <div class="seller-field">
              <label>GST Number</label>
              <input type="text" class="seller-input" name="gst" value="${escapeHtml(formData.gst || "")}" placeholder="22AAAAA0000A1Z5"  />
            </div>
            <div class="seller-field">
              <label>PAN Number *</label>
              <input type="text" class="seller-input" name="pan" value="${escapeHtml(formData.pan || "")}" placeholder="ABCDE1234F" required  />
            </div>
          </div>
          <div class="seller-form-row">
            <div class="seller-field">
              <label>Bank Account Number *</label>
              <input type="text" class="seller-input" name="bankAccount" value="${escapeHtml(formData.bankAccount || "")}" placeholder="Account number" required  />
            </div>
            <div class="seller-field">
              <label>IFSC Code *</label>
              <input type="text" class="seller-input" name="ifsc" value="${escapeHtml(formData.ifsc || "")}" placeholder="HDFC0001234" required  />
            </div>
          </div>
          <div class="seller-form-row">
            <div class="seller-field">
              <label>Bank Name *</label>
              <input type="text" class="seller-input" name="bankName" value="${escapeHtml(formData.bankName || "")}" placeholder="e.g. HDFC Bank" required  />
            </div>
            <div class="seller-field">
              <label>Account Holder Name *</label>
              <input type="text" class="seller-input" name="accountHolder" value="${escapeHtml(formData.accountHolder || formData.ownerName || "")}" placeholder="Name as per bank" required  />
            </div>
          </div>
          <div class="seller-field">
            <label>Payout Frequency</label>
            <select class="seller-select" name="payoutFreq">
              <option value="weekly">Weekly (every Monday)</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly (1st of every month)</option>
            </select>
          </div>
          <div style="background:var(--champagne);border-radius:12px;padding:12px 14px;border-left:3px solid var(--gold-deep);">
            <p style="font-size:12.5px;color:var(--text);line-height:1.5;">🔒 Your bank details are encrypted and used only for processing your payout. Tatito never stores CVV or net-banking credentials.</p>
          </div>
          ${navButtons("← Back", "Continue →", "sellerNextBtn")}
        </form>
      </div>
    `;

    el.querySelector("#sellerBackBtn")?.addEventListener("click", () => { currentStep--; renderForm(); });
    el.querySelector("#bankDetailsForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      Object.assign(formData, Object.fromEntries(new FormData(e.target).entries()));
      currentStep++;
      renderForm();
    });
  }

  /* ============================================================
     STEP 4: Document Upload
     ============================================================ */
  function renderStep4(el) {
    const docTypes = [
      { id: "id-proof", label: "Owner ID Proof (Aadhaar/PAN)", req: "required", icon: "🪪" },
      { id: "gst-cert", label: "GST Certificate", req: "optional", icon: "📄" },
      { id: "trade-license", label: "Trade License / Shop Act", req: "optional", icon: "🏪" },
      { id: "shop-photo", label: "Shop / Studio Photo", req: "optional", icon: "📸" },
      { id: "cancelled-cheque", label: "Cancelled Cheque / Bank Proof", req: "optional", icon: "🏦" },
    ];
    el.innerHTML = `
      <div class="checkout-panel">
        <h2 style="font-family:var(--font-display);font-size:22px;margin-bottom:4px;">Upload Documents</h2>
        <p style="color:var(--muted);margin-bottom:20px;font-size:14px;">Upload your documents for verification. JPG, PNG, or PDF. Max 5MB each.</p>
        <div style="display:flex;flex-direction:column;gap:14px;">
          ${docTypes.map((doc) => {
            const uploaded = formData.documents.find((d) => d.id === doc.id);
            return `
              <div style="display:flex;align-items:center;gap:12px;padding:14px;border:2px solid var(--line);border-radius:14px;transition:border-color .2s;">
                <div style="font-size:28px;flex-shrink:0;">${doc.icon}</div>
                <div style="flex:1;">
                  <div style="display:flex;align-items:center;gap:8px;">
                    <span style="font-size:14px;font-weight:600;color:var(--text);">${doc.label}</span>
                    <span style="font-size:10px;padding:2px 8px;border-radius:20px;background:${doc.req === "required" ? "rgba(125,17,40,0.1)" : "var(--line)"};color:${doc.req === "required" ? "var(--ruby)" : "var(--muted)"};">${doc.req}</span>
                  </div>
                  ${uploaded ? `<div style="font-size:12px;color:#2a8a3f;margin-top:4px;">✓ ${escapeHtml(uploaded.name)}</div>` : `<div style="font-size:12px;color:var(--muted);margin-top:2px;">Not uploaded</div>`}
                </div>
                <div style="display:flex;gap:6px;flex-shrink:0;">
                  ${uploaded ? `<button type="button" class="btn btn-ghost small" data-doc-remove="${doc.id}" style="font-size:12px;padding:6px 10px;">Remove</button>` : ""}
                  <button type="button" class="btn ${uploaded ? "btn-ghost" : "btn-primary"} small" data-doc-upload="${doc.id}" style="font-size:12px;padding:6px 12px;">${uploaded ? "Replace" : "Upload"}</button>
                </div>
                <input type="file" class="hidden-file-input" data-file-input="${doc.id}" accept="image/*,.pdf" style="display:none;" />
              </div>
            `;
          }).join("")}
        </div>
        ${navButtons("← Back", "Continue →", "sellerNextBtn")}
      </div>
    `;

    // Handle upload buttons
    el.querySelectorAll("[data-doc-upload]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const docId = btn.dataset.docUpload;
        el.querySelector(`[data-file-input="${docId}"]`)?.click();
      });
    });

    // Handle file selection
    el.querySelectorAll(".hidden-file-input").forEach((input) => {
      input.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
          showToast("File too large. Max 5MB.", "error");
          return;
        }
        const docId = input.dataset.fileInput;
        const reader = new FileReader();
        reader.onload = (ev) => {
          // Remove existing upload for this doc
          formData.documents = formData.documents.filter((d) => d.id !== docId);
          formData.documents.push({ id: docId, name: file.name, dataUrl: ev.target.result });
          showToast(`${file.name} uploaded`, "success");
          renderForm();
        };
        reader.readAsDataURL(file);
      });
    });

    // Handle remove buttons
    el.querySelectorAll("[data-doc-remove]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const docId = btn.dataset.docRemove;
        formData.documents = formData.documents.filter((d) => d.id !== docId);
        renderForm();
      });
    });

    el.querySelector("#sellerBackBtn")?.addEventListener("click", () => { currentStep--; renderForm(); });
    el.querySelector("#sellerNextBtn")?.addEventListener("click", () => { currentStep++; renderForm(); });
  }

  /* ============================================================
     STEP 5: Review & Submit
     ============================================================ */
  function renderStep5(el) {
    const cat = SELLER_CATEGORIES.find((c) => c.id === formData.selectedCategory);
    const regFee = 499;

    const reviewRow = (label, value) => `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;padding:6px 0;border-bottom:1px solid var(--line);">
        <span style="color:var(--muted);font-size:13px;flex-shrink:0;">${label}</span>
        <strong style="font-size:13px;text-align:right;">${escapeHtml(String(value || "—"))}</strong>
      </div>`;

    el.innerHTML = `
      <div class="checkout-panel">
        <h2 style="font-family:var(--font-display);font-size:22px;margin-bottom:4px;">Review &amp; Submit</h2>
        <p style="color:var(--muted);margin-bottom:20px;font-size:14px;">Please review your information before submitting.</p>

        <!-- Business Info -->
        <div style="background:var(--ivory);border-radius:14px;padding:16px;margin-bottom:16px;">
          <p style="font-size:12px;font-weight:700;color:var(--gold-deep);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px;">🏪 Business Details</p>
          ${reviewRow("Category", cat ? cat.emoji + " " + cat.label : "")}
          ${reviewRow("Business Name", formData.businessName)}
          ${reviewRow("Owner", formData.ownerName)}
          ${reviewRow("Email", formData.email)}
          ${reviewRow("Mobile", (formData.countryCode || "+91") + " " + formData.phone)}
          ${reviewRow("City", formData.city + (formData.state ? ", " + formData.state : ""))}
          ${reviewRow("Address", formData.address)}
          ${formData.experience ? reviewRow("Experience", formData.experience + " years") : ""}
          ${formData.social ? reviewRow("Social", formData.social) : ""}
        </div>

        <!-- Banking Info -->
        <div style="background:var(--ivory);border-radius:14px;padding:16px;margin-bottom:16px;">
          <p style="font-size:12px;font-weight:700;color:var(--gold-deep);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px;">🏦 Bank &amp; Tax</p>
          ${reviewRow("PAN", formData.pan)}
          ${reviewRow("GST", formData.gst || "Not provided")}
          ${reviewRow("Bank", formData.bankName)}
          ${reviewRow("Account No.", "••••" + String(formData.bankAccount || "").slice(-4))}
          ${reviewRow("IFSC", formData.ifsc)}
          ${reviewRow("Payout", formData.payoutFreq || "Weekly")}
        </div>

        <!-- Documents -->
        <div style="background:var(--ivory);border-radius:14px;padding:16px;margin-bottom:16px;">
          <p style="font-size:12px;font-weight:700;color:var(--gold-deep);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px;">📄 Documents</p>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            ${formData.documents.length ? formData.documents.map((d) => `
              <span style="font-size:12px;padding:6px 12px;background:rgba(42,138,63,0.1);color:#2a8a3f;border-radius:20px;">✓ ${escapeHtml(d.name)}</span>
            `).join("") : `<span style="font-size:13px;color:var(--muted);">No documents uploaded</span>`}
          </div>
        </div>

        <!-- Fee breakdown -->
        <div class="cost-estimate-box">
          <h4 style="font-family:var(--font-display);font-size:16px;margin-bottom:12px;">📋 Registration Fee</h4>
          <div class="cost-estimate-row"><span>Registration Fee (one-time)</span><span>${formatPrice(regFee)}</span></div>
          <div class="cost-estimate-row"><span>GST (18%)</span><span>${formatPrice(Math.floor(regFee * 0.18))}</span></div>
          <div class="cost-estimate-row" style="font-weight:700;"><span>Total Payable</span><span>${formatPrice(regFee + Math.floor(regFee * 0.18))}</span></div>
        </div>

        <!-- Terms -->
        <label style="display:flex;align-items:flex-start;gap:10px;margin-top:16px;cursor:pointer;">
          <input type="checkbox" id="agreeTerms" required style="margin-top:2px;width:18px;height:18px;accent-color:var(--ruby);cursor:pointer;" />
          <span style="font-size:13px;color:var(--text);line-height:1.5;">I agree to the <a href="#" style="color:var(--gold-deep);font-weight:600;">Tatito Seller Agreement</a>, <a href="#" style="color:var(--gold-deep);font-weight:600;">Privacy Policy</a>, and understand that Tatito charges a 5% commission on each sale.</span>
        </label>

        <div style="background:rgba(0,128,0,0.05);border:1px solid rgba(0,128,0,0.2);border-radius:12px;padding:14px;margin-top:16px;">
          <p style="font-size:13px;color:#2d6a2d;line-height:1.5;">✓ After submission, the Tatito team verifies your application within 48 hours. You'll receive a notification once approved. Only approved sellers can publish products or services.</p>
        </div>

        ${navButtons("← Back", "Pay " + formatPrice(regFee + Math.floor(regFee * 0.18)) + " & Submit", "sellerSubmitBtn")}
      </div>
    `;

    el.querySelector("#sellerBackBtn")?.addEventListener("click", () => { currentStep--; renderForm(); });

    el.querySelector("#sellerSubmitBtn")?.addEventListener("click", () => {
      const agree = el.querySelector("#agreeTerms");
      if (agree && !agree.checked) {
        showToast("Please accept the Seller Agreement to continue", "error");
        return;
      }
      const btn = el.querySelector("#sellerSubmitBtn");
      btn.textContent = "Processing…"; btn.disabled = true;

      TatitoStore.addSellerApp({
        category: formData.selectedCategory,
        categoryLabel: cat?.label,
        ...formData
      });

      TatitoStore.addNotification({
        title: "Registration Submitted",
        message: `Your seller registration for "${formData.businessName}" has been submitted. Admin verification in progress.`,
        type: "seller",
        icon: "🏪"
      });

      // Simulate admin approval after 3 seconds
      setTimeout(() => {
        TatitoStore.addNotification({
          title: "Seller Approved! 🎉",
          message: `Congratulations! Your seller account for "${formData.businessName}" has been approved. You can now publish products and services.`,
          type: "seller",
          icon: "✅"
        });
        showToast("Registration approved! Check notifications.", "success");
      }, 3000);

      showToast("Registration submitted! Verification pending.", "success");
      setTimeout(() => { window.location.href = "notifications.html"; }, 1500);
    });
  }

  renderForm();
});
