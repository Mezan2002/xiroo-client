"use client";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import {
  AlertCircle,
  ArrowRight,
  Bell,
  CheckCircle2,
  Shield,
  ShoppingBag,
  Trash2,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    type: "Order",
    title: "New Order #XR-2814",
    message: "৳2,450 • Processing • John Doe",
    time: "2 mins ago",
    unread: true,
  },
  {
    id: "2",
    type: "Inventory",
    title: "Low Stock Alert",
    message: "Xiroo™ LED Cap Lamp is below 5 units.",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: "3",
    type: "Security",
    title: "New Login Detected",
    message: "Admin session from Windows (Dhaka, BD).",
    time: "3 hours ago",
    unread: true,
  },
  {
    id: "4",
    type: "Order",
    title: "Payment Verified",
    message: "Order #XR-2811 was paid via bKash.",
    time: "5 hours ago",
    unread: false,
  },
  {
    id: "5",
    type: "System",
    title: "Backup Secure",
    message: "Automated daily system backup completed.",
    time: "1 day ago",
    unread: false,
  },
];

export default function AdminNotifications() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState("All");

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "Unread") return n.unread;
    if (filter === "Critical")
      return n.type === "Inventory" || n.type === "Security";
    return true;
  });

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case "Order":
        return ShoppingBag;
      case "Inventory":
        return AlertCircle;
      case "Security":
        return Shield;
      default:
        return Zap;
    }
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

      <div className="space-y-6">
        {/* Sorting & Global Actions */}
        <div className="flex items-center justify-between border-b border-[#EDECE9] pb-4">
          <div className="flex items-center gap-2">
            {["All", "Unread", "Critical"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] transition-all ${
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
            onClick={markAllRead}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#37352F40] hover:text-black transition-colors"
          >
            Mark all as read
          </button>
        </div>

        {/* Notification Stream */}
        <div className="space-y-px bg-[#EDECE9] border border-[#EDECE9] rounded-sm overflow-hidden">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((n) => {
              const Icon = getIcon(n.type);
              return (
                <div
                  key={n.id}
                  onClick={() => router.push(`/admin/notifications/${n.id}`)}
                  className={`flex items-center gap-6 p-6 transition-all group relative cursor-pointer ${
                    n.unread ? "bg-white" : "bg-white opacity-60 grayscale"
                  }`}
                >
                  <div className="w-10 h-10 bg-[#F7F7F5] flex items-center justify-center rounded-sm shrink-0">
                    <Icon
                      size={18}
                      className={n.unread ? "text-black" : "text-[#37352F40]"}
                      strokeWidth={1.5}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[9px] font-bold uppercase tracking-[0.2em] ${
                          n.type === "Inventory" || n.type === "Security"
                            ? "text-red-500"
                            : "text-[#37352F40]"
                        }`}
                      >
                        {n.type}
                      </span>
                      <span className="text-[9px] text-[#37352F20]">•</span>
                      <span className="text-[9px] font-bold text-[#37352F40] tracking-tight">
                        {n.time}
                      </span>
                    </div>
                    <h3 className="text-[14px] font-bold text-[#37352F] tracking-tight mb-0.5">
                      {n.title}
                    </h3>
                    <p className="text-[12px] text-[#37352FA6] line-clamp-1">
                      {n.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                    <button
                      onClick={() => deleteNotification(n.id)}
                      className="p-2 text-[#37352F40] hover:text-red-500 transition-colors"
                      title="Dismiss"
                    >
                      <Trash2 size={16} strokeWidth={1.5} />
                    </button>
                    <button className="p-2 text-[#37352F40] hover:text-black transition-colors">
                      <ArrowRight size={16} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white py-24 text-center space-y-4">
              <div className="w-16 h-16 bg-[#F7F7F5] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={24} className="text-[#37352F20]" />
              </div>
              <div className="space-y-1">
                <p className="text-[14px] font-bold text-[#37352F]">
                  Systems optimal
                </p>
                <p className="text-[12px] text-[#37352FA6]">
                  All system operations are running without alerts.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
