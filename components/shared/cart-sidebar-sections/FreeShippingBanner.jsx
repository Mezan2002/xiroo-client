"use client";

const FREE_SHIPPING_THRESHOLD = 2000;

export default function FreeShippingBanner({ subtotal }) {
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  return (
    <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
      <div className="flex flex-col gap-2">
        <p className="text-[13px] text-gray-600">
          {remaining > 0 ? (
            <>
              Add <span className="font-semibold text-black">৳{Number(remaining || 0).toFixed(0)}</span> more for <span className="font-semibold text-black">FREE SHIPPING!</span>
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
