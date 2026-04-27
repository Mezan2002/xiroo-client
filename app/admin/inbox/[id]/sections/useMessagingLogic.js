"use client";
import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/hooks/api/useAuth";
import { useInbox } from "@/hooks/api/useInbox";
import { useUsers } from "@/hooks/api/useUsers";
import { useToast } from "@/hooks/useToast";
import { useEffect, useRef, useState } from "react";

export const useMessagingLogic = (id) => {
  const { toast } = useToast();
  const {
    useConversation, sendMessage, assignConversation, flagConversation,
    setStatus, setPriority, markAsRead
  } = useInbox();

  const { data: conversation, isLoading, refetch } = useConversation(id);
  const { useAllUsers } = useUsers();
  const { data: adminRegistry = [] } = useAllUsers({ role: "admin" });
  const { socket } = useSocket();
  const { user: currentUser } = useAuth();

  const [reply, setReply] = useState("");
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [showAssignMenu, setShowAssignMenu] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const scrollRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const lastMarkedId = useRef(null);

  useEffect(() => {
    if (id && lastMarkedId.current !== id) {
      markAsRead.mutate(id);
      lastMarkedId.current = id;
    }
  }, [id, markAsRead]);

  useEffect(() => {
    if (!socket || !id) return;
    socket.emit("join_room", id);
    const onMsg = (d) => { if (String(d.conversationId) === String(id)) refetch(); };
    const onUpd = (d) => { if (!d?.conversationId || String(d.conversationId) === String(id)) refetch(); };
    socket.on("new_message", onMsg);
    socket.on("inbox_update", onUpd);
    return () => {
      socket.off("new_message", onMsg);
      socket.off("inbox_update", onUpd);
    };
  }, [socket, id, refetch]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [conversation?.messages?.length]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!reply.trim()) return;
    sendMessage.mutate({ content: reply, conversationId: id }, {
      onSuccess: () => setReply(""),
      onError: (err) => toast.error(err.message || "Failed to transmit message.")
    });
  };

  return {
    conversation, isLoading, currentUser, adminRegistry, reply, setReply,
    showPriorityMenu, setShowPriorityMenu, showAssignMenu, setShowAssignMenu,
    isInfoOpen, setIsInfoOpen, scrollRef, textareaRef, fileInputRef, handleSend,
    setStatus, setPriority, assignConversation, flagConversation
  };
};
