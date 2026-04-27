"use client";
import { UserAvatar } from "../UserAvatar";
import { Heart, LogOut, MapPin, Package, Shield, User, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function LoggedInProfile({
  currentUser,
  orders,
  wishlistItemsCount,
  cartItemsCount,
  handleLogout,
  onClose,
}) {
  const menuItems = [
    { label: "Personal Details", sub: "Manage Profile", icon: User, href: "/account/settings" },
    { label: "Order History", sub: "Track Purchases", icon: Package, href: "/account/orders" },
    { label: "My Wishlist", sub: "Saved Items", icon: Heart, href: "/account/wishlist" },
    { label: "Shipping Addresses", sub: "Manage Locations", icon: MapPin, href: "/account/addresses" },
    { label: "Prestige Sanctuary", sub: "Loyalty Benefits", icon: Shield, href: "/account/loyalty" },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
      {/* Profile Header */}
      <div className="px-10 py-12 text-left bg-black text-white">
        <UserAvatar
          user={currentUser}
          className="w-20 h-20 rounded-full bg-white border border-gray-100 mb-8 shadow-sm text-black"
          textClassName="text-xl tracking-wider"
        />
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-[24px] font-bold text-white tracking-tight">
            {`${currentUser.firstName} ${currentUser.lastName}`}
          </h3>
          <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]" />
        </div>
        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-widest">{currentUser.email}</p>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-3 border-y border-gray-100 py-8 bg-white">
        {[
          { label: "Orders", val: orders.length },
          { label: "Wishlist", val: wishlistItemsCount },
          { label: "Cart", val: cartItemsCount },
        ].map((stat, i) => (
          <div key={stat.label} className={`flex flex-col items-center ${i < 2 ? "border-r border-gray-100" : ""}`}>
            <span className="text-[22px] font-bold text-black mb-1">{String(stat.val).padStart(2, "0")}</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Loyalty Stats */}
      <div className="grid grid-cols-2 border-b border-gray-100 py-8 bg-gray-50/50">
        <div className="flex flex-col items-center border-r border-gray-100">
          <span className="text-[16px] font-bold text-black mb-1 uppercase tracking-tight">{currentUser.tier || "Bronze"}</span>
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Prestige Tier</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[16px] font-bold text-black mb-1">{currentUser.points || 0}</span>
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Loyalty Points</span>
        </div>
      </div>

      {/* Menu List */}
      <div className="p-8 space-y-2 bg-white">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={onClose}
            className="group flex items-center gap-5 p-4 hover:bg-gray-50 transition-all duration-300 rounded-sm"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-gray-50 border border-gray-100 transition-colors group-hover:border-black/10 group-hover:bg-white">
              <item.icon className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors stroke-[1.5]" />
            </div>
            <div className="flex-1">
              <span className="block text-[15px] font-bold text-black">{item.label}</span>
              <span className="block text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1 uppercase">{item.sub}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>

      {/* Sign Out Footer */}
      <div className="mt-auto p-10 pb-12 border-t border-gray-50">
        <button
          className="w-full flex items-center justify-center gap-3 py-5 border border-red-100 bg-red-50/50 hover:bg-red-50 text-red-500 transition-all rounded-full group"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[12px] font-bold tracking-[0.3em] uppercase">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
