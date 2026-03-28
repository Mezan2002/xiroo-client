import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { useSelector, useDispatch } from "react-redux";
import { setNotifications, setUnreadCount, addNotification, markRead, markAllRead } from "@/redux/slices/notificationSlice";
import { useEffect, useCallback } from "react";

/** 
 * Senior Dev Hook: useNotifications
 * Synchronizes real-time socket events with the server-side registry.
 */
export const useNotifications = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useSelector((state) => state.auth);

  // 1. Registry Fetching (Server-side)
  const notificationsQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await axiosInstance.get("/notifications");
      return response.data;
    },
    enabled: isAuthenticated && !!token,
    onSuccess: (data) => {
      dispatch(setNotifications(data));
    },
  });

  const unreadCountQuery = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      const response = await axiosInstance.get("/notifications/unread-count");
      return response.data;
    },
    enabled: isAuthenticated && !!token,
    onSuccess: (data) => {
      dispatch(setUnreadCount(data));
    },
  });

  // 2. Technical Mutations: Synchronization
  const markAsReadMutation = useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.patch(`/notifications/mark-read/${id}`);
      return response.data;
    },
    onSuccess: (data, id) => {
      dispatch(markRead(id));
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.patch("/notifications/mark-all-read");
      return response.data;
    },
    onSuccess: () => {
      dispatch(markAllAsRead());
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  // Manual refresh pattern
  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }, [queryClient]);

  return {
    notifications: notificationsQuery.data || [],
    unreadCount: unreadCountQuery.data || 0,
    isLoading: notificationsQuery.isLoading || unreadCountQuery.isLoading,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    refresh,
  };
};
