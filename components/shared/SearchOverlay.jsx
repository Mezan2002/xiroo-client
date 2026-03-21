import { Button } from "@/components/ui/Button";
import { Search, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const TRENDING_SEARCHES = [
  "Steamy Cat Brush",
  "Travel Dispensing Bottles",
  "Smart LED Desk Lamp",
  "Heated Jacket",
  "Pet Smart Feeder",
];

export function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-1001 transition-all duration-300 ${
        isOpen ? "visible pointer-events-auto" : "invisible pointer-events-none"
      }`}
    >
      {/* Backdrop Backdrop Overlay */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={`absolute inset-0 flex items-start justify-center pt-[10vh] px-4 pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
          isOpen
            ? "translate-y-0 opacity-100 scale-100"
            : "-translate-y-8 opacity-0 scale-95"
        }`}
      >
        {/* Modal Panel */}
        <aside className="w-full max-w-[1000px] bg-white text-black shadow-2xl pointer-events-auto overflow-hidden flex flex-col max-h-[80vh]">
          {/* Header Bar */}
          <div className="flex items-center gap-4 px-8 py-6 border-b border-gray-100">
            <Search className="w-6 h-6 text-gray-400 stroke-[1.5]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              autoFocus={isOpen}
              className="flex-1 bg-transparent text-[22px] font-light text-gray-800 placeholder:text-gray-300 outline-none"
            />
            <Button
              variant="ghost"
              size="icon"
              showHoverIcon={false}
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-black transition-colors"
            >
              <X className="w-6 h-6 stroke-[1.5]" />
            </Button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto px-12 py-12 scrollbar-hide">
            {/* Recently Viewed */}
            <div className="space-y-8 mb-16">
              <div className="flex items-center justify-between">
                <h3 className="text-[12px] font-bold uppercase tracking-widest text-gray-400">
                  Recently Viewed
                </h3>
                <Button
                  variant="link"
                  size="sm"
                  showHoverIcon={false}
                  className="text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                >
                  Clear All
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                {[
                  {
                    title: "Xiroo™ 4-in-1 Travel Dispensing Bottles...",
                    price: "৳2,445",
                    image: "/images/featured-product-main.png",
                  },
                  {
                    title: "Xiroo™ Minimalist LED String Cap Lamp",
                    price: "৳5,850",
                    oldPrice: "৳7,343",
                    image: "/images/category-smart-home.png",
                  },
                  {
                    title: "Xiroo™ Magnetic Stirring Cup",
                    price: "৳2,999",
                    image: "/images/featured-product-main.png",
                  },
                  {
                    title: "Xiroo™ Smart LED Lamp",
                    price: "৳3,500",
                    image: "/images/category-smart-home.png",
                  },
                  {
                    title: "Xiroo™ Heated Jacket",
                    price: "৳8,900",
                    image: "/images/category-smart-home.png",
                  },
                ].map((product, idx) => (
                  <div key={idx} className="group cursor-pointer space-y-4">
                    <div className="aspect-4/5 bg-gray-50 overflow-hidden relative border border-gray-100/50">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div>
                      <h5 className="text-[12px] font-bold text-gray-800 uppercase leading-snug mb-1 line-clamp-2 tracking-tight">
                        {product.title}
                      </h5>
                      <div className="flex items-center gap-3">
                        <span className="text-[12px] text-gray-400 font-medium">
                          {product.price}
                        </span>
                        {product.oldPrice && (
                          <span className="text-[10px] text-gray-200 line-through">
                            {product.oldPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Products Section */}
            <div className="space-y-8 pb-4">
              <h3 className="text-[12px] font-bold uppercase tracking-[0.25em] text-gray-400">
                Trending Products
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                {[
                  {
                    title: "Xiroo™ Portable Mini Fan",
                    price: "৳1,200",
                    image: "/images/featured-product-main.png",
                  },
                  {
                    title: "Xiroo™ Smart Pet Feeder",
                    price: "৳4,500",
                    image: "/images/category-smart-home.png",
                  },
                  {
                    title: "Xiroo™ Humidifier Pro",
                    price: "৳2,800",
                    image: "/images/featured-product-main.png",
                  },
                  {
                    title: "Xiroo™ Wireless Mouse",
                    price: "৳1,500",
                    image: "/images/category-smart-home.png",
                  },
                  {
                    title: "Xiroo™ Bluetooth Speaker",
                    price: "৳3,200",
                    image: "/images/featured-product-main.png",
                  },
                ].map((product, idx) => (
                  <div key={idx} className="group cursor-pointer space-y-4">
                    <div className="aspect-4/5 bg-gray-50 overflow-hidden relative border border-gray-100/50">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div>
                      <h5 className="text-[12px] font-bold text-gray-800 uppercase leading-snug mb-1 line-clamp-2 tracking-tight">
                        {product.title}
                      </h5>
                      <div className="flex items-center gap-3">
                        <span className="text-[12px] text-gray-400 font-medium tracking-tight">
                          {product.price}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
