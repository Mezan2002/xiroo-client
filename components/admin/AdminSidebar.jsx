"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Palette, 
  Package, 
  Settings, 
  Users, 
  ShieldCheck,
  ShoppingBag,
  Tag,
  Mail,
  LineChart,
  Layers,
  LayoutGrid,
  Search,
  Home,
  Inbox,
  ChevronDown,
  Plus
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: BarChart3 },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: LayoutGrid },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Discounts", href: "/admin/discounts", icon: Tag },
  { label: "Newsletters", href: "/admin/newsletters", icon: Mail },
  { label: "Analytics", href: "/admin/analytics", icon: LineChart },
  { label: "Branding", href: "/admin/branding", icon: Palette },
  { label: "Store Layout", href: "/admin/layout", icon: Layers },
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Security", href: "/admin/security", icon: ShieldCheck },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-[#F7F7F5] border-r border-[#EDECE9] flex flex-col sticky top-0 shrink-0 select-none font-montserrat antialiased overflow-hidden">
      {/* Workspace Selector */}
      <div className="p-4">
        <div className="flex items-center gap-3 px-2 py-2 hover:bg-[#EBEBE9] rounded-lg cursor-pointer transition-all active:scale-[0.98] group">
          <div className="w-7 h-7 bg-black text-white flex items-center justify-center font-bold text-[12px] rounded-lg shadow-xl shadow-black/10 ring-1 ring-black/5">
            X
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-bold text-[#37352F] truncate">Xiroo HQ</span>
              <ChevronDown size={12} className="text-[#37352F40] group-hover:text-[#37352F80] transition-colors" />
            </div>
            <span className="text-[10px] text-[#91918E] font-medium tracking-tight truncate">Commerce Hub</span>
          </div>
        </div>
      </div>

      {/* Primary Items */}
      <div className="px-3 space-y-px">
        {[
          { icon: Search, label: "Search" },
          { icon: Home, label: "Home", href: "/admin" },
          { icon: Inbox, label: "Inbox", badge: 3 },
        ].map((item, idx) => (
          <Link
            key={idx}
            href={item.href || "#"}
            className={`flex items-center gap-2.5 px-3 py-1 text-[14px] font-medium transition-all group rounded-md ${
              pathname === item.href 
                ? "bg-[#EBEBE9] text-[#37352F]" 
                : "text-[#37352FA6] hover:bg-[#EBEBE9] hover:text-[#37352F]"
            }`}
          >
            <item.icon size={16} className={pathname === item.href ? "text-[#37352F]" : "text-[#37352F80]"} />
            <span className="flex-1">{item.label}</span>
            {item.badge && <span className="text-[11px] font-bold text-[#37352F40] mr-1">{item.badge}</span>}
          </Link>
        ))}
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-6 space-y-6">
        <div className="space-y-0.5">
          <h4 className="px-3 text-[11px] font-bold text-[#91918E] uppercase tracking-wider mb-2">
            Operations
          </h4>
          <nav className="space-y-px">
            {NAV_ITEMS.map((item) => {
              const isActive = (item.label === "Products" || item.label === "Orders")
                ? (pathname === item.href || pathname?.startsWith(item.href + "/"))
                : pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-1 text-[14px] font-medium transition-all group rounded-md ${
                    isActive 
                      ? "bg-[#EBEBE9] text-[#37352F]" 
                      : "text-[#37352FA6] hover:bg-[#EBEBE9] hover:text-[#37352F]"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-[#37352F]" : "text-[#37352F80]"} />
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
          className="flex items-center gap-2.5 px-3 py-1.5 text-[14px] font-medium text-[#37352FA6] hover:bg-[#EBEBE9] hover:text-[#37352F] rounded-md transition-all"
        >
          <div className="w-5 h-5 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center text-[10px] text-gray-500 font-bold border border-gray-100">
            A
          </div>
          <span>Back to Store</span>
        </Link>
      </div>
    </aside>
  );
}
