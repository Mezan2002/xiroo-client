"use client";
import React, { useState } from "react";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import {
  AlertCircle,
  Bell,
  Shield,
  ShoppingBag,
  Zap,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useNotifications } from "@/hooks/api/useNotifications";
import Link from "next/link";

const ITEMS_PER_PAGE = 20;

const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "just now";
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return "just now";
};

export default function AdminNotifications() {
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const { notifications, pagination, markAsRead, markAllAsRead, isLoading } = useNotifications({ page, limit: ITEMS_PER_PAGE });

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "All") return true;
    if (filter === "Orders") return notif.type === "order";
    if (filter === "System") return notif.type === "system";
    if (filter === "Security") return notif.type === "security";
    if (filter === "Messages") return notif.type === "message";
    return true;
  });

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage);
    }
  };

  const getPageNumbers = () => {
    const { totalPages, page: currentPage } = pagination;
    const pages = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <ModuleHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Notifications", active: true },
        ]}
        title="System Pulse"
        icon={Bell}
      />

      <div className="space-y-6 md:space-y-8 px-0 md:px-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#EDECE9] pb-4 gap-4 px-4 md:px-0">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {["All", "Orders", "Messages", "System", "Security"].map((f) => (
              <button
                key={f}
                onClick={() => { setFilter(f); setPage(1); }}
                className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all shrink-0 ${
                  filter === f
                    ? "bg-black text-white"
                    : "text-[#37352FA6] hover:bg-[#F7F7F5]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button 
            onClick={markAllAsRead}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#37352F40] hover:text-black transition-colors shrink-0"
          >
            Mark all read
          </button>
        </div>

        <div className="space-y-px bg-[#EDECE9] border border-[#EDECE9] rounded-none overflow-hidden shadow-2xl shadow-black/5">
          {isLoading ? (
            <div className="bg-white py-32 text-center">
              <Loader2 size={32} className="animate-spin mx-auto text-zinc-300" />
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="bg-white py-32 text-center">
              <div className="opacity-20 flex flex-col items-center gap-4">
                <Bell size={48} strokeWidth={1} />
                <p className="text-[11px] font-bold uppercase tracking-[0.4em]">No active pulse found</p>
              </div>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              let Icon = Bell;
              if (notif.type === "order") Icon = ShoppingBag;
              if (notif.type === "system") Icon = AlertCircle;
              if (notif.type === "security") Icon = Shield;
              if (notif.type === "message") Icon = Zap;

              return (
                <div
                  key={notif._id}
                  onClick={() => !notif.isRead && markAsRead(notif._id)}
                  className={`flex items-start gap-4 md:gap-6 p-4 md:p-6 transition-all group relative cursor-pointer ${
                    !notif.isRead
                      ? "bg-white"
                      : "bg-[#FBFBFA] hover:bg-white"
                  }`}
                >
                  <div className={`shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-none shadow-lg transition-transform group-hover:scale-105 ${
                    !notif.isRead ? "bg-black text-white" : "bg-[#EDECE9] text-[#37352F40]"
                  }`}>
                    <Icon className="w-4 h-4 md:w-[18px] md:h-[18px]" strokeWidth={1.5} />
                  </div>

                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#37352F40]">
                        {notif.type} • {formatTimeAgo(notif.createdAt)}
                      </span>
                    </div>
                    <Link href={notif.link || "/admin/notifications"}>
                      <h3 className={`text-[14px] tracking-tight mb-1.5 ${!notif.isRead ? "font-bold text-black" : "font-medium text-[#37352F]"}`}>
                        {notif.title}
                      </h3>
                    </Link>
                    <p className="text-[13px] text-[#37352FA6] font-medium leading-relaxed max-w-2xl">
                      {notif.message}
                    </p>
                  </div>

                  {!notif.isRead && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-black animate-pulse" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-[#EDECE9]">
            <span className="text-[12px] text-[#37352F80]">
              Showing {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} notifications
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="p-2 text-[#37352F] border border-[#EDECE9] hover:bg-[#F7F7F5] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={14} />
              </button>

              {getPageNumbers().map((p, idx) =>
                p === "..." ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-[12px] text-[#37352F80]">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-8 h-8 text-[12px] font-medium border transition-colors ${
                      p === pagination.page
                        ? "bg-[#37352F] text-white border-[#37352F]"
                        : "text-[#37352F] border-[#EDECE9] hover:bg-[#F7F7F5]"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="p-2 text-[#37352F] border border-[#EDECE9] hover:bg-[#F7F7F5] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
