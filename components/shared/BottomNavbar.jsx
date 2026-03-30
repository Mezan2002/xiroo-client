/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useUser } from "@/hooks/api/useUser";
import { useCart } from "@/hooks/useCart";
import { Home, LayoutGrid, Package, ShoppingBag, User } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const CartSidebar = dynamic(
  () => import("./CartSidebar").then((mod) => mod.CartSidebar),
  { ssr: false },
);
const SearchOverlay = dynamic(
  () => import("./SearchOverlay").then((mod) => mod.SearchOverlay),
  { ssr: false },
);
const UserAccountDrawer = dynamic(
  () => import("./UserAccountDrawer").then((mod) => mod.UserAccountDrawer),
  { ssr: false },
);

export default function BottomNavbar() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // We only show this on mobile (< lg breakpoint)
  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-black px-6 py-4 safe-area-pb shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {/* Home */}
          <Link
            href="/"
            className={`flex flex-col items-center gap-1.5 transition-colors duration-300 ${
              pathname === "/" ? "text-white" : "text-zinc-500 hover:text-white"
            }`}
          >
            <Home className="w-[22px] h-[22px]" />
            <span className="text-[9px] font-bold uppercase tracking-widest">
              Home
            </span>
          </Link>

          {/* Shop */}
          <Link
            href="/collections"
            className={`flex flex-col items-center gap-1.5 transition-colors duration-300 ${
              pathname === "/collections"
                ? "text-white"
                : "text-zinc-500 hover:text-white"
            }`}
          >
            <LayoutGrid className="w-[22px] h-[22px]" />
            <span className="text-[9px] font-bold uppercase tracking-widest">
              Shop
            </span>
          </Link>

          {/* Orders */}
          <Link
            href="/account/orders"
            className={`flex flex-col items-center gap-1.5 transition-colors duration-300 ${
              pathname === "/account/orders"
                ? "text-white"
                : "text-zinc-500 hover:text-white"
            }`}
          >
            <Package className="w-[22px] h-[22px]" />
            <span className="text-[9px] font-bold uppercase tracking-widest">
              Orders
            </span>
          </Link>

          {/* Cart */}
          <button
            onClick={() => setIsCartOpen(true)}
            className={`relative flex flex-col items-center gap-1.5 transition-colors duration-300 ${
              isCartOpen ? "text-white" : "text-zinc-500"
            }`}
          >
            <div className="relative">
              <ShoppingBag className="w-[22px] h-[22px]" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-extrabold text-black ring-2 ring-black">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest">
              Cart
            </span>
          </button>

          {/* Account */}
          <button
            onClick={() => setIsUserOpen(true)}
            className={`flex flex-col items-center gap-1.5 transition-colors duration-300 ${
              isUserOpen ? "text-white" : "text-zinc-500"
            }`}
          >
            <User className="w-[22px] h-[22px]" />
            <span className="text-[9px] font-bold uppercase tracking-widest">
              Account
            </span>
          </button>
        </div>
      </nav>

      {/* Shared Modals for Mobile Hooks */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <UserAccountDrawer
        isOpen={isUserOpen}
        onClose={() => setIsUserOpen(false)}
      />
    </>
  );
}
