/* =========================================================
   profile.js — Profile page and Address book page.
   Handles profile editing, address CRUD, and address modal.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;

  /* ---------- PROFILE PAGE ---------- */
  if (page === "profile") {
    if (!TatitoStore.isLoggedIn()) {
      window.location.href = "login.html";
      return;
    }

    function renderProfile() {
      const user = TatitoStore.getUser();
      const orders = TatitoStore.getOrders();
      const addresses = TatitoStore.getAddresses();
      const initials = (user.name || "U").charAt(0).toUpperCase();

      const sidebar = document.getElementById("profileSidebar");
      if (sidebar) {
        sidebar.innerHTML = `
          <div class="profile-avatar">${initials}</div>
          <h3>${escapeHtml(user.name || "User")}</h3>
          <p>${escapeHtml(user.email || "")}</p>
          <p style="font-size:12px;margin-top:8px;">${t("memberSince")} ${formatDate(user.createdAt)}</p>
          <div style="margin-top:20px;display:flex;flex-direction:column;gap:8px;">
            <a href="orders.html" class="btn btn-ghost small block">${t("orders")}</a>
            <a href="addresses.html" class="btn btn-ghost small block">${t("addresses")}</a>
            <a href="wishlist.html" class="btn btn-ghost small block">${t("wishlist")}</a>
          </div>
        `;
      }

      const content = document.getElementById("profileContent");
      if (content) {
        content.innerHTML = `
          <h2>${t("personalInfo")}</h2>
          <div class="profile-stats" style="margin-bottom:24px;">
            <div class="profile-stat"><strong>${orders.length}</strong><span>${t("orders")}</span></div>
            <div class="profile-stat"><strong>${TatitoStore.wishlistCount()}</strong><span>${t("wishlist")}</span></div>
            <div class="profile-stat"><strong>${addresses.length}</strong><span>${t("addresses")}</span></div>
          </div>
          <form id="profileForm">
            <div class="form-row">
              <div class="form-field">
                <label>${t("fullName")}</label>
                <input type="text" name="name" value="${escapeHtml(user.name || "")}" />
              </div>
              <div class="form-field">
                <label>${t("email")}</label>
                <input type="email" name="email" value="${escapeHtml(user.email || "")}" />
              </div>
            </div>
            <div class="form-field">
              <label>${t("phone")}</label>
              <input type="tel" name="phone" data-i18n-placeholder="phonePlaceholder" placeholder="${t("phonePlaceholder")}" value="${escapeHtml(user.phone || "")}" />
            </div>
            <button type="submit" class="btn btn-primary">${t("saveChanges")}</button>
          </form>
        `;

        const form = document.getElementById("profileForm");
        form?.addEventListener("submit", (e) => {
          e.preventDefault();
          const data = new FormData(form);
          TatitoStore.updateUser({
            name: data.get("name"),
            email: data.get("email"),
            phone: data.get("phone")
          });
          showToast(t("changesSaved"), "success");
          renderProfile();
        });
      }
    }

    renderProfile();
    window.addEventListener("languagechange", renderProfile);
  }

  /* ---------- ADDRESSES PAGE ---------- */
  if (page === "addresses") {
    if (!TatitoStore.isLoggedIn()) {
      window.location.href = "login.html";
      return;
    }

    const modal = document.getElementById("addressModal");
    const form = document.getElementById("addressForm");

    function renderAddresses() {
      const grid = document.getElementById("addressGrid");
      if (!grid) return;
      const addresses = TatitoStore.getAddresses();

      if (!addresses.length) {
        grid.innerHTML = `<p class="empty-state">${t("noAddresses")}</p>`;
        return;
      }

      grid.innerHTML = addresses.map((addr) => `
        <div class="address-card ${addr.isDefault ? "is-default" : ""}">
          <h4>${escapeHtml(addr.fullName)} <span class="address-badge">${t(addr.type || "home")}</span></h4>
          <p>${escapeHtml(addr.line1)}${addr.line2 ? ", " + escapeHtml(addr.line2) : ""}<br>${escapeHtml(addr.city)}, ${escapeHtml(addr.state)} - ${escapeHtml(addr.pincode)}<br>${escapeHtml(addr.phone)}</p>
          ${addr.isDefault ? `<span class="address-badge" style="background:var(--gold);color:var(--black);">${t("defaultAddress")}</span>` : ""}
          <div class="address-card-actions" style="margin-top:12px;">
            <button class="btn btn-ghost small" data-action="edit-address" data-id="${addr.id}">${t("editAddress")}</button>
            ${!addr.isDefault ? `<button class="btn btn-ghost small" data-action="set-default" data-id="${addr.id}">${t("setDefault")}</button>` : ""}
            <button class="btn btn-danger small" data-action="delete-address" data-id="${addr.id}">${t("delete")}</button>
          </div>
        </div>
      `).join("");

      grid.querySelectorAll("[data-action]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const action = btn.dataset.action;
          const id = btn.dataset.id;
          if (action === "edit-address") openModal(id);
          else if (action === "set-default") {
            TatitoStore.updateAddress(id, { isDefault: true });
            renderAddresses();
            showToast(t("addressUpdated"), "success");
          } else if (action === "delete-address") {
            if (confirm(t("confirmDelete"))) {
              TatitoStore.removeAddress(id);
              renderAddresses();
              showToast(t("addressDeleted"));
            }
          }
        });
      });
    }

    function openModal(editId) {
      if (!modal) return;
      form.reset();
      document.getElementById("addressId").value = "";

      if (editId) {
        const addr = TatitoStore.getAddresses().find((a) => a.id === editId);
        if (addr) {
          document.getElementById("addressId").value = addr.id;
          document.getElementById("addrFullName").value = addr.fullName || "";
          document.getElementById("addrPhone").value = addr.phone || "";
          document.getElementById("addrLine1").value = addr.line1 || "";
          document.getElementById("addrLine2").value = addr.line2 || "";
          document.getElementById("addrCity").value = addr.city || "";
          document.getElementById("addrState").value = addr.state || "";
          document.getElementById("addrPincode").value = addr.pincode || "";
          document.getElementById("addrType").value = addr.type || "home";
        }
      }

      modal.classList.remove("hidden");
    }

    function closeModal() {
      modal?.classList.add("hidden");
    }

    document.getElementById("addAddressBtn")?.addEventListener("click", () => openModal());
    document.getElementById("addressModalClose")?.addEventListener("click", closeModal);
    modal?.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = document.getElementById("addressId").value;
      const data = {
        fullName: document.getElementById("addrFullName").value,
        phone: document.getElementById("addrPhone").value,
        line1: document.getElementById("addrLine1").value,
        line2: document.getElementById("addrLine2").value,
        city: document.getElementById("addrCity").value,
        state: document.getElementById("addrState").value,
        pincode: document.getElementById("addrPincode").value,
        type: document.getElementById("addrType").value
      };
      if (id) {
        TatitoStore.updateAddress(id, data);
        showToast(t("addressUpdated"), "success");
      } else {
        TatitoStore.addAddress(data);
        showToast(t("addressAdded"), "success");
      }
      closeModal();
      renderAddresses();
    });

    renderAddresses();
    window.addEventListener("languagechange", renderAddresses);
  }
});

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}
