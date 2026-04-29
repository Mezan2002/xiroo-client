/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useUser } from "@/hooks/api/useUser";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/useToast";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export const useProductActions = (product) => {
  const { user } = useUser();
  const { addItem } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const [dates, setDates] = useState({
    purchased: "",
    processing: "",
    delivered: "",
  });

  useEffect(() => {
    const format = (date) =>
      date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const now = new Date();
    const processingEnd = new Date(now);
    processingEnd.setDate(now.getDate() + 2);
    const deliveredStart = new Date(now);
    deliveredStart.setDate(now.getDate() + 2);
    const deliveredEnd = new Date(now);
    deliveredEnd.setDate(now.getDate() + 3);

    setDates({
      purchased: format(now),
      processing: `${format(now)} — ${format(processingEnd)}`,
      delivered: `${format(deliveredStart)} — ${format(deliveredEnd)}`,
    });
  }, []);

  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay - now;
      if (diff <= 0) return "00:00:00";
      const h = Math.floor(diff / 3600000)
        .toString()
        .padStart(2, "0");
      const m = Math.floor((diff % 3600000) / 60000)
        .toString()
        .padStart(2, "0");
      const s = Math.floor((diff % 60000) / 1000)
        .toString()
        .padStart(2, "0");
      return `${h}:${m}:${s}`;
    };
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isSaleActive = useMemo(() => {
    const now = new Date();
    return (
      product.salePrice &&
      product.salePrice > 0 &&
      (!product.saleEndDate || new Date(product.saleEndDate) > now)
    );
  }, [product.salePrice, product.saleEndDate]);

  const currentActivePrice = isSaleActive ? product.salePrice : product.price;

  const [selectedBundleId, setSelectedBundleId] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const variantPriceOverride = useMemo(() => {
    return Object.entries(selectedVariants).reduce((max, [vName, vVal]) => {
      const variant = product.variants.find((v) => v.name === vName);
      const valObj = variant?.values.find((v) => (v.value || v) === vVal);
      if (valObj?.price && valObj.price > max) return valObj.price;
      return max;
    }, 0);
  }, [selectedVariants, product.variants]);

  const displayPrice =
    variantPriceOverride > 0 ? variantPriceOverride : currentActivePrice;

  const activeBundles = useMemo(() => {
    const hasBundles = product.bundles && product.bundles.length > 0;
    if (hasBundles) return product.bundles.map((b, i) => ({ ...b, id: i + 1 }));
    return [
      {
        id: 1,
        title: "SINGLE UNIT",
        subtitle: "STANDARD PACK",
        discount: null,
        price: currentActivePrice,
        unitPrice: currentActivePrice,
        badge: null,
      },
    ];
  }, [product.bundles, currentActivePrice]);

  const selectedBundle = activeBundles.find((b) => b.id === selectedBundleId);

  const handleAddToCart = () => {
    const totalRequired = product.variants?.length || 0;
    const totalSelected = Object.keys(selectedVariants).length;
    if (totalSelected < totalRequired) {
      toast.info("Please select all options before adding to bag.");
      return;
    }
    const variantString = Object.entries(selectedVariants)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");

    addItem({
      product: {
        id: product._id,
        title: product.title,
        price: displayPrice,
        salePrice:
          variantPriceOverride > 0
            ? 0
            : isSaleActive
              ? product.salePrice
              : undefined,
        image: product.images?.[0] || "",
      },
      variant: variantString || "Standard",
      quantity,
      silent: true,
    });
    toast.success("Added to your shopping bag");
  };

  const handleOrderNow = () => {
    const totalRequired = product.variants?.length || 0;
    const totalSelected = Object.keys(selectedVariants).length;
    if (totalSelected < totalRequired) {
      toast.info("Please select all options before ordering.");
      return;
    }
    const variantString = Object.entries(selectedVariants)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");

    addItem({
      product: {
        id: product._id,
        title: product.title,
        price: displayPrice,
        salePrice:
          variantPriceOverride > 0
            ? 0
            : isSaleActive
              ? product.salePrice
              : undefined,
        image: product.images?.[0] || "",
      },
      variant: variantString || "Standard",
      quantity,
      silent: true,
    });
    router.push("/checkout");
  };

  return {
    dates,
    timeLeft,
    isSaleActive,
    displayPrice,
    activeBundles,
    selectedBundleId,
    setSelectedBundleId,
    selectedVariants,
    setSelectedVariants,
    quantity,
    setQuantity,
    activeTab,
    setActiveTab,
    handleAddToCart,
    handleOrderNow,
    variantPriceOverride,
  };
};
