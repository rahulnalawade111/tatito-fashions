/* =========================================================
   location.js — Splash, geolocation, reverse geocoding,
   city selection, and persistence.
   Auto-requests browser location permission on first visit.
   Only runs on index.html (checks for splash element).
   ========================================================= */

const STORAGE_KEY = "tatito_location";

/* Higher zoom = more precise locality (not state-level) */
const REVERSE_GEOCODE_URL = (lat, lon) =>
  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1&accept-language=en`;

function saveLocation(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  addRecentCity(data.city);
}
function getSavedLocation() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; }
}
function addRecentCity(city) {
  if (!city) return;
  let recents = JSON.parse(localStorage.getItem("tatito_recent_cities") || "[]");
  recents = [city, ...recents.filter((c) => c !== city)].slice(0, 5);
  localStorage.setItem("tatito_recent_cities", JSON.stringify(recents));
}
function getRecentCities() {
  return JSON.parse(localStorage.getItem("tatito_recent_cities") || "[]");
}

function showSplash() { document.getElementById("splash")?.classList.remove("fade-out"); }
function hideSplash() {
  const s = document.getElementById("splash");
  if (!s) return;
  s.classList.add("fade-out");
  setTimeout(() => s.classList.add("hidden"), 700);
}

/* ---------- Location modal / city screen helpers ---------- */
function showLocationModal() { document.getElementById("locationModal")?.classList.remove("hidden"); }
function hideLocationModal() { document.getElementById("locationModal")?.classList.add("hidden"); }
function showCityScreen() {
  document.getElementById("cityScreen")?.classList.remove("hidden");
  renderCityLists();
}
function hideCityScreen() { document.getElementById("cityScreen")?.classList.add("hidden"); }

function showMainSite(locationData) {
  hideLocationModal();
  hideCityScreen();
  document.getElementById("mainSite")?.classList.remove("hidden");
  applyLocationToUI(locationData);
  // Sync navbar pill
  const navText = document.getElementById("navLocationText");
  if (navText && locationData.city) navText.textContent = `📍 ${locationData.city}`;
}

/* Build a clean, user-friendly label from location data */
function buildLocationLabel(data) {
  if (!data) return "";
  const parts = [];
  if (data.city) parts.push(data.city);
  if (data.state && data.state !== data.city) parts.push(data.state);
  return parts.join(", ");
}

/* Clean a raw place name — remove unwanted prefixes/suffixes */
function cleanPlaceName(name) {
  if (!name) return "";
  return name
    .replace(/\b(District|Tehsil|Taluka|Taluk|Block|Municipality|Municipal Corporation)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function applyLocationToUI(data) {
  const label = data.city || t("yourCity");
  const pill = document.getElementById("locationPillText");
  if (pill) pill.textContent = label;
  const heroLoc = document.getElementById("heroLocationText");
  if (heroLoc) heroLoc.textContent = data.city || t("selectCity");
  const nearbyLoc = document.getElementById("nearbyLocationText");
  if (nearbyLoc) nearbyLoc.textContent = data.city || t("yourArea");
  const heroSearchLoc = document.getElementById("heroSearchLocationText");
  if (heroSearchLoc) heroSearchLoc.textContent = data.city || t("selectCity");
  // Navbar location pill
  const navText = document.getElementById("navLocationText");
  if (navText) navText.textContent = `📍 ${data.city || "Select City"}`;
}

/* ===========================================================
   BROWSER GEOLOCATION — auto-request on first visit
   =========================================================== */

function requestBrowserLocation() {
  const status = document.getElementById("locationStatus");
  if (status) status.textContent = t("locating") || "Detecting your location…";

  if (!("geolocation" in navigator)) {
    if (status) status.textContent = "Geolocation not supported";
    setTimeout(() => { hideLocationModal(); showCityScreen(); }, 1000);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const place = await reverseGeocode(latitude, longitude);
        const data = {
          lat: latitude,
          lng: longitude,
          city: place.city,
          state: place.state,
          country: place.country,
          source: "gps"
        };
        saveLocation(data);
        showMainSite(data);
      } catch {
        if (status) status.textContent = "Couldn't identify city. Please select manually.";
        setTimeout(() => { hideLocationModal(); showCityScreen(); }, 1200);
      }
    },
    (error) => {
      let msg = "Location access denied. Please select your city.";
      if (error.code === error.TIMEOUT) msg = "Location timed out. Please select your city.";
      if (status) status.textContent = msg;
      setTimeout(() => { hideLocationModal(); showCityScreen(); }, 1200);
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
  );
}

/* ===========================================================
   REVERSE GEOCODE — extract clean city/area name
   Priority: city > town > locality > suburb > neighbourhood > village > county
   =========================================================== */

async function reverseGeocode(lat, lon) {
  const res = await fetch(REVERSE_GEOCODE_URL(lat, lon), {
    headers: { Accept: "application/json" }
  });
  if (!res.ok) throw new Error("Geocoding failed");
  const json = await res.json();
  const addr = json.address || {};

  /* Extract the most precise place name available */
  let city =
    addr.city ||
    addr.town ||
    addr.locality ||
    addr.suburb ||
    addr.neighbourhood ||
    addr.village ||
    addr.county ||
    addr.city_district ||
    addr.state_district ||
    "Your Area";

  city = cleanPlaceName(city);

  return {
    city,
    state: addr.state || "",
    country: addr.country || ""
  };
}

/* ===========================================================
   MANUAL CITY SELECTION
   =========================================================== */

function selectCity(cityName) {
  const data = { city: cityName, source: "manual" };
  saveLocation(data);
  showMainSite(data);
}

function renderCityLists() {
  const popularWrap = document.getElementById("popularCityList");
  if (popularWrap) {
    popularWrap.innerHTML = POPULAR_CITIES.map((c) =>
      `<button class="city-chip" data-city="${c}">${c}</button>`
    ).join("");
  }
  const recents = getRecentCities();
  const recentWrap = document.getElementById("recentCityWrap");
  if (recentWrap) {
    if (recents.length) {
      recentWrap.classList.remove("hidden");
      document.getElementById("recentCityList").innerHTML = recents
        .map((c) => `<button class="city-chip current" data-city="${c}">${c}</button>`)
        .join("");
    } else {
      recentWrap.classList.add("hidden");
    }
  }
  document.querySelectorAll(".city-chip").forEach((btn) => {
    btn.addEventListener("click", () => selectCity(btn.dataset.city));
  });
}

function setupCitySearch() {
  const input = document.getElementById("citySearchInput");
  const suggestions = document.getElementById("citySuggestions");
  if (!input || !suggestions) return;

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { suggestions.classList.add("hidden"); suggestions.innerHTML = ""; return; }

    /* Search both POPULAR_CITIES and WORLD_CITIES for richer results */
    const popularMatches = (typeof POPULAR_CITIES !== "undefined" ? POPULAR_CITIES : [])
      .filter((c) => c.toLowerCase().includes(q))
      .map((c) => ({ city: c, country: "" }));

    const worldMatches = (typeof WORLD_CITIES !== "undefined" ? WORLD_CITIES : [])
      .filter((c) => c.city.toLowerCase().includes(q) || (c.country || "").toLowerCase().includes(q))
      .slice(0, 15)
      .map((c) => ({ city: c.city, country: c.country }));

    // Merge and dedupe
    const all = [...worldMatches];
    popularMatches.forEach((pm) => {
      if (!all.some((am) => am.city === pm.city)) all.push(pm);
    });

    if (!all.length) {
      suggestions.classList.add("hidden");
      return;
    }

    suggestions.innerHTML = all.slice(0, 20).map((c) =>
      `<li data-city="${c.city}">${c.city}${c.country ? ` <span class="city-sugg-country">${c.country}</span>` : ""}</li>`
    ).join("");
    suggestions.classList.remove("hidden");
    suggestions.querySelectorAll("li").forEach((li) => {
      li.addEventListener("click", () => selectCity(li.dataset.city));
    });
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && input.value.trim()) selectCity(input.value.trim());
  });
}

/* ===========================================================
   INIT — splash → auto-request location → show site
   =========================================================== */

function initLocationFlow() {
  const splash = document.getElementById("splash");
  if (!splash) return; // Only on index.html

  setupCitySearch();

  // Wire up buttons
  document.getElementById("allowLocationBtn")?.addEventListener("click", requestBrowserLocation);
  document.getElementById("manualCityBtn")?.addEventListener("click", () => {
    hideLocationModal();
    showCityScreen();
  });
  document.getElementById("closeCityScreen")?.addEventListener("click", () => {
    hideCityScreen();
    if (!getSavedLocation()) showLocationModal();
  });

  const saved = getSavedLocation();

  setTimeout(() => {
    hideSplash();
    if (saved && saved.city) {
      /* Returning user with saved location — go straight to site */
      showMainSite(saved);
    } else {
      /* NEW USER — automatically trigger geolocation permission prompt.
         The browser's native permission dialog appears without requiring
         a button click. Show the modal as a visual backdrop while
         geolocation runs. If denied/fails, fall through to city screen. */
      showLocationModal();

      /* Auto-request after a tiny delay so the modal is visible */
      setTimeout(() => {
        if (!("geolocation" in navigator)) {
          hideLocationModal();
          showCityScreen();
          return;
        }

        const status = document.getElementById("locationStatus");
        if (status) status.textContent = "Requesting location access…";

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              if (status) status.textContent = "Locating nearby services…";
              const place = await reverseGeocode(latitude, longitude);
              const data = {
                lat: latitude,
                lng: longitude,
                city: place.city,
                state: place.state,
                country: place.country,
                source: "gps"
              };
              saveLocation(data);
              showMainSite(data);
            } catch {
              if (status) status.textContent = "Couldn't identify city. Please select manually.";
              setTimeout(() => { hideLocationModal(); showCityScreen(); }, 1200);
            }
          },
          (error) => {
            /* Permission denied or timed out → show city selection */
            let msg = "Please select your city manually.";
            if (error.code === error.TIMEOUT) msg = "Location request timed out. Select your city.";
            if (status) status.textContent = msg;
            setTimeout(() => { hideLocationModal(); showCityScreen(); }, 1200);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
        );
      }, 300);
    }
  }, 1900);
}

document.addEventListener("DOMContentLoaded", initLocationFlow);
