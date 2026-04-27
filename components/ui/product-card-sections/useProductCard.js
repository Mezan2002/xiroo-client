"use client";

import { useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/hooks/api/useUser";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";

/**
 * Senior Dev Hook: useProductCard
 * Logic for handling ProductCard state and actions.
 */
export function useProductCard({ id, title, price, salePrice, image, images: imagesProp, hoverImage, variants, stockStage }) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Construct images array
  const images = useMemo(() => {
    let list = [];
    if (imagesProp && imagesProp.length > 0) {
      list = [...imagesProp];
    } else if (image) {
      list = [image];
    }
    
    if (hoverImage && !list.includes(hoverImage)) {
      // If we have a dedicated hover image and it's not already in the list, 
      // we might want to ensure it's the second image for the hover effect
      if (list.length > 0) {
        return [list[0], hoverImage, ...list.slice(1)];
      }
      return [hoverImage];
    }
    return list;
  }, [image, imagesProp, hoverImage]);

  const isSaved = isInWishlist(id);
  const hasVariants = variants && variants.length > 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      const redirectPath = encodeURIComponent(pathname);
      router.push(`/login?redirect=${redirectPath}`);
      return;
    }

    if (hasVariants) {
      router.push(`/product/${id}`);
      return;
    }

    addItem({
      product: {
        id,
        title,
        price,
        salePrice,
        image: images[0] || image,
      },
      variant: "Standard",
    });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      const redirectPath = encodeURIComponent(pathname);
      router.push(`/login?redirect=${redirectPath}`);
      return;
    }

    toggleWishlist({
      _id: id,
      id,
      title,
      price,
      salePrice,
      images,
      image: images[0] || image,
    });
  };

  return {
    user,
    isHovered,
    setIsHovered,
    currentImageIndex,
    setCurrentImageIndex,
    images,
    isSaved,
    hasVariants,
    handleQuickAdd,
    handleWishlist,
    router,
    pathname,
  };
}
