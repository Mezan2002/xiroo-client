"use client";
import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  Search, Command, LayoutDashboard, ShoppingBag, Package, Users,
  UserCheck, Tag, Truck, MessageSquare, Quote, Share2, Settings,
  Layers, Hash, StickyNote, Shield, Palette, LineChart, AlertTriangle, Mail, Bell,
} from "lucide-react";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, shortcut: "G D" },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag, shortcut: "G O" },
  { label: "Products", href: "/admin/products", icon: Package, shortcut: "G P" },
  { label: "Customers", href: "/admin/customers", icon: UserCheck, shortcut: "G C" },
  { label: "Users", href: "/admin/users", icon: Users, shortcut: "G U" },
  { label: "Categories", href: "/admin/categories", icon: Layers, shortcut: "" },
  { label: "Notes", href: "/admin/notes", icon: StickyNote, shortcut: "G N" },
  { label: "Discounts", href: "/admin/discounts", icon: Tag, shortcut: "" },
  { label: "Reviews", href: "/admin/reviews", icon: MessageSquare, shortcut: "" },
  { label: "Testimonials", href: "/admin/testimonials", icon: Quote, shortcut: "" },
  { label: "Social Feed", href: "/admin/social-posts", icon: Share2, shortcut: "" },
  { label: "Inbox", href: "/admin/inbox", icon: Mail, shortcut: "G I" },
  { label: "Courier Check", href: "/admin/courier-check", icon: Truck, shortcut: "" },
  { label: "Fraud Review", href: "/admin/fraud-review", icon: AlertTriangle, shortcut: "" },
  { label: "Loyalty", href: "/admin/loyalty", icon: Shield, shortcut: "" },
  { label: "Analytics", href: "/admin/analytics", icon: LineChart, shortcut: "" },
  { label: "Navigation", href: "/admin/navigation", icon: Layers, shortcut: "" },
  { label: "Attributes", href: "/admin/attributes", icon: Hash, shortcut: "" },
  { label: "Branding", href: "/admin/branding", icon: Palette, shortcut: "" },
  { label: "Store Layout", href: "/admin/layout", icon: Layers, shortcut: "" },
  { label: "Settings", href: "/admin/settings", icon: Settings, shortcut: "G S" },
  { label: "Notifications", href: "/admin/notifications", icon: Bell, shortcut: "" },
];

export default function SearchModal({ isOpen, onClose }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return NAV_ITEMS;
    const q = query.toLowerCase();
    return NAV_ITEMS.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.href.replace("/admin", "").replace("/", "").toLowerCase().includes(q)
    );
  }, [query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery("");
      setActiveIndex(0);
    }
  }, [isOpen]);

  const navigate = useCallback(
    (href) => {
      router.push(href);
      onClose();
    },
    [router, onClose]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[activeIndex]) {
          navigate(filtered[activeIndex].href);
        }
      } else if (e.key === "Escape") {
        onClose();
      }
    },
    [filtered, activeIndex, navigate, onClose]
  );

  useEffect(() => {
    if (listRef.current) {
      const active = listRef.current.children[activeIndex];
      if (active) {
        active.scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[12vh] px-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-xl bg-white border border-gray-200 shadow-2xl overflow-hidden"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-5 h-14 border-b border-gray-200">
          <Search size={18} className="text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands or navigate..."
            className="flex-1 bg-transparent border-none outline-none text-[15px] text-gray-900 placeholder:text-gray-400"
          />
          <button
            onClick={onClose}
            className="px-2 py-0.5 text-[11px] font-semibold text-gray-500 bg-gray-100 border border-gray-200 hover:bg-gray-200 transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-1">
          {filtered.length > 0 ? (
            filtered.map((item, i) => {
              const Icon = item.icon;
              const isActive = i === activeIndex;
              return (
                <button
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`w-full flex items-center justify-between px-5 py-3 text-left transition-colors ${
                    isActive ? "bg-gray-100" : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? "text-gray-900" : "text-gray-500"} strokeWidth={1.5} />
                    <span className={`text-[14px] ${isActive ? "text-gray-900 font-semibold" : "text-gray-700 font-medium"}`}>
                      {item.label}
                    </span>
                  </div>
                  {item.shortcut && (
                    <div className="flex items-center gap-1">
                      {item.shortcut.split(" ").map((k, j) => (
                        <span
                          key={j}
                          className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1 text-[10px] font-semibold text-gray-500 bg-gray-100 border border-gray-200"
                        >
                          {k}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              );
            })
          ) : (
            <div className="py-16 text-center">
              <p className="text-[13px] text-gray-400">No results found</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="h-11 border-t border-gray-200 flex items-center justify-between px-5 bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold text-gray-500">↑↓</span>
              <span className="text-[10px] text-gray-400">Navigate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold text-gray-500">↵</span>
              <span className="text-[10px] text-gray-400">Select</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Command size={10} className="text-gray-400" />
            <span className="text-[10px] text-gray-400">⌘K</span>
          </div>
        </div>
      </div>
    </div>
  );
}
