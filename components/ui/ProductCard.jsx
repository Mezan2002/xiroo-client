"use client";

import { Button } from "@/components/ui/Button";
import { useUser } from "@/hooks/api/useUser";
import { Heart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";

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
  const { user } = useUser();
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const router = useRouter();
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = (
    imagesProp && imagesProp.length > 0
      ? imagesProp
      : hoverImage
        ? [image, hoverImage]
        : [image]
  ).filter(Boolean);
  const hasVariants = variants && variants.length > 0;
  const buttonText = hasVariants
    ? "CHOOSE OPTIONS"
    : stockStage === "pre-order"
      ? "PRE-ORDER"
      : "ADD TO CART";
  const hasMultipleImages = images.length > 1;

  const isSaved = isInWishlist(id);

  // Format price to use BDT symbol if it currently uses $
  const formattedPrice =
    typeof price === "string" ? price.replace("$", "৳") : `৳${price}`;

  const badgeText = (() => {
    if (badge) return badge;
    if (stockStage !== "in-stock") return stockStage.replace("-", " ");

    const numPrice =
      typeof price === "string"
        ? parseFloat(price.replace(/[^0-9.-]+/g, ""))
        : price;
    const numSalePrice =
      typeof salePrice === "string"
        ? parseFloat(salePrice.replace(/[^0-9.-]+/g, ""))
        : salePrice;

    if (numSalePrice && numSalePrice > 0 && numPrice > numSalePrice) {
      const discount = Math.round(((numPrice - numSalePrice) / numPrice) * 100);
      return `SALE ${discount}% OFF`;
    }
    return null;
  })();

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      className="group flex flex-col w-full relative font-montserrat"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0);
      }}
    >
      {/* Image Block wrapper */}
      <div className="relative w-full mb-4 overflow-hidden bg-white border border-zinc-100 group-hover:border-zinc-200 transition-colors duration-500">
        {/* Status Badge (Dynamic Logic) */}
        {!showRemove && badgeText && (
          <div className="absolute top-0 left-0 z-30 px-2 py-1 bg-black">
            <p className="text-[8px] font-bold tracking-[0.2em] text-white uppercase">
              {badgeText}
            </p>
          </div>
        )}

        {/* Aspect Ratio Box Image ONLY */}
        <div className="relative w-full aspect-4/5 sm:aspect-square md:aspect-4/5 overflow-hidden">
          <Link
            href={`/product/${id}`}
            className="absolute w-full h-full block"
          >
            {images.map((img, idx) => (
              <div
                key={idx}
                className="absolute inset-0 w-full h-full transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
              >
                <Image
                  src={img}
                  alt={`${title} view ${idx + 1}`}
                  fill
                  className={`object-cover object-center transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                    idx === currentImageIndex
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-[1.02]"
                  }`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={priority && idx === 0}
                />
              </div>
            ))}
            {/* Subtle overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
          </Link>

          {/* Minimalist Progress Dots (Interactive) */}
          {hasMultipleImages && (
            <div
              className={`absolute left-1/2 -translate-x-1/2 z-20 flex gap-1.5 px-3 py-1.5 rounded-full bg-black/10 backdrop-blur-[2px] transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                isHovered ? "bottom-14" : "bottom-3"
              }`}
            >
              {images.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(dotIdx);
                  }}
                  className={`h-1 transition-all duration-300 rounded-full ${
                    dotIdx === currentImageIndex
                      ? "w-4 bg-white"
                      : "w-1 bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to image ${dotIdx + 1}`}
                />
              ))}
            </div>
          )}

          {showRemove ? (
            <Button
              variant="white"
              size="icon"
              showHoverIcon={false}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist({ id, title, price, salePrice, image });
              }}
              className="absolute right-0 top-0 z-20 size-8 md:size-10 rounded-none bg-white hover:bg-red-50 text-zinc-400 hover:text-red-500 border-l border-b border-zinc-100 transition-all duration-300"
              aria-label="Remove from wishlist"
            >
              <Trash2 className="w-4 h-4 stroke-[1.2]" />
            </Button>
          ) : (
            /* Minimalist Wishlist Button */
            <button
              className={`absolute right-3 top-3 z-20 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                isHovered
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2"
              }`}
              aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!user) {
                  const redirectPath = encodeURIComponent(pathname);
                  router.push(`/login?redirect=${redirectPath}`);
                  return;
                }
                toggleWishlist({ id, title, price, salePrice, image });
              }}
            >
              <Heart
                className={`w-4 h-4 transition-all duration-300 stroke-[1.5] ${
                  isSaved
                    ? "text-[#ff385c] fill-[#ff385c]"
                    : "text-white drop-shadow-md hover:text-[#ff385c] fill-none"
                }`}
              />
            </button>
          )}
        </div>

        {/* Integrated Quick Add Bar */}
        {!["out-of-stock", "upcoming"].includes(stockStage) && (
          <button
            className={`absolute bottom-0 left-0 right-0 h-10 md:h-12 bg-black text-white text-[9px] md:text-[10px] font-bold tracking-[0.2em] flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] z-30 uppercase ${
              isHovered
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0"
            }`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              if (hasVariants) {
                router.push(`/product/${id}`);
                return;
              }

              if (!user) {
                const redirectPath = encodeURIComponent(pathname);
                router.push(`/login?redirect=${redirectPath}`);
                return;
              }

              addItem({
                product: { id, title, price, salePrice, image },
                variant: "Standard",
              });
            }}
          >
            {buttonText}
          </button>
        )}
      </div>

      {/* Details Area (Editorial Layout) */}
      <div className="flex flex-col text-left relative z-10">
        <Link href={`/product/${id}`} className="group/title block">
          <h3 className="text-[10px] md:text-[11px] font-medium text-black tracking-[0.12em] uppercase leading-[1.6] mb-1 line-clamp-2 transition-all duration-300 group-hover/title:text-black group-hover/title:underline underline-offset-[3px] decoration-1 hover:font-semibold">
            {title}
          </h3>
        </Link>
        <div className="flex items-center justify-between border-t border-zinc-100 pt-2.5 mt-1">
          <div className="flex flex-col">
            {["out-of-stock", "upcoming"].includes(stockStage) ? (
              <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">
                {stockStage.replace("-", " ")}
              </span>
            ) : (
              <>
                <span className="text-[10px] md:text-[11px] text-black font-semibold tracking-wider">
                  {salePrice && salePrice > 0
                    ? `৳${salePrice.toLocaleString()}`
                    : formattedPrice}
                </span>
                {salePrice && salePrice > 0 && (
                  <span className="text-[8px] md:text-[9px] text-zinc-400 line-through tracking-wider">
                    {formattedPrice}
                  </span>
                )}
              </>
            )}
          </div>
          <span className="text-[8px] text-zinc-400 font-medium tracking-[0.15em] uppercase">
            {stockStage === "pre-order" ? "Enrolling" : "Limited"}
          </span>
        </div>
      </div>
    </div>
  );
}
