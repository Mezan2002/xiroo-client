"use client";

export default function ProductTabs({ product, activeTab, setActiveTab }) {
  const tabs = ["description", "specifications", "shipping", "return"];

  return (
    <div className="w-full flex flex-col bg-white">
      <div className="flex items-center gap-6 md:gap-8 border-b border-gray-200 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 px-1 text-[9px] sm:text-[10px] md:text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap relative ${
              activeTab === tab
                ? "text-black"
                : "text-gray-300 hover:text-black"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute -bottom-px left-0 w-full h-0.5 bg-black"></div>
            )}
          </button>
        ))}
      </div>

      <div className="py-6 md:py-8 w-full">
        {activeTab === "description" && (
          <div
            className="leading-relaxed text-gray-600 prose prose-sm max-w-none prose-p:mb-5 prose-strong:text-black text-[13px] md:text-sm"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        )}
        {activeTab === "specifications" && (
          <div className="grid grid-cols-1 gap-1">
            {product.specifications?.flatMap((group) =>
              group.items.map((item, id) => (
                <div
                  key={id}
                  className="flex items-start md:items-center justify-between py-3 md:py-4 border-b border-gray-200 group gap-4 md:gap-6"
                >
                  <span className="text-[8px] md:text-[9px] font-bold text-gray-400 tracking-widest uppercase group-hover:text-black transition-colors shrink-0 pt-0.5 md:pt-0">
                    {item.label}
                  </span>
                  <span className="text-[10px] md:text-[11px] font-bold text-black tracking-tight text-right">
                    {item.value}
                  </span>
                </div>
              )),
            )}
          </div>
        )}
        {activeTab === "shipping" && (
          <div className="leading-relaxed text-gray-600 text-[13px] md:text-sm">
            <p className="mb-4 text-black font-semibold">Nationwide Delivery</p>
            <p className="mb-4">
              We offer fast and reliable shipping across the country. Orders are typically processed and dispatched within 24 to 48 hours of confirmation.
            </p>
            <p className="mb-2 text-black font-semibold">Estimated Delivery Time:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Inside Dhaka: 1-2 business days</li>
              <li>Outside Dhaka: 3-5 business days</li>
            </ul>
          </div>
        )}
        {activeTab === "return" && (
          <div className="leading-relaxed text-gray-600 text-[13px] md:text-sm">
            <p className="mb-4 text-black font-semibold">7-Day Easy Returns</p>
            <p className="mb-4">
              If you are not completely satisfied with your purchase, you can return or exchange the item within 7 days of delivery.
            </p>
            <p>
              Please ensure the item is unworn, unwashed, and retains all original tags and packaging. For further assistance or to initiate a return, please contact our support team.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

