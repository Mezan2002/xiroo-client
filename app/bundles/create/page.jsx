"use client";
import { Button } from "@/components/ui/Button";
import ProductCard from "@/components/ui/ProductCard";
import { useCategories } from "@/hooks/api/useCategories";
import { useProducts } from "@/hooks/api/useProducts";
import { useCart } from "@/hooks/useCart";
import { CheckCircle2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function BundleCreator() {
  const router = useRouter();
  const { useCategoryTree } = useCategories();
  const { data: categoryTree, isLoading: isCategoriesLoading } =
    useCategoryTree();

  const { useAllProducts } = useProducts();
  const { data: productsData, isLoading: isProductsLoading } = useAllProducts({
    limit: 1000,
  });
  const allProducts = productsData?.data || [];

  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  // Array of { product, variant, quantity }
  const [bundleItems, setBundleItems] = useState([]);

  const { addItem, setIsCartOpen } = useCart();

  const handleSubCategorySelect = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setBundleItems([]); // Reset bundle if they change category
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

    // Create a unique bundle ID for this session
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

    // Redirect or open cart
    router.push("/");
    // TODO: Ideally open cart sidebar, but since useCart doesn't expose it directly here we just go home.
  };

  const [selectedCategory, setSelectedCategory] = useState("All");

  const categoriesList = useMemo(() => {
    if (!categoryTree) return ["All"];
    // Flatten categories if they are nested, or just extract names
    // Depending on backend, categoryTree might be an array of categories
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

  // Render Products View
  const availableProducts = allProducts.filter((p) => {
    if (selectedCategory === "All") return true;
    const catName = p.category?.name || p.category;
    const subCatName = p.subCategory?.name || p.subCategory;
    return catName === selectedCategory || subCatName === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-40">
      <div className="text-center pt-8 pb-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 uppercase">
          Create Your Own Bundle
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Mix and match any products! Add 2 items for 10% off, or 3+ items for
          10% off plus free shipping!
        </p>
      </div>

      <div className="border-b border-gray-100 sticky top-[64px] lg:top-[72px] z-40 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-start overflow-x-auto no-scrollbar gap-2">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12">
        {isProductsLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {availableProducts.map((product) => {
              // Simplified logic: Assume Standard variant if no variants exist
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
                  className="flex flex-col relative group/bundle"
                >
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

                  {/* Bundle Controls Override */}
                  <div className="absolute inset-0 bg-transparent flex flex-col justify-end pb-24 z-10 opacity-0 group-hover/bundle:opacity-100 transition-opacity duration-300">
                    <div className="px-4">
                      {quantityInBundle > 0 ? (
                        <div className="flex items-center justify-between bg-black text-white px-1 shadow-2xl">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleRemoveProductFromBundle(
                                product,
                                defaultVariant,
                              );
                            }}
                            className="w-10 h-10 flex items-center justify-center hover:bg-zinc-800 transition-colors text-lg font-light"
                          >
                            -
                          </button>
                          <span className="font-bold text-sm tracking-widest">
                            {quantityInBundle}
                          </span>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleAddProductToBundle(product, defaultVariant);
                            }}
                            className="w-10 h-10 flex items-center justify-center hover:bg-zinc-800 transition-colors text-lg font-light"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddProductToBundle(product, defaultVariant);
                          }}
                          className="w-full h-10 bg-black text-white font-bold text-[10px] tracking-widest uppercase hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 shadow-2xl"
                        >
                          <Plus className="w-3 h-3" strokeWidth={3} /> Add to
                          Bundle
                        </button>
                      )}
                    </div>
                  </div>
                  {/* Always show if quantity > 0 */}
                  {quantityInBundle > 0 && (
                    <div className="absolute inset-0 bg-transparent flex flex-col justify-end pb-24 z-10">
                      <div className="px-4">
                        <div className="flex items-center justify-between bg-black text-white px-1 shadow-2xl">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleRemoveProductFromBundle(
                                product,
                                defaultVariant,
                              );
                            }}
                            className="w-10 h-10 flex items-center justify-center hover:bg-zinc-800 transition-colors text-lg font-light"
                          >
                            -
                          </button>
                          <span className="font-bold text-sm tracking-widest">
                            {quantityInBundle}
                          </span>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleAddProductToBundle(product, defaultVariant);
                            }}
                            className="w-10 h-10 flex items-center justify-center hover:bg-zinc-800 transition-colors text-lg font-light"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sticky Bundle Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-1">
              Your Bundle ({totalBundleQuantity} items)
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold tracking-widest uppercase flex items-center gap-1 ${totalBundleQuantity >= 2 ? "text-green-600" : "text-gray-400"}`}
              >
                <CheckCircle2 className="w-4 h-4" /> 10% OFF
              </span>
              <span className="text-gray-300">|</span>
              <span
                className={`text-xs font-bold tracking-widest uppercase flex items-center gap-1 ${totalBundleQuantity >= 3 ? "text-green-600" : "text-gray-400"}`}
              >
                <CheckCircle2 className="w-4 h-4" /> FREE SHIPPING
              </span>
            </div>
          </div>
          <Button
            size="lg"
            variant="primary"
            disabled={totalBundleQuantity === 0}
            onClick={handleAddBundleToCart}
            className="shadow-xl"
          >
            ADD BUNDLE
          </Button>
        </div>
        <div className="h-1 w-full bg-gray-100">
          <div
            className="h-full bg-black transition-all duration-500"
            style={{
              width: `${Math.min((totalBundleQuantity / 3) * 100, 100)}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
