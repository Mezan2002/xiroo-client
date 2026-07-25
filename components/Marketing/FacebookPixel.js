"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { useUser } from "@/hooks/api/useUser";

// ─── Helpers ────────────────────────────────────────────────────────────────

function getCookie(name) {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(
    new RegExp("(^| )" + name + "=([^;]+)")
  );
  return match ? decodeURIComponent(match[2]) : "";
}

function normalizeEmail(email) {
  if (!email) return "";
  return email.trim().toLowerCase();
}

function normalizePhone(phone) {
  if (!phone) return "";
  return phone.replace(/[\s\-\(\)\+]/g, "");
}

// ─── IP Cache ───────────────────────────────────────────────────────────────

let cachedIp = "";

async function fetchClientIp() {
  if (cachedIp) return cachedIp;
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    cachedIp = data.ip || "";
    return cachedIp;
  } catch {
    return "";
  }
}

// ─── User Context ───────────────────────────────────────────────────────────

function getUserContext() {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("xiroo_user_context");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveUserContext(data) {
  if (typeof window === "undefined" || !data) return;
  try {
    const existing = getUserContext();
    const merged = { ...existing, ...data };
    const cleaned = Object.fromEntries(
      Object.entries(merged).filter(([_, v]) => !!v)
    );
    if (Object.keys(cleaned).length > 0) {
      localStorage.setItem("xiroo_user_context", JSON.stringify(cleaned));
    }
  } catch {}
}

// ─── Public Exports (used by other modules) ────────────────────────────────

export function getCachedUserData() {
  return getUserContext();
}

export function saveCustomerContext(data) {
  return saveUserContext(data);
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function FacebookPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useUser();

  // Refs to avoid stale closures
  const pixelInitialized = useRef(false);
  const pixelIdRef = useRef(null);
  const testCodeRef = useRef("");

  const loggedInUserData = user
    ? {
        email: user.email || "",
        phone: user.phoneNumber || user.phone || "",
        firstName: user.firstName || user.name?.split(" ")[0] || "",
        lastName: user.lastName || user.name?.split(" ").slice(1).join(" ") || "",
        externalId: user._id || user.id || "",
      }
    : {};

  // ── Initialize pixel ONCE ───────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined" || pixelInitialized.current) return;

    const initPixel = async () => {
      // 1. Resolve pixel ID
      let pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID || "";
      let testCode = "";
      let isEnabled = !!pixelId;

      try {
        const resp = await axiosInstance.get("/marketing");
        const settings = resp?.data;
        if (settings) {
          if (!pixelId) {
            pixelId = settings.pixelId || "";
            isEnabled = settings.isEnabled;
          }
          testCode = settings.testEventCode || "";
        }
      } catch (err) {
        console.warn("[FB Pixel] Failed to fetch settings:", err);
      }

      if (!pixelId || !isEnabled) {
        console.warn("[FB Pixel] Pixel disabled or no pixel ID");
        return;
      }

      pixelIdRef.current = pixelId;
      testCodeRef.current = testCode;

      // 2. Load fbevents.js
      if (!window.fbq) {
        !(function (f, b, e, v, n, t, s) {
          if (f.fbq) return;
          n = f.fbq = function () {
            n.callMethod
              ? n.callMethod.apply(n, arguments)
              : n.queue.push(arguments);
          };
          if (!f._fbq) f._fbq = n;
          n.push = n;
          n.loaded = !0;
          n.version = "2.0";
          n.queue = [];
          t = b.createElement(e);
          t.async = !0;
          t.src = v;
          s = b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t, s);
        })(
          window,
          document,
          "script",
          "https://connect.facebook.net/en_US/fbevents.js"
        );
      }

      // 3. Init with advanced matching (once)
      const initialUser = { ...getUserContext(), ...loggedInUserData };
      const advancedMatching = {};
      if (initialUser.email)
        advancedMatching.em = normalizeEmail(initialUser.email);
      if (initialUser.phone)
        advancedMatching.ph = normalizePhone(initialUser.phone);
      if (initialUser.firstName)
        advancedMatching.fn = initialUser.firstName.trim().toLowerCase();
      if (initialUser.lastName)
        advancedMatching.ln = initialUser.lastName.trim().toLowerCase();
      if (initialUser.externalId)
        advancedMatching.external_id = String(initialUser.externalId);

      if (Object.keys(advancedMatching).length > 0) {
        window.fbq("init", pixelId, advancedMatching);
      } else {
        window.fbq("init", pixelId);
      }

      // 4. Initial PageView
      window.fbq("track", "PageView");

      // 5. Expose global tracking function
      window.trackFacebookEvent = async (
        eventName,
        customData = {},
        userData = {},
        overrideEventId = null
      ) => {
        const activePid = pixelIdRef.current;
        if (!activePid || !window.fbq) return;

        const cachedUser = getUserContext();
        const hasExplicitUserData = Object.keys(userData).length > 0;
        const mergedUser = hasExplicitUserData
          ? { ...loggedInUserData, ...userData }
          : { ...cachedUser, ...loggedInUserData };

        if (hasExplicitUserData) {
          saveUserContext(userData);
        }

        // Generate unique event ID for deduplication
        const eventId =
          overrideEventId ||
          "evt_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();

        const fbc = getCookie("_fbc");
        const fbp = getCookie("_fbp");
        const clientIp = cachedIp || (await fetchClientIp());

        const nEmail = normalizeEmail(mergedUser.email);
        const nPhone = normalizePhone(mergedUser.phone);

        // Fire browser pixel with eventID for deduplication
        const advancedMatching = {};
        if (nEmail) advancedMatching.em = nEmail;
        if (nPhone) advancedMatching.ph = nPhone;
        if (mergedUser.firstName)
          advancedMatching.fn = mergedUser.firstName.trim().toLowerCase();
        if (mergedUser.lastName)
          advancedMatching.ln = mergedUser.lastName.trim().toLowerCase();
        if (mergedUser.externalId)
          advancedMatching.external_id = String(mergedUser.externalId);

        if (Object.keys(advancedMatching).length > 0) {
          window.fbq("init", activePid, advancedMatching);
        }
        window.fbq("track", eventName, customData, { eventID: eventId });

        // Send CAPI relay (server-side event)
        try {
          const capiUserData = {
            userAgent: window.navigator.userAgent,
            ip: clientIp,
          };
          // Only include PII if we have actual values
          if (nEmail) capiUserData.email = nEmail;
          if (nPhone) capiUserData.phone = nPhone;
          if (mergedUser.firstName) capiUserData.firstName = mergedUser.firstName;
          if (mergedUser.lastName) capiUserData.lastName = mergedUser.lastName;
          if (mergedUser.externalId)
            capiUserData.externalId = mergedUser.externalId;
          if (fbc) capiUserData.fbc = fbc;
          if (fbp) capiUserData.fbp = fbp;

          await axiosInstance.post("/marketing/track", {
            eventName,
            customData,
            eventSourceUrl: window.location.href,
            eventId,
            testEventCode: testCodeRef.current,
            userData: capiUserData,
          });
        } catch (err) {
          console.error(`[FB Pixel] CAPI ${eventName} failed:`, err);
        }
      };

      pixelInitialized.current = true;
      console.log("[FB Pixel] Initialized:", pixelId);
    };

    initPixel();
  }, [user]);

  // ── PageView on route change ────────────────────────────────────────────
  useEffect(() => {
    if (!window.fbq || !pixelIdRef.current) return;

    // Browser PageView
    window.fbq("track", "PageView");

    // CAPI PageView (no event_id — browser already handles dedup for PageView)
    const fbc = getCookie("_fbc");
    const fbp = getCookie("_fbp");

    const capiUserData = {
      userAgent: window.navigator.userAgent,
      ip: cachedIp,
    };
    if (fbc) capiUserData.fbc = fbc;
    if (fbp) capiUserData.fbp = fbp;

    axiosInstance
      .post("/marketing/track", {
        eventName: "PageView",
        customData: { page_title: document.title },
        eventSourceUrl: window.location.href,
        userData: capiUserData,
      })
      .catch(() => {});
  }, [pathname, searchParams, user]);

  return null;
}
