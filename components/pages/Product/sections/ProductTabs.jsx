"use client";

export default function ProductTabs({ product, activeTab, setActiveTab }) {
  const tabs = ["description", "specifications"];

  return (
    <div className="w-full flex flex-col bg-white">
      <div className="flex items-center gap-8 border-b border-gray-200 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 px-1 text-[10px] font-bold uppercase tracking-[0.2em] transition-all whitespace-nowrap relative ${
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

      <div className="py-8 w-full">
        {activeTab === "description" && (
          <div
            className="leading-relaxed text-gray-600 prose prose-sm max-w-none prose-p:mb-5 prose-strong:text-black"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        )}
        {activeTab === "specifications" && (
          <div className="grid grid-cols-1 gap-1">
            {product.specifications?.flatMap((group) =>
              group.items.map((item, id) => (
                <div
                  key={id}
                  className="flex items-center justify-between py-4 border-b border-gray-200 group"
                >
                  <span className="text-[9px] font-bold text-gray-400 tracking-widest uppercase group-hover:text-black transition-colors">
                    {item.label}
                  </span>
                  <span className="text-[11px] font-bold text-black tracking-tight">
                    {item.value}
                  </span>
                </div>
              )),
            )}
          </div>
        )}
      </div>
    </div>
  );
}
