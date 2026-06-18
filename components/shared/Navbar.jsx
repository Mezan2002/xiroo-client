/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useUser } from "@/hooks/api/useUser";
import { useCart } from "@/hooks/useCart";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import MobileMenu from "./MobileMenu";
import DesktopNavbar from "./navbar-sections/DesktopNavbar";
import MobileNavbar from "./navbar-sections/MobileNavbar";
import { useNavbarData } from "./navbar-sections/useNavbarData";

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

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { navItems, menusData } = useNavbarData();
  const { user: currentUser } = useUser();
  const { itemCount } = useCart();
  const isLoggedIn = !!currentUser;

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = pathname === "/";
  const isSolid = !isHomePage || scrolled || activeMenu !== null;

  const commonProps = {
    isSolid,
    mounted,
    currentUser,
    isLoggedIn,
    itemCount,
    setIsSearchOpen,
    setIsCartOpen,
    setIsUserOpen,
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 w-full flex flex-col">
        <div
          className={`grid transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${scrolled ? "grid-rows-[0fr] opacity-0 delay-0" : "grid-rows-[1fr] opacity-100 delay-500"}`}
        >
          <div className="overflow-hidden min-h-0">
            <div
              className={`transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${scrolled ? "-translate-y-full" : "translate-y-0"}`}
            >
              {/* <NoticeBoard /> */}
            </div>
          </div>
        </div>
        <nav
          className={`relative w-full h-[64px] lg:h-[72px] transition-colors duration-300 ${isSolid ? "text-black delay-0" : "text-white delay-500"}`}
        >
          <div
            className={`absolute inset-0 bg-white origin-top transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] -z-10 ${isSolid ? "scale-y-100 delay-0" : "scale-y-0 delay-500"}`}
          />

          <MobileNavbar
            {...commonProps}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />

          <DesktopNavbar
            {...commonProps}
            navItems={navItems}
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            scrolled={scrolled}
            menusData={menusData}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
        </nav>
      </div>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <UserAccountDrawer
        isOpen={isUserOpen}
        onClose={() => setIsUserOpen(false)}
      />
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={mounted ? navItems : []}
      />
    </>
  );
}
