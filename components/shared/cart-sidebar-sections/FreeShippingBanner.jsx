"use client";

const FREE_SHIPPING_THRESHOLD = 3;

export default function FreeShippingBanner({ items }) {
  // Find the highest quantity among explicitly created bundles
  const bundleGroups = {};
  items.forEach(item => {
    if (item.bundleId) {
      bundleGroups[item.bundleId] = (bundleGroups[item.bundleId] || 0) + (item.quantity || 1);
    }
  });

  const bundleValues = Object.values(bundleGroups);
  if (bundleValues.length === 0) return null; // Only show if they are building a bundle
  
  const maxBundleQuantity = Math.max(0, ...bundleValues);
  
  const remaining = FREE_SHIPPING_THRESHOLD - maxBundleQuantity;
  const progress = Math.min((maxBundleQuantity / FREE_SHIPPING_THRESHOLD) * 100, 100);

  return (
    <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
      <div className="flex flex-col gap-2">
        <p className="text-[13px] text-gray-600">
          {remaining > 0 ? (
            <>
              Add <span className="font-semibold text-black">{remaining}</span> more related item{remaining > 1 ? "s" : ""} for <span className="font-semibold text-black">FREE SHIPPING!</span>
            </>
          ) : (
            <>
              Congratulations! You qualify for <span className="font-semibold text-black">FREE SHIPPING!</span>
            </>
          )}
        </p>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-black transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
