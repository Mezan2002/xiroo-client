"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useNotifications } from "@/hooks/api/useNotifications";
import { useSocket } from "@/context/SocketContext";
import { useUser } from "@/hooks/api/useUser";
import { useInbox } from "@/hooks/api/useInbox";

export const useAdminSidebar = (onClose) => {
  const pathname = usePathname();
  const { unreadCount } = useNotifications();
  const notificationUnread = typeof unreadCount === "object" ? unreadCount?.unreadCount || 0 : unreadCount || 0;
  const { user } = useUser();
  const { socket } = useSocket();
  const { useConversations } = useInbox();
  const { data: conversations, refetch: refetchInbox } = useConversations({ status: "active" });

  useEffect(() => {
    if (socket) {
      const handleUpdate = () => refetchInbox();
      socket.on("inbox_update", handleUpdate);
      socket.on("new_message", handleUpdate);
      return () => {
        socket.off("inbox_update", handleUpdate);
        socket.off("new_message", handleUpdate);
      };
    }
  }, [socket, refetchInbox]);

  useEffect(() => { onClose?.(); }, [pathname]);

  const inboxUnread = conversations?.reduce((acc, conv) => acc + (conv.unreadCount?.[user?._id] || 0), 0) || 0;

  const handleOpenSearch = () => {
    window.dispatchEvent(new CustomEvent("open-admin-search"));
    onClose?.();
  };

  return { pathname, notificationUnread, inboxUnread, handleOpenSearch };
};
