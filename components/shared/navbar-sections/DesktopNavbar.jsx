"use client";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { LayoutGrid, Search, ShoppingBag, User } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { UserAvatar } from "../UserAvatar";
import MegaMenu from "./MegaMenu";
const NavLinks = dynamic(() => import("../NavLinks"), { ssr: false });

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

export default function DesktopNavbar({
  isSolid,
  navItems,
  activeMenu,
  setActiveMenu,
  scrolled,
  menusData,
  mounted,
  currentUser,
  isLoggedIn,
  itemCount,
  notificationCount,
  setIsSearchOpen,
  setIsCartOpen,
  setIsUserOpen,
  setIsMobileMenuOpen,
}) {
  return (
    <div
      className="hidden lg:flex items-center justify-between w-full h-full px-12"
      onMouseLeave={() => setActiveMenu(null)}
    >
      <div
        className="flex items-center gap-8 w-[350px] h-full"
        suppressHydrationWarning
      >
        <div className="flex items-center gap-8 h-full">
          <NavLinks
            navItems={navItems}
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
          />
        </div>

        <MegaMenu
          activeMenu={activeMenu}
          scrolled={scrolled}
          menusData={menusData}
          setActiveMenu={setActiveMenu}
        />
      </div>

      <div className="flex items-center justify-center">
        <Reveal>
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="Xiroo Shop Logo"
              width={130}
              height={130}
              priority
              style={{ height: "auto" }}
              className={`transition-all duration-300 ${
                isSolid ? "delay-0" : "brightness-0 invert delay-500"
              }`}
            />
          </Link>
        </Reveal>
      </div>

      <div className="flex items-center justify-end gap-3 w-[350px]">
        {mounted && currentUser?.role === "admin" && (
          <Reveal>
            <Link href="/admin" className="relative">
              <Button
                variant="ghost"
                size="icon"
                showHoverIcon={false}
                className="hover:bg-transparent! transition-all duration-300 text-inherit!"
                aria-label="Admin Dashboard"
              >
                <LayoutGrid className="w-[18px] h-[18px] stroke-[1.5]" />
              </Button>
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-black px-1 text-[9px] font-bold text-white">
                  {notificationCount}
                </span>
              )}
            </Link>
          </Reveal>
        )}
        <Reveal>
          <Button
            variant="ghost"
            size="icon"
            showHoverIcon={false}
            className="hover:bg-transparent! transition-all duration-300 text-inherit!"
            aria-label="Search"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="w-[18px] h-[18px] stroke-[1.5]" />
          </Button>
        </Reveal>
        <Reveal>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              showHoverIcon={false}
              className="hover:bg-transparent! transition-all duration-300 text-inherit! relative"
              aria-label="Shopping Bag"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="size-4.5 stroke-[1.5]" />
            </Button>
            {mounted && itemCount > 0 && (
              <motion.span
                className="absolute top-1 right-0.5 flex size-4 items-center justify-center rounded-full bg-black px-1 text-[9px] font-bold text-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
              >
                {itemCount}
              </motion.span>
            )}
          </div>
        </Reveal>
        <Reveal>
          <Button
            variant="ghost"
            size="icon"
            showHoverIcon={false}
            className="hover:bg-transparent! transition-all duration-300 text-inherit!"
            aria-label="User Account"
            onClick={() => setIsUserOpen(true)}
          >
            {mounted && isLoggedIn && currentUser ? (
              <UserAvatar
                user={currentUser}
                className="w-[24px] h-[24px] rounded-full border-[1.5px] border-current bg-transparent"
                textClassName="text-[9px] tracking-widest ml-px"
              />
            ) : (
              <User className="w-[18px] h-[18px] stroke-[1.5]" />
            )}
          </Button>
        </Reveal>
      </div>
    </div>
  );
}
