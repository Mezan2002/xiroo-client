"use client";
import LoadingOverlay from "@/components/shared/LoadingOverlay";
import { Button } from "@/components/ui/Button";
import { useProducts } from "@/hooks/api/useProducts";
import { useUser } from "@/hooks/api/useUser";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/useToast";
import { addRecentView } from "@/redux/slices/recentlyViewedSlice";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductReviews from "./ProductReviews";
import RelatedProducts from "./RelatedProducts";

export default function ProductView({ productId }) {
  const { user } = useUser();
  const { addItem } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const { useProductDetail } = useProducts();
  const { data: response, isLoading, error } = useProductDetail(productId);
  const product = response?.data;

  const dispatch = useDispatch();

  // Track product view for Recently Viewed feature
  useEffect(() => {
    if (!product) return;
    dispatch(
      addRecentView({
        _id: product._id,
        title: product.title,
        price: product.price,
        salePrice: product.salePrice || null,
        images: product.images?.slice(0, 1) || [],
      }),
    );

    // --- Marketing Protocol: Facebook Pixel ---
    if (window.fbq) {
      window.fbq("track", "ViewContent", {
        content_name: product.title,
        content_category: product.category?.name || "Product",
        content_ids: [product._id],
        content_type: "product",
        value: product.salePrice || product.price,
        currency: "BDT",
      });
    }
  }, [product, dispatch]);

  // Sticky bar: shows once cart buttons scroll past the top, stays visible until page end
  const [showStickyBar, setShowStickyBar] = useState(false);
  const cartRef = useRef(null);

  useEffect(() => {
    if (!cartRef.current) return;

    const cartObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setShowStickyBar(entry.boundingClientRect.top < 0);
        } else {
          setShowStickyBar(false);
        }
      },
      { threshold: 0 },
    );

    cartObserver.observe(cartRef.current);
    return () => cartObserver.disconnect();
  }, [product]);

  if (isLoading) return <LoadingOverlay />;
  if (error || !product) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-semibold tracking-tight">
          Product not found
        </h2>
        <Button onClick={() => router.push("/")}>Return to Home</Button>
      </div>
    );
  }

  return (
    <div className="w-full pt-12 md:pt-24 lg:pt-32">
      <div className="w-full px-4 md:px-8">
        {/* Split Architecture Container */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 relative">
          {/* Left Side: Image Gallery */}
          <div className="w-full lg:w-1/2">
            <ProductGallery title={product.title} images={product.images} />
          </div>

          {/* Right Side: Sticky Purchasing Block */}
          <div className="w-full lg:w-1/2 relative bg-white">
            <div className="lg:sticky lg:top-[120px]">
              <ProductInfo product={product} cartRef={cartRef} />
            </div>
          </div>
        </div>
      </div>

      <RelatedProducts
        categoryId={product.category?._id || product.category}
        currentProductId={product._id}
      />
      <div className="px-4 md:px-8">
        <ProductReviews productId={product._id} />
      </div>

      {/* Sticky Add to Cart Bar — controlled at ProductView level */}
      <div
        className={`fixed bottom-20 lg:bottom-0 left-0 right-0 z-50 flex items-center justify-center px-4 pb-4 pt-2 pointer-events-none transition-all duration-300 ${
          showStickyBar &&
          !["out-of-stock", "upcoming"].includes(product.stockStage)
            ? "translate-y-0 opacity-100"
            : "translate-y-12 opacity-0"
        }`}
      >
        <div className="pointer-events-auto w-full max-w-[560px] h-[64px] md:h-[72px] flex items-center gap-3 bg-white border border-gray-200 shadow-[0_12px_40px_rgba(0,0,0,0.12)] px-3">
          {/* Thumbnail */}
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 shrink-0 overflow-hidden flex items-center justify-center">
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={product.title}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            ) : (
              <ShoppingCart size={18} className="text-gray-400" />
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col flex-1 min-w-0 justify-center">
            <span className="text-[11px] md:text-[12px] font-bold text-black truncate leading-tight uppercase tracking-wide">
              {product.title}
            </span>
            <span className="text-[10px] text-gray-500 mt-0.5 truncate uppercase tracking-widest font-medium">
              {product.salePrice ? "Special Offer" : "Boutique Exclusive"}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center shrink-0 mx-2">
            <span className="text-[13px] md:text-[14px] font-bold text-black">
              ৳{(product.salePrice || product.price).toLocaleString()}
            </span>
          </div>

          {/* CTA */}
          <Button
            size="sm"
            className="h-10 md:h-11 px-4 md:px-6 text-[10px] tracking-[0.15em] font-bold shrink-0 flex items-center justify-center"
            onClick={() => {
              const hasVariants =
                product.variants && product.variants.length > 0;

              if (hasVariants) {
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
              }

              // Standard add to cart logic (simplified for view)
              addItem({
                product: {
                  id: product._id,
                  title: product.title,
                  price: product.price,
                  salePrice: product.salePrice,
                  image: product.images?.[0] || "",
                },
                variant: "Standard",
                silent: true,
              });
              toast.success("Added to your shopping bag");
            }}
          >
            {product.variants && product.variants.length > 0 ? "CHOOSE" : "ADD"}
          </Button>
        </div>
      </div>
    </div>
  );
}
