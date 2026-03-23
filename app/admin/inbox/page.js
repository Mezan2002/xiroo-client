"use client";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import { Button } from "@/components/ui/Button";
import {
  CheckCircle2,
  Mail,
  MessageSquare,
  Reply,
  Trash2,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const MOCK_MESSAGES = [
  {
    id: "1",
    type: "Inquiry",
    sender: "John Doe",
    title: "Product Availability",
    message: "Is the Xiroo™ LED Cap Lamp back in stock?",
    time: "2 mins ago",
    unread: true,
  },
  {
    id: "2",
    type: "Support",
    sender: "Sarah Smith",
    title: "Order #XR-2813 Update",
    message:
      "Can I change my shipping address for the Travel Dispensing Bottles?",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: "3",
    type: "Feedback",
    sender: "Rahim Ahmed",
    title: "Amazing Product!",
    message:
      "Just received my String Cap Lamp. The quality is exceptional. Thank you!",
    time: "5 hours ago",
    unread: false,
  },
  {
    id: "4",
    type: "Inquiry",
    sender: "Emma Wilson",
    title: "Platinum Tier Benefits",
    message:
      "I'd like more information on the exclusive rewards for Platinum members.",
    time: "1 day ago",
    unread: false,
  },
];

export default function AdminInbox() {
  const router = useRouter();
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [filter, setFilter] = useState("All");

  const filteredMessages = messages.filter((m) => {
    if (filter === "Unread") return m.unread;
    if (filter === "Support") return m.type === "Support";
    return true;
  });

  const markAsRead = (id) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, unread: false } : m)),
    );
  };

  const deleteMessage = (id) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case "Inquiry":
        return HelpCircle;
      case "Support":
        return MessageSquare;
      case "Feedback":
        return User;
      default:
        return Mail;
    }
  };

  // Safe icon helper for help circle as it's not imported yet but I want a custom one
  const HelpCircle = (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <ModuleHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Inbox", active: true },
        ]}
        title="Customer Messaging"
        icon={Mail}
      />

      <div className="space-y-6">
        {/* Filtering & Actions */}
        <div className="flex items-center justify-between border-b border-[#EDECE9] pb-4">
          <div className="flex items-center gap-2">
            {["All", "Unread", "Support"].map((f) => (
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
          <Button
            variant="ghost"
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#37352F40] hover:text-black"
          >
            Mark all as read
          </Button>
        </div>

        {/* Message Stream */}
        <div className="space-y-px bg-[#EDECE9] border border-[#EDECE9] rounded-sm overflow-hidden">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((m) => {
              const Icon = getIcon(m.type);
              return (
                <div
                  key={m.id}
                  onClick={() => router.push(`/admin/inbox/${m.id}`)}
                  className={`flex items-center gap-6 p-6 transition-all group relative cursor-pointer ${
                    m.unread
                      ? "bg-white"
                      : "bg-white opacity-60 grayscale-[40%]"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 bg-[#F7F7F5] flex items-center justify-center rounded-sm">
                      <Icon
                        size={20}
                        className="text-[#37352F40]"
                        strokeWidth={1.5}
                      />
                    </div>
                    {m.unread && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border-2 border-white rounded-full shadow-sm" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#37352F40]">
                        {m.sender}
                      </span>
                      <span className="text-[10px] text-[#37352F20]">•</span>
                      <span className="text-[10px] font-bold text-[#37352F40] tracking-tight">
                        {m.time}
                      </span>
                    </div>
                    <h3 className="text-[14px] font-bold text-[#37352F] tracking-tight mb-1">
                      {m.title}
                    </h3>
                    <p className="text-[12px] text-[#37352FA6] line-clamp-1">
                      {m.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 transform">
                    <button
                      onClick={() => console.log("Replying to:", m.id)}
                      className="p-3 text-[#37352F40] hover:text-black transition-colors"
                      title="Reply"
                    >
                      <Reply size={18} strokeWidth={1.5} />
                    </button>
                    {m.unread && (
                      <button
                        onClick={() => markAsRead(m.id)}
                        className="p-3 text-[#37352F40] hover:text-green-600 transition-colors"
                        title="Mark as Read"
                      >
                        <CheckCircle2 size={18} strokeWidth={1.5} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteMessage(m.id)}
                      className="p-3 text-[#37352F40] hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white py-24 text-center space-y-4">
              <div className="w-16 h-16 bg-[#F7F7F5] rounded-full flex items-center justify-center mx-auto">
                <MessageSquare size={24} className="text-[#37352F20]" />
              </div>
              <div className="space-y-1">
                <p className="text-[14px] font-bold text-[#37352F]">
                  No messages in queue
                </p>
                <p className="text-[12px] text-[#37352FA6]">
                  You&apos;ve responded to all customer inquiries.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
