"use client";
import { useCategories } from "@/hooks/api/useCategories";
import { useProducts } from "@/hooks/api/useProducts";
import { useEffect, useMemo, useState } from "react";

export const useCategoryFilters = (category) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSearchQuery, setTempSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [tempMinPrice, setTempMinPrice] = useState("");
  const [tempMaxPrice, setTempMaxPrice] = useState("");
  const [isFilterMobileOpen, setIsFilterMobileOpen] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState({});

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(tempSearchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [tempSearchQuery]);

  const { useCategoryDetail } = useCategories();
  const { data: categoryData } = useCategoryDetail(category);

  const { useAllProducts } = useProducts();

  const queryParams = useMemo(() => {
    const p = { limit: 1000 };
    if (category !== "all") p.categorySlug = category;
    if (searchQuery) p.searchTerm = searchQuery;
    if (minPrice) p.minPrice = minPrice;
    if (maxPrice) p.maxPrice = maxPrice;

    if (selectedStatuses.includes("in-stock") && !selectedStatuses.includes("out-of-stock")) p.inStock = "true";
    if (selectedStatuses.includes("out-of-stock") && !selectedStatuses.includes("in-stock")) p.inStock = "false";

    return p;
  }, [category, searchQuery, minPrice, maxPrice, selectedStatuses]);

  const { data: productsResponse, isLoading } = useAllProducts(queryParams);
  const products = productsResponse?.data || [];

  const variantOptions = useMemo(() => {
    const options = {};
    products.forEach((product) => {
      product.variants?.forEach((variant) => {
        if (!options[variant.name]) options[variant.name] = new Set();
        variant.values?.forEach((val) => {
          const valueName = val?.value || val;
          if (valueName) options[variant.name].add(valueName);
        });
      });
    });

    Object.keys(options).forEach((key) => {
      options[key] = Array.from(options[key]);
    });
    return options;
  }, [products]);

  const toggleVariantFilter = (variantName, value) => {
    setSelectedVariants((prev) => {
      const activeValues = prev[variantName] || [];
      if (activeValues.includes(value)) {
        return {
          ...prev,
          [variantName]: activeValues.filter((v) => v !== value),
        };
      } else {
        return { ...prev, [variantName]: [...activeValues, value] };
      }
    });
  };

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((product) => {
        const status = product.stockStage || (product.inventory > 0 ? "in-stock" : "out-of-stock");
        return selectedStatuses.includes(status);
      });
    }

    if (minPrice || maxPrice) {
      const min = Number(minPrice) || 0;
      const max = Number(maxPrice) || Number.MAX_SAFE_INTEGER;
      filtered = filtered.filter((product) => {
        const effectivePrice = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
        return effectivePrice >= min && effectivePrice <= max;
      });
    }

    const activeVariantNames = Object.keys(selectedVariants).filter(
      (name) => selectedVariants[name].length > 0
    );

    if (activeVariantNames.length > 0) {
      filtered = filtered.filter((product) => {
        return activeVariantNames.every((variantName) => {
          const productVariant = product.variants?.find(
            (v) => v.name === variantName
          );
          if (!productVariant) return false;

          const productValues = productVariant.values.map((v) => v.value || v);
          return selectedVariants[variantName].some((selectedVal) =>
            productValues.includes(selectedVal)
          );
        });
      });
    }

    return filtered;
  }, [products, selectedVariants, selectedStatuses, minPrice, maxPrice]);

  const counts = {
    inStock: products.filter((p) => p.inventory > 0).length,
    outOfStock: products.filter((p) => p.inventory === 0).length,
    preOrder: products.filter((p) => p.stockStage === "pre-order").length,
    upcoming: products.filter((p) => p.stockStage === "upcoming").length,
  };

  const isFiltering =
    tempSearchQuery || selectedStatuses.length > 0 || minPrice || maxPrice || Object.values(selectedVariants).some((vals) => vals.length > 0);

  const resetFilters = () => {
    setSearchQuery("");
    setTempSearchQuery("");
    setSelectedStatuses([]);
    setMinPrice("");
    setMaxPrice("");
    setTempMinPrice("");
    setTempMaxPrice("");
    setSelectedVariants({});
  };

  const toggleStatusFilter = (status) => {
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const applyPriceFilter = () => {
    setMinPrice(tempMinPrice);
    setMaxPrice(tempMaxPrice);
  };

  return {
    categoryData,
    products,
    filteredProducts,
    variantOptions,
    tempSearchQuery,
    setTempSearchQuery,
    selectedStatuses,
    toggleStatusFilter,
    tempMinPrice,
    setTempMinPrice,
    tempMaxPrice,
    setTempMaxPrice,
    applyPriceFilter,
    selectedVariants,
    toggleVariantFilter,
    isFiltering,
    resetFilters,
    isLoading,
    counts,
    isFilterMobileOpen,
    setIsFilterMobileOpen,
  };
};
