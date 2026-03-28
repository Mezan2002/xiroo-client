"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hydrate } from "@/redux/slices/authSlice";
import { useSocket } from "@/context/SocketContext"; // Socket stays in context for now as a singleton
import { addNotification } from "@/redux/slices/notificationSlice";
import { addToast } from "@/redux/slices/toastSlice";
import { useNotifications } from "@/hooks/api/useNotifications";
import { useUser } from "@/hooks/api/useUser";

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
    dispatch(hydrate());
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
