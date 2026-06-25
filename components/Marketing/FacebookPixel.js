"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import axiosInstance from "@/lib/axios";

export default function FacebookPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Define a fallback stub immediately to prevent "undefined" errors
    window.trackFacebookEvent = async (eventName, customData = {}) => {
      console.warn("Facebook Tracking not yet initialized for:", eventName);
    };

    const initPixel = async () => {
      let pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
      let testCode = "";
      let isEnabled = !!pixelId;

      try {
        // Fetch from server if not in ENV or to get additional settings (like Test Code)
        const { data } = await axiosInstance.get("/marketing");
        // Axios response interceptor returns response.data, which is already the settings object
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
        // Standard Facebook Pixel initialization
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

        // Provide a robust global wrapper
        window.trackFacebookEvent = async (eventName, customData = {}, userData = {}) => {
          // Generate a unique event ID for deduplication between Pixel and CAPI
          const eventId = "event_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();

          // 1. Track via Browser (Pixel) with Advanced Matching
          if (window.fbq) {
            // Build advanced matching user data object
            const advancedMatching = {};
            if (userData.email) advancedMatching.em = userData.email;
            if (userData.phone) advancedMatching.ph = userData.phone;
            if (userData.firstName) advancedMatching.fn = userData.firstName;
            if (userData.lastName) advancedMatching.ln = userData.lastName;
            if (userData.externalId) advancedMatching.external_id = userData.externalId;

            // Re-initialize pixel with user data for Advanced Matching
            if (Object.keys(advancedMatching).length > 0) {
              window.fbq("init", pixelId, advancedMatching);
            }
            window.fbq("track", eventName, customData, { event_id: eventId });
          }

          // 2. Track via Server (CAPI)
          try {
            await axiosInstance.post("/marketing/track", {
              eventName,
              customData,
              eventSourceUrl: window.location.href,
              eventId, // Pass for deduplication
              testEventCode: testCode, // For testing in Events Manager
              userData: {
                email: userData.email || '',
                phone: userData.phone || '',
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                userAgent: window.navigator.userAgent,
                ip: userData.ip || '',
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
    }
  }, [pathname, searchParams]);

  return null;
}
