"use client";

import { Search, ShoppingBag, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
        title: "Cat Steam Brush Steamy Dog Brush 3 In 1 Electric Spray Cat...",
        price: "$24.45",
      },
      {
        title: "Winter Heated Jacket USB Electric Cotton Coat Zip-up...",
        price: "$45.90",
      },
      {
        title: "Xiroo™ 4-in-1 Travel Dispensing Bottles Portable Lotion Bottle",
        price: "$28.55",
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
        title: "Smart LED Desk Lamp with Wireless Fast Charger...",
        price: "$35.00",
      },
      {
        title: "Portable Mini Blender Juicer Cup Rechargeable...",
        price: "$19.99",
      },
      {
        title: "Automatic Pet Smart Feeder with 1080p HD Camera",
        price: "$89.50",
      },
    ],
  },
  "hot-sale": {
    categories: ["CLEARANCE", "FLASH DEALS", "UNDER $20", "BUNDLE & SAVE"],
    products: [
      {
        title: "Men's Winter Heavy Fleece Lined Utility Jacket...",
        price: "$39.99",
      },
      {
        title: "Ergonomic Office Chair with Adjustable Lumbar Support",
        price: "$120.00",
      },
      {
        title: "Wireless Active Noise Cancelling Earbuds Pro Edition",
        price: "$45.00",
      },
    ],
  },
};

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // Replaced boolean hoveredMenu with a string state tracking exactly WHICH menu is active
  const [activeMenu, setActiveMenu] = useState(null);

  // Fake auth state for conditional rendering
  const isLoggedIn = false;
  const currentUser = { firstName: "John", lastName: "Doe" };

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

              {/* Right: Featured Products Placeholder Grid */}
              <div className="flex gap-6">
                {currentMenuData.products.map((product, idx) => (
                  <div key={idx} className="w-[200px] group cursor-pointer">
                    <div className="aspect-4/5 bg-gray-100 relative overflow-hidden mb-4 rounded-sm">
                      {/* Place image here if available */}
                      <div className="absolute inset-0 bg-gray-200 transition-transform duration-500 group-hover:scale-105"></div>
                    </div>
                    <h3 className="text-[13px] font-medium leading-relaxed text-gray-900 line-clamp-2 group-hover:underline">
                      {product.title}
                    </h3>
                    <p className="text-[13px] text-gray-500 mt-1">
                      {product.price}
                    </p>
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
              className={`transition-all duration-300 ${
                isSolid ? "delay-0" : "brightness-0 invert delay-500"
              }`}
            />
          </Link>
        </div>

        {/* Right side actions */}
        <div className="flex items-center justify-end gap-6 w-[250px]">
          <button
            className="hover:opacity-70 transition-opacity"
            aria-label="Search"
          >
            <Search className="w-[18px] h-[18px] stroke-[1.5]" />
          </button>

          <button
            className="hover:opacity-70 transition-opacity"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-[18px] h-[18px] stroke-[1.5]" />
          </button>

          {isLoggedIn && currentUser ? (
            <button
              className={`flex items-center justify-center size-7 rounded-full font-medium text-[11px] tracking-wider transition-colors duration-300 ${
                isSolid
                  ? "bg-black text-white hover:bg-gray-800 delay-0"
                  : "bg-white text-black hover:bg-gray-300 delay-500"
              }`}
              aria-label="User Account"
            >
              {`${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(0)}`.toUpperCase()}
            </button>
          ) : (
            <button
              className="hover:opacity-70 transition-opacity"
              aria-label="User Account"
            >
              <User className="w-[18px] h-[18px] stroke-[1.5]" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
