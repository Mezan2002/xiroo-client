"use client";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  FileText,
  Hash,
  Inbox,
  Layers,
  LayoutGrid,
  LineChart,
  Mail,
  MessageSquare,
  Package,
  Palette,
  Quote,
  Search,
  Settings,
  Share2,
  Shield,
  ShoppingBag,
  StickyNote,
  Tag,
  Trash2,
  Truck,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAdminSidebar } from "./sidebar-sections/useAdminSidebar";

const NAV_GROUPS = [
  {
    label: "Commerce",
    items: [
      { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
      { label: "Order Trash", href: "/admin/orders/trash", icon: Trash2 },
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Categories", href: "/admin/categories", icon: LayoutGrid },
      { label: "Customers", href: "/admin/customers", icon: UserCheck },
    ],
  },
  {
    label: "Logistics",
    items: [
      { label: "Courier Check", href: "/admin/courier-check", icon: Truck },
      {
        label: "Fraud Review",
        href: "/admin/fraud-review",
        icon: AlertTriangle,
      },
    ],
  },
  {
    label: "Engagement",
    items: [
      { label: "Reviews", href: "/admin/reviews", icon: MessageSquare },
      { label: "Testimonials", href: "/admin/testimonials", icon: Quote },
      { label: "Social Feed", href: "/admin/social-posts", icon: Share2 },
      { label: "Newsletters", href: "/admin/newsletters", icon: Mail },
    ],
  },
  {
    label: "People",
    items: [
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Loyalty Matrix", href: "/admin/loyalty", icon: Shield },
      { label: "Discounts", href: "/admin/discounts", icon: Tag },
    ],
  },
  {
    label: "Store",
    items: [
      { label: "Analytics", href: "/admin/analytics", icon: LineChart },
      { label: "Navigation", href: "/admin/navigation", icon: Layers },
      { label: "Attributes", href: "/admin/attributes", icon: Hash },
      { label: "Branding", href: "/admin/branding", icon: Palette },
      { label: "Landing Pages", href: "/admin/landing-pages", icon: FileText },
      { label: "Store Layout", href: "/admin/layout", icon: Layers },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export default function AdminSidebar({ isOpen, onClose }) {
  const { pathname, notificationUnread, inboxUnread, handleOpenSearch } =
    useAdminSidebar(onClose);

  return (
    <>
      <aside
        className={`fixed top-0 left-0 z-50 w-72 lg:w-56 h-screen bg-[#F7F7F5] border-r border-[#EDECE9] flex flex-col shrink-0 select-none font-montserrat antialiased transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 flex-1 px-2 py-2">
            <Image
              width={100}
              height={100}
              src="/images/logo.png"
              alt="Xiroo"
              className=" h-7 w-auto object-contain"
            />
            <span className="text-[11px] font-bold text-[#91918E] uppercase tracking-wider">
              Admin
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-[#37352F80] hover:text-[#37352F]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Quick Links */}
        <div className="px-3 space-y-px">
          {[
            { icon: Search, label: "Search", onClick: handleOpenSearch, shortcut: "⌘ K" },
            {
              icon: Inbox,
              label: "Inbox",
              href: "/admin/inbox",
              badge: inboxUnread,
            },
            {
              icon: Bell,
              label: "Notifications",
              href: "/admin/notifications",
              badge: notificationUnread,
            },
            { label: "Dashboard", href: "/admin", icon: BarChart3 },
            { label: "Notes", href: "/admin/notes", icon: StickyNote },
          ].map((item, idx) => {
            const Icon = item.icon;
            const isActive =
              item.href &&
              (item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href ||
                  pathname?.startsWith(item.href + "/"));
            const content = (
              <>
                <Icon
                  size={16}
                  className={
                    isActive
                      ? "text-[#37352F]"
                      : "text-[#37352F80] group-hover:text-[#37352F]"
                  }
                />
                <span className="flex-1 text-left">{item.label}</span>
                {item.shortcut && (
                  <div className="flex items-center gap-0.5">
                    {item.shortcut.split(" ").map((k, j) => (
                      <span
                        key={j}
                        className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[9px] font-semibold text-[#91918E] bg-[#EDECE9]"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                )}
                {item.badge > 0 && (
                  <span className="text-[10px] font-bold bg-[#37352F] text-white px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {item.badge}
                  </span>
                )}
              </>
            );
            return item.onClick ? (
              <button
                key={idx}
                onClick={item.onClick}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 text-[14px] font-medium transition-all group text-[#37352FA6] hover:bg-[#EBEBE9] hover:text-[#37352F]"
              >
                {content}
              </button>
            ) : (
              <Link
                key={idx}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-1.5 text-[14px] font-medium transition-all group ${isActive ? "bg-[#EBEBE9] text-[#37352F]" : "text-[#37352FA6] hover:bg-[#EBEBE9] hover:text-[#37352F]"}`}
              >
                {content}
              </Link>
            );
          })}
        </div>

        {/* Categorized Nav */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-3 py-5 space-y-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="space-y-0.5">
              <h4 className="px-3 text-[9px] font-bold text-[#91918E] uppercase tracking-[0.15em] mb-1.5">
                {group.label}
              </h4>
              <nav className="space-y-px">
                {group.items.map((item) => {
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname === item.href ||
                        pathname?.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2.5 px-3 py-1.5 text-[13px] font-medium transition-all group ${isActive ? "bg-[#EBEBE9] text-[#37352F]" : "text-[#37352FA6] hover:bg-[#EBEBE9] hover:text-[#37352F]"}`}
                    >
                      <item.icon
                        size={15}
                        className={
                          isActive ? "text-[#37352F]" : "text-[#37352F80]"
                        }
                      />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        <div className="px-3 py-4 border-t border-[#EDECE9]">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-1.5 text-[14px] font-medium text-[#37352FA6] hover:bg-[#EBEBE9] hover:text-[#37352F] transition-all"
          >
            <div className="w-5 h-5 bg-gray-200 flex items-center justify-center text-[10px] text-gray-500 font-bold border border-gray-100">
              A
            </div>
            <span>Back to Store</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
