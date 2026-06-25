"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import axiosInstance from "@/lib/axios";

function getCookie(name) {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : "";
}

function setCookie(name, value, days = 7) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

/**
 * Meta best practice: Extract fbclid from URL and manually create _fbc cookie.
 * Meta's pixel script usually does this, but this is a fallback to guarantee coverage.
 * Format: fb.${subdomain_index}.${creation_time}.${fbclid}
 */
function ensureFbcFromUrl() {
  if (typeof window === "undefined") return;
  const existing = getCookie("_fbc");
  if (existing) return;

  const params = new URLSearchParams(window.location.search);
  const fbclid = params.get("fbclid");
  if (!fbclid) return;

  const subdomainIndex = window.location.hostname === "www." ? 1 : 0;
  const creationTime = Math.floor(Date.now() / 1000);
  const fbcValue = `fb.${subdomainIndex}.${creationTime}.${fbclid}`;
  setCookie("_fbc", fbcValue);
}

function normalizeEmail(email) {
  if (!email) return "";
  return email.trim().toLowerCase();
}

function normalizePhone(phone) {
  if (!phone) return "";
  return phone.replace(/[\s\-\(\)]/g, "");
}

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

export default function FacebookPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Meta best practice: capture fbc from URL + IP early on landing page
    ensureFbcFromUrl();
    fetchClientIp();

    window.trackFacebookEvent = async (eventName, customData = {}) => {
      console.warn("Facebook Tracking not yet initialized for:", eventName);
    };

    const initPixel = async () => {
      let pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
      let testCode = "";
      let isEnabled = !!pixelId;

      try {
        const { data } = await axiosInstance.get("/marketing");
        const settings = data;
        
        if (settings) {
          if (!pixelId) {
            pixelId = settings.pixelId;
            isEnabled = settings.isEnabled;
          }
          testCode = settings.testEventCode || "";
        }
      } catch (error) {
        console.warn("Failed to fetch marketing settings from server, falling back to client env:", error);
      }

      if (!pixelId || !isEnabled) {
        return;
      }

      try {
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
          "https://connect.facebook.net/en_US/fbevents.js",
        );

        window.fbq("init", pixelId);
        window.fbq("track", "PageView");

        window.trackFacebookEvent = async (eventName, customData = {}, userData = {}) => {
          const eventId = "event_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();
          const fbc = getCookie("_fbc");
          const fbp = getCookie("_fbp");
          const clientIp = cachedIp || await fetchClientIp();

          const normalizedEmail = normalizeEmail(userData.email);
          const normalizedPhone = normalizePhone(userData.phone);

          if (window.fbq) {
            const advancedMatching = {};
            if (normalizedEmail) advancedMatching.em = normalizedEmail;
            if (normalizedPhone) advancedMatching.ph = normalizedPhone;
            if (userData.firstName) advancedMatching.fn = userData.firstName;
            if (userData.lastName) advancedMatching.ln = userData.lastName;
            if (userData.externalId) advancedMatching.external_id = userData.externalId;

            if (Object.keys(advancedMatching).length > 0) {
              window.fbq("init", pixelId, advancedMatching);
            }
            window.fbq("track", eventName, customData, { event_id: eventId });
          }

          try {
            await axiosInstance.post("/marketing/track", {
              eventName,
              customData,
              eventSourceUrl: window.location.href,
              eventId,
              testEventCode: testCode,
              userData: {
                email: normalizedEmail,
                phone: normalizedPhone,
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                userAgent: window.navigator.userAgent,
                ip: clientIp,
                fbc,
                fbp,
              },
            });
          } catch (error) {
            console.error("Failed to track CAPI event:", error);
          }
        };
      } catch (error) {
        console.error("Failed to initialize Facebook Pixel script:", error);
      }
    };

    initPixel();
  }, []);

  useEffect(() => {
    if (window.fbq) {
      window.fbq("track", "PageView");
      try {
        const fbc = getCookie("_fbc");
        const fbp = getCookie("_fbp");
        axiosInstance.post("/marketing/track", {
          eventName: "PageView",
          customData: { page_title: document.title },
          eventSourceUrl: window.location.href,
          eventId: "pv_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now(),
          userData: { email: "", phone: "", userAgent: window.navigator.userAgent, ip: cachedIp, fbc, fbp },
        });
      } catch (_) {}
    }
  }, [pathname, searchParams]);

  return null;
}
