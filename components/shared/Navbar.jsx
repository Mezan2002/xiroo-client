/* eslint-disable react-hooks/set-state-in-effect */
import { Button } from "@/components/ui/Button";
import ProductCard from "@/components/ui/ProductCard";
import { LayoutGrid, Search, ShoppingBag, User } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { UserAvatar } from "./UserAvatar";
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

// Dynamic Navigation Architecture Hooked to Admin Modules

import { useUser } from "@/hooks/api/useUser";
import { useCart } from "@/hooks/useCart";
import { useProducts } from "@/hooks/api/useProducts";
import { useCategories } from "@/hooks/api/useCategories";
import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [navItems, setNavItems] = useState([]);
  const [menusData, setMenusData] = useState({});

  const { user: currentUser } = useUser();
  const { itemCount } = useCart();
  const isLoggedIn = !!currentUser;

  const { data: menuResponse } = useQuery({
    queryKey: ["menus"],
    queryFn: () => axiosInstance.get("/menus"),
    staleTime: 10 * 60 * 1000,
  });

  const { useAllProducts } = useProducts();
  const { data: productsResponse } = useAllProducts({ limit: 50 });

  useEffect(() => {
    setMounted(true);
    if (menuResponse) {
      const allProducts = productsResponse?.data || [];
      const items = menuResponse.data.map((menu) => {
        const categories = menu.categories || [];
        const catIds = categories.map((c) => c._id || c.id || c);

        // Find relevant products for this menu's categories
        const relevantProducts = allProducts
          .filter((p) =>
            catIds.includes(p.category?._id || p.category?.id || p.category),
          )
          .slice(0, 2); // Show top 2 for boutique aesthetic

        return {
          id: menu.slug,
          label: menu.name.toUpperCase(),
          categories: categories,
          products: relevantProducts,
        };
      });
      setNavItems(items);

      const data = {};
      items.forEach((item) => {
        data[item.id] = {
          categories: item.categories,
          products: item.products,
        };
      });
      setMenusData(data);
    }
  }, [menuResponse, productsResponse]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = pathname === "/";
  const isSolid = !isHomePage || scrolled || activeMenu !== null;

  const currentMenuData =
    activeMenu && menusData[activeMenu]
      ? menusData[activeMenu]
      : { categories: [], products: [] };

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
            {navItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center h-full cursor-pointer"
                onMouseEnter={() => setActiveMenu(item.id)}
              >
                <p
                  className={`text-[11px] font-semibold transition-opacity uppercase tracking-widest w-max ${
                    activeMenu === item.id ? "opacity-70" : "hover:opacity-70"
                  }`}
                >
                  {item.label}
                </p>
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
                      key={category._id}
                      href={`/collections/${category.slug}`}
                      className="text-[15px] font-medium tracking-wide text-gray-800 hover:text-black hover:translate-x-1 transition-transform inline-block"
                      onClick={() => setActiveMenu(null)}
                    >
                      {category.name.toUpperCase()}
                    </Link>
                  ))}
                </div>

                {/* Right: Featured Products Grid using reusable ProductCard */}
                <div className="flex gap-6 items-start">
                  {currentMenuData.products.map((product, idx) => (
                    <div key={idx} className="w-[180px] shrink-0">
                      <ProductCard
                        id={product._id}
                        title={product.title}
                        price={product.price}
                        image={product.images?.[0]}
                        images={product.images}
                        hoverImage={product.images?.[1]}
                      />
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
                style={{ height: "auto", width: "130px" }}
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
