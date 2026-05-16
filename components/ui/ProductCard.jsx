"use client";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import ProductImageGallery from "./product-card-sections/ProductImageGallery";
import { useProductCard } from "./product-card-sections/useProductCard";

export default function ProductCard({
  id, title, price, salePrice, image, images: imagesProp, hoverImage,
  variants = [], showRemove = false, onRemove = null, priority = false,
  stockStage = "in-stock", badge,
}) {
  const {
    user, isHovered, setIsHovered, currentImageIndex, setCurrentImageIndex,
    images, isSaved, hasVariants, handleQuickAdd, handleWishlist, router, pathname
  } = useProductCard({ id, title, price, salePrice, image, images: imagesProp, hoverImage, variants, stockStage });

  const formattedPrice = typeof price === "string" ? price.replace("$", "৳") : `৳${price}`;
  const buttonText = hasVariants ? "OPTIONS" : "ADD";

  const badgeText = badge || (stockStage !== "in-stock" ? stockStage.replace("-", " ") : (() => {
    const numPrice = typeof price === "string" ? parseFloat(price.replace(/[^0-9.-]+/g, "")) : price;
    const numSalePrice = typeof salePrice === "string" ? parseFloat(salePrice.replace(/[^0-9.-]+/g, "")) : salePrice;
    if (numSalePrice && numSalePrice > 0 && numPrice > numSalePrice) {
      return `-${Math.round(((numPrice - numSalePrice) / numPrice) * 100)}%`;
    }
    return null;
  })());

  return (
    <div
      className="group flex flex-col w-full relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setCurrentImageIndex(0); }}
      onClick={() => router.push(`/product/${id}`)}
    >
      {/* 1. Image Viewport */}
      <div className="relative w-full aspect-square overflow-hidden bg-[#f9f9f9] border border-zinc-100 transition-all duration-500 group-hover:border-zinc-300">
        <ProductImageGallery
          id={id} title={title} images={images} currentImageIndex={currentImageIndex}
          setCurrentImageIndex={setCurrentImageIndex} priority={priority} isHovered={isHovered}
        />

        {/* Status Badge */}
        {badgeText && (
          <div className="absolute top-0 left-0 z-30 px-2 py-1 bg-black">
             <span className="text-[9px] font-bold tracking-[0.1em] text-white uppercase">{badgeText}</span>
          </div>
        )}

        {/* Hover Action Overlay */}
        <div className={`absolute inset-0 z-20 bg-white/10 backdrop-blur-[2px] transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

        {/* Floating Quick Add */}
        <div className={`absolute bottom-4 left-4 right-4 z-30 transition-all duration-500 transform ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <button
            onClick={handleQuickAdd}
            className="w-full h-11 bg-black text-white flex items-center justify-center gap-3 shadow-2xl hover:bg-zinc-800 transition-colors"
          >
            <ShoppingBag size={14} className="stroke-[1.5]" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">{buttonText}</span>
          </button>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute right-4 top-4 z-30 transition-all duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className={`size-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${isSaved ? "bg-black text-white" : "bg-white text-black hover:bg-black hover:text-white"}`}>
            <Heart className={`w-4 h-4 stroke-[1.5] ${isSaved ? "fill-white" : "fill-none"}`} />
          </div>
        </button>
      </div>

      {/* 2. Product Information */}
      <div className="pt-4 flex flex-col gap-2">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-[11px] md:text-[12px] font-bold text-black tracking-[0.1em] uppercase leading-relaxed flex-1 group-hover:text-zinc-600 transition-colors">
            {title}
          </h3>
        </div>
        
        <div className="flex items-center justify-between border-t border-zinc-100 pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-[13px] md:text-[15px] text-black font-medium tracking-tight">
              {salePrice && salePrice > 0 ? `৳${salePrice.toLocaleString()}` : formattedPrice}
            </span>
            {salePrice && salePrice > 0 && (
              <span className="text-[10px] md:text-[11px] text-zinc-400 line-through font-light">
                {formattedPrice}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1.5">
            <div className={`size-1 rounded-full ${stockStage === 'in-stock' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-[0.15em]">
              {stockStage === "pre-order" ? "Pre-order" : "Stock"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
