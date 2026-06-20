"use client";
import ProductCard from "@/components/ui/ProductCard";
import { useCategories } from "@/hooks/api/useCategories";
import { useProducts } from "@/hooks/api/useProducts";
import { useCart } from "@/hooks/useCart";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function BundleCreator() {
  const router = useRouter();
  const { useCategoryTree } = useCategories();
  const { data: categoryTree } = useCategoryTree();

  const { useAllProducts } = useProducts();
  const { data: productsData, isLoading: isProductsLoading } = useAllProducts({
    limit: 1000,
  });
  const allProducts = productsData?.data || [];

  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [bundleItems, setBundleItems] = useState([]);
  const { addItem } = useCart();

  const handleSubCategorySelect = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setBundleItems([]);
  };

  const handleBackToCategories = () => {
    setSelectedSubCategory(null);
  };

  const handleAddProductToBundle = (product, variantName) => {
    setBundleItems((prev) => {
      const existing = prev.find(
        (i) => i.product._id === product._id && i.variant === variantName,
      );
      if (existing) {
        return prev.map((i) =>
          i.product._id === product._id && i.variant === variantName
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      }
      return [
        ...prev,
        { product, variant: variantName || "Standard", quantity: 1 },
      ];
    });
  };

  const handleRemoveProductFromBundle = (product, variantName) => {
    setBundleItems((prev) => {
      const existing = prev.find(
        (i) => i.product._id === product._id && i.variant === variantName,
      );
      if (existing && existing.quantity > 1) {
        return prev.map((i) =>
          i.product._id === product._id && i.variant === variantName
            ? { ...i, quantity: i.quantity - 1 }
            : i,
        );
      }
      return prev.filter(
        (i) => !(i.product._id === product._id && i.variant === variantName),
      );
    });
  };

  const totalBundleQuantity = bundleItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const handleAddBundleToCart = () => {
    if (totalBundleQuantity === 0) return;
    const bundleId = `bundle_${Date.now()}`;
    bundleItems.forEach((item) => {
      addItem({
        product: {
          ...item.product,
          id: item.product._id,
          image: item.product.images?.[0] || "",
        },
        variant: item.variant,
        quantity: item.quantity,
        bundleId,
        silent: true,
      });
    });
    router.push("/");
  };

  const [selectedCategory, setSelectedCategory] = useState("All");

  const categoriesList = useMemo(() => {
    if (!categoryTree) return ["All"];
    const names = ["All"];
    if (Array.isArray(categoryTree)) {
      categoryTree.forEach((c) => {
        if (c.name) names.push(c.name);
        if (c.categories && Array.isArray(c.categories)) {
          c.categories.forEach((sub) => {
            if (sub.name) names.push(sub.name);
          });
        }
      });
    }
    return Array.from(new Set(names));
  }, [categoryTree]);

  const availableProducts = allProducts.filter((p) => {
    if (selectedCategory === "All") return true;
    const catName = p.category?.name || p.category;
    const subCatName = p.subCategory?.name || p.subCategory;
    return catName === selectedCategory || subCatName === selectedCategory;
  });

  const discountUnlocked = totalBundleQuantity >= 2;
  const shippingUnlocked = totalBundleQuantity >= 3;

  return (
    <div className="min-h-screen bg-white">
      {/* ── Page Header ── */}
      <div className="w-full pt-28 pb-0 px-6 lg:px-16 max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 pb-10">
          {/* Title */}
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
              Mix & Match
            </p>
            <h1 className="text-5xl md:text-6xl font-extralight text-gray-900 tracking-tight leading-none">
              Build Your Bundle
            </h1>
          </div>
        </div>
      </div>

      {/* ── Category Filter ── */}
      <div className="sticky top-[64px] lg:top-[72px] z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 py-4 flex items-center gap-8 overflow-x-auto no-scrollbar">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 text-sm font-medium pb-0.5 transition-all duration-300 ${
                selectedCategory === cat
                  ? "text-gray-900 border-b-2 border-gray-900"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Product Grid ── */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 py-12 pb-52">
        {/* Row info */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-gray-500">
            {selectedCategory === "All" ? "All Products" : selectedCategory}
          </p>
          <p className="text-sm text-gray-400">
            {availableProducts.length} products
          </p>
        </div>

        {isProductsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col gap-4">
                <div className="aspect-3/4 bg-gray-100" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16">
            {availableProducts.map((product) => {
              const defaultVariant =
                product.variants?.[0]?.values?.[0]?.value || "Standard";
              const quantityInBundle =
                bundleItems.find(
                  (i) =>
                    i.product._id === product._id &&
                    i.variant === defaultVariant,
                )?.quantity || 0;

              return (
                <div
                  key={product._id}
                  className="relative flex flex-col group/card"
                >
                  {/* Product card */}
                  <div className="pointer-events-none">
                    <ProductCard
                      id={product._id}
                      title={product.title}
                      price={product.price}
                      salePrice={product.salePrice}
                      image={product.images?.[0]}
                      images={product.images}
                      hoverImage={product.images?.[1]}
                      variants={product.variants}
                    />
                  </div>

                  {/* Quantity badge */}
                  {quantityInBundle > 0 && (
                    <div className="absolute top-3 right-3 z-30 w-7 h-7 bg-black text-white rounded-full flex items-center justify-center text-xs font-semibold shadow-md">
                      {quantityInBundle}
                    </div>
                  )}

                  {/* Add button — hover, qty = 0 */}
                  {quantityInBundle === 0 && (
                    <div className="absolute inset-0 flex items-end pb-[86px] px-3 z-20 opacity-0 group-hover/card:opacity-100 transition-all duration-300">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddProductToBundle(product, defaultVariant);
                        }}
                        className="w-full h-10 bg-black text-white text-xs font-semibold hover:bg-zinc-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                      >
                        <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                        Add to Bundle
                      </button>
                    </div>
                  )}

                  {/* Stepper — always visible when qty > 0 */}
                  {quantityInBundle > 0 && (
                    <div className="absolute inset-0 flex items-end pb-[86px] px-3 z-20">
                      <div className="w-full h-10 bg-black flex items-center justify-between shadow-lg">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleRemoveProductFromBundle(
                              product,
                              defaultVariant,
                            );
                          }}
                          className="w-10 h-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" strokeWidth={2.5} />
                        </button>
                        <span className="text-white text-xs font-semibold">
                          {quantityInBundle} added
                        </span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddProductToBundle(product, defaultVariant);
                          }}
                          className="w-10 h-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Sticky Footer ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        {/* Progress line */}
        <div className="w-full h-[3px] bg-gray-100">
          <div
            className="h-full bg-black transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{
              width: `${Math.min((totalBundleQuantity / 3) * 100, 100)}%`,
            }}
          />
        </div>

        <div className="bg-white border-t border-gray-200">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-16 py-5 flex items-center justify-between gap-6">
            {/* Left */}
            <div className="flex items-center gap-8">
              {/* Count */}
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-0.5">
                  Your Bundle
                </span>
                <span className="text-2xl font-extralight text-gray-900 leading-none">
                  {totalBundleQuantity}
                  <span className="text-gray-400 text-base font-light ml-1">
                    {totalBundleQuantity === 1 ? "item" : "items"}
                  </span>
                </span>
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px h-10 bg-gray-200" />

              {/* Reward status */}
              <div className="hidden sm:flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full transition-colors duration-500 ${
                      discountUnlocked ? "bg-black" : "bg-gray-300"
                    }`}
                  />
                  <span
                    className={`text-xs font-medium transition-colors duration-500 ${
                      discountUnlocked ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    10% Discount
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full transition-colors duration-500 ${
                      shippingUnlocked ? "bg-black" : "bg-gray-300"
                    }`}
                  />
                  <span
                    className={`text-xs font-medium transition-colors duration-500 ${
                      shippingUnlocked ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    Free Shipping
                  </span>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-6">
              {/* Hint */}
              {totalBundleQuantity < 3 && (
                <p className="hidden md:block text-sm text-gray-500">
                  {totalBundleQuantity === 0 && "Add 2 items to unlock 10% off"}
                  {totalBundleQuantity === 1 && "1 more item for 10% off"}
                  {totalBundleQuantity === 2 && "1 more item for free shipping"}
                </p>
              )}
              {totalBundleQuantity >= 3 && (
                <p className="hidden md:block text-sm font-medium text-gray-900">
                  All rewards unlocked 🎉
                </p>
              )}

              {/* CTA */}
              <button
                disabled={totalBundleQuantity === 0}
                onClick={handleAddBundleToCart}
                className={`flex items-center gap-2.5 px-8 py-3.5 text-sm font-semibold transition-all duration-500 ${
                  totalBundleQuantity > 0
                    ? "bg-black text-white hover:bg-zinc-800"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                {totalBundleQuantity > 0 ? "Add to Cart" : "Select Items"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
