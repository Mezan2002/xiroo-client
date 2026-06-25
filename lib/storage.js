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
    if (!cipher || typeof cipher !== "string") return null;

    // Guard against invalid/legacy/non-Base64 strings.
    // atob() throws InvalidCharacterError when input contains non-Latin1 chars.
    const base64ish = /^[A-Za-z0-9+/]+={0,2}$/;
    if (!base64ish.test(cipher)) return null;

    let decoded;
    try {
      // 1) Unicode-safe Base64 -> string (works for UTF-8 JSON)
      decoded = decodeURIComponent(escape(atob(cipher)));
    } catch (e) {
      // 2) If atob decoded bytes aren't valid UTF-8, avoid re-calling atob.
      //    Returning null prevents repeated noisy console errors.
      return null;
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
