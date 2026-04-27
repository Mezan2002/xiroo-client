"use client";
import { useSocket } from "@/context/SocketContext";
import { useInbox } from "@/hooks/api/useInbox";
import { useEffect, useState } from "react";

export const useInboxLogic = () => {
  const [filter, setFilter] = useState("All");
  const { useConversations } = useInbox();
  const { socket } = useSocket();

  const { data: conversations, isLoading, refetch } = useConversations(
    filter === "flagged" ? { isFlagged: "true" } : filter !== "All" ? { status: filter } : {}
  );

  useEffect(() => {
    if (socket) {
      socket.on("inbox_update", () => refetch());
      socket.on("new_message", () => refetch());
      return () => {
        socket.off("inbox_update");
        socket.off("new_message");
      };
    }
  }, [socket, refetch]);

  return { conversations, isLoading, filter, setFilter, refetch };
};
