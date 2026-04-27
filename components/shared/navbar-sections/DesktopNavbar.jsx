"use client";
import { Button } from "@/components/ui/Button";
import { LayoutGrid, Search, ShoppingBag, User } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import MegaMenu from "./MegaMenu";
import { UserAvatar } from "../UserAvatar";

const NavLinks = dynamic(() => import("../NavLinks"), { ssr: false });

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
  setIsSearchOpen,
  setIsCartOpen,
  setIsUserOpen,
}) {
  return (
    <div
      className="hidden lg:flex items-center justify-between w-full h-full px-12"
      onMouseLeave={() => setActiveMenu(null)}
    >
      <div className="flex items-center gap-8 w-[350px] h-full">
        <NavLinks
          navItems={navItems}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />
        <MegaMenu
          activeMenu={activeMenu}
          scrolled={scrolled}
          menusData={menusData}
          setActiveMenu={setActiveMenu}
        />
      </div>

      <div className="flex items-center justify-center">
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
      </div>

      <div className="flex items-center justify-end gap-3 w-[350px]">
        {mounted && currentUser?.role === "admin" && (
          <Link href="/admin">
            <Button
              variant="ghost"
              size="icon"
              showHoverIcon={false}
              className="hover:bg-transparent! transition-all duration-300 text-inherit!"
              aria-label="Admin Dashboard"
            >
              <LayoutGrid className="w-[18px] h-[18px] stroke-[1.5]" />
            </Button>
          </Link>
        )}
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
        <Button
          variant="ghost"
          size="icon"
          showHoverIcon={false}
          className="hover:bg-transparent! transition-all duration-300 text-inherit! relative"
          aria-label="Shopping Bag"
          onClick={() => setIsCartOpen(true)}
        >
          <ShoppingBag className="w-[18px] h-[18px] stroke-[1.5]" />
          {mounted && itemCount > 0 && (
            <span className="absolute -top-1 -right-1.5 flex size-3.5 items-center justify-center rounded-full bg-black text-[7px] font-medium text-white ring-1 ring-white">
              {itemCount}
            </span>
          )}
        </Button>
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
      </div>
    </div>
  );
}
