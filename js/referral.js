/* =========================================================
   referral.js — Multi-Level Referral Program (Req 19)

   Every user gets a unique code + link. Multi-level rewards:
   L1 (direct) → 10%, L2 → 5%, L3 → 3%, L4 → 1%
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page !== "referral") return;

  const root = document.getElementById("referralRoot");
  if (!root) return;

  // Ensure user is logged in
  if (!TatitoStore.isLoggedIn()) {
    root.innerHTML = `
      <div class="checkout-panel" style="text-align:center;padding:48px 24px;">
        <div style="font-size:48px;margin-bottom:16px;">🎁</div>
        <h2>Login to Access Referral Program</h2>
        <p style="color:var(--muted);margin-bottom:20px;">Earn rewards by inviting friends to Tatito Fashions.</p>
        <a href="login.html" class="btn btn-primary">Login →</a>
      </div>
    `;
    return;
  }

  const code = TatitoStore.getReferralCode();
  const user = TatitoStore.getUser();
  const referrals = TatitoStore.getReferrals();
  const rewards = TatitoStore.getReferralRewards();
  const link = `${window.location.origin}/register.html?ref=${code}`;
  const totalEarned = rewards.reduce((s, r) => s + r.amount, 0);

  // Build referral tree from referrals
  const tree = buildReferralTree(user, referrals);

  root.innerHTML = `
    <!-- Hero -->
    <div class="referral-hero" style="margin-bottom:28px;">
      <h1 style="font-family:var(--font-display);font-size:32px;margin-bottom:8px;">🎁 Refer &amp; Earn</h1>
      <p style="opacity:0.9;">Invite friends to Tatito Fashions and earn rewards across 4 levels!</p>

      <div class="referral-code-box">
        <div>
          <p style="font-size:12px;opacity:0.7;margin-bottom:4px;">YOUR REFERRAL CODE</p>
          <code>${code}</code>
        </div>
        <button class="btn" id="copyCodeBtn" style="background:rgba(255,255,255,0.2);color:#fff;border:1px solid rgba(255,255,255,0.3);">📋 Copy</button>
      </div>

      <div style="margin-top:12px;">
        <p style="font-size:12px;opacity:0.7;margin-bottom:4px;">YOUR REFERRAL LINK</p>
        <div style="display:flex;gap:8px;justify-content:center;align-items:center;">
          <code style="font-size:13px;background:rgba(255,255,255,0.1);padding:6px 14px;border-radius:8px;max-width:400px;overflow:hidden;text-overflow:ellipsis;">${link}</code>
          <button class="btn" id="copyLinkBtn" style="background:rgba(255,255,255,0.2);color:#fff;border:1px solid rgba(255,255,255,0.3);">📋</button>
        </div>
      </div>

      <div style="display:flex;gap:24px;justify-content:center;margin-top:20px;flex-wrap:wrap;">
        <div><strong style="font-size:28px;">${referrals.length}</strong><p style="font-size:12px;opacity:0.8;">Total Referrals</p></div>
        <div><strong style="font-size:28px;">${formatPrice(totalEarned)}</strong><p style="font-size:12px;opacity:0.8;">Total Earned</p></div>
        <div><strong style="font-size:28px;">4</strong><p style="font-size:12px;opacity:0.8;">Reward Levels</p></div>
      </div>
    </div>

    <!-- How It Works -->
    <div class="checkout-panel" style="margin-bottom:28px;">
      <h2 style="font-family:var(--font-display);font-size:22px;margin-bottom:16px;">How Multi-Level Referral Works</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px;">
        <div style="text-align:center;padding:16px;background:var(--surface);border-radius:12px;">
          <div style="font-size:24px;margin-bottom:6px;">👇</div>
          <strong>Level 1 (Direct)</strong>
          <p style="font-size:13px;color:var(--muted);">Friend joins using your code. You earn 10% of their first order.</p>
        </div>
        <div style="text-align:center;padding:16px;background:var(--surface);border-radius:12px;">
          <div style="font-size:24px;margin-bottom:6px;">🔗</div>
          <strong>Level 2</strong>
          <p style="font-size:13px;color:var(--muted);">Your friend refers someone. You earn 5% of their order.</p>
        </div>
        <div style="text-align:center;padding:16px;background:var(--surface);border-radius:12px;">
          <div style="font-size:24px;margin-bottom:6px;">🔗</div>
          <strong>Level 3</strong>
          <p style="font-size:13px;color:var(--muted);">Third-level referral. You earn 3% of their order.</p>
        </div>
        <div style="text-align:center;padding:16px;background:var(--surface);border-radius:12px;">
          <div style="font-size:24px;margin-bottom:6px;">🔗</div>
          <strong>Level 4</strong>
          <p style="font-size:13px;color:var(--muted);">Fourth-level referral. You earn 1% of their order.</p>
        </div>
      </div>
    </div>

    <!-- Referral Tree Visualization -->
    <div class="checkout-panel" style="margin-bottom:28px;">
      <h2 style="font-family:var(--font-display);font-size:22px;margin-bottom:16px;">🌳 Your Referral Tree</h2>
      ${renderTree(tree)}
      ${referrals.length === 0 ? `
        <div style="text-align:center;padding:24px;">
          <p style="color:var(--muted);">No referrals yet. Share your code to start building your network!</p>
          <button class="btn btn-primary" id="simulateRefBtn" style="margin-top:12px;">Simulate a Referral (Demo)</button>
        </div>
      ` : ""}
    </div>

    <!-- Rewards Table -->
    ${rewards.length ? `
      <div class="checkout-panel" style="margin-bottom:28px;">
        <h2 style="font-family:var(--font-display);font-size:22px;margin-bottom:16px;">💰 Your Rewards</h2>
        <table class="referral-reward-table">
          <thead>
            <tr>
              <th>Referred User</th>
              <th>Level</th>
              <th>Reward Rate</th>
              <th style="text-align:right;">Amount Earned</th>
            </tr>
          </thead>
          <tbody>
            ${rewards.map((r) => `
              <tr>
                <td>${escapeHtml(r.name || "User")}</td>
                <td><span style="padding:3px 10px;border-radius:20px;font-size:12px;background:${r.level === 1 ? "var(--gold)" : r.level === 2 ? "#c0a050" : r.level === 3 ? "#d0c080" : "var(--line)"};color:${r.level <= 2 ? "var(--black)" : "var(--text)"};">Level ${r.level}</span></td>
                <td>${(r.rate * 100).toFixed(0)}%</td>
                <td style="text-align:right;font-weight:700;color:#2d6a2d;">+${formatPrice(r.amount)}</td>
              </tr>
            `).join("")}
          </tbody>
          <tfoot>
            <tr style="border-top:2px solid var(--line);">
              <td colspan="3" style="font-weight:700;">Total Earned</td>
              <td style="text-align:right;font-weight:700;font-size:18px;color:#2d6a2d;">${formatPrice(totalEarned)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    ` : ""}

    <!-- Share buttons -->
    <div class="checkout-panel" style="text-align:center;">
      <h3 style="font-family:var(--font-display);font-size:20px;margin-bottom:12px;">Share Your Code</h3>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
        <button class="btn btn-primary" id="shareWhatsAppBtn">💬 WhatsApp</button>
        <button class="btn btn-ghost" id="shareEmailBtn">📧 Email</button>
        <button class="btn btn-ghost" id="shareCopyBtn">🔗 Copy Link</button>
      </div>
    </div>
  `;

  // Copy code
  root.querySelector("#copyCodeBtn")?.addEventListener("click", () => {
    navigator.clipboard.writeText(code).then(() => showToast("Code copied!", "success"));
  });

  // Copy link
  root.querySelector("#copyLinkBtn")?.addEventListener("click", copyLink);
  root.querySelector("#shareCopyBtn")?.addEventListener("click", copyLink);
  function copyLink() {
    navigator.clipboard.writeText(link).then(() => showToast("Link copied!", "success"));
  }

  // WhatsApp share
  root.querySelector("#shareWhatsAppBtn")?.addEventListener("click", () => {
    const msg = `Check out Tatito Fashions! 🛍️ Use my referral code ${code} to sign up: ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  });

  // Email share
  root.querySelector("#shareEmailBtn")?.addEventListener("click", () => {
    const subject = "Join me on Tatito Fashions!";
    const body = `Hi! I've been shopping on Tatito Fashions and thought you'd love it too. Use my referral code: ${code}\n\nSign up here: ${link}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
  });

  // Simulate referral (demo)
  root.querySelector("#simulateRefBtn")?.addEventListener("click", () => {
    const names = ["Priya", "Rahul", "Ananya", "Vikram", "Meera"];
    const name = names[Math.floor(Math.random() * names.length)];
    TatitoStore.addReferral({ name, level: 1, orderValue: Math.round(2000 + Math.random() * 8000) });
    TatitoStore.addNotification({
      title: "Referral Reward Earned! 🎉",
      message: `${name} joined using your referral code. You earned a Level 1 reward!`,
      type: "referral",
      icon: "🎁"
    });
    showToast("Referral added! Check your rewards.", "success");
    setTimeout(() => window.location.reload(), 1000);
  });
});

/* Build a simple referral tree for visualization */
function buildReferralTree(user, referrals) {
  return {
    name: user.name || "You",
    level: 0,
    children: referrals.map((r) => ({ name: r.name, level: r.level || 1, children: [] })),
  };
}

function renderTree(node, depth = 0) {
  if (!node) return "";
  if (depth === 0) {
    return `
      <div class="referral-node level-1" style="border-left:4px solid var(--ruby);">
        <div class="ref-avatar" style="background:var(--ruby);color:#fff;">${(node.name || "Y")[0].toUpperCase()}</div>
        <div>
          <strong>${escapeHtml(node.name)}</strong>
          <p style="font-size:12px;color:var(--muted);">You</p>
        </div>
      </div>
      ${node.children?.map((child) => renderTree(child, depth + 1)).join("") || ""}
    `;
  }
  return `
    <div class="referral-node level-${Math.min(depth, 4)}">
      <div class="ref-avatar">${(node.name || "?")[0].toUpperCase()}</div>
      <div>
        <strong>${escapeHtml(node.name)}</strong>
        <p style="font-size:12px;color:var(--muted);">Level ${depth} referral</p>
      </div>
    </div>
    ${node.children?.map((child) => renderTree(child, depth + 1)).join("") || ""}
  `;
}
