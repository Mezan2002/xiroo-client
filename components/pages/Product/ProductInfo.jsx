"use client";
import { Button } from "@/components/ui/Button";
import BundleSelector from "./sections/BundleSelector";
import DeliveryTimeline from "./sections/DeliveryTimeline";
import ProductPricing from "./sections/ProductPricing";
import ProductTabs from "./sections/ProductTabs";
import QuantitySelector from "./sections/QuantitySelector";
import VariantSelector from "./sections/VariantSelector";
import { useProductActions } from "./sections/useProductActions";

export default function ProductInfo({ product, cartRef }) {
  const {
    dates,
    timeLeft,
    isSaleActive,
    displayPrice,
    activeBundles,
    selectedBundleId,
    setSelectedBundleId,
    selectedVariants,
    setSelectedVariants,
    quantity,
    setQuantity,
    activeTab,
    setActiveTab,
    handleAddToCart,
    handleOrderNow,
    variantPriceOverride,
  } = useProductActions(product);

  const isBuyDisabled = ["out-of-stock", "upcoming"].includes(product.stockStage);

  return (
    <div className="flex flex-col w-full pb-20 px-0 lg:px-10">
      <ProductPricing
        product={product}
        displayPrice={displayPrice}
        isSaleActive={isSaleActive}
        variantPriceOverride={variantPriceOverride}
      />

      <VariantSelector
        variants={product.variants}
        selectedVariants={selectedVariants}
        setSelectedVariants={setSelectedVariants}
      />

      <BundleSelector
        product={product}
        activeBundles={activeBundles}
        selectedBundleId={selectedBundleId}
        setSelectedBundleId={setSelectedBundleId}
      />

      {!isBuyDisabled && (
        <>
          <QuantitySelector quantity={quantity} setQuantity={setQuantity} />

          <DeliveryTimeline timeLeft={timeLeft} dates={dates} />

          <div ref={cartRef} className="flex flex-col gap-4 w-full mb-12">
            <Button
              variant="primary"
              className="w-full h-14 bg-black text-white text-[11px] font-bold tracking-[0.3em] transition-all active:scale-[0.98] shadow-2xl shadow-black/10"
              onClick={handleAddToCart}
            >
              ADD TO CART — ৳{(displayPrice * quantity).toLocaleString()}
              {quantity > 1 ? ` (${quantity} ITEMS)` : ""}
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
