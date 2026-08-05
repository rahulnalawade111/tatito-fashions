/* =========================================================
   careers.js — Job listings, department/location filters,
   and application form handler.
   ========================================================= */

const JOB_LISTINGS = [
  { id: 1, title: "Senior Frontend Developer", department: "Engineering", location: "Mumbai", type: "Full-time", emoji: "💻",
    desc: "Build delightful user interfaces for our marketplace using React, TypeScript, and modern CSS." },
  { id: 2, title: "Backend Engineer (Node.js)", department: "Engineering", location: "Remote", type: "Full-time", emoji: "⚙️",
    desc: "Design and maintain scalable APIs, payment integrations, and vendor management systems." },
  { id: 3, title: "UI/UX Designer", department: "Design", location: "Mumbai", type: "Full-time", emoji: "🎨",
    desc: "Create beautiful, intuitive designs for web and mobile across the fashion marketplace." },
  { id: 4, title: "Fashion Graphic Designer", department: "Design", location: "Bengaluru", type: "Full-time", emoji: "🖼️",
    desc: "Design marketing campaigns, social media creatives, and lookbooks for fashion brands." },
  { id: 5, title: "Digital Marketing Manager", department: "Marketing", location: "Mumbai", type: "Full-time", emoji: "📈",
    desc: "Lead performance marketing, SEO, and social media strategy for customer growth." },
  { id: 6, title: "Content Creator", department: "Marketing", location: "Remote", type: "Contract", emoji: "✍️",
    desc: "Create engaging fashion content, blog posts, and video scripts for our community." },
  { id: 7, title: "Operations Manager", department: "Operations", location: "Mumbai", type: "Full-time", emoji: "📦",
    desc: "Oversee vendor onboarding, logistics, and order fulfillment across multiple cities." },
  { id: 8, title: "Vendor Success Specialist", department: "Operations", location: "Delhi", type: "Full-time", emoji: "🤝",
    desc: "Help vendors succeed on the platform with training, support, and growth strategies." },
  { id: 9, title: "Business Development Lead", department: "Business", location: "Bengaluru", type: "Full-time", emoji: "📊",
    desc: "Drive partnerships with boutiques, brands, and enterprise clients." },
  { id: 10, title: "Customer Support Executive", department: "Operations", location: "Remote", type: "Full-time", emoji: "🎧",
    desc: "Provide exceptional support to customers across chat, email, and phone channels." },
  { id: 11, title: "Mobile App Developer (React Native)", department: "Engineering", location: "Bengaluru", type: "Full-time", emoji: "📱",
    desc: "Build and maintain our cross-platform mobile app with offline-first architecture." },
  { id: 12, title: "Data Analyst", department: "Business", location: "Remote", type: "Full-time", emoji: "📈",
    desc: "Analyze marketplace trends, vendor performance, and customer behavior to drive decisions." },
];

let activeDept = "all";
let activeLoc = "all";

function renderJobs() {
  const list = document.getElementById("jobsList");
  if (!list) return;

  let jobs = JOB_LISTINGS.filter((j) => {
    if (activeDept !== "all" && j.department !== activeDept) return false;
    if (activeLoc !== "all" && j.location !== activeLoc) return false;
    return true;
  });

  if (!jobs.length) {
    list.innerHTML = `<p class="empty-state">No positions match your filters. Try a different selection.</p>`;
    return;
  }

  list.innerHTML = jobs.map((j) => `
    <div class="job-card">
      <div class="job-card-head">
        <div class="job-emoji">${j.emoji}</div>
        <div>
          <h3>${j.title}</h3>
          <div class="job-meta">
            <span class="job-tag">${j.department}</span>
            <span class="job-tag">📍 ${j.location}</span>
            <span class="job-tag">${j.type}</span>
          </div>
        </div>
      </div>
      <p class="job-desc">${j.desc}</p>
      <button class="btn btn-primary small job-apply-btn" data-job="${j.title}">Apply Now</button>
    </div>
  `).join("");
}

function setupFilters() {
  document.getElementById("deptFilter")?.addEventListener("change", (e) => {
    activeDept = e.target.value;
    renderJobs();
  });
  document.getElementById("locFilter")?.addEventListener("change", (e) => {
    activeLoc = e.target.value;
    renderJobs();
  });

  document.addEventListener("click", (e) => {
    const applyBtn = e.target.closest(".job-apply-btn");
    if (applyBtn) {
      const form = document.getElementById("careerForm");
      if (form) {
        form.querySelector('[name="name"]')?.focus();
        form.scrollIntoView({ behavior: "smooth", block: "center" });
        showToast(`Interested in "${applyBtn.dataset.job}"? Fill the form below!`);
      }
    }
  });

  document.getElementById("careerForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    showToast("Application submitted! We'll be in touch soon.", "success");
    form.reset();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderJobs();
  setupFilters();
});
