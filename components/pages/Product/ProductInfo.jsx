"use client";
import { Button } from "@/components/ui/Button";
import BundleSelector from "./sections/BundleSelector";
import DeliveryTimeline from "./sections/DeliveryTimeline";
import MultiItemVariantSelector from "./sections/MultiItemVariantSelector";
import ProductPricing from "./sections/ProductPricing";
import ProductTabs from "./sections/ProductTabs";
import QuantitySelector from "./sections/QuantitySelector";
import VariantSelector from "./sections/VariantSelector";
import { useProductActions } from "./sections/useProductActions";

export default function ProductInfo({ product, cartRef, selectedVariants, setSelectedVariants }) {
  const {
    dates,
    timeLeft,
    isSaleActive,
    displayPrice,
    activeBundles,
    selectedBundleId,
    setSelectedBundleId,
    selectedVariants: hookVariants,
    setSelectedVariants: hookSetVariants,
    quantity,
    setQuantity,
    activeTab,
    setActiveTab,
    handleAddToCart,
    handleOrderNow,
    variantPriceOverride,
    variantQuantity,
    variantImage,
    effectiveStock,
    multiItems,
    setMultiItems,
  } = useProductActions(product, selectedVariants, setSelectedVariants);

  const isBuyDisabled = ["out-of-stock", "upcoming"].includes(product.stockStage);

  return (
    <div className="flex flex-col w-full pb-20 px-0 lg:px-10">
      <ProductPricing
        product={product}
        displayPrice={displayPrice}
        isSaleActive={isSaleActive}
        variantPriceOverride={variantPriceOverride}
      />

      {product.isMultiItem ? (
        <MultiItemVariantSelector
          variants={product.variants}
          packQuantity={product.multiItemQuantity || 1}
          selectedItems={multiItems}
          setSelectedItems={setMultiItems}
        />
      ) : (
        <VariantSelector
          variants={product.variants}
          selectedVariants={hookVariants}
          setSelectedVariants={hookSetVariants}
        />
      )}

      <BundleSelector
        product={product}
        activeBundles={activeBundles}
        selectedBundleId={selectedBundleId}
        setSelectedBundleId={setSelectedBundleId}
      />

      {!isBuyDisabled && (
        <>
          {product.isMultiItem && (
            <div className="flex items-center justify-between w-full mt-6 pt-6 pb-2 border-t border-gray-200">
              <div className="text-[10px] font-bold tracking-[0.2em] text-black uppercase">
                Package Quantity
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-bold text-black">
                  {product.multiItemQuantity || 1} items per pack
                </span>
              </div>
            </div>
          )}

          {!product.isMultiItem && (
            <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
          )}

          <DeliveryTimeline timeLeft={timeLeft} dates={dates} />

          <div ref={cartRef} className="flex flex-col gap-4 w-full mb-12">
            <Button
              variant="primary"
              className="w-full h-14 bg-black text-white text-[11px] font-bold tracking-[0.3em] transition-all active:scale-[0.98] shadow-2xl shadow-black/10"
              onClick={handleAddToCart}
            >
              ADD TO CART — ৳{displayPrice.toLocaleString()}
            </Button>
            <Button
              variant="outline"
              className="w-full h-14 border-black text-black text-[11px] font-bold tracking-[0.3em] hover:bg-black hover:text-white transition-all active:scale-[0.98]"
              onClick={handleOrderNow}
            >
              ORDER NOW
            </Button>
          </div>
        </>
      )}

      <ProductTabs
        product={product}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}
