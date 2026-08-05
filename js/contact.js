/* =========================================================
   contact.js — Contact Us page
   Form submission (mock), FAQ accordion
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page !== "contact") return;

  // Pre-fill form if logged in
  const user = TatitoStore.getUser();
  if (user && user.email) {
    const nameInput = document.querySelector('#contactForm input[name="name"]');
    const emailInput = document.querySelector('#contactForm input[name="email"]');
    if (nameInput && !nameInput.value) nameInput.value = user.name || "";
    if (emailInput && !emailInput.value) emailInput.value = user.email || "";
  }

  // Form submit
  const form = document.getElementById("contactForm");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = form.querySelector("button[type='submit']");
    const originalText = btn.textContent;
    btn.textContent = "Sending…";
    btn.disabled = true;

    const data = Object.fromEntries(new FormData(form).entries());

    // Save message to localStorage
    const messages = JSON.parse(localStorage.getItem("tatito_contact_messages") || "[]");
    messages.unshift({ ...data, id: `msg_${Date.now()}`, createdAt: new Date().toISOString(), status: "sent" });
    localStorage.setItem("tatito_contact_messages", JSON.stringify(messages));

    // Add notification
    TatitoStore.addNotification({
      title: "Message Sent ✉️",
      message: `Your message about "${data.subject}" has been received. Our team will respond within 24 hours.`,
      type: "support",
      icon: "📧"
    });

    setTimeout(() => {
      showToast("Message sent! We'll get back to you soon.", "success");
      form.reset();
      // Restore pre-fill
      if (user && user.email) {
        form.querySelector('input[name="name"]').value = user.name || "";
        form.querySelector('input[name="email"]').value = user.email || "";
      }
      btn.textContent = originalText;
      btn.disabled = false;
    }, 800);
  });

  // FAQ accordion
  const faqs = [
    { q: "How do I track my order?", a: "Go to My Orders → click on any order to see the full tracking timeline with all stages from placement to delivery." },
    { q: "How does the AI Virtual Try-On work?", a: "Upload a full-body photo on the Try-On page, select a dress, and our system generates a preview. You can compare colors and sizes before purchasing." },
    { q: "How do I request custom-designed clothing?", a: "Visit the Customize page, select your category (Men/Women/Kids), upload a reference image, enter measurements, set a budget, and nearby designers will respond with quotations." },
    { q: "How do I become a seller on Tatito?", a: "Click 'Sell on Tatito' and complete the seller registration. Choose your business category, fill in your profile, upload documents, and our team will verify your application." },
    { q: "How does the referral program work?", a: "Every user gets a unique referral code. Share it with friends — you earn rewards across 4 levels (10%, 5%, 3%, 1%) when your referrals make purchases." },
    { q: "Can I book photography and event services?", a: "Yes! Browse photographers or event managers in your area, compare packages (hourly, daily, combo), select a date and time, and book instantly." },
    { q: "What payment methods are supported?", a: "We support all major credit/debit cards, UPI, and Cash on Delivery (COD) for eligible orders." },
    { q: "How do I leave a review?", a: "Visit any shop detail page and click 'Write a Review'. You can give star ratings, write your experience, and upload photos for delivered orders." },
  ];

  const faqList = document.getElementById("faqList");
  if (faqList) {
    faqList.innerHTML = faqs.map((faq, i) => `
      <div class="faq-item" data-faq-index="${i}">
        <button class="faq-question">
          <span>${faq.q}</span>
          <span class="faq-toggle">+</span>
        </button>
        <div class="faq-answer">
          <p>${faq.a}</p>
        </div>
      </div>
    `).join("");

    faqList.querySelectorAll(".faq-question").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.parentElement;
        const isOpen = item.classList.contains("open");
        // Close all
        faqList.querySelectorAll(".faq-item").forEach((fi) => {
          fi.classList.remove("open");
          fi.querySelector(".faq-toggle").textContent = "+";
        });
        // Open clicked if it was closed
        if (!isOpen) {
          item.classList.add("open");
          btn.querySelector(".faq-toggle").textContent = "−";
        }
      });
    });
  }
});
