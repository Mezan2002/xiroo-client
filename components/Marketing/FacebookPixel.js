"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { useUser } from "@/hooks/api/useUser";

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

export function getCachedUserData() {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("xiroo_user_context") || getCookie("_xiroo_user_context");
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return {};
}

export function saveCustomerContext(userData) {
  if (typeof window === "undefined" || !userData) return;
  try {
    const existing = getCachedUserData();
    const merged = { ...existing, ...userData };
    const cleaned = Object.fromEntries(Object.entries(merged).filter(([_, v]) => !!v));
    if (Object.keys(cleaned).length > 0) {
      const json = JSON.stringify(cleaned);
      localStorage.setItem("xiroo_user_context", json);
      setCookie("_xiroo_user_context", json, 30);
    }
  } catch (_) {}
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
  const { user } = useUser();

  const loggedInUserData = user
    ? {
        email: user.email || "",
        phone: user.phoneNumber || user.phone || "",
        firstName: user.firstName || user.name?.split(" ")[0] || "",
        lastName: user.lastName || user.name?.split(" ").slice(1).join(" ") || "",
        externalId: user._id || user.id || "",
        city: user.addresses?.[0]?.city || "",
        state: user.addresses?.[0]?.state || "",
        zip: user.addresses?.[0]?.postalCode || "",
        country: user.addresses?.[0]?.country || "",
      }
    : {};

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Cache client IP early for CAPI events
    fetchClientIp();

    window.trackFacebookEvent = async (eventName, customData = {}, userData = {}, overrideEventId = null) => {
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

        const initialUser = {
          ...getCachedUserData(),
          ...loggedInUserData,
        };

        const initialAdvanced = {};
        if (initialUser.email) initialAdvanced.em = normalizeEmail(initialUser.email);
        if (initialUser.phone) initialAdvanced.ph = normalizePhone(initialUser.phone);
        if (initialUser.firstName) initialAdvanced.fn = initialUser.firstName.trim().toLowerCase();
        if (initialUser.lastName) initialAdvanced.ln = initialUser.lastName.trim().toLowerCase();
        if (initialUser.externalId) initialAdvanced.external_id = String(initialUser.externalId);

        if (Object.keys(initialAdvanced).length > 0) {
          window.fbq("init", pixelId, initialAdvanced);
        } else {
          window.fbq("init", pixelId);
        }

        window.fbq("track", "PageView");

        window.trackFacebookEvent = async (eventName, customData = {}, userData = {}, overrideEventId = null) => {
          const cachedUser = getCachedUserData();
          const activeUser = {
            ...cachedUser,
            ...loggedInUserData,
            ...userData,
          };

          if (Object.keys(userData).length > 0) {
            saveCustomerContext(userData);
          }

          const eventId = overrideEventId || "event_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();
          const fbc = getCookie("_fbc");
          const fbp = getCookie("_fbp");
          const clientIp = cachedIp || await fetchClientIp();

          const normalizedEmail = normalizeEmail(activeUser.email);
          const normalizedPhone = normalizePhone(activeUser.phone);

          if (window.fbq) {
            const advancedMatching = {};
            if (normalizedEmail) advancedMatching.em = normalizedEmail;
            if (normalizedPhone) advancedMatching.ph = normalizedPhone;
            if (activeUser.firstName) advancedMatching.fn = activeUser.firstName.trim().toLowerCase();
            if (activeUser.lastName) advancedMatching.ln = activeUser.lastName.trim().toLowerCase();
            if (activeUser.externalId) advancedMatching.external_id = String(activeUser.externalId);
            if (activeUser.city) advancedMatching.ct = activeUser.city.trim().toLowerCase().replace(/[\s\-\.]/g, "");
            if (activeUser.state) advancedMatching.st = activeUser.state.trim().toLowerCase();
            if (activeUser.zip) advancedMatching.zp = String(activeUser.zip).trim();
            if (activeUser.country) advancedMatching.country = activeUser.country.trim().toLowerCase();

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
                firstName: activeUser.firstName || '',
                lastName: activeUser.lastName || '',
                externalId: activeUser.externalId || '',
                city: activeUser.city || '',
                state: activeUser.state || '',
                zip: activeUser.zip || '',
                country: activeUser.country || '',
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
  }, [user]);

  useEffect(() => {
    if (window.fbq) {
      window.fbq("track", "PageView");
      try {
        const activeUser = {
          ...getCachedUserData(),
          ...loggedInUserData,
        };
        const fbc = getCookie("_fbc");
        const fbp = getCookie("_fbp");
        axiosInstance.post("/marketing/track", {
          eventName: "PageView",
          customData: { page_title: document.title },
          eventSourceUrl: window.location.href,
          eventId: "pv_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now(),
          userData: {
            email: normalizeEmail(activeUser.email),
            phone: normalizePhone(activeUser.phone),
            firstName: activeUser.firstName || '',
            lastName: activeUser.lastName || '',
            externalId: activeUser.externalId || '',
            city: activeUser.city || '',
            state: activeUser.state || '',
            zip: activeUser.zip || '',
            country: activeUser.country || '',
            userAgent: window.navigator.userAgent,
            ip: cachedIp,
            fbc,
            fbp,
          },
        });
      } catch (_) {}
    }
  }, [pathname, searchParams, user]);

  return null;
}
