"use client";
import {
  BarChart3,
  ChevronDown,
  Home,
  Inbox,
  Layers,
  LayoutGrid,
  LineChart,
  Mail,
  Package,
  Palette,
  Search,
  Settings,
  Shield,
  ShoppingBag,
  Tag,
  Users,
  Bell,
  Hash,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: BarChart3 },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: LayoutGrid },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Loyalty Matrix", href: "/admin/loyalty", icon: Shield },
  { label: "Discounts", href: "/admin/discounts", icon: Tag },
  { label: "Newsletters", href: "/admin/newsletters", icon: Mail },
  { label: "Navigation", href: "/admin/navigation", icon: Layers },
  { label: "Attributes", href: "/admin/attributes", icon: Hash },
  { label: "Analytics", href: "/admin/analytics", icon: LineChart },
  { label: "Branding", href: "/admin/branding", icon: Palette },
  { label: "Store Layout", href: "/admin/layout", icon: Layers },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

import { useNotifications } from "@/context/NotificationContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { useSocket } from "@/context/SocketContext";
import { useUser } from "@/context/UserContext";
import { useEffect } from "react";
import { useConversations } from "@/hooks/useInbox";

export default function AdminSidebar() {
  const pathname = usePathname();
  const { unreadCount: notificationUnread } = useNotifications();
  const { user } = useUser();
  const { socket } = useSocket();

  // Dynamic Inbox Sync
  const { data: conversations, refetch: refetchInbox } = useConversations({ status: 'active' });

  useEffect(() => {
    if (socket) {
      socket.on("inbox_update", () => refetchInbox());
      socket.on("new_message", () => refetchInbox());
      return () => {
        socket.off("inbox_update");
        socket.off("new_message");
      };
    }
  }, [socket, refetchInbox]);

  const inboxUnread = conversations?.reduce((acc, conv) => {
    return acc + (conv.unreadCount?.[user?._id] || 0);
  }, 0) || 0;

  const handleOpenSearch = () => {
    window.dispatchEvent(new CustomEvent('open-admin-search'));
  };

  return (
    <aside className="w-64 h-screen bg-[#F7F7F5] border-r border-[#EDECE9] flex flex-col sticky top-0 shrink-0 select-none font-montserrat antialiased overflow-hidden">
      {/* Workspace Selector */}
      <div className="p-4">
        <div className="flex items-center gap-3 px-2 py-2 hover:bg-[#EBEBE9] rounded-none cursor-pointer transition-all active:scale-[0.98] group">
          <div className="w-7 h-7 bg-black text-white flex items-center justify-center font-bold text-[12px] rounded-none shadow-xl shadow-black/10 ring-1 ring-black/5">
            X
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-bold text-[#37352F] truncate">
                Xiroo HQ
              </span>
              <ChevronDown
                size={12}
                className="text-[#37352F40] group-hover:text-[#37352F80] transition-colors"
              />
            </div>
            <span className="text-[10px] text-[#91918E] font-medium tracking-tight truncate">
              Commerce Hub
            </span>
          </div>
        </div>
      </div>

      {/* Primary Items */}
      <div className="px-3 space-y-px">
        {[
          { icon: Search, label: "Search", onClick: handleOpenSearch },
          { icon: Inbox, label: "Inbox", href: "/admin/inbox", badge: inboxUnread },
          { icon: Bell, label: "Notifications", href: "/admin/notifications", badge: notificationUnread },
        ].map((item, idx) => {
          const Icon = item.icon;
          const isActive = item.href && pathname === item.href;
          
          if (item.onClick) {
            return (
              <button
                key={idx}
                onClick={item.onClick}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 text-[14px] font-medium transition-all group rounded-none text-[#37352FA6] hover:bg-[#EBEBE9] hover:text-[#37352F] outline-none"
              >
                <Icon size={16} className="text-[#37352F80] group-hover:text-[#37352F]" />
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            );
          }
          
          return (
            <Link
              key={idx}
              href={item.href || "#"}
              className={`flex items-center gap-2.5 px-3 py-1.5 text-[14px] font-medium transition-all group rounded-none ${
                isActive
                  ? "bg-[#EBEBE9] text-[#37352F]"
                  : "text-[#37352FA6] hover:bg-[#EBEBE9] hover:text-[#37352F]"
              }`}
            >
              <Icon
                size={16}
                className={isActive ? "text-[#37352F]" : "text-[#37352F80]"}
              />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-[11px] font-bold text-[#37352F40] mr-1">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-6 space-y-6">
        <div className="space-y-0.5">
          <h4 className="px-3 text-[11px] font-bold text-[#91918E] uppercase tracking-wider mb-2">
            Operations
          </h4>
          <nav className="space-y-px">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname === item.href ||
                    pathname?.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-1.5 text-[14px] font-medium transition-all group rounded-none ${
                    isActive
                      ? "bg-[#EBEBE9] text-[#37352F]"
                      : "text-[#37352FA6] hover:bg-[#EBEBE9] hover:text-[#37352F]"
                  }`}
                >
                  <Icon
                    size={16}
                    className={isActive ? "text-[#37352F]" : "text-[#37352F80]"}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer / Back to Store */}
      <div className="px-3 py-4 border-t border-[#EDECE9]">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-1.5 text-[14px] font-medium text-[#37352FA6] hover:bg-[#EBEBE9] hover:text-[#37352F] rounded-none transition-all"
        >
          <div className="w-5 h-5 bg-gray-200 rounded-none overflow-hidden flex items-center justify-center text-[10px] text-gray-500 font-bold border border-gray-100">
            A
          </div>
          <span>Back to Store</span>
        </Link>
      </div>
    </aside>
  );
}
