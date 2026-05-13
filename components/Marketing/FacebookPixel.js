"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import axiosInstance from "@/lib/axios";

export default function FacebookPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const initPixel = async () => {
      try {
        let pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
        let isEnabled = !!pixelId;

        if (!pixelId) {
          const { data } = await axiosInstance.get("/marketing");
          const settings = data?.data;
          pixelId = settings?.pixelId;
          isEnabled = settings?.isEnabled;
        }

        if (!pixelId || !isEnabled) {
          return;
        }

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

        // Provide a global wrapper for other components to use
        window.trackFacebookEvent = async (eventName, customData = {}) => {
          // 1. Track via Browser (Pixel)
          window.fbq("track", eventName, customData);

          // 2. Track via Server (CAPI)
          try {
            await axiosInstance.post("/marketing/track", {
              eventName,
              customData,
              eventSourceUrl: window.location.href,
              userData: {
                // Basic user data if available (e.g. from a global auth state)
                // You can expand this as needed
              },
            });
          } catch (error) {
            console.error("Failed to track CAPI event:", error);
          }
        };
      } catch (error) {
        console.error("Failed to initialize Facebook Pixel:", error);
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
