"use client";

import { Button } from "@/components/ui/Button";
import { useProducts } from "@/hooks/api/useProducts";
import { useUser } from "@/hooks/api/useUser";
import { useCart } from "@/hooks/useCart";
import { ArrowLeft, ArrowRight, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function FeaturedProduct() {
  const { useFeaturedProducts } = useProducts();
  const { data: response, isLoading } = useFeaturedProducts();
  const featuredProducts = response?.data || [];

  const product = featuredProducts[0] || null;
  const images = product?.images || [];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Sync index once product data is available: Start at index 1 for the right card
  // to differ from the left hero (index 0).
  useEffect(() => {
    if (images.length > 1) {
      setCurrentImageIndex(1);
    }
  }, [images.length]);

  const { user } = useUser();
  const { addItem } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentPrice =
    product?.salePrice && product.salePrice > 0
      ? product.salePrice
      : product?.price;

  const originalPrice = product?.price;
  const hasDiscount = product?.salePrice && product.salePrice > 0;

  if (isLoading) {
    return (
      <section className="w-full flex flex-col lg:flex-row min-h-screen lg:min-h-[400px] border-t border-gray-100">
        <div className="w-full lg:w-1/2 relative h-[50vh] lg:h-[95vh] bg-gray-100 animate-pulse" />
        <div className="w-full lg:w-1/2 bg-[#f5f5f5] p-6 lg:p-12 flex flex-col justify-center items-center">
          <div className="w-full max-w-[500px] flex flex-col gap-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="w-full aspect-square lg:aspect-5/4 bg-gray-200" />
          </div>
        </div>
      </section>
    );
  }

  if (!product) return null;

  return (
    <section className="w-full flex flex-col lg:flex-row min-h-screen lg:min-h-[400px] border-t border-gray-100">
      {/* Left Side: Studio Product Image */}
      <div className="w-full lg:w-1/2 relative h-[50vh] lg:h-[95vh] bg-[#e5e5e5]">
        <Link
          href={`/product/${product._id}`}
          className="absolute inset-0 w-full h-full block"
        >
          {images.length > 0 ? (
            <Image
              src={images[0]}
              alt={product.title}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-xs uppercase tracking-widest">
              No Image
            </div>
          )}
        </Link>
      </div>

      {/* Right Side: Product Details & Lifestyle Gallery */}
      <div className="w-full lg:w-1/2 bg-[#f5f5f5] p-6 lg:p-12 flex flex-col justify-center items-center">
        <div className="w-full max-w-[500px] flex flex-col">
          {/* Header: Title and Pricing */}
          <div className="flex justify-between items-center mb-6 lg:mb-8">
            <h2 className="text-[10px] md:text-[11px] font-semibold text-[#555] uppercase max-w-[80%] leading-relaxed">
              {product.title}
            </h2>
            <div className="flex flex-col items-end">
              <span className="font-semibold text-gray-800 tracking-wide text-[10px] md:text-xs">
                ৳{currentPrice?.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-gray-400 line-through tracking-wide text-[10px] md:text-xs">
                  ৳{originalPrice?.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Gallery Image Container */}
          <div className="relative w-full aspect-square lg:aspect-5/4 bg-[#ececec] overflow-hidden shadow-sm group">
            {images.length > 0 ? (
              <>
                {images.map((img, idx) => (
                  <Image
                    key={idx}
                    src={img}
                    alt={`${product.title} view ${idx + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className={`object-cover object-center transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                      idx === currentImageIndex
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-[1.02]"
                    }`}
                  />

                ))}
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-xs uppercase tracking-widest">
                No Image
              </div>
            )}

            {/* Subtle Gallery Arrows — only show if multiple images */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  showHoverIcon={false}
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-transparent hover:bg-white text-black transition-all h-8 w-8 p-0 rounded-full"
                  aria-label="Previous image"
                >
                  <ArrowLeft strokeWidth={1.5} size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  showHoverIcon={false}
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent hover:bg-white text-black transition-all h-8 w-8 p-0 rounded-full"
                  aria-label="Next image"
                >
                  <ArrowRight strokeWidth={1.5} size={16} />
                </Button>
              </>
            )}

            {/* Quick Add to Cart Button */}
            {!["out-of-stock", "upcoming"].includes(product.stockStage) && (
              <Button
                variant="white"
                size="icon"
                showHoverIcon={false}
                onClick={() => {
                  if (!user) {
                    const redirectPath = encodeURIComponent(pathname);
                    router.push(`/login?redirect=${redirectPath}`);
                    return;
                  }
                  if (product.variants?.length > 0) {
                    router.push(`/product/${product._id}`);
                    return;
                  }

                  addItem({
                    product: {
                      id: product._id,
                      title: product.title,
                      price: product.price,
                      salePrice: product.salePrice,
                      image: images[0],
                    },
                    variant: "Standard",
                  });
                }}
                className="absolute right-4 bottom-4 lg:right-6 lg:bottom-6 w-11 h-11 lg:w-[48px] lg:h-[48px] rounded-full shadow-md hover:scale-105 active:scale-95 transition-all group/btn"
                aria-label="Add to cart"
              >
                <div className="relative flex items-center justify-center">
                  <ShoppingBag
                    strokeWidth={1.5}
                    size={18}
                    className="text-black group-hover/btn:scale-110 transition-transform"
                  />
                  {/* Overlapping plus icon */}
                  <div className="absolute -bottom-1 -right-[4px] bg-white rounded-full flex items-center justify-center border-[1.5px] border-white">
                    <Plus strokeWidth={3} size={10} className="text-black" />
                  </div>
                </div>
              </Button>
            )}
          </div>

          {/* View Product Link */}
          <div className="mt-6 flex justify-center">
            <Link
              href={`/product/${product._id}`}
              className="text-[10px] md:text-[11px] font-medium text-gray-400 hover:text-black uppercase tracking-[0.2em] transition-colors"
            >
              VIEW PRODUCT
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
