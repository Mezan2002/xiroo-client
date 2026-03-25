/**
 * Xiroo Security Layer: Encrypted Storage Utility
 * Uses Base64 (btoa/atob) for basic obfuscation as requested.
 */

export const encrypt = (data) => {
  try {
    const stringified = JSON.stringify(data);
    // Unicode-safe Base64 encoding
    return btoa(unescape(encodeURIComponent(stringified)));
  } catch (error) {
    console.error("Encryption Error:", error);
    return null;
  }
};

export const decrypt = (cipher) => {
  try {
    if (!cipher) return null;
    let decoded;
    try {
      // 1. Try modern Unicode-safe decoding protocol
      decoded = decodeURIComponent(escape(atob(cipher)));
    } catch (e) {
      // 2. Fallback to legacy raw Base64 decoding
      decoded = atob(cipher);
    }
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Decryption Error:", error);
    return null;
  }
};

export const saveToStorage = (key, data) => {
  if (typeof window === "undefined") return;
  const encrypted = encrypt(data);
  if (encrypted) {
    localStorage.setItem(key, encrypted);
  }
};

export const getFromStorage = (key) => {
  if (typeof window === "undefined") return null;
  const cipher = localStorage.getItem(key);
  return decrypt(cipher);
};

export const removeFromStorage = (key) => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
};

export const SECURITY_KEYS = {
  USER_DATA: "XO_UD",
  ACCESS_TOKEN: "XO_AT",
};
