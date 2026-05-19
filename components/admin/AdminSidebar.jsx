"use client";
import { BarChart3, Bell, ChevronDown, Hash, Inbox, Layers, LayoutGrid, LineChart, Mail, MessageSquare, Package, Palette, Search, Settings, Shield, ShoppingBag, Tag, Users, X } from "lucide-react";
import Link from "next/link";
import { useAdminSidebar } from "./sidebar-sections/useAdminSidebar";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: BarChart3 },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: LayoutGrid },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Reviews", href: "/admin/reviews", icon: MessageSquare },
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

export default function AdminSidebar({ isOpen, onClose }) {
  const { pathname, notificationUnread, inboxUnread, handleOpenSearch } = useAdminSidebar(onClose);

  return (
    <>
      <aside className={`fixed lg:sticky top-0 z-50 lg:z-auto w-72 lg:w-64 h-screen bg-[#F7F7F5] border-r border-[#EDECE9] flex flex-col shrink-0 select-none font-montserrat antialiased transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 px-2 py-2 hover:bg-[#EBEBE9] cursor-pointer group transition-all">
            <div className="w-7 h-7 bg-black text-white flex items-center justify-center font-bold text-[12px]">X</div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5"><span className="text-[13px] font-bold text-[#37352F]">Xiroo HQ</span><ChevronDown size={12} className="text-[#37352F40]" /></div>
              <span className="text-[10px] text-[#91918E] font-medium tracking-tight">Commerce Hub</span>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1.5 text-[#37352F80] hover:text-[#37352F]"><X size={16} /></button>
        </div>

        <div className="px-3 space-y-px">
          {[
            { icon: Search, label: "Search", onClick: handleOpenSearch },
            { icon: Inbox, label: "Inbox", href: "/admin/inbox", badge: inboxUnread },
            { icon: Bell, label: "Notifications", href: "/admin/notifications", badge: notificationUnread },
          ].map((item, idx) => {
            const Icon = item.icon;
            const isActive = item.href && pathname === item.href;
            const content = (
              <><Icon size={16} className={isActive ? "text-[#37352F]" : "text-[#37352F80] group-hover:text-[#37352F]"} /><span className="flex-1 text-left">{item.label}</span>{item.badge > 0 && <span className="text-[10px] font-bold bg-[#37352F] text-white px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{item.badge}</span>}</>
            );
            return item.onClick ? (
              <button key={idx} onClick={item.onClick} className="w-full flex items-center gap-2.5 px-3 py-1.5 text-[14px] font-medium transition-all group text-[#37352FA6] hover:bg-[#EBEBE9] hover:text-[#37352F]">{content}</button>
            ) : (
              <Link key={idx} href={item.href} className={`flex items-center gap-2.5 px-3 py-1.5 text-[14px] font-medium transition-all group ${isActive ? "bg-[#EBEBE9] text-[#37352F]" : "text-[#37352FA6] hover:bg-[#EBEBE9] hover:text-[#37352F]"}`}>{content}</Link>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-6 space-y-6">
          <div className="space-y-0.5">
            <h4 className="px-3 text-[11px] font-bold text-[#91918E] uppercase tracking-wider mb-2">Operations</h4>
            <nav className="space-y-px">
              {NAV_ITEMS.map((item) => {
                const isActive = item.href === "/admin" ? pathname === "/admin" : pathname === item.href || pathname?.startsWith(item.href + "/");
                return (
                  <Link key={item.href} href={item.href} className={`flex items-center gap-2.5 px-3 py-1.5 text-[14px] font-medium transition-all group ${isActive ? "bg-[#EBEBE9] text-[#37352F]" : "text-[#37352FA6] hover:bg-[#EBEBE9] hover:text-[#37352F]"}`}>
                    <item.icon size={16} className={isActive ? "text-[#37352F]" : "text-[#37352F80]"} /><span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="px-3 py-4 border-t border-[#EDECE9]">
          <Link href="/" className="flex items-center gap-2.5 px-3 py-1.5 text-[14px] font-medium text-[#37352FA6] hover:bg-[#EBEBE9] hover:text-[#37352F] transition-all"><div className="w-5 h-5 bg-gray-200 flex items-center justify-center text-[10px] text-gray-500 font-bold border border-gray-100">A</div><span>Back to Store</span></Link>
        </div>
      </aside>
    </>
  );
}
