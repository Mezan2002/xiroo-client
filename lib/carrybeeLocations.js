/**
 * CarryBee Location Service
 * Uses hardcoded fallback data, with optional live API fetch from backend proxy
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// Hardcoded fallback - always works even if API is down
const FALLBACK_CITIES = [
  { id: 1, name: "Dhaka" },
  { id: 2, name: "Chattogram" },
  { id: 3, name: "Sylhet" },
  { id: 4, name: "Rajshahi" },
  { id: 5, name: "Khulna" },
  { id: 6, name: "Barishal" },
  { id: 7, name: "Rangpur" },
  { id: 8, name: "Mymensingh" },
  { id: 9, name: "Comilla" },
  { id: 10, name: "Gazipur" },
  { id: 11, name: "Narayanganj" },
  { id: 12, name: "Bogra" },
  { id: 13, name: "Cox's Bazar" },
  { id: 14, name: "Jessore" },
  { id: 15, name: "Dinajpur" },
];

const FALLBACK_ZONES = {
  1: [
    { id: 1, name: "Dhanmondi" }, { id: 2, name: "Gulshan" }, { id: 3, name: "Banani" },
    { id: 4, name: "Mirpur" }, { id: 5, name: "Uttara" }, { id: 6, name: "Motijheel" },
    { id: 7, name: "Old Dhaka" }, { id: 8, name: "Tejgaon" }, { id: 9, name: "Mohammadpur" },
    { id: 10, name: "Lalmatia" }, { id: 11, name: "Eskaton" }, { id: 12, name: "Shahbagh" },
    { id: 13, name: "Farmgate" }, { id: 14, name: "Khilgaon" }, { id: 15, name: "Badda" },
    { id: 16, name: "Rampura" }, { id: 17, name: "Jatrabari" }, { id: 18, name: "Demra" },
  ],
  2: [
    { id: 1, name: "Agrabad" }, { id: 2, name: "Nasirabad" }, { id: 3, name: "GEC Circle" },
    { id: 4, name: "Chawkbazar" }, { id: 5, name: "Kotwali" }, { id: 6, name: "Pahartali" },
    { id: 7, name: "Bayazid" }, { id: 8, name: "Halishahar" }, { id: 9, name: "Patenga" },
  ],
  3: [
    { id: 1, name: "Zindabazar" }, { id: 2, name: "Ambarkhana" }, { id: 3, name: "Sylhet Sadar" },
    { id: 4, name: "Beanibazar" }, { id: 5, name: "Golapganj" },
  ],
  4: [
    { id: 1, name: "Rajshahi Sadar" }, { id: 2, name: "Boalia" }, { id: 3, name: "Natore" },
  ],
  5: [
    { id: 1, name: "Khulna Sadar" }, { id: 2, name: "Sonadanga" }, { id: 3, name: "Daulatpur" },
  ],
  6: [{ id: 1, name: "Barishal Sadar" }, { id: 2, name: "Bakerganj" }],
  7: [{ id: 1, name: "Rangpur Sadar" }, { id: 2, name: "Gangachara" }],
  8: [{ id: 1, name: "Mymensingh Sadar" }],
  9: [{ id: 1, name: "Comilla Sadar" }],
  10: [{ id: 1, name: "Gazipur Sadar" }, { id: 2, name: "Tongi" }],
  11: [{ id: 1, name: "Narayanganj Sadar" }],
  12: [{ id: 1, name: "Bogra Sadar" }],
  13: [{ id: 1, name: "Cox's Bazar Sadar" }],
  14: [{ id: 1, name: "Jessore Sadar" }],
  15: [{ id: 1, name: "Dinajpur Sadar" }],
};

/**
 * Fetch cities - tries live API first, falls back to hardcoded
 */
export async function fetchCarrybeeCities() {
  try {
    const res = await fetch(`${API_BASE}/orders/carrybee/cities`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const cities = data.data?.cities || data.cities || [];
    if (cities.length > 0) return cities;
  } catch (err) {
    console.warn("CarryBee cities API unavailable, using fallback:", err.message);
  }
  return FALLBACK_CITIES;
}

/**
 * Fetch zones - tries live API first, falls back to hardcoded
 */
export async function fetchCarrybeeZones(cityId) {
  try {
    const res = await fetch(`${API_BASE}/orders/carrybee/cities/${cityId}/zones`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const zones = data.data?.zones || data.zones || [];
    if (zones.length > 0) return zones;
  } catch (err) {
    console.warn("CarryBee zones API unavailable, using fallback:", err.message);
  }
  return FALLBACK_ZONES[cityId] || [];
}
