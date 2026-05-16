"use client";
import { Heart, Trash2 } from "lucide-react";
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
  const buttonText = hasVariants
    ? "CHOOSE OPTIONS"
    : stockStage === "pre-order"
      ? "PRE-ORDER"
      : "ADD TO CART";

  const badgeText =
    badge ||
    (stockStage !== "in-stock"
      ? stockStage.replace("-", " ")
      : (() => {
          const numPrice =
            typeof price === "string"
              ? parseFloat(price.replace(/[^0-9.-]+/g, ""))
              : price;
          const numSalePrice =
            typeof salePrice === "string"
              ? parseFloat(salePrice.replace(/[^0-9.-]+/g, ""))
              : salePrice;
          if (numSalePrice && numSalePrice > 0 && numPrice > numSalePrice) {
            return `SALE ${Math.round(((numPrice - numSalePrice) / numPrice) * 100)}% OFF`;
          }
          return null;
        })());

  return (
    <div
      className="group flex flex-col w-full relative font-montserrat cursor-pointer overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0);
      }}
      onClick={() => router.push(`/product/${id}`)}
    >
      {/* Image Container - Square Poster Style */}
      <div className="relative w-full aspect-square overflow-hidden bg-[#F7F7F7]">
        {/* Floating Badge */}
        {!showRemove && badgeText && (
          <div
            className={`absolute top-4 left-4 z-30 px-3 py-1 bg-black shadow-lg transition-all duration-500 ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[9px] font-bold tracking-[0.25em] text-white uppercase">
              {badgeText}
            </p>
          </div>
        )}

        <ProductImageGallery
          id={id}
          title={title}
          images={images}
          currentImageIndex={currentImageIndex}
          setCurrentImageIndex={setCurrentImageIndex}
          priority={priority}
          isHovered={isHovered}
        />

        {/* Action Overlay */}
        <div
          className={`absolute inset-0 z-20 transition-all duration-700 ${isHovered ? "bg-black/5" : "bg-transparent"}`}
        />

        {showRemove ? (
          <button
            onClick={handleWishlist}
            className="absolute right-4 top-4 z-30 size-10 bg-white hover:bg-red-50 text-zinc-400 hover:text-red-500 rounded-full shadow-xl transition-all flex items-center justify-center"
          >
            <Trash2 className="w-4 h-4 stroke-[1.5]" />
          </button>
        ) : (
          <button
            onClick={handleWishlist}
            className={`absolute right-4 top-4 z-30 transition-all duration-500 ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`}
          >
            <div
              className={`size-10 rounded-full flex items-center justify-center transition-colors ${isSaved ? "bg-white text-[#ff385c]" : "bg-white/80 backdrop-blur-md text-black hover:bg-white"}`}
            >
              <Heart
                className={`w-4 h-4 stroke-[1.5] ${isSaved ? "fill-[#ff385c]" : "fill-none"}`}
              />
            </div>
          </button>
        )}

        {!["out-of-stock", "upcoming"].includes(stockStage) && (
          <button
            onClick={handleQuickAdd}
            className={`absolute bottom-0 left-0 right-0 h-12 bg-black text-white text-[10px] font-bold tracking-[0.3em] flex items-center justify-center transition-all duration-500 z-30 uppercase ${isHovered ? "translate-y-0" : "translate-y-full"}`}
          >
            {buttonText}
          </button>
        )}
      </div>

      {/* Info Section */}
      <div className="pt-5 space-y-3">
        <div className="space-y-1">
          <h3 className="text-[11px] md:text-[12px] font-bold text-black tracking-[0.15em] uppercase leading-relaxed line-clamp-2 min-h-[2.4em]">
            {title}
          </h3>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-1">
            {["out-of-stock", "upcoming"].includes(stockStage) ? (
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                {stockStage.replace("-", " ")}
              </span>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-[14px] md:text-[16px] text-black font-medium tracking-tight">
                  {salePrice && salePrice > 0
                    ? `৳${salePrice.toLocaleString()}`
                    : formattedPrice}
                </span>
                {salePrice && salePrice > 0 && (
                  <span className="text-[11px] text-zinc-400 line-through decoration-zinc-300">
                    {formattedPrice}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pb-1">
            <div
              className={`size-1.5 rounded-full ${stockStage === "in-stock" ? "bg-emerald-500" : "bg-amber-500"}`}
            />
            <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">
              {stockStage === "pre-order" ? "Enrollment" : "Limited Ed."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
