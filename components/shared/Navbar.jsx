/* eslint-disable react-hooks/set-state-in-effect */
import { Button } from "@/components/ui/Button";
import ProductCard from "@/components/ui/ProductCard";
import { useUser } from "@/context/UserContext";
import { LayoutGrid, Search, ShoppingBag, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const CartSidebar = dynamic(() => import("./CartSidebar").then(mod => mod.CartSidebar), { ssr: false });
const SearchOverlay = dynamic(() => import("./SearchOverlay").then(mod => mod.SearchOverlay), { ssr: false });
const UserAccountDrawer = dynamic(() => import("./UserAccountDrawer").then(mod => mod.UserAccountDrawer), { ssr: false });
import { UserAvatar } from "./UserAvatar";

// Structure of our dynamical nav items
const NAV_ITEMS = [
  { id: "collections", label: "COLLECTIONS" },
  { id: "new-in", label: "NEW IN" },
  { id: "hot-sale", label: "HOT SALE" },
];

// Content arrays for each megamenu dropdown tab
const MENUS_DATA = {
  collections: {
    categories: [
      "SMART HOME",
      "HOME DECOR",
      "LIFESTYLE",
      "KITCHEN GADGETS",
      "PET ACCESSORIES",
      "TOYS",
    ],
    products: [
      {
        id: "cat-brush",
        title: "Cat Steam Brush Steamy Dog Brush 3 In 1",
        price: "$24.45",
        image:
          "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=400",
      },
      {
        id: "heated-jacket",
        title: "Winter Heated Jacket USB Electric",
        price: "$45.90",
        image:
          "https://images.unsplash.com/photo-1551028719-00160b23e035?auto=format&fit=crop&q=80&w=400",
      },
      {
        id: "travel-bottles",
        title: "Xiroo™ 4-in-1 Travel Dispensing Bottles",
        price: "$28.55",
        image:
          "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=400",
      },
    ],
  },
  "new-in": {
    categories: [
      "NEW ARRIVALS",
      "TRENDING NOW",
      "BEST SELLERS",
      "FEATURED GEAR",
    ],
    products: [
      {
        id: "smart-lamp",
        title: "Smart LED Desk Lamp with Wireless Charger",
        price: "$35.00",
        image:
          "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=400",
      },
      {
        id: "mini-blender",
        title: "Portable Mini Blender Juicer Cup",
        price: "$19.99",
        image:
          "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&q=80&w=400",
      },
      {
        id: "pet-feeder",
        title: "Automatic Pet Smart Feeder with HD Camera",
        price: "$89.50",
        image:
          "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=400",
      },
    ],
  },
  "hot-sale": {
    categories: ["CLEARANCE", "FLASH DEALS", "UNDER $20", "BUNDLE & SAVE"],
    products: [
      {
        id: "heavy-jacket",
        title: "Men's Winter Heavy Fleece Utility Jacket",
        price: "$39.99",
        image:
          "https://images.unsplash.com/photo-1551028719-00160b23e035?auto=format&fit=crop&q=80&w=400",
      },
      {
        id: "office-chair",
        title: "Ergonomic Office Chair with Lumbar Support",
        price: "$120.00",
        image:
          "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=400",
      },
      {
        id: "anc-earbuds",
        title: "Wireless Active Noise Cancelling Earbuds",
        price: "$45.00",
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400",
      },
    ],
  },
};

import { useCart } from "@/context/CartContext";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { user: currentUser } = useUser();
  const { itemCount } = useCart();
  const isLoggedIn = !!currentUser;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Toggle navbar style after scrolling down 50 pixels
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Require solid navbar everywhere except the exact homepage root
  const isHomePage = pathname === "/";
  const isSolid = !isHomePage || scrolled || activeMenu !== null;

  // Retrieve data for the currently hovered menu. Default to "collections" to avoid
  // undefined mappings during the fade-out closing animation.
  const currentMenuData = activeMenu
    ? MENUS_DATA[activeMenu]
    : MENUS_DATA["collections"];

  return (
    <>
      <nav
        className={`fixed top-0 z-50 w-full h-[72px] transition-colors duration-300 ${
          isSolid ? "text-black delay-0" : "text-white"
        }`}
      >
        {/* Top-to-Bottom White Background Animation Layer */}
        <div
          className={`absolute inset-0 bg-white origin-top transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] -z-10 ${
            isSolid ? "scale-y-100 delay-0" : "scale-y-0 delay-500"
          }`}
        />

        {/* Wrapping content to keep padding structure intact */}
        <div className="w-full h-full px-6 lg:px-12 flex items-center justify-between">
          {/* Left side links with hover wrapper for mega menu */}
          <div
            className="flex items-center gap-8 md:flex w-[250px] h-full"
            onMouseLeave={() => setActiveMenu(null)}
          >
            {NAV_ITEMS.map((item) => (
              <div
                key={item.id}
                className="flex items-center h-full cursor-pointer"
                onMouseEnter={() => setActiveMenu(item.id)}
              >
                <Link
                  href={`/${item.id}`}
                  className={`text-[11px] font-semibold transition-opacity ${
                    activeMenu === item.id ? "opacity-70" : "hover:opacity-70"
                  }`}
                >
                  {item.label}
                </Link>
              </div>
            ))}

            {/* Dynamic Mega Menu Dropdown */}
            <div
              className={`absolute top-[72px] left-0 w-full cursor-default ${
                activeMenu !== null
                  ? "pointer-events-auto"
                  : "pointer-events-none"
              }`}
            >
              {/* Top-to-Bottom Sliding Background Layer for Mega Menu */}
              <div
                className={`absolute inset-0 bg-white border-t border-gray-100 origin-top transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] -z-10 ${
                  activeMenu !== null
                    ? `scale-y-100 shadow-xl ${!scrolled ? "delay-300" : "delay-0"}`
                    : "scale-y-0 shadow-none delay-200"
                }`}
              />

              {/* Mega menu content max width to match navbar flow, fading in on delay */}
              <div
                className={`flex justify-between px-6 lg:px-12 py-10 w-full max-w-[1600px] mx-auto transition-opacity duration-300 ${
                  activeMenu !== null
                    ? `opacity-100 ${!scrolled ? "delay-600" : "delay-300"}`
                    : "opacity-0 delay-0"
                }`}
              >
                {/* Left: Mega Menu Categories */}
                <div className="flex flex-col gap-6 min-w-[250px]">
                  {currentMenuData.categories.map((category) => (
                    <Link
                      key={category}
                      href={`/collections/${category.toLowerCase().replace(/ /g, "-")}`}
                      className="text-[15px] font-medium tracking-wide text-gray-800 hover:text-black hover:translate-x-1 transition-transform"
                    >
                      {category}
                    </Link>
                  ))}
                </div>

                {/* Right: Featured Products Grid using reusable ProductCard */}
                <div className="flex gap-6 items-start">
                  {currentMenuData.products.map((product, idx) => (
                    <div key={idx} className="w-[180px] shrink-0">
                      <ProductCard {...product} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Center Logo */}
          <div className="flex items-center justify-center">
            <Link href="/">
              <Image
                src="/images/logo.png"
                alt="Xiroo Shop Logo"
                width={130}
                height={130}
                style={{ height: "auto" }}
                className={`transition-all duration-300 ${
                  isSolid ? "delay-0" : "brightness-0 invert delay-500"
                }`}
              />
            </Link>
          </div>

          {/* Right side actions */}
          <div className="flex items-center justify-end gap-3 w-[250px]">
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
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] font-bold text-white ring-2 ring-white">
                  {itemCount}
                </span>
              )}
            </Button>

            {mounted && isLoggedIn && currentUser ? (
              <Button
                variant="ghost"
                size="icon"
                showHoverIcon={false}
                className="hover:bg-transparent! transition-all duration-300 text-inherit!"
                aria-label="User Account"
                onClick={() => setIsUserOpen(true)}
              >
                <UserAvatar
                  user={currentUser}
                  className="w-[24px] h-[24px] rounded-full border-[1.5px] border-current bg-transparent"
                  textClassName="text-[9px] tracking-widest ml-px"
                />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                showHoverIcon={false}
                className="hover:bg-transparent! transition-all duration-300 text-inherit!"
                aria-label="User Account"
                onClick={() => setIsUserOpen(true)}
              >
                <User className="w-[18px] h-[18px] stroke-[1.5]" />
              </Button>
            )}
          </div>
        </div>
      </nav>

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
