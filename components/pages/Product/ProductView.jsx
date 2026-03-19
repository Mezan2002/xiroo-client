"use client";
import { Button } from "@/components/ui/Button";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductReviews from "./ProductReviews";
import RelatedProducts from "./RelatedProducts";

const MOCK_PRODUCT = {
  id: "1",
  title: "Xiroo™ Minimalist LED String Cap Lamp",
  price: "$58.50",
  referencePrice: "$73.43",
  images: [
    "/images/image-2.jpeg",
    "/images/comparison-dark.png",
    "/images/comparison-light.png",
    "/images/featured-product-main.png",
    "/images/product-coffee-1.png",
    "/images/product-travel-bottles.png",
  ],
  category: "Lighting",
  description:
    "Experience lighting architecture explicitly engineered for calm precision. Floating directly over its premium matte core base powered strictly by custom magnetic tracking loops.",
  rating: 4.8,
  reviewsCount: 104,
  colors: ["Dark Grey", "Green", "White", "Yellow"],
  electricalOutlet: "USB",
  materials: "Premium Matte Aluminum & Glass Envelope.",
  shipping: "Shipping calculated at checkout.",
};

export default function ProductView({ productId }) {
  const product = MOCK_PRODUCT;

  // Sticky bar: shows once cart buttons scroll past the top, stays visible until page end
  const [showStickyBar, setShowStickyBar] = useState(false);
  const cartRef = useRef(null);

  useEffect(() => {
    const cartObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          // Only show when cart has scrolled UP off the top of the screen
          setShowStickyBar(entry.boundingClientRect.top < 0);
        } else {
          setShowStickyBar(false);
        }
      },
      { threshold: 0 },
    );

    if (cartRef.current) cartObserver.observe(cartRef.current);
    return () => cartObserver.disconnect();
  }, []);

  return (
    <div className="w-full">
      <div className="max-w-[1400px] w-full mx-auto px-0 md:px-8 xl:px-12">
        {/* Split Architecture Container */}
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-14 relative">
          {/* Left Side: Elaborate Scrolling Image Gallery */}
          <div className="w-full lg:w-1/2">
            <ProductGallery title={product.title} images={product.images} />
          </div>

          {/* Right Side: Sticky Purchasing Information Block */}
          <div className="w-full lg:w-1/2 relative bg-white">
            <div className="lg:sticky lg:top-[120px]">
              {/* cartRef passed down so ProductInfo can attach it to the cart buttons div */}
              <ProductInfo product={product} cartRef={cartRef} />
            </div>
          </div>
        </div>
      </div>

      <RelatedProducts />
      <ProductReviews />

      {/* Sticky Add to Cart Bar — controlled at ProductView level */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center px-4 pb-4 pt-2 pointer-events-none transition-all duration-300 ${
          showStickyBar
            ? "translate-y-0 opacity-100"
            : "translate-y-6 opacity-0"
        }`}
      >
        <div className="pointer-events-auto w-full max-w-[560px] flex items-center gap-3 bg-white border border-gray-300 shadow-[0_8px_30px_rgba(0,0,0,0.14)] px-3 py-3">
          {/* Thumbnail */}
          <div className="w-12 h-12 bg-gray-100 shrink-0 overflow-hidden">
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={product.title}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <ShoppingCart size={18} className="text-gray-400" />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[12px] font-bold text-black truncate leading-tight">
              {product.title}
            </span>
            <span className="text-[11px] text-gray-500 mt-px truncate">
              {product.colors?.[0]} / {product.electricalOutlet}
            </span>
          </div>

          {/* Price */}
          <div className="flex flex-col items-end shrink-0 mr-1">
            <span className="text-[14px] font-black text-black">
              {product.price}
            </span>
            <span className="text-[10px] text-gray-400 line-through">
              {product.referencePrice}
            </span>
          </div>

          {/* CTA */}
          <Button>
            <div className="flex items-center gap-2">
              <ShoppingCart size={14} />
              ADD TO CART
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
