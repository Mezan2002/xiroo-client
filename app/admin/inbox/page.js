"use client";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import { Button } from "@/components/ui/Button";
import { useSocket } from "@/context/SocketContext";
import { useInbox } from "@/hooks/api/useInbox";
import {
  CheckCircle2,
  ExternalLink,
  Flag,
  Loader2,
  Mail,
  RotateCcw,
  Shield,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PRIORITY_COLORS = {
  low: "bg-blue-100 text-blue-700",
  medium: "bg-gray-100 text-gray-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700 shadow-sm shadow-red-200",
};

export default function AdminInbox() {
  const router = useRouter();
  const [filter, setFilter] = useState("All");
  const { useConversations } = useInbox();
  
  const {
    data: conversations,
    isLoading,
    refetch,
  } = useConversations(
    filter === "flagged"
      ? { isFlagged: "true" }
      : filter !== "All"
        ? { status: filter }
        : {},
  );
  const { socket } = useSocket();



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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 animate-pulse">
        <div className="w-12 h-12 bg-[#EDECE9] animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#37352F60]">
          Synchronizing Registry...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-montserrat">
      <ModuleHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Inbox", active: true },
        ]}
        title="Intelligence Hub"
        icon={Mail}
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#EDECE9] pb-4">
          <div className="flex items-center gap-2">
            {[
              { id: "All", label: "All Records" },
              { id: "active", label: "Active" },
              { id: "flagged", label: "Under Review" },
              { id: "resolved", label: "Resolved" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] transition-all ${
                  filter === f.id
                    ? "bg-black text-white"
                    : "text-[#37352FA6] hover:bg-[#F7F7F5]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <Button
            variant="ghost"
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#37352F60] hover:text-black transition-colors"
          >
            Clear Notifications
          </Button>
        </div>

        <div className="space-y-px bg-[#EDECE9] border border-[#EDECE9] overflow-hidden shadow-2xl shadow-black/5">
          {conversations?.length === 0 && (
            <div className="bg-white p-20 text-center space-y-4">
              <Shield size={32} className="mx-auto text-[#EDECE9]" />
              <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#37352F60]">
                Zero{" "}
                {filter === "flagged"
                  ? "Flagged"
                  : filter === "active"
                    ? "Active"
                    : ""}{" "}
                Inquiries
              </p>
            </div>
          )}

          {conversations?.map((conv, idx) => (
            <ConversationCard
              key={conv._id || `fallback-${idx}`}
              conv={conv}
              onOpen={() => router.push(`/admin/inbox/${conv._id}`)}
              onRefetch={refetch}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Isolated card component so each card manages its own mutation state ────────
function ConversationCard({ conv, onOpen, onRefetch }) {
  const { setStatus, deleteConversation } = useInbox();

  const customer =
    conv.customer ||
    conv.participants?.find((p) => p.role === "customer") ||
    conv.participants?.[0] ||
    {};


  const unreadCount = customer._id ? conv.unreadCount?.[customer._id] || 0 : 0;
  const isUnread = unreadCount > 0;
  const isResolved = conv.status === "resolved";

  const displayTime = isUnread
    ? new Date(conv.updatedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date(conv.updatedAt).toLocaleDateString([], {
        month: "short",
        day: "numeric",
      });

  const handleResolveToggle = (e) => {
    e.stopPropagation();
    setStatus.mutate(
      { id: conv._id, status: isResolved ? "active" : "resolved" },
      { onSuccess: onRefetch },
    );
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (!confirm("Permanently delete this conversation?")) return;
    deleteConversation.mutate(conv._id, { onSuccess: onRefetch });
  };


  return (
    <div
      onClick={onOpen}
      className={`flex items-center gap-6 p-6 transition-all group relative cursor-pointer ${
        isResolved
          ? "bg-green-50 hover:bg-green-100/60"
          : isUnread
            ? "bg-white"
            : "bg-white opacity-60 hover:opacity-100"
      }`}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-none font-bold text-[13px] shadow-lg uppercase">
          {customer.firstName?.[0] || customer.lastName?.[0] || "C"}
        </div>
        {isUnread ? (
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-black border-2 border-white rounded-none flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-none animate-pulse" />
          </div>
        ) : conv.status === "active" ? (
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-none shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
        ) : null}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#37352F60]">
            {customer.firstName || "Unknown"} {customer.lastName || "Entity"}
          </span>
          <span className="text-[10px] text-[#37352F20]">•</span>
          <span className="text-[10px] font-bold text-[#37352F60] tracking-tight">
            {displayTime}
          </span>
          {conv.priority && (
            <span
              className={`text-[8px] px-2 py-0.5 font-bold uppercase tracking-widest ${PRIORITY_COLORS[conv.priority]} ml-2 rounded-none`}
            >
              {conv.priority}
            </span>
          )}
        </div>
        <h3
          className={`text-[14px] tracking-tight mb-1 truncate ${
            isUnread ? "font-bold text-black" : "font-medium text-[#37352F]"
          }`}
        >
          {conv.lastMessage?.content || "Starting inquiry..."}
        </h3>
        <div className="flex items-center gap-3">
          <p className="text-[10px] text-[#37352FA6] font-bold uppercase tracking-widest">
            ID: {conv._id?.slice(-8).toUpperCase() || "EXTERNAL"} •{" "}
            {conv.status}
          </p>
          {conv.assignedTo && (
            <>
              <span className="text-[#37352F20] text-[10px]">•</span>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-none bg-zinc-100 flex items-center justify-center text-[8px] font-bold">
                  {conv.assignedTo.firstName?.[0]}
                </div>
                <span className="text-[10px] text-[#37352FA6] font-bold uppercase tracking-widest">
                  {conv.assignedTo.firstName}
                </span>
              </div>
            </>
          )}
          {conv.isFlagged && <Flag size={12} className="text-blue-500" />}
        </div>
      </div>

      {/* Action Buttons — always visible on hover */}
      <div
        className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-3 group-hover:translate-x-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* View Details */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
          title="View conversation"
          className="w-9 h-9 flex items-center justify-center text-[#37352F60] hover:text-black hover:bg-[#F7F7F5] transition-all"
        >
          <ExternalLink size={16} />
        </button>

        {/* Resolve / Reopen */}
        <button
          onClick={handleResolveToggle}
          disabled={setStatus.isPending}
          title={isResolved ? "Reopen conversation" : "Resolve conversation"}
          className={`w-9 h-9 flex items-center justify-center transition-all ${
            isResolved
              ? "text-green-600 hover:text-green-800 hover:bg-green-100"
              : "text-[#37352F60] hover:text-green-600 hover:bg-green-50"
          }`}
        >
          {setStatus.isPending ? (
            <Loader2 size={15} className="animate-spin" />
          ) : isResolved ? (
            <RotateCcw size={16} />
          ) : (
            <CheckCircle2 size={16} />
          )}
        </button>

        {/* Delete */}
        <button
          onClick={handleDelete}
          disabled={deleteConversation.isPending}
          title="Delete conversation"
          className="w-9 h-9 flex items-center justify-center text-[#37352F60] hover:text-red-500 hover:bg-red-50 transition-all"
        >
          {deleteConversation.isPending ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Trash2 size={16} />
          )}
        </button>

      </div>

      {/* Unread left-border accent */}
      {isUnread && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-black" />
      )}
    </div>
  );
}
