"use client";
import { useProducts } from "@/hooks/api/useProducts";
import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const DEFAULT_NAV_ITEMS = [
  { id: "collections", label: "COLLECTIONS", categories: [], products: [] },
  { id: "new-in", label: "NEW IN", categories: [], products: [] },
  { id: "hot-sale", label: "HOT SALE", categories: [], products: [] },
];

export const useNavbarData = () => {
  const [navItems, setNavItems] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_NAV_ITEMS;
    try {
      const cached = localStorage.getItem("xiroo_cached_nav");
      if (cached) return JSON.parse(cached).items || DEFAULT_NAV_ITEMS;
    } catch (e) {}
    return DEFAULT_NAV_ITEMS;
  });

  const [menusData, setMenusData] = useState(() => {
    if (typeof window === "undefined") return {};
    try {
      const cached = localStorage.getItem("xiroo_cached_nav");
      if (cached) return JSON.parse(cached).data || {};
    } catch (e) {}
    return {};
  });


  const { data: menuResponse } = useQuery({
    queryKey: ["menus"],
    queryFn: async () => {
      const response = await axiosInstance.get("/menus");
      return response.data || response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes fresh
    gcTime: 24 * 60 * 60 * 1000,
    placeholderData: (prev) => prev,
  });


  const { useAllProducts } = useProducts({
    staleTime: 5 * 60 * 1000, // 5 minutes fresh
    gcTime: 60 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

  const { data: productsResponse } = useAllProducts({ limit: 50 });

  useEffect(() => {
    if (menuResponse) {
      const allProducts = productsResponse?.data || productsResponse || [];
      const menusArray = Array.isArray(menuResponse)
        ? menuResponse
        : menuResponse.data || [];

      const items = menusArray.map((menu) => {
        const categories = menu.categories || [];
        const catIds = categories.map((c) => c._id || c.id || c);

        const relevantProducts = allProducts
          .filter((p) =>
            catIds.includes(p.category?._id || p.category?.id || p.category),
          )
          .slice(0, 2);

        return {
          id: menu.slug,
          label: menu.name.toUpperCase(),
          categories: categories,
          products: relevantProducts,
        };
      });

      const data = {};
      items.forEach((item) => {
        data[item.id] = {
          categories: item.categories,
          products: item.products,
        };
      });

      setNavItems(items);
      setMenusData(data);
      if (typeof window !== "undefined" && items.length > 0) {
        localStorage.setItem(
          "xiroo_cached_nav",
          JSON.stringify({ items, data }),
        );
      }
    }
  }, [menuResponse, productsResponse]);

  return { navItems, menusData };
};
