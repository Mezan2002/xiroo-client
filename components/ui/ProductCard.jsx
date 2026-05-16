"use client";
import { Heart, ShoppingBag, Plus } from "lucide-react";
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

  const badgeText = badge || (stockStage !== "in-stock" ? stockStage.replace("-", " ") : null);

  return (
    <div
      className="group flex flex-col w-full relative bg-white transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setCurrentImageIndex(0); }}
      onClick={() => router.push(`/product/${id}`)}
    >
      {/* 1. Pure Viewport - No Overlays */}
      <div className="relative w-full aspect-square overflow-hidden bg-[#f8f8f8]">
        <ProductImageGallery
          id={id} title={title} images={images} currentImageIndex={currentImageIndex}
          setCurrentImageIndex={setCurrentImageIndex} priority={priority} isHovered={isHovered}
        />
      </div>

      {/* 2. Compact Info Section */}
      <div className="pt-4 flex flex-col relative overflow-hidden h-[90px]">
        {/* State 1: Default View (Title & Price) */}
        <div className={`flex flex-col gap-2.5 transition-all duration-500 transform ${isHovered ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
          <div className="flex justify-between items-start gap-4">
             <h3 className="text-[10px] md:text-[11px] font-bold text-black tracking-[0.05em] uppercase line-clamp-1 flex-1">
               {title}
             </h3>
             <span className="text-[11px] font-bold text-black">
               {salePrice && salePrice > 0 ? `৳${salePrice.toLocaleString()}` : formattedPrice}
             </span>
          </div>
          
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
                {badgeText && <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">{badgeText}</span>}
                <span className="text-zinc-200 text-[8px]">|</span>
                <span className="text-[8px] text-zinc-400 font-medium uppercase tracking-widest">{stockStage}</span>
             </div>
             <Heart className={`w-3.5 h-3.5 ${isSaved ? 'text-black fill-black' : 'text-zinc-300'}`} />
          </div>
        </div>

        {/* State 2: Hover View (Action Bar) */}
        <div className={`absolute inset-0 pt-4 px-0.5 transition-all duration-500 transform ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
           <div className="flex gap-2 h-11">
             <button
                onClick={handleQuickAdd}
                className="flex-1 bg-black text-white flex items-center justify-center gap-3 hover:bg-zinc-800 transition-colors"
             >
                <ShoppingBag size={14} className="stroke-[1.5]" />
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase">{buttonText}</span>
             </button>
             <button
                onClick={handleWishlist}
                className={`w-11 border-2 flex items-center justify-center transition-colors ${isSaved ? 'bg-black border-black text-white' : 'border-zinc-100 text-black hover:border-black'}`}
             >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : 'fill-none'}`} />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}
