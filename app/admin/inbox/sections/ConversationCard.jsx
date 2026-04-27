"use client";
import { useInbox } from "@/hooks/api/useInbox";
import { CheckCircle2, ExternalLink, Flag, Loader2, RotateCcw, Trash2 } from "lucide-react";

const PRIORITY_COLORS = {
  low: "bg-blue-100 text-blue-700",
  medium: "bg-gray-100 text-gray-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700 shadow-sm",
};

export default function ConversationCard({ conv, onOpen, onRefetch }) {
  const { setStatus, deleteConversation } = useInbox();

  const customer = conv.customer || conv.participants?.find((p) => p.role === "customer") || conv.participants?.[0] || {};
  const unreadCount = customer._id ? conv.unreadCount?.[customer._id] || 0 : 0;
  const isUnread = unreadCount > 0;
  const isResolved = conv.status === "resolved";

  const displayTime = isUnread
    ? new Date(conv.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : new Date(conv.updatedAt).toLocaleDateString([], { month: "short", day: "numeric" });

  const handleResolveToggle = (e) => {
    e.stopPropagation();
    setStatus.mutate({ id: conv._id, status: isResolved ? "active" : "resolved" }, { onSuccess: onRefetch });
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (!confirm("Permanently delete this conversation?")) return;
    deleteConversation.mutate(conv._id, { onSuccess: onRefetch });
  };

  return (
    <div
      onClick={onOpen}
      className={`flex items-center gap-4 sm:gap-6 p-4 sm:p-6 transition-all group relative cursor-pointer ${isResolved ? "bg-green-50 hover:bg-green-100/60" : isUnread ? "bg-white" : "bg-white opacity-60 hover:opacity-100"}`}
    >
      <div className="relative shrink-0">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black text-white flex items-center justify-center font-bold text-[11px] sm:text-[13px] uppercase">
          {customer.firstName?.[0] || "C"}
        </div>
        {isUnread ? (
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-black border-2 border-white flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white animate-pulse" />
          </div>
        ) : conv.status === "active" ? (
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
        ) : null}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#37352F60]">{customer.firstName} {customer.lastName}</span>
          <span className="text-[10px] text-[#37352F20]">•</span>
          <span className="text-[10px] font-bold text-[#37352F60]">{displayTime}</span>
          {conv.priority && (
            <span className={`text-[8px] px-2 py-0.5 font-bold uppercase tracking-widest ${PRIORITY_COLORS[conv.priority]} ml-2`}>{conv.priority}</span>
          )}
        </div>
        <h3 className={`text-[14px] truncate ${isUnread ? "font-bold text-black" : "font-medium text-[#37352F]"}`}>
          {conv.lastMessage?.content || "Starting inquiry..."}
        </h3>
        <div className="flex items-center gap-3">
          <p className="text-[10px] text-[#37352FA6] font-bold uppercase tracking-widest">ID: {conv._id?.slice(-8).toUpperCase()} • {conv.status}</p>
          {conv.assignedTo && (
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-zinc-100 flex items-center justify-center text-[8px] font-bold uppercase">{conv.assignedTo.firstName?.[0]}</div>
              <span className="text-[10px] text-[#37352FA6] font-bold uppercase">{conv.assignedTo.firstName}</span>
            </div>
          )}
          {conv.isFlagged && <Flag size={12} className="text-blue-500" />}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all" onClick={(e) => e.stopPropagation()}>
        <button onClick={onOpen} className="w-9 h-9 flex items-center justify-center text-[#37352F60] hover:text-black hover:bg-[#F7F7F5] transition-all"><ExternalLink size={16} /></button>
        <button onClick={handleResolveToggle} disabled={setStatus.isPending} className={`w-9 h-9 flex items-center justify-center transition-all ${isResolved ? "text-green-600 hover:bg-green-100" : "text-[#37352F60] hover:text-green-600 hover:bg-green-50"}`}>
          {setStatus.isPending ? <Loader2 size={15} className="animate-spin" /> : isResolved ? <RotateCcw size={16} /> : <CheckCircle2 size={16} />}
        </button>
        <button onClick={handleDelete} disabled={deleteConversation.isPending} className="w-9 h-9 flex items-center justify-center text-[#37352F60] hover:text-red-500 hover:bg-red-50">
          {deleteConversation.isPending ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={16} />}
        </button>
      </div>
      {isUnread && <div className="absolute left-0 top-0 bottom-0 w-1 bg-black" />}
    </div>
  );
}
