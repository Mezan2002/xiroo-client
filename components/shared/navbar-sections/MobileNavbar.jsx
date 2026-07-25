"use client";
import { LayoutGrid, Menu, Search, ShoppingBag, User } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { UserAvatar } from "../UserAvatar";

function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 1.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

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
        <Reveal>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2"
            aria-label="Menu"
          >
            <Menu className="w-6 h-6 stroke-[1.5]" />
          </button>
        </Reveal>
        <Reveal>
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2"
            aria-label="Search"
          >
            <Search className="w-5 h-5 stroke-[1.5]" />
          </button>
        </Reveal>
      </div>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <Reveal>
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
        </Reveal>
      </div>

      <div className="flex items-center gap-0.5">
        {mounted && currentUser?.role === "admin" ? (
          <Reveal>
            <Link
              href="/admin"
              className="p-2"
              aria-label="Admin Dashboard"
            >
              <LayoutGrid className="w-5 h-5 stroke-[1.5]" />
            </Link>
          </Reveal>
        ) : (
          <Reveal>
            <div className="relative">
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 relative"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              </button>
              {mounted && itemCount > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-black px-1 text-[9px] font-bold text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                  {itemCount}
                </motion.span>
              )}
            </div>
          </Reveal>
        )}

        <Reveal>
          <button
            onClick={() => setIsUserOpen(true)}
            className="p-2"
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
        </Reveal>
      </div>
    </div>
  );
}
