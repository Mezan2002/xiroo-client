/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { Button } from "@/components/ui/Button";
import { useUser } from "@/hooks/api/useUser";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/useToast";
import {
  Check,
  Clock,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const bundles = [
  {
    id: 1,
    title: "SINGLE UNIT",
    subtitle: "STANDARD PACK",
    discount: null,
    price: 350,
    unitPrice: 350,
    badge: null,
  },
  {
    id: 2,
    title: "DUO PACK",
    subtitle: "MOST POPULAR",
    discount: "10% OFF",
    price: 630,
    unitPrice: 315,
    badge: { text: "MOST POPULAR", theme: "light" },
  },
  {
    id: 3,
    title: "TRIPPLE PACK",
    subtitle: "HOT SALE",
    discount: "13% OFF",
    price: 915,
    unitPrice: 305,
    badge: { text: "HOT SALE", theme: "dark" },
  },
  {
    id: 4,
    title: "FAMILY PACK",
    subtitle: "HOME CARE",
    discount: "15% OFF",
    price: 1192,
    unitPrice: 298,
    badge: { text: "HOME CARE", theme: "light" },
  },
];

export default function ProductInfo({ product, cartRef }) {
  const { user } = useUser();
  const { addItem } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  // --- Dynamic Delivery Date Logic ---
  const [dates, setDates] = useState({
    purchased: "",
    processing: "",
    delivered: "",
  });

  useEffect(() => {
    const format = (date) =>
      date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const now = new Date();
    const processingEnd = new Date(now);
    processingEnd.setDate(now.getDate() + 2);
    const deliveredStart = new Date(now);
    deliveredStart.setDate(now.getDate() + 2);
    const deliveredEnd = new Date(now);
    deliveredEnd.setDate(now.getDate() + 3);

    setDates({
      purchased: format(now),
      processing: `${format(now)} — ${format(processingEnd)}`,
      delivered: `${format(deliveredStart)} — ${format(deliveredEnd)}`,
    });
  }, []);

  // --- Countdown Timer Logic ---
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay - now;

      if (diff <= 0) return "00:00:00";

      const h = Math.floor(diff / 3600000)
        .toString()
        .padStart(2, "0");
      const m = Math.floor((diff % 3600000) / 60000)
        .toString()
        .padStart(2, "0");
      const s = Math.floor((diff % 60000) / 1000)
        .toString()
        .padStart(2, "0");
      return `${h}:${m}:${s}`;
    };

    const now = new Date();
    const isSaleActive =
      product.salePrice &&
      product.salePrice > 0 &&
      (!product.saleEndDate || new Date(product.saleEndDate) > now);
    const activePrice = isSaleActive ? product.salePrice : product.price;

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [product.salePrice, product.saleEndDate, product.price]);

  // --- Product State ---
  const hasBundles = product.bundles && product.bundles.length > 0;

  const now = new Date();
  const isSaleActive =
    product.salePrice &&
    product.salePrice > 0 &&
    (!product.saleEndDate || new Date(product.saleEndDate) > now);
  const currentActivePrice = isSaleActive ? product.salePrice : product.price;

  const activeBundles = hasBundles
    ? product.bundles.map((b, i) => ({ ...b, id: i + 1 }))
    : [
        {
          id: 1,
          title: "SINGLE UNIT",
          subtitle: "STANDARD PACK",
          discount: null,
          price: currentActivePrice,
          unitPrice: currentActivePrice,
          badge: null,
        },
      ];

  const [selectedBundleId, setSelectedBundleId] = useState(hasBundles ? 1 : 1); // Default to 1 even if no bundles, assuming single unit is always available
  const [selectedVariants, setSelectedVariants] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const selectedBundle = activeBundles.find((b) => b.id === selectedBundleId);
  const unitPrice = selectedBundle
    ? selectedBundle.unitPrice
    : product.salePrice || product.price;
  const totalPrice = (selectedBundle?.price || unitPrice) * quantity;

  return (
    <div className="flex flex-col w-full pb-20 px-0 lg:px-10">
      {/* Top Main Entry */}
      <div className="flex flex-col items-center text-center w-full mb-10 pt-4 lg:pt-8 font-mono">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-normal tracking-tight text-[#111] leading-[1.3] mb-4 max-w-[95%]">
          {product.title}
        </h1>

        {!["out-of-stock", "upcoming"].includes(product.stockStage) ? (
          <>
            <div className="flex items-center justify-center gap-3 mb-1">
              <span className="text-[17px] md:text-[20px] font-bold text-black tracking-tight">
                ৳{currentActivePrice.toLocaleString()}
              </span>
              {isSaleActive && (
                <span className="text-[13px] md:text-[14px] text-gray-400 line-through">
                  ৳{product.price.toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-[10px] md:text-[12px] text-gray-500 font-medium tracking-widest uppercase mt-2">
              Complimentary shipping on orders over ৳2000
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

      {/* Product Variants */}
      {product.variants && product.variants.length > 0 && (
        <div className="w-full mb-10 px-[2px]">
          <div className="flex flex-col gap-6">
            {product.variants.map((variant) => (
              <div key={variant.name} className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black">
                    Select {variant.name}
                  </span>
                  <span
                    className={`text-[9px] font-bold tracking-widest uppercase ${!selectedVariants[variant.name] ? "text-red-500 animate-pulse" : "text-gray-600"}`}
                  >
                    {selectedVariants[variant.name] || "Required"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {variant.values.map((val) => {
                    const isSelected = selectedVariants[variant.name] === val;
                    return (
                      <button
                        key={val}
                        onClick={() =>
                          setSelectedVariants((prev) => ({
                            ...prev,
                            [variant.name]: val,
                          }))
                        }
                        className={`min-w-[50px] px-4 py-2.5 text-[10px] font-bold tracking-widest transition-all border ${
                          isSelected
                            ? "bg-black text-white border-black shadow-lg"
                            : "bg-white text-gray-500 border-gray-200 hover:border-black"
                        }`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bundle Selector */}
      {hasBundles &&
        !["out-of-stock", "upcoming"].includes(product.stockStage) && (
          <div className="w-full mb-10 px-[2px]">
            <div className="flex flex-col text-left w-full mb-6 py-[2px]">
              <h3 className="text-[11px] font-bold tracking-[0.2em] text-black uppercase border-b border-gray-200 pb-3">
                Elite Packages
              </h3>
            </div>

            <div className="flex flex-col w-full gap-3">
              {activeBundles.map((bundle) => {
                const isSelected = selectedBundleId === bundle.id;

                return (
                  <div
                    key={bundle.id}
                    onClick={() => setSelectedBundleId(bundle.id)}
                    className={`relative w-full p-4 md:p-5 flex items-center justify-between cursor-pointer transition-all border ${
                      isSelected
                        ? "bg-white border-black ring-1 ring-black shadow-xl"
                        : "bg-white border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {bundle.badge && isSelected && (
                      <div className="absolute -top-2.5 left-4 px-2 py-1 bg-black text-white text-[8px] font-bold tracking-[0.2em] uppercase">
                        {bundle.badge.text}
                      </div>
                    )}

                    <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                      <div
                        className={`w-[14px] h-[14px] rounded-full flex items-center justify-center shrink-0 border ${isSelected ? "border-black bg-black" : "border-gray-300"}`}
                      >
                        {isSelected && (
                          <Check
                            size={8}
                            className="text-white"
                            strokeWidth={4}
                          />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] md:text-[13px] font-bold tracking-wider uppercase text-black truncate">
                            {bundle.title}
                          </span>
                          {bundle.discount && (
                            <span className="px-1.5 py-0.5 bg-gray-200 text-[8px] font-black tracking-tighter text-black uppercase">
                              {bundle.discount}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mt-0.5 truncate">
                          {bundle.subtitle}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0 pl-4">
                      <span className="text-[16px] md:text-[20px] font-bold tracking-tight text-black">
                        ৳{bundle.price.toLocaleString()}
                      </span>
                      <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-0.5">
                        ৳{bundle.unitPrice} / Item
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      {!["out-of-stock", "upcoming"].includes(product.stockStage) && (
        <>
          <div className="flex items-center justify-between w-full mt-6 pt-6 pb-2 border-t border-gray-200">
            <div className="text-[10px] font-bold tracking-[0.2em] text-black uppercase">
              Quantity
            </div>
            <div className="flex items-center border border-gray-200 bg-white">
              <Button
                variant="ghost"
                size="icon"
                showHoverIcon={false}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-50 transition-colors"
              >
                <Minus size={12} />
              </Button>
              <div className="w-10 h-10 flex items-center justify-center border-l border-r border-gray-200 text-black text-[11px] font-bold tracking-widest">
                {quantity < 10 ? `0${quantity}` : quantity}
              </div>
              <Button
                variant="ghost"
                size="icon"
                showHoverIcon={false}
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-50 transition-colors"
              >
                <Plus size={12} />
              </Button>
            </div>
          </div>

          <div className="flex flex-col w-full mb-12 mt-8 overflow-hidden border border-black bg-white">
            <div className="flex flex-col lg:flex-row items-center justify-between w-full bg-black text-white px-4 py-3 lg:px-6 lg:py-4 gap-2 lg:gap-0">
              <div className="flex items-center gap-2 lg:gap-3 w-full lg:w-auto justify-center lg:justify-start">
                <Clock
                  className="w-[14px] h-[14px] lg:w-[16px] lg:h-[16px] text-white"
                  strokeWidth={2.5}
                />
                <span className="text-[10px] lg:text-[12px] font-bold tracking-[0.2em] uppercase">
                  Place order IN {timeLeft}
                </span>
              </div>
              <div className="text-[9px] lg:text-[11px] font-bold tracking-[0.2em] uppercase text-gray-500">
                Arriving{" "}
                <span className="text-white ml-1.5 lg:ml-2">
                  {dates.delivered}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 divide-x divide-gray-200 w-full bg-white relative">
              {[
                {
                  label: "Ordered",
                  date: dates.purchased,
                  icon: ShoppingBag,
                  active: true,
                },
                {
                  label: "Dispatch",
                  date: dates.processing,
                  icon: Truck,
                  active: false,
                },
                {
                  label: "Arrival",
                  date: dates.delivered,
                  icon: MapPin,
                  active: false,
                },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center text-center p-3 py-5 lg:p-6 lg:py-8 ${step.active ? "bg-zinc-50/50" : "bg-white"}`}
                >
                  <step.icon
                    className="w-[18px] h-[18px] lg:w-[22px] lg:h-[22px] mb-2 lg:mb-4 text-black"
                    strokeWidth={step.active ? 2 : 1.5}
                  />
                  <span className="text-[8px] lg:text-[10px] font-bold tracking-[0.2em] uppercase mb-1 lg:mb-1.5 text-black">
                    {step.label}
                  </span>
                  <span className="text-[9px] lg:text-[11px] font-bold tracking-wide text-gray-500">
                    {step.date}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div ref={cartRef} className="flex flex-col gap-4 w-full mb-12">
            <Button
              variant="primary"
              className="w-full h-14 bg-black text-white text-[11px] font-bold tracking-[0.3em] transition-all active:scale-[0.98] shadow-2xl shadow-black/10"
              onClick={() => {
                if (!user) {
                  const redirectPath = encodeURIComponent(pathname);
                  router.push(`/login?redirect=${redirectPath}`);
                  return;
                }
                const totalRequired = product.variants?.length || 0;
                const totalSelected = Object.keys(selectedVariants).length;
                if (totalSelected < totalRequired) {
                  toast.info("Please select all options before adding to bag.");
                  return;
                }
                const variantString = Object.entries(selectedVariants)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(", ");
                const cartProduct = {
                  id: product._id,
                  title: product.title,
                  price:
                    hasBundles && selectedBundleId > 1
                      ? selectedBundle.price
                      : product.price,
                  salePrice:
                    hasBundles && selectedBundleId > 1
                      ? undefined
                      : isSaleActive
                        ? product.salePrice
                        : undefined,
                  image: product.images?.[0] || "",
                };
                addItem({
                  product: cartProduct,
                  variant: variantString || "Standard",
                  silent: true,
                });
                toast.success("Added to your shopping bag");
              }}
            >
              ADD TO BAG
            </Button>
            <Button
              variant="outline"
              className="w-full h-14 border-black text-black text-[11px] font-bold tracking-[0.3em] hover:bg-black hover:text-white transition-all active:scale-[0.98]"
              onClick={() => {
                // Standard quick buy logic
              }}
            >
              ORDER NOW
            </Button>
          </div>
        </>
      )}

      {/* Tabs */}
      <div className="w-full flex flex-col bg-white">
        <div className="flex items-center gap-8 border-b border-gray-200 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {["description", "specifications"].map((tab) => (
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
    </div>
  );
}
