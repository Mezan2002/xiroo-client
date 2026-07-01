"use client";
import { useCategories } from "@/hooks/api/useCategories";
import { useProducts } from "@/hooks/api/useProducts";
import { useCart } from "@/hooks/useCart";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

// Generate cartesian product of selected variant values
const getVariantCombinations = (attributeGroups, selectedVariants) => {
  const selectedArrays = attributeGroups
    .map((group) => {
      const vals = selectedVariants[group.name];
      if (!vals || vals.length === 0) return [null];
      return vals;
    })
    .filter((arr) => arr.length > 0);

  if (selectedArrays.length === 0) return [];

  return selectedArrays.reduce(
    (acc, curr) =>
      acc.flatMap((combo) =>
        curr.map((val) => (combo ? `${combo} / ${val}` : val))
      ),
    [""]
  );
};

// Individual product card with multi-variant selection for bundle creation
const BundleProductCard = ({ product, bundleItems, onAdd, onRemove }) => {
  const attributeGroups = product.variants || [];
  const [selectedVariants, setSelectedVariants] = useState({});

  const toggleVariant = (groupName, value) => {
    setSelectedVariants((prev) => {
      const current = prev[groupName] || [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [groupName]: next };
    });
  };

  const combinations = getVariantCombinations(attributeGroups, selectedVariants);
  const hasVariants = attributeGroups.length > 0;
  const hasSelections = combinations.length > 0;

  const totalQuantityInBundle = bundleItems
    .filter((i) => i.product._id === product._id)
    .reduce((sum, i) => sum + i.quantity, 0);

  const getComboQuantity = (variantStr) =>
    bundleItems.find(
      (i) => i.product._id === product._id && i.variant === variantStr
    )?.quantity || 0;

  const handleAddAll = (e) => {
    e.preventDefault();
    if (!hasSelections) return;
    combinations.forEach((combo) => onAdd(product, combo));
  };

  return (
    <div className="bg-white border border-zinc-100 flex flex-col">
      {/* Product Image */}
      <div className="aspect-square bg-zinc-50 relative">
        {product.images?.[0] && (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover"
          />
        )}
        {totalQuantityInBundle > 0 && (
          <div className="absolute top-3 right-3 z-10 w-7 h-7 bg-black text-white rounded-full flex items-center justify-center text-xs font-semibold shadow-md">
            {totalQuantityInBundle}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 pb-3">
        <p className="text-[13px] font-bold text-black line-clamp-1">
          {product.title}
        </p>
        <p className="text-[11px] text-zinc-400 font-medium">
          ৳{product.salePrice || product.price}
        </p>
      </div>

      {/* Variant Groups */}
      {hasVariants && (
        <div className="px-4 pb-3 flex flex-col gap-2.5">
          {attributeGroups.map((group) => (
            <div key={group.name}>
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                Select {group.name}
                {(selectedVariants[group.name] || []).length === 0 && (
                  <span className="text-red-400 ml-1">Required</span>
                )}
              </p>
              <div className="flex flex-wrap gap-1">
                {group.values.map((val) => {
                  const isSelected = (
                    selectedVariants[group.name] || []
                  ).includes(val.value);
                  return (
                    <button
                      key={val.value}
                      onClick={() => toggleVariant(group.name, val.value)}
                      className={`px-2 py-1 text-[10px] font-bold border transition-all ${
                        isSelected
                          ? "bg-black text-white border-black"
                          : "border-zinc-200 text-zinc-500 hover:border-black"
                      }`}
                    >
                      {val.value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Combinations */}
      {hasSelections && (
        <div className="px-4 pb-3">
          <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
            Selected Variants
          </p>
          <div className="flex flex-col gap-1.5">
            {combinations.map((combo) => {
              const qty = getComboQuantity(combo);
              return (
                <div
                  key={combo}
                  className="flex items-center justify-between bg-zinc-50 border border-zinc-100 px-2 py-1.5"
                >
                  <span className="text-[10px] font-bold text-black">
                    {combo}
                  </span>
                  {qty === 0 ? (
                    <button
                      onClick={() => onAdd(product, combo)}
                      className="text-[9px] font-bold text-zinc-400 hover:text-black uppercase tracking-widest"
                    >
                      Add
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onRemove(product, combo)}
                        className="w-5 h-5 flex items-center justify-center bg-white border border-zinc-200 hover:border-black transition-colors"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="text-[11px] font-bold text-black w-4 text-center">
                        {qty}
                      </span>
                      <button
                        onClick={() => onAdd(product, combo)}
                        className="w-5 h-5 flex items-center justify-center bg-white border border-zinc-200 hover:border-black transition-colors"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add All Button */}
      <div className="px-4 pb-4 mt-auto">
        {totalQuantityInBundle === 0 ? (
          <button
            onClick={handleAddAll}
            disabled={!hasSelections}
            className={`w-full h-8 text-[11px] font-bold uppercase tracking-widest transition-colors ${
              hasSelections
                ? "bg-black text-white hover:bg-zinc-800"
                : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
            }`}
          >
            {hasVariants && !hasSelections ? "Select Variants" : "Add to Bundle"}
          </button>
        ) : (
          <div className="flex items-center justify-between h-8 bg-zinc-100 px-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                const lastCombo = combinations.find(
                  (c) => getComboQuantity(c) > 0
                );
                if (lastCombo) onRemove(product, lastCombo);
              }}
              className="w-6 h-6 flex items-center justify-center bg-white hover:bg-zinc-200 transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-[12px] font-bold">
              {totalQuantityInBundle} added
            </span>
            <button
              onClick={handleAddAll}
              className="w-6 h-6 flex items-center justify-center bg-white hover:bg-zinc-200 transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function BundleCreator() {
  const router = useRouter();
  const { useCategoryTree } = useCategories();
  const { data: categoryTree } = useCategoryTree();

  const { useAllProducts } = useProducts();
  const { data: productsData, isLoading: isProductsLoading } = useAllProducts({
    limit: 1000,
  });
  const allProducts = (() => {
    const d = productsData?.data;
    if (!d) return [];
    if (Array.isArray(d)) return d;
    if (Array.isArray(d.data)) return d.data;
    return [];
  })();

  const [bundleItems, setBundleItems] = useState([]);
  const { addItem } = useCart();

  const handleAddProductToBundle = (product, variantName) => {
    setBundleItems((prev) => {
      const existing = prev.find(
        (i) => i.product._id === product._id && i.variant === variantName
      );
      if (existing) {
        return prev.map((i) =>
          i.product._id === product._id && i.variant === variantName
            ? { ...i, quantity: i.quantity + 1 }
            : i
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
        (i) => i.product._id === product._id && i.variant === variantName
      );
      if (existing && existing.quantity > 1) {
        return prev.map((i) =>
          i.product._id === product._id && i.variant === variantName
            ? { ...i, quantity: i.quantity - 1 }
            : i
        );
      }
      return prev.filter(
        (i) => !(i.product._id === product._id && i.variant === variantName)
      );
    });
  };

  const totalBundleQuantity = bundleItems.reduce(
    (sum, item) => sum + item.quantity,
    0
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
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
              Mix &amp; Match
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
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 py-12 pb-[240px] lg:pb-52">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
            {availableProducts.map((product) => (
              <BundleProductCard
                key={product._id}
                product={product}
                bundleItems={bundleItems}
                onAdd={handleAddProductToBundle}
                onRemove={handleRemoveProductFromBundle}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Sticky Footer ── */}
      <div className="fixed bottom-[74px] lg:bottom-0 left-0 right-0 z-40 lg:z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] lg:shadow-none border-b border-gray-200 lg:border-none">
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
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-16 py-4 lg:py-5 flex items-center justify-between gap-4 lg:gap-6">
            {/* Left */}
            <div className="flex items-center gap-4 lg:gap-8">
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-xs text-gray-500 mb-0.5">
                  Your Bundle
                </span>
                <span className="text-xl sm:text-2xl font-extralight text-gray-900 leading-none">
                  {totalBundleQuantity}
                  <span className="text-gray-400 text-sm sm:text-base font-light ml-1">
                    {totalBundleQuantity === 1 ? "item" : "items"}
                  </span>
                </span>
              </div>

              <div className="hidden sm:block w-px h-10 bg-gray-200" />

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
            <div className="flex items-center gap-4 lg:gap-6">
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

              <button
                disabled={totalBundleQuantity === 0}
                onClick={handleAddBundleToCart}
                className={`flex items-center gap-2 px-4 sm:px-8 py-2.5 sm:py-3.5 text-xs sm:text-sm font-semibold transition-all duration-500 ${
                  totalBundleQuantity > 0
                    ? "bg-black text-white hover:bg-zinc-800"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {totalBundleQuantity > 0 ? "Add to Cart" : "Select Items"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
