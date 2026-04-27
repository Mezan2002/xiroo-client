"use client";
import { Heart, Trash2 } from "lucide-react";
import Link from "next/link";
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
  const buttonText = hasVariants ? "CHOOSE OPTIONS" : stockStage === "pre-order" ? "PRE-ORDER" : "ADD TO CART";

  const badgeText = badge || (stockStage !== "in-stock" ? stockStage.replace("-", " ") : (() => {
    const numPrice = typeof price === "string" ? parseFloat(price.replace(/[^0-9.-]+/g, "")) : price;
    const numSalePrice = typeof salePrice === "string" ? parseFloat(salePrice.replace(/[^0-9.-]+/g, "")) : salePrice;
    if (numSalePrice && numSalePrice > 0 && numPrice > numSalePrice) {
      return `SALE ${Math.round(((numPrice - numSalePrice) / numPrice) * 100)}% OFF`;
    }
    return null;
  })());

  return (
    <div
      className="group flex flex-col w-full relative font-montserrat"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setCurrentImageIndex(0); }}
    >
      <div className="relative w-full mb-4 overflow-hidden bg-white border border-zinc-100 group-hover:border-zinc-200 transition-colors duration-500">
        {!showRemove && badgeText && (
          <div className="absolute top-0 left-0 z-30 px-2 py-1 bg-black">
            <p className="text-[8px] font-bold tracking-[0.2em] text-white uppercase">{badgeText}</p>
          </div>
        )}

        <ProductImageGallery
          id={id} title={title} images={images} currentImageIndex={currentImageIndex}
          setCurrentImageIndex={setCurrentImageIndex} priority={priority} isHovered={isHovered}
        />

        {showRemove ? (
          <button
            onClick={handleWishlist}
            className="absolute right-0 top-0 z-20 size-8 md:size-10 bg-white hover:bg-red-50 text-zinc-400 hover:text-red-500 border-l border-b border-zinc-100 transition-all flex items-center justify-center"
          >
            <Trash2 className="w-4 h-4 stroke-[1.2]" />
          </button>
        ) : (
          <button
            onClick={handleWishlist}
            className={`absolute right-3 top-3 z-20 transition-all duration-500 ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
          >
            <Heart className={`w-4 h-4 transition-all stroke-[1.5] ${isSaved ? "text-[#ff385c] fill-[#ff385c]" : "text-white drop-shadow-md hover:text-[#ff385c] fill-none"}`} />
          </button>
        )}

        {!["out-of-stock", "upcoming"].includes(stockStage) && (
          <button
            onClick={handleQuickAdd}
            className={`absolute bottom-0 left-0 right-0 h-10 bg-black text-white text-[9px] md:text-[10px] font-bold tracking-[0.2em] flex items-center justify-center transition-all duration-500 z-30 uppercase ${isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
          >
            {buttonText}
          </button>
        )}
      </div>

      <div className="flex flex-col text-left relative z-10">
        <Link href={`/product/${id}`} className="group/title block">
          <h3 className="text-[10px] md:text-[11px] font-medium text-black tracking-[0.12em] uppercase leading-[1.6] mb-1 line-clamp-2 transition-all duration-300 group-hover/title:underline decoration-1 hover:font-semibold">{title}</h3>
        </Link>
        <div className="flex items-center justify-between border-t border-zinc-100 pt-2.5 mt-1">
          <div className="flex flex-col">
            {["out-of-stock", "upcoming"].includes(stockStage) ? (
              <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">{stockStage.replace("-", " ")}</span>
            ) : (
              <>
                <span className="text-[10px] md:text-[11px] text-black font-semibold tracking-wider">{salePrice && salePrice > 0 ? `৳${salePrice.toLocaleString()}` : formattedPrice}</span>
                {salePrice && salePrice > 0 && <span className="text-[8px] md:text-[9px] text-zinc-400 line-through tracking-wider">{formattedPrice}</span>}
              </>
            )}
          </div>
          <span className="text-[8px] text-zinc-400 font-medium tracking-[0.15em] uppercase">{stockStage === "pre-order" ? "Enrolling" : "Limited"}</span>
        </div>
      </div>
    </div>
  );
}
