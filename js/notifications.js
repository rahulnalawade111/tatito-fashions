/* =========================================================
   notifications.js — Notification Center (Req 20)

   Categorizes: orders, bookings, quotations, approvals,
   payments, referral, promotions, reviews, consultations.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page !== "notifications") return;

  let activeFilter = "all";

  function render() {
    const list = document.getElementById("notificationsList");
    const filterBar = document.getElementById("notifFilterBar");
    const unreadEl = document.getElementById("unreadCount");
    if (!list) return;

    const allNotifs = TatitoStore.getNotifications();
    const unreadCount = allNotifs.filter((n) => !n.read).length;

    if (unreadEl) {
      unreadEl.textContent = unreadCount > 0 ? `${unreadCount} unread` : "All caught up! ✓";
    }

    // Build filters
    const categories = [
      { id: "all", label: "All", icon: "📋" },
      { id: "order", label: "Orders", icon: "📦" },
      { id: "booking", label: "Bookings", icon: "📅" },
      { id: "quotation", label: "Quotations", icon: "💰" },
      { id: "seller", label: "Seller", icon: "🏪" },
      { id: "customization", label: "Customization", icon: "✂️" },
      { id: "payment", label: "Payments", icon: "💳" },
      { id: "referral", label: "Referral", icon: "🎁" },
      { id: "review", label: "Reviews", icon: "⭐" },
      { id: "consultation", label: "Consultations", icon: "📞" },
      { id: "promo", label: "Promotions", icon: "🏷️" },
    ];

    if (filterBar) {
      filterBar.innerHTML = categories.map((cat) => `
        <div class="notif-filter-chip ${activeFilter === cat.id ? "active" : ""}" data-filter="${cat.id}">
          ${cat.icon} ${cat.label}
        </div>
      `).join("");

      filterBar.querySelectorAll("[data-filter]").forEach((chip) => {
        chip.addEventListener("click", () => {
          activeFilter = chip.dataset.filter;
          render();
        });
      });
    }

    // Filter notifications
    const filtered = activeFilter === "all"
      ? allNotifs
      : allNotifs.filter((n) => n.type === activeFilter);

    if (!filtered.length) {
      // If no notifications at all, add demo ones
      if (!allNotifs.length) {
        seedDemoNotifications();
        setTimeout(render, 100);
        return;
      }
      list.innerHTML = `
        <div class="checkout-panel" style="text-align:center;padding:48px;">
          <div style="font-size:48px;margin-bottom:16px;">🔔</div>
          <h2>No notifications</h2>
          <p style="color:var(--muted);">You'll see updates here for orders, bookings, quotations, and more.</p>
        </div>
      `;
      return;
    }

    list.innerHTML = filtered.map((n) => {
      const timeAgo = getTimeAgo(n.createdAt);
      return `
        <div class="notification-item ${n.read ? "" : "unread"}" data-notif-id="${n.id}" ${n.link ? `data-link="${n.link}"` : ""}>
          <div class="notif-icon">${n.icon || "🔔"}</div>
          <div class="notif-body">
            <h4>${escapeHtml(n.title)}</h4>
            <p>${escapeHtml(n.message)}</p>
          </div>
          <div class="notif-time">${timeAgo}</div>
        </div>
      `;
    }).join("");

    // Click to mark read / navigate
    list.querySelectorAll("[data-notif-id]").forEach((item) => {
      item.addEventListener("click", () => {
        const id = item.dataset.notifId;
        TatitoStore.markNotificationRead(id);
        const link = item.dataset.link;
        if (link) window.location.href = link;
        else render();
      });
    });
  }

  // Mark all read
  document.getElementById("markAllReadBtn")?.addEventListener("click", () => {
    TatitoStore.markAllNotificationsRead();
    showToast("All notifications marked as read", "success");
    render();
  });

  // Filter bar clicks
  document.getElementById("notifFilterBar")?.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-filter]");
    if (chip) {
      activeFilter = chip.dataset.filter;
      render();
    }
  });

  render();
});

function getTimeAgo(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/* Seed demo notifications for first visit */
function seedDemoNotifications() {
  const demos = [
    { title: "Welcome to Tatito Fashions! 🎉", message: "Explore fashion, jewellery, wedding collections, and book services near you.", type: "promo", icon: "🎉" },
    { title: "Flat 20% off on Wedding Collection", message: "Limited time offer! Use code WED20 at checkout.", type: "promo", icon: "🏷️" },
    { title: "New Stores Near You", message: "3 new boutiques and 2 photographers just joined in your area.", type: "promo", icon: "📍" },
  ];
  demos.forEach((d) => TatitoStore.addNotification(d));
}
