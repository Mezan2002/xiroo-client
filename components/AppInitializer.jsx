"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hydrate } from "@/redux/slices/authSlice";
import { setCart } from "@/redux/slices/cartSlice";
import { setWishlist } from "@/redux/slices/wishlistSlice";
import { setRecentlyViewed } from "@/redux/slices/recentlyViewedSlice";
import { useSocket } from "@/context/SocketContext"; // Socket stays in context for now as a singleton
import { addNotification } from "@/redux/slices/notificationSlice";
import { addToast } from "@/redux/slices/toastSlice";
import { useNotifications } from "@/hooks/api/useNotifications";
import { useUser } from "@/hooks/api/useUser";
import { getFromStorage } from "@/lib/storage";

/** 
 * Senior Dev Component: AppInitializer
 * Manages the high-level application lifecycle, hydration, and real-time synchronization.
 * This replaces many logic-heavy Context Providers.
 */
export default function AppInitializer({ children }) {
  const dispatch = useDispatch();
  const { socket } = useSocket();
  const { user } = useUser();
  const { refresh: refreshNotifications } = useNotifications();

  // 1. Technical Hydration: Restore Session from Storage
  useEffect(() => {
    // Auth Hydration
    dispatch(hydrate());

    // Registry Hydration (Client-only)
    if (typeof window !== "undefined") {
      try {
        const cartData = getFromStorage("xiroo_cart_registry");
        if (cartData) dispatch(setCart(cartData));

        const wishlistData = getFromStorage("xiroo_wishlist_registry");
        if (wishlistData) dispatch(setWishlist(wishlistData));

        const recentData = getFromStorage("xiroo_recently_viewed");
        if (recentData) dispatch(setRecentlyViewed(recentData));
      } catch (error) {
        console.error("Critical Hydration Failure:", error);
      }
    }
  }, [dispatch]);

  // 2. Real-time Synchronization: Socket-to-Redux Bridge
  useEffect(() => {
    if (socket && user) {
      const channel = `notification:${user._id}`;
      
      const handleNotification = (notif) => {
        dispatch(addNotification(notif));
        
        // Global UX Trigger: Toast
        dispatch(addToast({ 
          message: `${notif.title}: ${notif.message}`, 
          type: "info" 
        }));
      };

      const handleGlobalUpdate = () => {
        refreshNotifications();
      };

      socket.on(channel, handleNotification);
      socket.on("global_notification_update", handleGlobalUpdate);

      return () => {
        socket.off(channel, handleNotification);
        socket.off("global_notification_update", handleGlobalUpdate);
      };
    }
  }, [socket, user, dispatch, refreshNotifications]);

  return <>{children}</>;
}
