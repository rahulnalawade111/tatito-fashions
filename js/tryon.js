/* =========================================================
   tryon.js — AI Virtual Try-On
   Upload photo → AI vision analyzes body + garment →
   advanced canvas compositing for realistic preview.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page !== "try-on") return;

  const root = document.getElementById("tryonRoot");
  if (!root) return;

  /* Categories that are services, not clothing/wearables — excluded from try-on */
  const TRYON_EXCLUDE_CATEGORIES = [
    "photography", "event decoration", "catering", "dj & music",
  ];

  /* Build product list from all stores + try-on catalog.
     Skip non-clothing service categories entirely (you can't try on photography/catering). */
  const catalogProducts = [];
  if (typeof STORES !== "undefined") {
    STORES.forEach((store) => {
      const storeCat = (store.category || "").toLowerCase();
      if (TRYON_EXCLUDE_CATEGORIES.includes(storeCat)) return; // skip service stores
      (store.products || []).forEach((p) => {
        catalogProducts.push({ ...p, storeId: store.id, storeName: store.name, category: store.category });
      });
    });
  }
  if (typeof TRYON_PRODUCTS !== "undefined") {
    TRYON_PRODUCTS.forEach((p) => catalogProducts.push(p));
  }

  /* Normalize product categories into clean groups.
     Maps the various store.category strings (Men's Fashion, Women's Fashion,
     Bridal Boutique, Ethnic Fusion, etc.) into clean tab names. */
  function normalizeCategory(rawCat) {
    if (!rawCat) return "Fashion";
    const lower = rawCat.toLowerCase().trim();
    // Direct map first (covers "men's fashion", "women accessories", etc.)
    if (TRYON_CATEGORY_MAP[lower]) return TRYON_CATEGORY_MAP[lower];
    // Already clean TRYON_PRODUCTS category (Men, Women, Kids)
    if (["Men", "Women", "Kids"].includes(rawCat)) return rawCat;
    // Partial match fallbacks
    if (lower.includes("women") || lower.includes("ladies")) return "Women";
    if (lower.includes("men") && !lower.includes("women")) return "Men";
    if (lower.includes("kid") || lower.includes("child")) return "Kids";
    if (lower.includes("wedding") || lower.includes("bridal") || lower.includes("groom") || lower.includes("rental")) return "Wedding";
    if (lower.includes("jewel")) return "Jewellery";
    if (lower.includes("ethnic") || lower.includes("fusion")) return "Women";
    if (lower.includes("accessor")) {
      // Can't determine gender from "accessories" alone — leave as Accessories
      return "Accessories";
    }
    return "Fashion";
  }

  // Attach normalized category to each product
  catalogProducts.forEach((p) => {
    p.normalizedCategory = normalizeCategory(p.category);
  });

  let userPhoto = null;
  let isGenerating = false;
  let aiAnalysis = null;
  let compositeCanvas = null;

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("product");
  const preselected = productId
    ? catalogProducts.find((p) => p.id === productId) || catalogProducts[0]
    : catalogProducts[0];
  let selectedProduct = preselected;

  const categoryGroups = {};
  // Always add "All" first
  categoryGroups["All"] = catalogProducts;
  catalogProducts.forEach((p) => {
    const cat = p.normalizedCategory || "Fashion";
    if (!categoryGroups[cat]) categoryGroups[cat] = [];
    categoryGroups[cat].push(p);
  });

  // Ordered list of categories for display (Events removed — service stores excluded from try-on)
  const displayCategories = ["All", "Men", "Women", "Kids", "Wedding", "Jewellery", "Accessories", "Fashion"]
    .filter((c) => categoryGroups[c]);

  function render() {
    root.innerHTML = `
      <div class="tryon-studio">
        <!-- LEFT: Upload + Result -->
        <div class="tryon-panel">
          <h3 class="tryon-step-title">Step 1: Upload Your Photo</h3>
          <div class="upload-zone" id="photoUploadZone">
            ${userPhoto
              ? `<img src="${userPhoto}" class="preview-img" alt="Your photo" style="max-height:300px;border-radius:12px;" />`
              : `<div class="upload-icon">📸</div>
                 <p>Click or drag to upload a full-body photo</p>
                 <p class="upload-hint">Best results: front-facing, good lighting, plain background</p>`}
          </div>
          <input type="file" id="photoInput" accept="image/*" style="display:none;" />

          <!-- AI Result -->
          <div id="aiResultSection" style="${userPhoto ? "" : "display:none;"}">
            <div class="ai-result-header">
              <h4 class="tryon-step-title" style="font-size:15px;">✨ AI Try-On Result</h4>
              <span class="ai-loading-indicator" id="aiLoadingIndicator" style="display:none;">
                <span class="ai-spinner"></span> AI analyzing…
              </span>
            </div>
            <div class="tryon-canvas-wrap" id="resultWrap">
              ${aiAnalysis
                ? `<canvas id="tryonCanvas" width="420" height="560" style="max-width:100%;border-radius:12px;"></canvas>`
                : `<div class="tryon-placeholder">
                     <div class="tryon-placeholder-icon">👗</div>
                     <p>Pick an outfit on the right, then tap <strong>Generate</strong> to see yourself wearing it</p>
                   </div>`}
            </div>
            ${aiAnalysis ? renderAnalysisCard(aiAnalysis) : ""}
          </div>
        </div>

        <!-- RIGHT: Product selection -->
        <div class="tryon-panel">
          <h3 class="tryon-step-title">Step 2: Choose an Outfit</h3>

          <div class="tryon-cat-tabs" id="catTabs">
            ${displayCategories.map((cat, i) =>
              `<button class="tryon-cat-tab ${i === 0 ? "active" : ""}" data-cat="${cat}">${cat}</button>`
            ).join("")}
          </div>

          <div class="tryon-product-selector" id="productSelector">
            ${(categoryGroups["All"] || catalogProducts).slice(0, 24).map((p) => `
              <div class="tryon-product-thumb ${selectedProduct.id === p.id ? "active" : ""}"
                   data-product-id="${p.id}" title="${escapeHtml(p.name)}">
                <img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy" />
                <span class="thumb-name">${escapeHtml(p.name.length > 18 ? p.name.slice(0, 18) + "…" : p.name)}</span>
                <span class="thumb-price">${formatPrice(p.price)}</span>
              </div>
            `).join("")}
          </div>

          <div id="productInfo" class="tryon-product-info">
            <h4>${escapeHtml(selectedProduct.name)}</h4>
            <p>${escapeHtml(selectedProduct.storeName || selectedProduct.normalizedCategory || "Fashion")} · ${formatPrice(selectedProduct.price)}</p>
          </div>

          <div class="tryon-actions">
            <button class="btn btn-primary" id="generateBtn" ${userPhoto ? "" : "disabled"}>
              ✨ Generate AI Try-On
            </button>
            <button class="btn btn-ghost" id="regenerateBtn" ${userPhoto ? "" : "disabled"}>
              🔄 Try Different Outfit
            </button>
          </div>

          <div class="tryon-actions" style="margin-top:10px;">
            <button class="btn btn-ghost" id="saveLookBtn" ${aiAnalysis ? "" : "disabled"}>
              💾 Save This Look
            </button>
            <button class="btn btn-ghost" id="addCartBtn" ${aiAnalysis ? "" : "disabled"}>
              🛒 Add to Cart
            </button>
          </div>

          <div id="comparisonStrip" class="tryon-comparison">
            <h4 style="font-family:var(--font-display);font-size:15px;margin-bottom:8px;">Saved Looks</h4>
            <div id="savedLooks"></div>
          </div>

          <div class="tryon-tips">
            <p><strong>💡 Tips for best results:</strong></p>
            <ul>
              <li>Use a clear, well-lit, front-facing photo</li>
              <li>Plain backgrounds produce cleaner results</li>
              <li>Full-body shots give better garment draping</li>
              <li>AI analyzes your body type and skin tone for personalized styling</li>
            </ul>
          </div>
        </div>
      </div>
    `;

    bindEvents();
    renderSavedLooks();
    if (aiAnalysis) {
      setTimeout(() => drawComposite(), 50);
    }
  }

  function renderAnalysisCard(a) {
    const score = a.compatibilityScore || 7;
    const scoreColor = score >= 8 ? "#1e8449" : score >= 6 ? "#c9a24b" : "#c0392b";
    const m = a.estimatedMeasurements || {};
    return `
      <div class="ai-analysis-card">
        <div class="ai-analysis-score" style="border-color:${scoreColor};">
          <span style="font-size:28px;font-weight:700;color:${scoreColor};">${score}/10</span>
          <span style="font-size:11px;color:var(--muted);">Match Score</span>
        </div>
        <div class="ai-analysis-details">
          <div class="ai-detail-row"><span>Body Type</span><strong>${a.bodyType || "—"}</strong></div>
          <div class="ai-detail-row"><span>Skin Tone</span><strong>${a.skinTone || "—"}</strong></div>
          ${a.heightCm ? `<div class="ai-detail-row"><span>Est. Height</span><strong>${a.heightCm} cm</strong></div>` : ""}
          <div class="ai-detail-row"><span>Garment</span><strong>${a.garmentType || "—"}</strong></div>
          ${a.fabricType ? `<div class="ai-detail-row"><span>Fabric</span><strong>${a.fabricType}</strong></div>` : ""}
          ${a.pattern ? `<div class="ai-detail-row"><span>Pattern</span><strong>${a.pattern}</strong></div>` : ""}

          ${a.estimatedMeasurements ? `
            <div style="margin-top:10px;padding:10px;background:var(--ivory);border-radius:10px;">
              <p style="font-size:12px;font-weight:600;color:var(--gold-deep);margin-bottom:6px;">📏 Estimated Measurements</p>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;font-size:12px;">
                ${m.chest ? `<span>Chest: ${m.chest}"</span>` : ""}
                ${m.waist ? `<span>Waist: ${m.waist}"</span>` : ""}
                ${m.hips ? `<span>Hips: ${m.hips}"</span>` : ""}
                ${m.shoulder ? `<span>Shoulder: ${m.shoulder}"</span>` : ""}
              </div>
            </div>
          ` : ""}

          ${a.recommendedSize ? `
            <div style="margin-top:8px;padding:8px 12px;background:linear-gradient(135deg,var(--ruby),var(--gold-deep));border-radius:10px;text-align:center;">
              <span style="color:#fff;font-size:13px;">Recommended Size: <strong style="font-size:18px;">${a.recommendedSize}</strong></span>
            </div>
          ` : ""}

          ${a.fitPrediction ? `<div class="ai-detail-row" style="margin-top:6px;"><span>Fit Prediction</span><strong style="color:${a.fitPrediction.includes("Perfect") ? "#1e8449" : "var(--gold-deep)"};">${a.fitPrediction}</strong></div>` : ""}

          <p class="ai-styling-note">${a.stylingNotes || ""}</p>
          ${a.fitRecommendation ? `<p class="ai-fit-rec">✅ ${a.fitRecommendation}</p>` : ""}
        </div>
      </div>
    `;
  }

  function bindEvents() {
    const zone = root.querySelector("#photoUploadZone");
    const input = root.querySelector("#photoInput");
    zone?.addEventListener("click", () => input.click());

    zone?.addEventListener("dragover", (e) => { e.preventDefault(); zone.classList.add("drag-over"); });
    zone?.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
    zone?.addEventListener("drop", (e) => {
      e.preventDefault();
      zone.classList.remove("drag-over");
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) handlePhotoFile(file);
    });

    input?.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) handlePhotoFile(file);
    });

    // Product selection
    rebindProductThumbs();

    // Category tabs
    root.querySelectorAll("#catTabs .tryon-cat-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        root.querySelectorAll("#catTabs .tryon-cat-tab").forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        const cat = tab.dataset.cat;
        const filtered = cat === "All" ? catalogProducts : (categoryGroups[cat] || catalogProducts.filter((p) => (p.normalizedCategory || "Fashion") === cat));
        const selector = root.querySelector("#productSelector");
        if (selector) {
          selector.innerHTML = filtered.slice(0, 24).map((p) => `
            <div class="tryon-product-thumb ${selectedProduct.id === p.id ? "active" : ""}"
                 data-product-id="${p.id}" title="${p.name}">
              <img src="${p.image}" alt="${p.name}" loading="lazy" />
              <span class="thumb-name">${p.name.length > 18 ? p.name.slice(0, 18) + "…" : p.name}</span>
              <span class="thumb-price">${formatPrice(p.price)}</span>
            </div>
          `).join("");
          rebindProductThumbs();
        }
      });
    });

    root.querySelector("#generateBtn")?.addEventListener("click", () => generateAI());
    root.querySelector("#regenerateBtn")?.addEventListener("click", () => {
      // Scroll to product selector
      root.querySelector("#productSelector")?.scrollIntoView({ behavior: "smooth", block: "center" });
      showToast("Pick a different outfit above!", "");
    });
    root.querySelector("#saveLookBtn")?.addEventListener("click", saveLook);
    root.querySelector("#addCartBtn")?.addEventListener("click", addToCartFromTryOn);
  }

  function rebindProductThumbs() {
    root.querySelectorAll("#productSelector .tryon-product-thumb").forEach((thumb) => {
      thumb.addEventListener("click", () => {
        selectedProduct = catalogProducts.find((p) => p.id === thumb.dataset.productId);
        root.querySelectorAll("#productSelector .tryon-product-thumb").forEach((t) => t.classList.remove("active"));
        thumb.classList.add("active");
        const info = root.querySelector("#productInfo");
        if (info) {
          info.innerHTML = `<h4>${selectedProduct.name}</h4>
            <p>${selectedProduct.storeName || selectedProduct.normalizedCategory || "Fashion"} · ${formatPrice(selectedProduct.price)}</p>`;
        }
      });
    });
  }

  function handlePhotoFile(file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      userPhoto = ev.target.result;
      aiAnalysis = null;
      render();
    };
    reader.readAsDataURL(file);
  }

  /* ---- AI generation ---- */
  async function generateAI() {
    if (!userPhoto || isGenerating) return;
    isGenerating = true;

    const loadingEl = root.querySelector("#aiLoadingIndicator");
    const resultWrap = root.querySelector("#resultWrap");
    const generateBtn = root.querySelector("#generateBtn");
    const regenerateBtn = root.querySelector("#regenerateBtn");

    if (loadingEl) loadingEl.style.display = "flex";
    if (generateBtn) { generateBtn.disabled = true; generateBtn.textContent = "✨ Analyzing…"; }
    if (regenerateBtn) regenerateBtn.disabled = true;
    if (resultWrap) {
      resultWrap.innerHTML = `<div class="tryon-placeholder">
        <div class="tryon-placeholder-icon spinning">🧠</div>
        <p>AI is analyzing your photo and styling you in <strong>${selectedProduct.name}</strong>…</p>
        <p class="tryon-loading-sub">This usually takes 5–15 seconds</p>
      </div>`;
    }

    try {
      const productImage = await urlToBase64(selectedProduct.image);

      const resp = await fetch("/tryon-api/api/tryon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userImage: userPhoto,
          productImage,
          productName: selectedProduct.name,
          productCategory: selectedProduct.normalizedCategory || selectedProduct.category || "Fashion",
          gender: (selectedProduct.normalizedCategory || selectedProduct.category || "").toLowerCase().includes("men") ? "man" : "woman",
        }),
      });

      const data = await resp.json();

      if (data.success && data.analysis) {
        aiAnalysis = data.analysis;
        render();
        showToast("✨ AI Try-On generated successfully!", "success");
      } else {
        throw new Error(data.error || "AI analysis failed.");
      }
    } catch (err) {
      console.error("[tryon] AI error:", err);
      if (resultWrap) {
        resultWrap.innerHTML = `<div class="tryon-placeholder tryon-error">
          <div class="tryon-placeholder-icon">⚠️</div>
          <p>AI analysis encountered an issue.</p>
          <p class="tryon-loading-sub">${err.message || "Please try again."}</p>
        </div>`;
      }
      showToast("AI generation failed. Please try again.", "error");
    } finally {
      isGenerating = false;
      if (loadingEl) loadingEl.style.display = "none";
      if (generateBtn) { generateBtn.disabled = false; generateBtn.textContent = "✨ Generate AI Try-On"; }
      if (regenerateBtn) regenerateBtn.disabled = false;
    }
  }

  /* ---- Advanced Canvas Compositing ---- */
  function drawComposite() {
    const canvas = document.getElementById("tryonCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // 1. Draw user photo as background
    const userImg = new Image();
    userImg.onload = () => {
      // Fill background
      const gradient = ctx.createLinearGradient(0, 0, 0, H);
      gradient.addColorStop(0, "#faf7f2");
      gradient.addColorStop(1, "#f0ebe2");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, W, H);

      // Draw user photo fitted
      const ratio = Math.min(W / userImg.width, H / userImg.height);
      const drawW = userImg.width * ratio;
      const drawH = userImg.height * ratio;
      const offsetX = (W - drawW) / 2;
      ctx.drawImage(userImg, offsetX, 0, drawW, drawH);

      // 2. Draw AI analysis overlay
      if (!aiAnalysis) return;

      const shoulderY = (aiAnalysis.shoulderLine?.y || 22) / 100 * H;
      const hipY = (aiAnalysis.hipLine?.y || 52) / 100 * H;
      const bodyW = aiAnalysis.bodyWidth || "medium";
      const gColor = aiAnalysis.garmentColor || "unknown";

      // 3. Draw product image as floating reference
      const prodImg = new Image();
      prodImg.crossOrigin = "anonymous";
      prodImg.onload = () => {
        const thumbW = 110;
        const thumbH = 110;
        const thumbX = W - thumbW - 16;
        const thumbY = 16;

        // Card background
        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.2)";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 2;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.roundRect(thumbX, thumbY, thumbW, thumbH, 12);
        ctx.fill();
        ctx.restore();

        // Product image clipped to rounded rect
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(thumbX + 4, thumbY + 4, thumbW - 8, thumbH - 8, 8);
        ctx.clip();
        ctx.drawImage(prodImg, thumbX + 4, thumbY + 4, thumbW - 8, thumbH - 8);
        ctx.restore();

        // Border
        ctx.strokeStyle = "#c9a24b";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(thumbX, thumbY, thumbW, thumbH, 12);
        ctx.stroke();

        // 4. AI analysis highlight markers on body
        ctx.save();
        ctx.strokeStyle = "rgba(201, 162, 75, 0.6)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 4]);

        // Shoulder line
        ctx.beginPath();
        ctx.moveTo(40, shoulderY);
        ctx.lineTo(W - 40, shoulderY);
        ctx.stroke();

        // Hip line
        ctx.beginPath();
        ctx.moveTo(40, hipY);
        ctx.lineTo(W - 40, hipY);
        ctx.stroke();
        ctx.restore();

        // Labels
        ctx.fillStyle = "rgba(90, 10, 24, 0.85)";
        ctx.font = "bold 11px Inter, sans-serif";
        ctx.fillText("SHOULDERS", 44, shoulderY - 4);
        ctx.fillText("WAIST", 44, hipY - 4);

        // 5. Garment tint overlay on torso
        const torsoTop = shoulderY;
        const torsoHeight = hipY - shoulderY + (H - hipY) * 0.7;
        const torsoWidth = bodyW === "wide" ? W * 0.5 : bodyW === "narrow" ? W * 0.3 : W * 0.4;

        ctx.save();
        ctx.globalAlpha = 0.28;
        const colorMap = {
          red: "#c0392b", maroon: "#641e16", blue: "#1a4b8c", navy: "#1a237e",
          green: "#1e8449", black: "#1a1a1a", cream: "#f5e6c8", gold: "#c9a24b",
          pink: "#e91e63", purple: "#6c3483", white: "#f0f0f0", grey: "#7f8c8d",
        };
        const matchedColor = Object.keys(colorMap).find((k) =>
          gColor.toLowerCase().includes(k)
        );
        ctx.fillStyle = matchedColor ? colorMap[matchedColor] : "rgba(201, 162, 75, 0.5)";
        ctx.beginPath();
        ctx.roundRect(W / 2 - torsoWidth / 2, torsoTop, torsoWidth, torsoHeight, 8);
        ctx.fill();
        ctx.restore();

        // 6. Bottom info bar
        ctx.fillStyle = "rgba(90, 10, 24, 0.88)";
        ctx.fillRect(0, H - 70, W, 70);

        ctx.fillStyle = "#fff";
        ctx.font = "bold 18px Inter, sans-serif";
        ctx.fillText(selectedProduct.name, 18, H - 44);

        ctx.font = "13px Inter, sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        const matchScore = aiAnalysis.compatibilityScore || 8;
        ctx.fillText(`✨ AI Match Score: ${matchScore}/10 · ${formatPrice(selectedProduct.price)}`, 18, H - 22);

        // AI badge
        ctx.fillStyle = "#c9a24b";
        ctx.font = "bold 10px Inter, sans-serif";
        ctx.fillText("⚡ AI-POWERED VIRTUAL TRY-ON", W - 170, H - 44);

        // 7. Body type label
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.font = "11px Inter, sans-serif";
        ctx.fillText(`Body: ${aiAnalysis.bodyType || "average"} · Skin: ${aiAnalysis.skinTone || "wheatish"}`, W - 170, H - 22);

        // 8. Sparkle decorations
        drawSparkle(ctx, W * 0.85, H * 0.15, 12, "rgba(201,162,75,0.8)");
        drawSparkle(ctx, W * 0.15, H * 0.75, 8, "rgba(201,162,75,0.6)");
      };
      prodImg.src = selectedProduct.image;
    };
    userImg.src = userPhoto;
  }

  function drawSparkle(ctx, x, y, size, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * size, y + Math.sin(angle) * size);
      ctx.lineTo(x + Math.cos(angle + 0.3) * size * 0.3, y + Math.sin(angle + 0.3) * size * 0.3);
    }
    ctx.fill();
    ctx.restore();
  }

  async function urlToBase64(url) {
    if (url.startsWith("data:")) return url;
    try {
      const resp = await fetch(url);
      const blob = await resp.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch {
      return url;
    }
  }

  let savedLooks = [];
  function saveLook() {
    const canvas = document.getElementById("tryonCanvas");
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
    savedLooks.unshift({
      img: dataUrl,
      product: selectedProduct.name,
      price: selectedProduct.price,
      score: aiAnalysis?.compatibilityScore || 0,
      date: new Date().toLocaleDateString(),
    });
    renderSavedLooks();
    showToast("Look saved to comparison!", "success");
  }

  function renderSavedLooks() {
    const el = root.querySelector("#savedLooks");
    if (!el) return;
    if (!savedLooks.length) {
      el.innerHTML = `<p style="color:var(--muted);font-size:13px;">No saved looks yet.</p>`;
      return;
    }
    el.innerHTML = savedLooks.map((look) => `
      <div style="flex-shrink:0;text-align:center;">
        <img src="${look.img}" style="width:72px;height:96px;border-radius:10px;object-fit:cover;border:2px solid var(--line);" alt="${look.product}" />
        <p style="font-size:10px;color:var(--muted);margin-top:4px;">${look.product.slice(0, 15)}</p>
      </div>
    `).join("");
  }

  function addToCartFromTryOn() {
    if (!TatitoStore.isLoggedIn()) {
      showToast("Please login to add to cart", "error");
      setTimeout(() => { window.location.href = "login.html"; }, 900);
      return;
    }
    const variant = selectedProduct.variantOptions && selectedProduct.variantOptions.length
      ? selectedProduct.variantOptions[0]
      : "M";
    TatitoStore.addToCart(selectedProduct.storeId || "try-on", selectedProduct.id, {
      name: selectedProduct.name,
      price: selectedProduct.price,
      image: selectedProduct.image,
      shopName: selectedProduct.storeName || "AI Try-On",
      category: selectedProduct.normalizedCategory || selectedProduct.category || "Fashion",
    }, variant);
    showToast(`${selectedProduct.name} added to cart!`, "success");
  }

  render();
});
