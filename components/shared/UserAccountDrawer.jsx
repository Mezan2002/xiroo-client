/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useUser } from "@/hooks/api/useUser";
import { useAuth } from "@/hooks/api/useAuth";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useOrders } from "@/hooks/api/useOrders";
import {
  ChevronRight,
  Heart,
  LogOut,
  MapPin,
  Package,
  Shield,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { UserAvatar } from "./UserAvatar";

export function UserAccountDrawer({ isOpen, onClose }) {
  const [mounted, setMounted] = useState(false);
  const { user: currentUser } = useUser();
  const { logout } = useAuth();
  const { itemCount: cartItemsCount } = useCart();
  const { itemCount: wishlistItemsCount } = useWishlist();
  const { useMyOrders } = useOrders();
  
  const isLoggedIn = !!currentUser;
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Consume cached registries for real-time stats
  const { data: orders = [] } = useMyOrders({
    enabled: isLoggedIn && isOpen,
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleLoginRedirect = () => {
    onClose();
    router.push("/login");
  };

  const handleRegisterRedirect = () => {
    onClose();
    router.push("/register");
  };

  return (
    <div
      className={`fixed inset-0 z-1001 transition-all duration-300 ${
        isOpen ? "visible pointer-events-auto" : "invisible pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="absolute inset-0 flex justify-end overflow-hidden">
        <aside
          className={`h-full w-full sm:w-[450px] bg-white text-black shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {!mounted ? (
            <div className="flex h-full items-center justify-center">
              <div className="w-8 h-8 border-2 border-zinc-200 border-t-black animate-spin rounded-full" />
            </div>
          ) : (
            <div className="flex flex-col h-full font-montserrat">
              {isLoggedIn ? (
                <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
                  {/* Premium Profile Header - Light Mode */}
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

                    <p className="text-[11px] text-gray-400 font-medium uppercase tracking-widest">
                      {currentUser.email}
                    </p>
                  </div>

                  {/* Stats Row 1: Activity */}
                  <div className="grid grid-cols-3 border-y border-gray-100 py-8 bg-white">
                    <div className="flex flex-col items-center border-r border-gray-100">
                      <span className="text-[22px] font-bold text-black mb-1">
                        {String(orders.length).padStart(2, "0")}
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        Orders
                      </span>
                    </div>
                    <div className="flex flex-col items-center border-r border-gray-100">
                      <span className="text-[22px] font-bold text-black mb-1">
                        {String(wishlistItemsCount).padStart(2, "0")}
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        Wishlist
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[22px] font-bold text-black mb-1">
                        {String(cartItemsCount).padStart(2, "0")}
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        Cart
                      </span>
                    </div>
                  </div>

                  {/* Stats Row 2: Loyalty Registry */}
                  <div className="grid grid-cols-2 border-b border-gray-100 py-8 bg-gray-50/50">
                    <div className="flex flex-col items-center border-r border-gray-100">
                      <span className="text-[16px] font-bold text-black mb-1 uppercase tracking-tight">
                        {currentUser.tier || "Bronze"}
                      </span>
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                        Prestige Tier
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[16px] font-bold text-black mb-1">
                        {currentUser.points || 0}
                      </span>
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                        Loyalty Points
                      </span>
                    </div>
                  </div>

                  {/* Menu List - Light Mode */}
                  <div className="p-8 space-y-2 bg-white">
                    {[
                      {
                        label: "Personal Details",
                        sub: "Manage Profile",
                        icon: User,
                        href: "/account/settings",
                      },
                      {
                        label: "Order History",
                        sub: "Track Purchases",
                        icon: Package,
                        href: "/account/orders",
                      },
                      {
                        label: "My Wishlist",
                        sub: "Saved Items",
                        icon: Heart,
                        href: "/account/wishlist",
                      },
                      {
                        label: "Shipping Addresses",
                        sub: "Manage Locations",
                        icon: MapPin,
                        href: "/account/addresses",
                      },
                      {
                        label: "Prestige Sanctuary",
                        sub: "Loyalty Benefits",
                        icon: Shield,
                        href: "/account/loyalty",
                      },
                    ].map((item) => (
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
                          <div className="flex items-center gap-3">
                            <span className="block text-[15px] font-bold text-black group-hover:text-black transition-colors">
                              {item.label}
                            </span>
                          </div>
                          <span className="block text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1 group-hover:text-gray-500 transition-colors">
                            {item.sub}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>

                  {/* Sign Out Footer - Light Mode */}
                  <div className="mt-auto p-10 pb-12 border-t border-gray-50">
                    <button
                      className="w-full flex items-center justify-center gap-3 py-5 border border-red-100 bg-red-50/50 hover:bg-red-50 text-red-500 transition-all rounded-full group"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                      <span className="text-[12px] font-bold tracking-[0.3em] uppercase">
                        Sign Out
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center px-12 text-center py-24 bg-white">
                  <div className="w-20 h-20 rounded-full border border-gray-100 flex items-center justify-center mb-10 bg-gray-50">
                    <User className="w-[30px] h-[30px] text-gray-300 stroke-1" />
                  </div>

                  <h2 className="text-[24px] font-bold tracking-tighter leading-none uppercase mb-6 text-black inline-block">
                    Join The Collection
                  </h2>

                  <p className="text-[11px] text-gray-400 leading-relaxed mb-12 uppercase tracking-[0.2em] font-medium text-center max-w-xs mx-auto">
                    Sync your shopping experience across all devices. Save
                    wishlists, track orders, and get faster checkout.
                  </p>

                  <div className="w-full space-y-4 max-w-[320px]">
                    <Button
                      onClick={handleLoginRedirect}
                      variant="primary"
                      size="lg"
                      className="w-full bg-black text-white hover:bg-gray-800 border-none h-[56px] text-xs tracking-[0.2em] font-bold"
                    >
                      SIGN IN
                    </Button>
                    <Button
                      onClick={handleRegisterRedirect}
                      variant="outline"
                      size="lg"
                      className="w-full border-black bg-transparent text-black! hover:bg-black! hover:text-white! h-[56px] text-xs tracking-[0.2em] font-bold uppercase transition-colors"
                    >
                      CREATE ACCOUNT
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
