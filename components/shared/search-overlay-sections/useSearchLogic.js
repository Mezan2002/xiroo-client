"use client";
import { useProducts } from "@/hooks/api/useProducts";
import { clearRecentViews } from "@/redux/slices/recentlyViewedSlice";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function useDebounce(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export const useSearchLogic = (isOpen, onClose) => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const recentlyViewed = useSelector((state) => state.recentlyViewed.items);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 350);

  const { useSearchProducts, useNewArrivals } = useProducts();
  const { data: searchData, isFetching: isSearching } = useSearchProducts(debouncedQuery);
  const { data: trendingData } = useNewArrivals(4);

  const searchResults = searchData?.data || searchData?.products || searchData || [];
  const trendingProducts = trendingData?.data || trendingData?.products || trendingData || [];

  const isSearchMode = debouncedQuery.trim().length > 0;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const handleClearRecent = () => dispatch(clearRecentViews());
  const handleTrendingClick = (term) => setQuery(term);

  return {
    query, setQuery, debouncedQuery, isSearching, searchResults, trendingProducts,
    recentlyViewed, isSearchMode, handleClearRecent, handleTrendingClick, inputRef
  };
};
