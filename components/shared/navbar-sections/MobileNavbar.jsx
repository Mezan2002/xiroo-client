"use client";
import { LayoutGrid, Menu, Search, ShoppingBag, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { UserAvatar } from "../UserAvatar";

export default function MobileNavbar({
  isSolid,
  setIsMobileMenuOpen,
  setIsSearchOpen,
  mounted,
  currentUser,
  setIsCartOpen,
  itemCount,
  setIsUserOpen,
  isLoggedIn,
}) {
  return (
    <div className="flex lg:hidden items-center justify-between w-full relative h-full px-3">
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 transition-transform active:scale-90"
          aria-label="Menu"
        >
          <Menu className="w-6 h-6 stroke-[1.5]" />
        </button>
        <button
          onClick={() => setIsSearchOpen(true)}
          className="p-2 transition-transform active:scale-90"
          aria-label="Search"
        >
          <Search className="w-5 h-5 stroke-[1.5]" />
        </button>
      </div>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="Xiroo Shop Logo"
            width={90}
            height={90}
            priority
            style={{ height: "auto" }}
            className={`transition-all duration-300 ${
              isSolid ? "delay-0" : "brightness-0 invert delay-500"
            }`}
          />
        </Link>
      </div>

      <div className="flex items-center gap-0.5">
        {mounted && currentUser?.role === "admin" ? (
          <Link
            href="/admin"
            className="p-2 transition-transform active:scale-90"
            aria-label="Admin Dashboard"
          >
            <LayoutGrid className="w-5 h-5 stroke-[1.5]" />
          </Link>
        ) : (
          <button
            onClick={() => setIsCartOpen(true)}
            className="p-2 transition-transform active:scale-90 relative"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
            {mounted && itemCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-black text-[8px] font-bold text-white ring-1 ring-white">
                {itemCount}
              </span>
            )}
          </button>
        )}

        <button
          onClick={() => setIsUserOpen(true)}
          className="p-2 transition-transform active:scale-90"
          aria-label="User Account"
        >
          {mounted && isLoggedIn && currentUser ? (
            <UserAvatar
              user={currentUser}
              className="w-[20px] h-[20px] rounded-full border-[1.5px] border-current bg-transparent"
              textClassName="text-[8px] tracking-widest ml-px"
            />
          ) : (
            <User className="w-5 h-5 stroke-[1.5]" />
          )}
        </button>
      </div>
    </div>
  );
}
