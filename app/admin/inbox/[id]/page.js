"use client";
import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/hooks/api/useAuth";
import { useInbox } from "@/hooks/api/useInbox";
import { useUsers } from "@/hooks/api/useUsers";
import { useToast } from "@/hooks/useToast";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Flag,
  Loader2,
  Paperclip,
  RotateCcw,
  Send,
  Shield,
  UserCheck,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const PRIORITY_OPTIONS = ["low", "medium", "high", "urgent"];

const PRIORITY_STYLES = {
  low: {
    pill: "bg-emerald-50 text-emerald-700 border-emerald-100",
    dot: "bg-emerald-500",
  },
  medium: {
    pill: "bg-zinc-50 text-zinc-600 border-zinc-100",
    dot: "bg-zinc-400",
  },
  high: {
    pill: "bg-orange-50 text-orange-700 border-orange-100",
    dot: "bg-orange-500",
  },
  urgent: { pill: "bg-red-50 text-red-700 border-red-100", dot: "bg-red-500" },
};

export default function MessagingTerminal() {
  const router = useRouter();
  const { id } = useParams();
  const { toast } = useToast();

  const {
    useConversation,
    sendMessage,
    assignConversation,
    flagConversation,
    setStatus,
    setPriority,
    markAsRead,
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
    const onMsg = (d) => {
      if (String(d.conversationId) === String(id)) refetch();
    };
    const onUpd = (d) => {
      if (!d?.conversationId || String(d.conversationId) === String(id))
        refetch();
    };
    socket.on("new_message", onMsg);
    socket.on("inbox_update", onUpd);
    return () => {
      socket.off("new_message", onMsg);
      socket.off("inbox_update", onUpd);
    };
  }, [socket, id, refetch]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [reply]);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [conversation?.messages?.length]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!reply.trim()) return;
    sendMessage.mutate(
      { content: reply, conversationId: id },
      {
        onSuccess: () => {
          setReply("");
        },
        onError: (err) => {
          toast.error(err.message || "Failed to transmit message.");
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-zinc-300" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
          Synchronizing...
        </p>
      </div>
    );
  }

  const customer =
    conversation?.customer ||
    conversation?.participants?.find((p) => p.role === "customer") ||
    conversation?.participants?.[0] ||
    {};

  const isResolved = conversation?.status === "resolved";
  const priority = conversation?.priority || "medium";
  const ps = PRIORITY_STYLES[priority] || PRIORITY_STYLES.medium;

  return (
    <div className="fixed inset-0 top-0 left-0 lg:left-64 flex overflow-hidden bg-white font-montserrat antialiased z-50">
      {/* ══ Main Column ═══════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-zinc-100 h-full">
        {/* Header */}
        <header className="h-[64px] md:h-[72px] shrink-0 px-4 md:px-8 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-zinc-100">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 rounded-none text-zinc-400 hover:bg-zinc-50 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-none bg-zinc-900 text-white flex items-center justify-center font-bold text-xs md:text-sm shadow-sm uppercase shrink-0">
                {customer.firstName?.[0] || "?"}
              </div>
              <div>
                <h1 className="text-[13px] md:text-[15px] font-semibold text-zinc-900 leading-tight truncate max-w-[120px] sm:max-w-none">
                  {customer.firstName} {customer.lastName}
                </h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-none bg-emerald-500" />
                  <span className="text-[10px] font-medium text-emerald-600 uppercase tracking-wider">
                    Online
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <span className="hidden sm:inline-block text-[11px] font-medium text-zinc-500 uppercase tracking-widest px-3 py-1 border border-zinc-200 rounded-none">
              Case #{conversation?._id?.slice(-6).toUpperCase()}
            </span>
            <div className="hidden sm:block w-px h-6 bg-zinc-200 mx-2" />
            <button
              onClick={() => setIsInfoOpen(!isInfoOpen)}
              className="lg:hidden p-2 text-zinc-400 hover:bg-zinc-50 transition-colors"
              title="Toggle Info"
            >
              <Shield size={20} />
            </button>
            <button
              onClick={() =>
                setStatus.mutate({
                  id,
                  status: isResolved ? "active" : "resolved",
                })
              }
              disabled={setStatus.isPending}
              className={`h-9 px-5 rounded-none text-[11px] font-semibold tracking-wide transition-all ${
                isResolved
                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  : "bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-200"
              }`}
            >
              {setStatus.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : isResolved ? (
                <RotateCcw size={16} className="md:hidden" />
              ) : (
                <CheckCircle2 size={16} className="md:hidden" />
              )}
              <span className="hidden md:inline">
                {isResolved ? "Reopen Case" : "Resolve Case"}
              </span>
            </button>
          </div>
        </header>

        {/* Messaging Area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 md:px-10 py-6 md:py-10 space-y-6 md:space-y-8 bg-white custom-scrollbar"
        >
          <div className="flex justify-center mb-4">
            <span className="text-[11px] font-medium text-zinc-600 bg-zinc-50 px-3 py-1 rounded-none border border-zinc-200">
              Inquiry started on{" "}
              {new Date(conversation?.createdAt).toLocaleDateString([], {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          {conversation?.messages?.map((msg, idx) => {
            const isAdminMsg = msg.senderRole === "admin";
            const isMe =
              String(msg.sender?._id || msg.sender) ===
              String(currentUser?._id);

            return (
              <div
                key={msg._id || idx}
                className={`flex ${isMe ? "justify-end" : "justify-start"} animate-in fade-in duration-500 px-2 sm:px-0`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] flex flex-col ${isMe ? "items-end" : "items-start"} gap-1.5`}
                >
                  <div
                    className={`px-5 py-3.5 rounded-none text-[14px] leading-relaxed tracking-tight ${
                      isMe
                        ? "bg-zinc-900 text-white rounded-none shadow-lg shadow-zinc-200"
                        : "bg-zinc-100 text-zinc-800 border border-zinc-200/50 rounded-none"
                    }`}
                  >
                    {msg.content && (
                      <p className="whitespace-pre-wrap font-medium">
                        {msg.content}
                      </p>
                    )}

                    {msg.attachments?.map((at, i) => (
                      <div key={i} className="mt-3">
                        {at.type?.startsWith("image") ? (
                          <Image
                            src={at.url}
                            alt="Attachment"
                            width={500}
                            height={500}
                            className="max-w-full rounded-none border border-zinc-200/50"
                          />
                        ) : (
                          <a
                            href={at.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-3 p-3 rounded-none bg-zinc-800/50 border border-zinc-700/30 text-white hover:bg-zinc-700/50 transition-all"
                          >
                            <Paperclip size={14} />
                            <div className="text-left">
                              <p className="text-[11px] font-semibold truncate max-w-[150px]">
                                {at.name}
                              </p>
                              <p className="text-[9px] opacity-40 uppercase tracking-widest">
                                {(at.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 px-1 opacity-70">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-900">
                      {isAdminMsg
                        ? isMe
                          ? "You"
                          : msg.sender?.firstName || "Admin"
                        : customer.firstName}
                    </span>
                    <span className="text-[14px] leading-none text-zinc-400 pb-0.5">
                      ·
                    </span>
                    <span className="text-[10px] font-semibold tracking-wide text-zinc-600">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer / Input */}
        <footer className="p-6 bg-white border-t border-zinc-100 shrink-0">
          {isResolved ? (
            <div className="flex items-center justify-center h-14 bg-emerald-50 text-emerald-700 text-[12px] font-semibold rounded-none gap-2 border border-emerald-100">
              <CheckCircle2 size={16} /> This conversation was resolved. Reopen
              to continue.
            </div>
          ) : (
            <form
              onSubmit={handleSend}
              className="flex items-end gap-3 max-w-5xl mx-auto"
            >
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 md:p-3 rounded-none text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 transition-all mb-0.5 shrink-0"
              >
                <Paperclip size={20} className="md:size-[22px]" />
              </button>
              <input ref={fileInputRef} type="file" hidden multiple />

              <div className="flex-1 bg-zinc-50 border border-zinc-100 rounded-none focus-within:bg-white focus-within:border-zinc-300 focus-within:shadow-xl focus-within:shadow-zinc-100/50 transition-all px-2 md:px-4 py-1">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type your response…"
                  disabled={sendMessage.isPending}
                  className="w-full bg-transparent px-2 py-4 text-[14px] text-zinc-800 placeholder:text-zinc-400 outline-none resize-none max-h-[160px] leading-relaxed font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={!reply.trim() || sendMessage.isPending}
                className="h-12 w-12 md:h-14 md:w-14 flex items-center justify-center rounded-none transition-all shadow-xl shadow-zinc-200/50 mb-0.5 shrink-0
                  enabled:bg-zinc-900 enabled:text-white enabled:hover:bg-zinc-700 enabled:hover:scale-105 active:scale-95
                  disabled:bg-zinc-100 disabled:text-zinc-300"
              >
                {sendMessage.isPending ? (
                  <Loader2 className="w-[18px] h-[18px] md:w-5 md:h-5 animate-spin" />
                ) : (
                  <Send className="w-[18px] h-[18px] md:w-5 md:h-5 ml-0.5" />
                )}
              </button>
            </form>
          )}
        </footer>
      </div>

      {/* ══ Sidebar / Drawer Overlay ═══════════════════════════════════════════════════ */}
      {/* Mobile Backdrop */}
      {isInfoOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm transition-all animate-in fade-in duration-300"
          onClick={() => setIsInfoOpen(false)}
        />
      )}

      <aside
        className={`
         fixed lg:relative inset-y-0 right-0 w-[300px] sm:w-[320px] bg-white z-[70] lg:z-0
         transform lg:transform-none transition-transform duration-500 ease-in-out border-l border-zinc-100
         flex flex-col overflow-y-auto custom-scrollbar shadow-2xl lg:shadow-none
         ${isInfoOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
       `}
      >
        {/* User Card */}
        <div className="p-8 text-center bg-zinc-50/50 border-b border-zinc-100">
          <div className="w-20 h-20 rounded-none bg-white border border-zinc-100 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-zinc-200/50 font-bold text-2xl text-zinc-900 uppercase">
            {customer.firstName?.[0] || "?"}
          </div>
          <h2 className="text-[17px] font-bold text-zinc-900 tracking-tight">
            {customer.firstName} {customer.lastName}
          </h2>
          <p className="text-[12px] text-zinc-600 mt-1.5 font-semibold truncate px-4">
            {customer.email}
          </p>
          <div className="mt-6 flex flex-col gap-2.5 px-4 w-full">
            <div className="flex justify-between items-center text-[11px] font-medium text-zinc-500 py-1.5 border-b border-zinc-50">
              <span className="uppercase tracking-widest text-[9px]">
                Joined
              </span>
              <span className="text-zinc-900">
                {customer?.createdAt
                  ? new Date(customer.createdAt).toLocaleDateString([], {
                      month: "short",
                      year: "numeric",
                    })
                  : "Mar 2024"}
              </span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-medium text-zinc-500 py-1.5 border-b border-zinc-50">
              <span className="uppercase tracking-widest text-[9px]">
                Total Orders
              </span>
              <span className="text-zinc-900 font-bold">12</span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-medium text-zinc-500 py-1.5 border-b border-zinc-50">
              <span className="uppercase tracking-widest text-[9px]">
                Account
              </span>
              <span className="text-emerald-600 font-bold">Verified</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 w-full px-4">
            <button className="h-11 w-full text-[11px] font-bold text-white bg-black rounded-none hover:bg-zinc-800 transition-all uppercase tracking-widest">
              View Profile
            </button>
          </div>
        </div>

        {/* Management Controls */}
        <div className="p-8 space-y-10">
          <div className="space-y-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
              Case Management
            </p>
            <div className="space-y-3">
              {/* Priority Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowPriorityMenu(!showPriorityMenu);
                    setShowAssignMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-5 h-12 rounded-none border transition-all text-[12px] font-semibold tracking-wide ${ps.pill}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-none ${ps.dot} shadow-sm`}
                    />
                    <span className="capitalize">{priority} Priority</span>
                  </div>
                  <ChevronDown
                    size={14}
                    className={`opacity-40 transition-transform ${showPriorityMenu ? "rotate-180" : ""}`}
                  />
                </button>
                {showPriorityMenu && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-zinc-100 shadow-[0_20px_40px_rgba(0,0,0,0.06)] rounded-none z-30 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    {PRIORITY_OPTIONS.map((p) => (
                      <button
                        key={p}
                        onClick={() => {
                          setPriority.mutate({ id, priority: p });
                          setShowPriorityMenu(false);
                        }}
                        className="w-full text-left px-5 py-2.5 text-[12px] font-medium text-zinc-700 hover:bg-zinc-50 transition-colors flex items-center gap-3"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-none ${PRIORITY_STYLES[p]?.dot}`}
                        />
                        <span className="capitalize">{p}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Assignment Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowAssignMenu(!showAssignMenu);
                    setShowPriorityMenu(false);
                  }}
                  className="w-full flex items-center justify-between px-5 h-12 rounded-none border border-zinc-100 bg-white hover:border-zinc-300 transition-all text-[12px] font-semibold text-zinc-700"
                >
                  <div className="flex items-center gap-3 text-zinc-400">
                    <UserCheck size={16} />
                    <span className="truncate text-zinc-700">
                      {conversation?.assignedTo
                        ? `${conversation.assignedTo.firstName}`
                        : "Unassigned"}
                    </span>
                  </div>
                  <ChevronDown
                    size={14}
                    className={`opacity-40 transition-transform ${showAssignMenu ? "rotate-180" : ""}`}
                  />
                </button>
                {showAssignMenu && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-zinc-100 shadow-[0_20px_40px_rgba(0,0,0,0.06)] rounded-none z-30 py-2 max-h-56 overflow-y-auto animate-in fade-in slide-in-from-top-2 custom-scrollbar">
                    {adminRegistry.map((admin) => (
                      <button
                        key={admin._id}
                        onClick={() => {
                          assignConversation.mutate({
                            id,
                            assignedTo: admin._id,
                          });
                          setShowAssignMenu(false);
                        }}
                        className="w-full text-left px-5 py-2.5 text-[12px] font-medium text-zinc-700 hover:bg-zinc-50 transition-colors flex items-center gap-3"
                      >
                        <div className="w-6 h-6 rounded-none bg-zinc-100 text-zinc-700 flex items-center justify-center text-[10px] font-bold">
                          {admin.firstName?.[0]}
                        </div>
                        {admin.firstName} {admin.lastName}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Flag Toggle */}
              <button
                onClick={() => flagConversation.mutate(id)}
                className={`w-full flex items-center gap-3 px-5 h-12 rounded-none border transition-all text-[12px] font-semibold ${
                  conversation?.isFlagged
                    ? "bg-blue-50 border-blue-100 text-blue-700 shadow-sm"
                    : "bg-white border-zinc-100 text-zinc-600 hover:border-zinc-300"
                }`}
              >
                <Flag
                  size={15}
                  className={
                    conversation?.isFlagged ? "text-blue-600" : "text-zinc-300"
                  }
                />
                <span>
                  {conversation?.isFlagged ? "Under Review" : "Mark for Review"}
                </span>
              </button>
            </div>
          </div>

          <div className="space-y-6 pt-8 border-t border-zinc-50">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
              Case Registry
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[11px] font-medium text-zinc-500 py-1.5 border-b border-zinc-50">
                <span className="uppercase tracking-widest text-[9px]">
                  Status
                </span>
                <span
                  className={`flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] ${isResolved ? "text-emerald-600" : "text-amber-600"}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-none ${isResolved ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`}
                  />
                  {isResolved ? "Resolved" : "Open"}
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px] font-medium text-zinc-500 py-1.5 border-b border-zinc-50">
                <span className="uppercase tracking-widest text-[9px]">
                  Created
                </span>
                <span className="text-zinc-900">
                  {conversation?.createdAt
                    ? new Date(conversation.createdAt).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px] font-medium text-zinc-500 py-1.5 border-b border-zinc-50">
                <span className="uppercase tracking-widest text-[9px]">
                  Channel
                </span>
                <span className="text-zinc-900 font-bold uppercase tracking-tighter text-[10px]">
                  Direct Support
                </span>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          {conversation?.activityLog?.length > 0 && (
            <div className="space-y-6 pt-8 border-t border-zinc-50">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
                Activity History
              </p>
              <div className="space-y-4 pr-2">
                {[...conversation.activityLog].reverse().map((entry, i) => (
                  <div key={i} className="flex gap-4 items-start group">
                    <div className="w-8 h-8 rounded-none bg-zinc-50 border border-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-500 group-hover:bg-zinc-900 group-hover:text-white transition-all shrink-0">
                      {entry.actor?.firstName?.[0] || "A"}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex justify-between items-center bg-transparent">
                        <span className="text-[11px] font-bold text-zinc-800">
                          {entry.actor?.firstName || "System"}
                        </span>
                        <span className="text-[9px] font-semibold text-zinc-500">
                          {new Date(entry.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 font-bold capitalize mt-0.5">
                        {entry.action?.replace(/_/g, " ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Footer */}
          <div className="pt-8 border-t border-zinc-50 flex flex-col items-center opacity-70">
            <div className="w-12 h-12 rounded-none bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 mb-4">
              <Shield size={20} />
            </div>
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-600">
              Secure Protocol v2.0
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
