/* =========================================================
   customize.js — Fashion Customization + Quotation System
   + Nearby Boutique Selection + Call Consultation + Translator

   Req 9:  Fashion Customization
   Req 10: Designer Quotation System
   Req 11: Nearby Boutique Selection
   Req 12: Call Consultation
   Req 13: Translator
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page === "customize") initCustomizePage();
  else if (page === "quotations") initQuotationsPage();
  else if (page === "consultations") initConsultationsPage();
});

/* =========================================================
   CUSTOMIZE PAGE (Req 9, 11, 12, 13)
   ========================================================= */
function initCustomizePage() {
  let currentStep = 1;
  const totalSteps = 4;
  const formData = {
    gender: "men",
    measurements: {},
    clothType: CLOTH_TYPES[0],
    budget: 5000,
    referenceImage: null,
    description: "",
    selectedBoutique: null,
    needConsultation: false,
    needTranslator: false,
  };

  const stepLabels = ["Design", "Measurements", "Boutique", "Review & Submit"];

  function renderStepIndicator() {
    const el = document.getElementById("customizeStepIndicator");
    if (!el) return;
    let html = "";
    for (let i = 1; i <= totalSteps; i++) {
      const cls = i === currentStep ? "active" : i < currentStep ? "completed" : "";
      const txt = i < currentStep ? "✓" : i;
      html += `<div class="form-step-dot ${cls}">${txt}</div>`;
      if (i < totalSteps) html += `<div class="form-step-connector ${i < currentStep ? "completed" : ""}"></div>`;
    }
    el.innerHTML = html;
  }

  function renderForm() {
    const container = document.getElementById("customizeFormContainer");
    if (!container) return;
    renderStepIndicator();

    if (currentStep === 1) renderDesignStep(container);
    else if (currentStep === 2) renderMeasurementsStep(container);
    else if (currentStep === 3) renderBoutiqueStep(container);
    else if (currentStep === 4) renderReviewStep(container);
  }

  // Step 1: Design upload + cloth type + budget + description
  function renderDesignStep(el) {
    el.innerHTML = `
      <div class="checkout-panel">
        <h2>Design &amp; Requirements</h2>

        <div style="margin-bottom:20px;">
          <label style="font-weight:600;display:block;margin-bottom:8px;">Select Category</label>
          <div style="display:flex;gap:10px;">
            ${["men", "women", "kids"].map((g) => `
              <button class="sort-chip ${formData.gender === g ? "active" : ""}" data-gender="${g}"
                style="padding:10px 24px;font-size:14px;text-transform:capitalize;">${g === "men" ? "👨" : g === "women" ? "👩" : "🧒"} ${g}</button>
            `).join("")}
          </div>
        </div>

        <div style="margin-bottom:20px;">
          <label style="font-weight:600;display:block;margin-bottom:8px;">Reference Design Image</label>
          <div class="upload-zone" id="refImageZone">
            ${formData.referenceImage
              ? `<img src="${formData.referenceImage}" class="preview-img" alt="Reference" style="max-height:240px;" />`
              : `<div class="upload-icon">🎨</div><p>Upload a reference design or style image</p>`}
          </div>
          <input type="file" id="refImageInput" accept="image/*" style="display:none;" />
        </div>

        <div class="form-row">
          <div class="form-field">
            <label>Cloth Type</label>
            <select id="clothTypeSelect">
              ${CLOTH_TYPES.map((c) => `<option value="${c}" ${formData.clothType === c ? "selected" : ""}>${c}</option>`).join("")}
            </select>
          </div>
          <div class="form-field">
            <label>Your Budget (₹)</label>
            <input type="number" id="budgetInput" value="${formData.budget}" min="1000" step="500" />
          </div>
        </div>

        <div class="form-field">
          <label>Design Description</label>
          <textarea id="descInput" rows="3" placeholder="Describe the outfit you want — style, occasion, color preferences, special details...">${formData.description}</textarea>
        </div>

        <!-- Cost Estimate (live calculation) -->
        <div class="cost-estimate-box" id="costEstimate"></div>

        <div style="margin-top:20px;display:flex;gap:8px;">
          <button type="button" class="btn btn-primary" id="custNextBtn">Next →</button>
        </div>
      </div>
    `;

    // Gender selection
    el.querySelectorAll("[data-gender]").forEach((btn) => {
      btn.addEventListener("click", () => {
        formData.gender = btn.dataset.gender;
        formData.measurements = {};
        renderForm();
      });
    });

    // Reference image upload
    const zone = el.querySelector("#refImageZone");
    const input = el.querySelector("#refImageInput");
    zone.addEventListener("click", () => input.click());
    input.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => { formData.referenceImage = ev.target.result; renderForm(); };
      reader.readAsDataURL(file);
    });

    // Cloth type + budget live updates
    el.querySelector("#clothTypeSelect").addEventListener("change", (e) => {
      formData.clothType = e.target.value;
      updateCostEstimate(el);
    });
    el.querySelector("#budgetInput").addEventListener("input", (e) => {
      formData.budget = parseInt(e.target.value) || 0;
      updateCostEstimate(el);
    });
    el.querySelector("#descInput").addEventListener("input", (e) => {
      formData.description = e.target.value;
    });

    updateCostEstimate(el);

    el.querySelector("#custNextBtn").addEventListener("click", () => {
      formData.clothType = el.querySelector("#clothTypeSelect").value;
      formData.budget = parseInt(el.querySelector("#budgetInput").value) || 0;
      formData.description = el.querySelector("#descInput").value;
      currentStep++;
      renderForm();
    });
  }

  function updateCostEstimate(el) {
    const box = el.querySelector("#costEstimate");
    if (!box) return;
    // Simple estimation algorithm based on cloth type and category
    const clothRates = {
      Silk: 450, "Cotton Silk": 350, Chiffon: 200, Georgette: 220, Velvet: 500,
      Brocade: 480, Linen: 250, Crepe: 280, Net: 180, Satin: 300,
    };
    const stitchingRates = { men: 1500, women: 1800, kids: 1000 };
    const estMeters = formData.gender === "kids" ? 2.5 : formData.gender === "women" ? 4.5 : 3.5;
    const clothCost = Math.round(estMeters * (clothRates[formData.clothType] || 300));
    const stitchCost = stitchingRates[formData.gender] || 1500;
    const total = clothCost + stitchCost;

    box.innerHTML = `
      <h4>📊 Estimated Cost Breakdown</h4>
      <div class="cost-estimate-row"><span>Cloth: ${formData.clothType} (~${estMeters} meters)</span><span>${formatPrice(clothCost)}</span></div>
      <div class="cost-estimate-row"><span>Stitching (estimated)</span><span>${formatPrice(stitchCost)}</span></div>
      <div class="cost-estimate-row"><span>Estimated Total</span><span>${formatPrice(total)}</span></div>
      ${total > formData.budget
        ? `<p style="color:var(--ruby);font-size:13px;margin-top:8px;">⚠ Estimated cost exceeds your budget. Designers may quote higher.</p>`
        : `<p style="color:#2d6a2d;font-size:13px;margin-top:8px;">✓ Within your budget range.</p>`}
    `;
  }

  // Step 2: Measurements
  function renderMeasurementsStep(el) {
    const fields = MEASUREMENT_FIELDS[formData.gender] || MEASUREMENT_FIELDS.men;
    el.innerHTML = `
      <div class="checkout-panel">
        <h2>Body Measurements</h2>
        <p style="color:var(--muted);margin-bottom:16px;">Enter accurate measurements in inches for the best fit.</p>
        <div class="measurement-grid">
          ${fields.map((field) => `
            <div class="measurement-field form-field">
              <label>${field}</label>
              <input type="number" step="0.5" min="10" data-measurement="${field}"
                value="${formData.measurements[field] || ""}" placeholder="0" />
            </div>
          `).join("")}
        </div>
        <div style="background:rgba(201,162,75,0.08);border-radius:12px;padding:14px;margin-top:16px;">
          <p style="font-size:13px;color:var(--muted);">💡 Tip: Have a tailor measure you for accuracy. You can also schedule a call consultation with a designer in the next step to get measured professionally.</p>
        </div>
        <div style="margin-top:20px;display:flex;gap:8px;">
          <button type="button" class="btn btn-ghost" id="custBackBtn">← Back</button>
          <button type="button" class="btn btn-primary" id="custNextBtn">Next →</button>
        </div>
      </div>
    `;

    el.querySelectorAll("[data-measurement]").forEach((input) => {
      input.addEventListener("input", (e) => {
        formData.measurements[e.target.dataset.measurement] = parseFloat(e.target.value) || 0;
      });
    });

    el.querySelector("#custBackBtn").addEventListener("click", () => { currentStep--; renderForm(); });
    el.querySelector("#custNextBtn").addEventListener("click", () => { currentStep++; renderForm(); });
  }

  // Step 3: Nearby Boutique Selection
  function renderBoutiqueStep(el) {
    el.innerHTML = `
      <div class="checkout-panel">
        <h2>Select Preferred Boutique / Designer</h2>
        <p style="color:var(--muted);margin-bottom:16px;">Recommended based on your location, delivery availability, and estimated stitching time.</p>
        <div id="boutiqueList"></div>

        <div style="margin-top:24px;">
          <h3 style="font-family:var(--font-display);font-size:18px;">Call Consultation</h3>
          <div style="display:flex;align-items:center;gap:12px;padding:14px;background:var(--surface);border:1px solid var(--line);border-radius:12px;margin-top:8px;">
            <input type="checkbox" id="consultationCheck" ${formData.needConsultation ? "checked" : ""} style="width:20px;height:20px;" />
            <div>
              <p style="font-weight:600;">Schedule in-app call consultation</p>
              <p style="font-size:13px;color:var(--muted);">Discuss your requirements with the designer. Your phone number is not shared.</p>
            </div>
          </div>
          <div id="consultationFields" style="${formData.needConsultation ? "" : "display:none;"};margin-top:12px;">
            <div class="form-row">
              <div class="form-field">
                <label>Preferred Date</label>
                <input type="date" id="consultDate" />
              </div>
              <div class="form-field">
                <label>Preferred Time</label>
                <input type="time" id="consultTime" />
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:12px;padding:14px;background:var(--surface);border:1px solid var(--line);border-radius:12px;">
              <input type="checkbox" id="translatorCheck" ${formData.needTranslator ? "checked" : ""} style="width:20px;height:20px;" />
              <div>
                <p style="font-weight:600;">🌐 Enable Translator</p>
                <p style="font-size:13px;color:var(--muted);">If you and the designer speak different languages, a translator will join the call.</p>
              </div>
            </div>
            <div id="translatorFields" style="${formData.needTranslator ? "" : "display:none;"};margin-top:8px;">
              <div class="form-row">
                <div class="form-field">
                  <label>Your Language</label>
                  <select id="userLang">
                    <option>English</option><option>हिन्दी (Hindi)</option><option>தமிழ் (Tamil)</option>
                    <option>తెలుగు (Telugu)</option><option>ಕನ್ನಡ (Kannada)</option><option>मराठी (Marathi)</option>
                    <option>ગુજરાતી (Gujarati)</option><option>বাংলা (Bengali)</option>
                  </select>
                </div>
                <div class="form-field">
                  <label>Designer's Language (expected)</label>
                  <select id="designerLang">
                    <option>English</option><option>हिन्दी (Hindi)</option><option>தமிழ் (Tamil)</option>
                    <option>తెలుగు (Telugu)</option><option>ಕನ್ನಡ (Kannada)</option><option>मराठी (Marathi)</option>
                    <option>ગુજરાતી (Gujarati)</option><option>বাংলা (Bengali)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style="margin-top:20px;display:flex;gap:8px;">
          <button type="button" class="btn btn-ghost" id="custBackBtn">← Back</button>
          <button type="button" class="btn btn-primary" id="custNextBtn">Next →</button>
        </div>
      </div>
    `;

    // Render boutiques/designers
    renderBoutiqueList(el);

    // Consultation toggle
    const consultCheck = el.querySelector("#consultationCheck");
    consultCheck.addEventListener("change", (e) => {
      formData.needConsultation = e.target.checked;
      el.querySelector("#consultationFields").style.display = e.target.checked ? "" : "none";
    });

    // Translator toggle
    el.querySelector("#translatorCheck").addEventListener("change", (e) => {
      formData.needTranslator = e.target.checked;
      el.querySelector("#translatorFields").style.display = e.target.checked ? "" : "none";
    });

    el.querySelector("#custBackBtn").addEventListener("click", () => { currentStep--; renderForm(); });
    el.querySelector("#custNextBtn").addEventListener("click", () => {
      // Save consultation data if enabled
      if (formData.needConsultation) {
        formData.consultDate = el.querySelector("#consultDate").value;
        formData.consultTime = el.querySelector("#consultTime").value;
        if (formData.needTranslator) {
          formData.userLang = el.querySelector("#userLang").value;
          formData.designerLang = el.querySelector("#designerLang").value;
        }
      }
      currentStep++;
      renderForm();
    });
  }

  function renderBoutiqueList(el) {
    const list = el.querySelector("#boutiqueList");
    if (!list) return;
    list.innerHTML = MOCK_DESIGNERS.map((d) => `
      <div class="quotation-card" style="cursor:pointer;" data-designer-id="${d.id}">
        <div class="quote-head">
          <div>
            <h4 style="font-family:var(--font-display);font-size:18px;">${d.name}</h4>
            <p style="font-size:13px;color:var(--muted);">${d.specialty}</p>
          </div>
          <div style="text-align:right;">
            <div class="quote-price">${formatPrice(d.basePrice)}</div>
            <p style="font-size:12px;color:var(--muted);">starting from</p>
          </div>
        </div>
        <div class="quote-meta">
          <span>⭐ ${d.rating} (${d.reviewCount})</span>
          <span>📍 ${d.distance} km away</span>
          <span>⏱ ~${d.estDays} days delivery</span>
          <span>🚚 Delivery available</span>
        </div>
        <div style="margin-top:10px;">
          <span style="font-size:13px;padding:4px 12px;border-radius:20px;${formData.selectedBoutique === d.id ? "background:var(--ruby);color:#fff;" : "background:var(--line);color:var(--text);"}">
            ${formData.selectedBoutique === d.id ? "✓ Selected" : "Click to select"}
          </span>
        </div>
      </div>
    `).join("");

    list.querySelectorAll("[data-designer-id]").forEach((card) => {
      card.addEventListener("click", () => {
        formData.selectedBoutique = card.dataset.designerId;
        renderBoutiqueList(el);
      });
    });
  }

  // Step 4: Review & Submit
  function renderReviewStep(el) {
    const designer = MOCK_DESIGNERS.find((d) => d.id === formData.selectedBoutique);
    const clothRates = { Silk: 450, "Cotton Silk": 350, Chiffon: 200, Georgette: 220, Velvet: 500, Brocade: 480, Linen: 250, Crepe: 280, Net: 180, Satin: 300 };
    const estMeters = formData.gender === "kids" ? 2.5 : formData.gender === "women" ? 4.5 : 3.5;
    const clothCost = Math.round(estMeters * (clothRates[formData.clothType] || 300));
    const stitchCost = { men: 1500, women: 1800, kids: 1000 }[formData.gender] || 1500;
    const estTotal = clothCost + stitchCost;

    el.innerHTML = `
      <div class="checkout-panel">
        <h2>Review &amp; Submit Request</h2>

        <div style="background:var(--ivory);border-radius:12px;padding:16px;margin-bottom:16px;">
          <div style="display:flex;justify-content:space-between;margin-bottom:6px;"><span style="color:var(--muted);">Category</span><strong style="text-transform:capitalize;">${formData.gender}</strong></div>
          <div style="display:flex;justify-content:space-between;margin-bottom:6px;"><span style="color:var(--muted);">Cloth Type</span><strong>${formData.clothType}</strong></div>
          <div style="display:flex;justify-content:space-between;margin-bottom:6px;"><span style="color:var(--muted);">Budget</span><strong>${formatPrice(formData.budget)}</strong></div>
          <div style="display:flex;justify-content:space-between;margin-bottom:6px;"><span style="color:var(--muted);">Reference Image</span><strong>${formData.referenceImage ? "✓ Uploaded" : "Not provided"}</strong></div>
          <div style="display:flex;justify-content:space-between;margin-bottom:6px;"><span style="color:var(--muted);">Measurements</span><strong>${Object.keys(formData.measurements).length} fields entered</strong></div>
          <div style="display:flex;justify-content:space-between;margin-bottom:6px;"><span style="color:var(--muted);">Preferred Designer</span><strong>${designer ? designer.name : "Any available"}</strong></div>
          ${formData.needConsultation ? `<div style="display:flex;justify-content:space-between;margin-bottom:6px;"><span style="color:var(--muted);">Consultation</span><strong>${formData.consultDate} ${formData.consultTime}${formData.needTranslator ? " (with Translator)" : ""}</strong></div>` : ""}
        </div>

        <div class="cost-estimate-box">
          <h4>📊 Cost Estimate</h4>
          <div class="cost-estimate-row"><span>Cloth (${formData.clothType})</span><span>${formatPrice(clothCost)}</span></div>
          <div class="cost-estimate-row"><span>Stitching</span><span>${formatPrice(stitchCost)}</span></div>
          <div class="cost-estimate-row"><span>Estimated Total</span><span>${formatPrice(estTotal)}</span></div>
          <p style="font-size:13px;color:var(--muted);margin-top:8px;">Designers will submit actual quotations based on your requirements.</p>
        </div>

        <div style="background:rgba(0,128,0,0.05);border:1px solid rgba(0,128,0,0.2);border-radius:12px;padding:14px;margin-bottom:16px;">
          <p style="font-size:13px;color:#2d6a2d;">✓ Your request will be forwarded to nearby designers. You'll receive quotations in the Quotations page. You can compare prices, ratings, and delivery times, then select your preferred designer.</p>
        </div>

        <div style="display:flex;gap:8px;">
          <button type="button" class="btn btn-ghost" id="custBackBtn">← Back</button>
          <button type="button" class="btn btn-primary" id="custSubmitBtn">Submit Customization Request</button>
        </div>
      </div>
    `;

    el.querySelector("#custBackBtn").addEventListener("click", () => { currentStep--; renderForm(); });
    el.querySelector("#custSubmitBtn").addEventListener("click", () => {
      const btn = el.querySelector("#custSubmitBtn");
      btn.textContent = "Submitting..."; btn.disabled = true;

      const designer = formData.selectedBoutique ? MOCK_DESIGNERS.find((d) => d.id === formData.selectedBoutique) : null;

      const request = TatitoStore.addCustomRequest({
        ...formData,
        estTotal,
        preferredDesigner: designer?.name,
      });

      // Schedule consultation if requested
      if (formData.needConsultation) {
        TatitoStore.addConsultation({
          requestId: request.id,
          designerId: formData.selectedBoutique,
          designerName: designer?.name || "Any available designer",
          date: formData.consultDate,
          time: formData.consultTime,
          translator: formData.needTranslator,
          userLang: formData.userLang,
          designerLang: formData.designerLang,
        });
      }

      // Generate mock quotations after delay
      setTimeout(() => generateMockQuotations(request.id), 2000);

      TatitoStore.addNotification({
        title: "Customization Request Submitted",
        message: `Your ${formData.clothType} ${formData.gender}'s outfit request has been sent to nearby designers.`,
        type: "customization",
        icon: "✂️"
      });

      showToast("Request submitted! Check quotations page.", "success");
      setTimeout(() => { window.location.href = `quotations.html?id=${request.id}`; }, 1500);
    });
  }

  renderForm();
}

function generateMockQuotations(requestId) {
  MOCK_DESIGNERS.forEach((d, i) => {
    setTimeout(() => {
      const variation = 0.85 + Math.random() * 0.4;
      const price = Math.round(d.basePrice * variation);
      TatitoStore.addQuotation(requestId, {
        designerId: d.id,
        designerName: d.name,
        price,
        estDays: d.estDays + Math.floor(Math.random() * 5),
        rating: d.rating,
        reviewCount: d.reviewCount,
        message: `We'd love to create this for you. Estimated delivery in ${d.estDays + Math.floor(Math.random() * 5)} days. Price includes fabric and stitching.`,
      });
      TatitoStore.addNotification({
        title: "New Quotation Received 💬",
        message: `${d.name} quoted ${formatPrice(price)} for your customization request.`,
        type: "quotation",
        icon: "💰",
        link: `quotations.html?id=${requestId}`,
      });
    }, 1500 + i * 800);
  });
}

/* =========================================================
   QUOTATIONS PAGE (Req 10)
   ========================================================= */
function initQuotationsPage() {
  const root = document.getElementById("quotationsRoot");
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const focusId = params.get("id");

  const requests = TatitoStore.getCustomRequests();

  if (!requests.length) {
    root.innerHTML = `
      <div class="checkout-panel" style="text-align:center;padding:48px 24px;">
        <div style="font-size:48px;margin-bottom:16px;">📋</div>
        <h2>No Quotations Yet</h2>
        <p style="color:var(--muted);margin-bottom:20px;">Submit a customization request to receive quotations from nearby designers.</p>
        <a href="customize.html" class="btn btn-primary">Start Customization →</a>
      </div>
    `;
    return;
  }

  root.innerHTML = `
    <div id="quotationsList">
      ${requests.map((req) => renderRequestCard(req, focusId)).join("")}
    </div>
  `;

  bindQuotationEvents(root);
}

function renderRequestCard(req, focusId) {
  const isFocus = req.id === focusId;
  const quotations = req.quotations || [];
  const sortedQuotes = [...quotations].sort((a, b) => a.price - b.price);

  return `
    <div class="checkout-panel" id="req-${req.id}" style="margin-bottom:20px;${isFocus ? "border:2px solid var(--gold);" : ""}">
      <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:12px;">
        <div>
          <h3 style="font-family:var(--font-display);font-size:20px;">${req.clothType} ${req.gender}'s Outfit</h3>
          <p style="font-size:13px;color:var(--muted);">
            Budget: ${formatPrice(req.budget)} ·
            ${req.description ? `"${req.description.substring(0, 60)}${req.description.length > 60 ? "..." : ""}"` : "No description"}
          </p>
        </div>
        <span style="font-size:12px;padding:4px 12px;border-radius:20px;background:${req.status === "quoted" ? "rgba(0,128,0,0.1)" : "var(--line)"};color:${req.status === "quoted" ? "green" : "var(--muted)"};">
          ${req.status === "quoted" ? `${quotations.length} Quotation(s)` : "Awaiting quotations..."}
        </span>
      </div>

      ${req.referenceImage ? `<img src="${req.referenceImage}" style="width:80px;height:80px;border-radius:10px;object-fit:cover;margin-bottom:12px;" alt="Reference" />` : ""}

      <!-- Quotations -->
      ${quotations.length === 0
        ? `<p style="color:var(--muted);font-size:14px;padding:20px 0;">⏳ Waiting for designers to respond...</p>`
        : sortedQuotes.map((q, i) => renderQuotationCard(q, req, i === 0)).join("")}

      <!-- Increase budget option -->
      ${req.status !== "accepted" ? `
        <div style="margin-top:16px;padding:14px;background:var(--surface);border:1px dashed var(--line);border-radius:12px;">
          <p style="font-size:13px;color:var(--muted);margin-bottom:8px;">Budget too low? Increase and resend to designers:</p>
          <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
            <input type="number" id="newBudget-${req.id}" placeholder="New budget (₹)" value="${req.budget + 2000}" min="1000" step="500" style="width:180px;" />
            <button class="btn btn-ghost small" data-action="increase-budget" data-req-id="${req.id}">Increase &amp; Resend</button>
          </div>
        </div>
      ` : ""}
    </div>
  `;
}

function renderQuotationCard(q, req, isLowest) {
  const accepted = req.status === "accepted" && req.acceptedQuote === q.id;
  return `
    <div class="quotation-card" style="${accepted ? "border:2px solid green;" : ""}">
      <div class="quote-head">
        <div>
          <h4 style="font-family:var(--font-display);font-size:18px;">
            ${q.designerName}
            ${isLowest ? '<span style="font-size:11px;padding:2px 8px;border-radius:20px;background:rgba(0,128,0,0.1);color:green;margin-left:8px;">Best Price</span>' : ""}
            ${accepted ? '<span style="font-size:11px;padding:2px 8px;border-radius:20px;background:green;color:#fff;margin-left:8px;">✓ Selected</span>' : ""}
          </h4>
          <div class="quote-meta">
            <span>⭐ ${q.rating} (${q.reviewCount} reviews)</span>
            <span>⏱ ${q.estDays} days delivery</span>
          </div>
        </div>
        <div style="text-align:right;">
          <div class="quote-price">${formatPrice(q.price)}</div>
        </div>
      </div>
      ${q.message ? `<p style="font-size:13px;color:var(--muted);margin:8px 0;">"${q.message}"</p>` : ""}
      <div style="display:flex;gap:8px;margin-top:10px;">
        ${!accepted ? `<button class="btn btn-primary small" data-action="accept-quote" data-req-id="${req.id}" data-quote-id="${q.id}">Select This Designer</button>` : ""}
        <button class="btn btn-ghost small" data-action="schedule-call" data-designer="${q.designerName}" data-req-id="${req.id}">📞 Schedule Call</button>
      </div>
    </div>
  `;
}

function bindQuotationEvents(root) {
  root.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;

    if (action === "accept-quote") {
      const reqId = btn.dataset.reqId;
      const quoteId = btn.dataset.quoteId;
      TatitoStore.updateCustomRequest(reqId, { status: "accepted", acceptedQuote: quoteId });
      TatitoStore.addNotification({
        title: "Designer Selected ✅",
        message: "You've selected a designer for your customization. They'll start working on your outfit soon!",
        type: "customization",
        icon: "✂️"
      });
      showToast("Designer selected! They will contact you soon.", "success");
      initQuotationsPage();
    }

    if (action === "schedule-call") {
      window.location.href = `consultations.html?designer=${encodeURIComponent(btn.dataset.designer)}&reqId=${btn.dataset.reqId}`;
    }

    if (action === "increase-budget") {
      const reqId = btn.dataset.reqId;
      const input = document.getElementById(`newBudget-${reqId}`);
      const newBudget = parseInt(input.value) || 0;
      TatitoStore.updateCustomRequest(reqId, { budget: newBudget, status: "pending", quotations: [] });
      TatitoStore.addNotification({
        title: "Budget Updated & Resent",
        message: `Your budget has been increased to ${formatPrice(newBudget)}. Request resent to designers.`,
        type: "customization",
        icon: "💰"
      });
      showToast("Budget updated! Request resent to designers.", "success");
      // Re-generate mock quotations
      setTimeout(() => generateMockQuotations(reqId), 2000);
      initQuotationsPage();
    }
  });
}

/* =========================================================
   CONSULTATIONS PAGE (Req 12, 13)
   ========================================================= */
function initConsultationsPage() {
  const root = document.getElementById("consultationsRoot");
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const prefillDesigner = params.get("designer") || "";
  const consultations = TatitoStore.getConsultations();

  root.innerHTML = `
    <!-- Schedule New Consultation -->
    <div class="checkout-panel" style="margin-bottom:28px;">
      <h2 style="font-family:var(--font-display);font-size:22px;">📞 Schedule Call Consultation</h2>
      <p style="color:var(--muted);margin-bottom:16px;">Book a secure in-app call with a designer. Your phone number is never shared.</p>
      <form id="consultForm">
        <div class="form-row">
          <div class="form-field">
            <label>Designer / Boutique</label>
            <input type="text" id="consultDesigner" value="${prefillDesigner}" placeholder="Designer name" required />
          </div>
          <div class="form-field">
            <label>Topic</label>
            <select id="consultTopic">
              <option>Customization Discussion</option>
              <option>Measurement Consultation</option>
              <option>Design Review</option>
              <option>Fabric Selection</option>
              <option>General Inquiry</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-filed">
            <label>Preferred Date</label>
            <input type="date" id="consultDate" required />
          </div>
          <div class="form-field">
            <label>Preferred Time</label>
            <input type="time" id="consultTime" required />
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:12px;padding:14px;background:var(--surface);border:1px solid var(--line);border-radius:12px;margin-bottom:12px;">
          <input type="checkbox" id="translatorToggle" style="width:20px;height:20px;" />
          <div>
            <p style="font-weight:600;">🌐 Enable Translator</p>
            <p style="font-size:13px;color:var(--muted);">If you and the designer speak different languages, a translator joins the call.</p>
          </div>
        </div>
        <div id="translatorLangRow" style="display:none;">
          <div class="form-row">
            <div class="form-field">
              <label>Your Language</label>
              <select id="userLang">
                <option>English</option><option>हिन्दी (Hindi)</option><option>தமிழ் (Tamil)</option>
                <option>తెలుగు (Telugu)</option><option>ಕನ್ನಡ (Kannada)</option><option>मराठी (Marathi)</option>
                <option>ગુજરાતી (Gujarati)</option><option>বাংলা (Bengali)</option>
              </select>
            </div>
            <div class="form-field">
              <label>Designer's Language</label>
              <select id="designerLang">
                <option>English</option><option>हिन्दी (Hindi)</option><option>தமிழ் (Tamil)</option>
                <option>తెలుగు (Telugu)</option><option>ಕನ್ನಡ (Kannada)</option><option>मराठी (Marathi)</option>
                <option>ગુજરાતી (Gujarati)</option><option>বাংলা (Bengali)</option>
              </select>
            </div>
          </div>
        </div>
        <button type="submit" class="btn btn-primary">Schedule Consultation</button>
      </form>
    </div>

    <!-- Existing Consultations -->
    <h2 style="font-family:var(--font-display);font-size:22px;margin-bottom:16px;">Your Consultations</h2>
    <div id="consultationsList">
      ${consultations.length === 0
        ? `<p style="color:var(--muted);text-align:center;padding:32px;">No consultations scheduled yet.</p>`
        : consultations.map((c) => `
          <div class="consultation-card">
            <div style="display:flex;justify-content:space-between;align-items:start;">
              <div>
                <h4 style="font-family:var(--font-display);font-size:16px;">${c.designerName || "Designer"}</h4>
                <p style="font-size:13px;color:var(--muted);">
                  📅 ${c.date || "TBD"} ${c.time ? "at " + c.time : ""} · ${c.translator ? "🌐 Translator enabled" : "No translator"}
                </p>
                ${c.userLang ? `<p style="font-size:12px;color:var(--muted);">Languages: ${c.userLang} ↔ ${c.designerLang}</p>` : ""}
              </div>
              <span class="con-status ${c.status}">${c.status}</span>
            </div>
          </div>
        `).join("")
      }
    </div>
  `;

  // Translator toggle
  root.querySelector("#translatorToggle").addEventListener("change", (e) => {
    root.querySelector("#translatorLangRow").style.display = e.target.checked ? "" : "none";
  });

  // Form submit
  root.querySelector("#consultForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const translator = root.querySelector("#translatorToggle").checked;
    const consultation = TatitoStore.addConsultation({
      designerName: root.querySelector("#consultDesigner").value,
      date: root.querySelector("#consultDate").value,
      time: root.querySelector("#consultTime").value,
      topic: root.querySelector("#consultTopic").value,
      translator,
      userLang: translator ? root.querySelector("#userLang").value : null,
      designerLang: translator ? root.querySelector("#designerLang").value : null,
    });
    TatitoStore.addNotification({
      title: "Consultation Scheduled 📞",
      message: `Call with ${consultation.designerName} on ${consultation.date} at ${consultation.time}.${translator ? " Translator enabled." : ""}`,
      type: "consultation",
      icon: "📞"
    });
    showToast("Consultation scheduled!", "success");
    initConsultationsPage();
  });
}
