/* =========================================================
   about.js — About page team rendering & interactions.
   ========================================================= */

const TEAM_MEMBERS = [
  { name: "Aisha Patel", role: "Founder & CEO", photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80" },
  { name: "Rohan Mehta", role: "Co-Founder & CTO", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80" },
  { name: "Priya Sharma", role: "Head of Design", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80" },
  { name: "Vikram Singh", role: "Head of Operations", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80" },
  { name: "Neha Reddy", role: "Vendor Partnerships", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80" },
  { name: "Arjun Nair", role: "Product Manager", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" },
  { name: "Sneha Iyer", role: "Marketing Lead", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" },
  { name: "Karan Joshi", role: "Customer Experience", photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80" },
];

function renderTeam() {
  const grid = document.getElementById("teamGrid");
  if (!grid) return;
  grid.innerHTML = TEAM_MEMBERS.map((m) => `
    <div class="team-card">
      <div class="team-photo-wrap">
        <img src="${m.photo}" alt="${m.name}" class="team-photo" loading="lazy" />
      </div>
      <h3>${m.name}</h3>
      <p>${m.role}</p>
    </div>
  `).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  renderTeam();
});
