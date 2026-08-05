"use client";
import { Heart } from "lucide-react";
import ProductImageGallery from "./product-card-sections/ProductImageGallery";
import { useProductCard } from "./product-card-sections/useProductCard";

export default function ProductCard({
  id,
  title,
  price,
  salePrice,
  image,
  images: imagesProp,
  hoverImage,
  variants = [],
  showRemove = false,
  onRemove = null,
  priority = false,
  stockStage = "in-stock",
  badge,
  dark = false,
}) {
  const {
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
  } = useProductCard({
    id,
    title,
    price,
    salePrice,
    image,
    images: imagesProp,
    hoverImage,
    variants,
    stockStage,
  });

  const formattedPrice =
    typeof price === "string" ? price.replace("$", "৳") : `৳${price}`;

  const badgeText =
    badge || (stockStage !== "in-stock" ? stockStage.replace("-", " ") : null);

  return (
    <div
      className={`group flex flex-col w-full relative transition-all duration-300 cursor-pointer ${
        dark ? "bg-transparent" : "bg-white"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0);
      }}
      onClick={() => router.push(`/product/${id}`)}
    >
      {/* 1. Pure Viewport - No Overlays */}
      <div
        className={`relative w-full aspect-square overflow-hidden ${
          dark ? "bg-white/[0.04]" : "bg-[#f8f8f8]"
        }`}
      >
        <ProductImageGallery
          id={id}
          title={title}
          images={images}
          currentImageIndex={currentImageIndex}
          setCurrentImageIndex={setCurrentImageIndex}
          priority={priority}
          isHovered={isHovered}
        />
      </div>

      {/* 2. Compact Info Section */}
      <div className="pt-4 flex flex-col relative">
        <div className="flex justify-between items-start gap-4">
          <h3
            className={`text-[10px] md:text-[11px] font-bold tracking-[0.05em] uppercase line-clamp-1 flex-1 ${
              dark ? "text-white" : "text-black"
            }`}
          >
            {title}
          </h3>
          <span
            className={`text-[11px] font-bold ${
              dark ? "text-white" : "text-black"
            }`}
          >
            {salePrice && salePrice > 0
              ? `৳${salePrice.toLocaleString()}`
              : formattedPrice}
          </span>
        </div>

        <div className="flex items-center justify-between mt-2.5">
          <div className="flex items-center gap-2">
            {badgeText && (
              <span
                className={`text-[8px] font-bold uppercase tracking-widest ${
                  dark ? "text-white/40" : "text-zinc-400"
                }`}
              >
                {badgeText}
              </span>
            )}
            <span
              className={`text-[8px] ${
                dark ? "text-white/20" : "text-zinc-200"
              }`}
            >
              |
            </span>
            <span
              className={`text-[8px] font-medium uppercase tracking-widest ${
                dark ? "text-white/40" : "text-zinc-400"
              }`}
            >
              {stockStage}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleWishlist(e);
            }}
            className="p-1 -mr-1 hover:scale-110 transition-transform"
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors ${
                isSaved
                  ? dark
                    ? "text-white fill-white"
                    : "text-black fill-black"
                  : dark
                    ? "text-white/30 hover:text-white"
                    : "text-zinc-300 hover:text-black"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
