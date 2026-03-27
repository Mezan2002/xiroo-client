"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSocket } from "./SocketContext";
import { useUser } from "./UserContext";
import { useToast } from "./ToastContext";
import { apiRequest } from "@/lib/api";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { socket } = useSocket();
  const { user } = useUser();
  const { toast } = useToast();

  const fetchStatus = useCallback(async () => {
    if (!user) return;
    try {
      const [{ data: notifs }, { data: count }] = await Promise.all([
        apiRequest('/notifications'),
        apiRequest('/notifications/unread-count')
      ]);
      setNotifications(notifs);
      setUnreadCount(count);
    } catch (err) {
      console.error('--- Notification Sync Error ---', err);
    }
  }, [user]);

  useEffect(() => {
    const initSync = async () => {
      await fetchStatus();
    };
    initSync();
  }, [fetchStatus]);

  useEffect(() => {
    if (socket && user) {
      const channel = `notification:${user._id}`;
      
      const handleNotification = (notif) => {
        setNotifications(prev => [notif, ...prev].slice(0, 50));
        setUnreadCount(prev => prev + 1);
        
        // Global Toast Trigger
        toast.info(notif.title + ": " + notif.message);
      };

      const handleGlobalUpdate = () => {
        fetchStatus();
      };

      socket.on(channel, handleNotification);
      socket.on('global_notification_update', handleGlobalUpdate);

      return () => {
        socket.off(channel, handleNotification);
        socket.off('global_notification_update', handleGlobalUpdate);
      };
    }
  }, [socket, user, toast, fetchStatus]);

  const markAsRead = async (id) => {
    try {
      await apiRequest(`/notifications/mark-read/${id}`, { method: 'PATCH' });
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('--- Notification Action Failed ---', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiRequest('/notifications/mark-all-read', { method: 'PATCH' });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('--- Notification Action Failed ---', err);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, refresh: fetchStatus }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
