/* =========================================================
   location-gmaps.js — Google Maps location system for Tatito
   - Google Maps Places Autocomplete for search
   - Google Maps Geocoder for reverse geocoding
   - Haversine distance from user location to each shop
   - Graceful fallback to Nominatim + Haversine when no API key
   ========================================================= */

const TatitoLocation = (() => {
  let gmapsReady = false;
  let gmapsKey = null;
  let useFallback = true;
  let autocomplete = null;
  let geocoder = null;

  /* ---- Bootstrap: fetch config, load Google Maps if key available ---- */
  async function init() {
    try {
      const resp = await fetch("gmaps-config.php");
      const config = await resp.json();
      gmapsKey = config.apiKey || "";
      useFallback = !config.hasGoogleMaps;

      if (config.hasGoogleMaps) {
        await loadGoogleMaps(gmapsKey);
        gmapsReady = true;
        useFallback = false;
      }
    } catch (e) {
      // Network error — use fallback
      useFallback = true;
    }
    return { gmapsReady, useFallback };
  }

  /* Load Google Maps JS API with Places + Geocoder */
  function loadGoogleMaps(key) {
    return new Promise((resolve, reject) => {
      if (typeof google !== "undefined" && google.maps) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&loading=async`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        geocoder = new google.maps.Geocoder();
        resolve();
      };
      script.onerror = () => reject(new Error("Failed to load Google Maps"));
      document.head.appendChild(script);
    });
  }

  /* ---- Attach Places Autocomplete to a search input ---- */
  function attachAutocomplete(inputEl, onPlaceSelect) {
    if (gmapsReady && google && google.maps) {
      autocomplete = new google.maps.places.Autocomplete(inputEl, {
        types: ["(cities)"],
        fields: ["formatted_address", "geometry", "name", "address_components"],
      });
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place && place.geometry) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const name = place.name ||
            (place.address_components || []).find(c => c.types.includes("locality"))?.long_name ||
            "Selected Location";
          onPlaceSelect({ name, lat, lng, source: "google" });
        }
      });
      return "google";
    }
    // Fallback: use world cities search
    return "fallback";
  }

  /* ---- Reverse geocode lat/lng → city name ---- */
  async function reverseGeocode(lat, lng) {
    if (gmapsReady && geocoder) {
      try {
        const resp = await new Promise((resolve, reject) => {
          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results[0]) resolve(results[0]);
            else reject(new Error(status));
          });
        });
        const comps = resp.address_components || [];
        const city = comps.find(c => c.types.includes("locality"))?.long_name ||
                     comps.find(c => c.types.includes("sublocality"))?.long_name ||
                     comps.find(c => c.types.includes("neighborhood"))?.long_name ||
                     comps.find(c => c.types.includes("administrative_area_level_3"))?.long_name ||
                     comps.find(c => c.types.includes("administrative_area_level_2"))?.long_name ||
                     comps.find(c => c.types.includes("administrative_area_level_1"))?.long_name ||
                     "Current Location";
        return { name: city, lat, lng, source: "google" };
      } catch (e) {
        // fall through to fallback
      }
    }
    // Fallback: Nominatim with higher zoom for precise locality
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1&accept-language=en`);
      const data = await r.json();
      const a = data?.address || {};
      const city = a.city || a.town || a.locality || a.suburb ||
                   a.neighbourhood || a.village || a.county ||
                   a.state_district || a.state || "";
      return { name: city || "Current Location", lat, lng, source: "nominatim" };
    } catch (e) {
      return { name: "Current Location", lat, lng, source: "fallback" };
    }
  }

  /* ---- Fallback city search from WORLD_CITIES ---- */
  function searchCities(query, limit) {
    limit = limit || 12;
    if (typeof WORLD_CITIES === "undefined") return [];
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return WORLD_CITIES.filter((c) =>
      c.city.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
    ).slice(0, limit);
  }

  /* ---- Calculate distance (km) from user to a shop's lat/lng ---- */
  function distanceTo(userLat, userLng, shopLat, shopLng) {
    if (!shopLat || !shopLng) return null;
    return haversineDistance(userLat, userLng, shopLat, shopLng);
  }

  /* ---- Format distance for display ---- */
  function formatDist(km) {
    if (km === null || km === undefined) return "—";
    if (km < 1) return (Math.round(km * 10) / 10) + " km";
    if (km < 100) return Math.round(km) + " km";
    return Math.round(km / 10) * 10 + "+ km";
  }

  /* ---- Update all store distances based on user location ---- */
  function applyStoreDistances(userLat, userLng) {
    if (!userLat || !userLng || typeof STORES === "undefined") return;
    STORES.forEach((store) => {
      if (store.lat && store.lng) {
        store._dynamicDistance = haversineDistance(userLat, userLng, store.lat, store.lng);
      }
    });
  }

  /* ---- Find nearby stores sorted by distance ---- */
  function findNearbyStores(userLat, userLng, count) {
    count = count || 10;
    applyStoreDistances(userLat, userLng);
    return STORES
      .filter((s) => s._dynamicDistance !== undefined)
      .sort((a, b) => a._dynamicDistance - b._dynamicDistance)
      .slice(0, count);
  }

  /* ---- Find nearest known world cities (for fallback nearby display) ---- */
  function findNearestCities(lat, lng, count) {
    count = count || 5;
    if (typeof WORLD_CITIES === "undefined") return [];
    return WORLD_CITIES
      .map((c) => ({ ...c, distance: haversineDistance(lat, lng, c.lat, c.lng) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, count);
  }

  return {
    init,
    attachAutocomplete,
    reverseGeocode,
    searchCities,
    distanceTo,
    formatDist,
    applyStoreDistances,
    findNearbyStores,
    findNearestCities,
    isReady: () => gmapsReady,
    useFallback: () => useFallback,
  };
})();
