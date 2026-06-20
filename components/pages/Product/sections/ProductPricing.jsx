"use client";

export default function ProductPricing({
  product,
  displayPrice,
  isSaleActive,
  variantPriceOverride,
}) {
  const isOutOfStock = ["out-of-stock", "upcoming"].includes(
    product.stockStage,
  );

  return (
    <div className="flex flex-col items-center text-center w-full mb-10 pt-4 lg:pt-8 font-mono">
      <h1 className="text-2xl md:text-4xl lg:text-5xl font-normal tracking-tight text-[#111] leading-[1.3] mb-4 max-w-[95%]">
        {product.title}
      </h1>

      {!isOutOfStock ? (
        <>
          <div className="flex items-center justify-center gap-3 mb-1">
            <span className="text-[17px] md:text-[20px] font-bold text-black tracking-tight">
              ৳{displayPrice.toLocaleString()}
            </span>
            {isSaleActive && variantPriceOverride === 0 && (
              <span className="text-[13px] md:text-[14px] text-gray-400 line-through">
                ৳{product.price.toLocaleString()}
              </span>
            )}
          </div>
          <span className="text-[10px] md:text-[12px] text-gray-500 font-medium tracking-widest uppercase mt-2">
            Complimentary shipping on orders over 3 products
          </span>
        </>
      ) : (
        <div className="mt-4 p-8 bg-zinc-50 border border-zinc-200 w-full mb-6">
          <span className="text-2xl md:text-3xl font-black text-black uppercase tracking-tighter">
            {product.stockStage?.replace("-", " ")}
          </span>
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-3">
            Item is currently {product.stockStage?.replace("-", " ")}.
          </p>
        </div>
      )}
    </div>
  );
}
