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
  }, [product.salePrice, product.saleEndDate]);

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
  const [selectedVariants, setSelectedVariants] = useState(
    product.variants?.reduce(
      (acc, v) => ({ ...acc, [v.name]: v.values[0] }),
      {},
    ) || {},
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const selectedBundle = activeBundles.find((b) => b.id === selectedBundleId);
  const unitPrice = selectedBundle
    ? selectedBundle.unitPrice
    : product.salePrice || product.price;
  const totalPrice = (selectedBundle?.price || unitPrice) * quantity;

  return (
    <div className="flex flex-col w-full pb-20 px-0 md:px-6 lg:px-10">
      {/* Top Main Entry */}
      <div className="flex flex-col items-center text-center w-full mb-10 font-mono pt-4 lg:pt-8">
        <h1 className="text-[26px] md:text-4xl lg:text-5xl font-normal tracking-tight text-[#111] leading-[1.3] mb-4 max-w-[95%]">
          {product.title}
        </h1>

        {!["out-of-stock", "upcoming"].includes(product.stockStage) ? (
          <>
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-[17px] md:text-[19px] font-normal text-black">
                <span className="mr-1">৳</span>
                {currentActivePrice.toLocaleString()}
              </span>
              {isSaleActive && (
                <span className="text-[13px] md:text-[14px] text-gray-400 line-through">
                  ৳{product.price.toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-[11px] md:text-[12px] text-gray-500 tracking-wide mt-1">
              Delivery cost will be calculated at checkout.
            </span>
          </>
        ) : (
          <div className="mt-4 p-8 bg-zinc-50 border border-zinc-100 w-full mb-6">
            <span className="text-3xl font-black text-black uppercase tracking-tighter">
              {product.stockStage?.replace("-", " ")}
            </span>
            <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest mt-3">
              This item is currently {product.stockStage?.replace("-", " ")}.
              {product.stockStage === "upcoming"
                ? " Stay tuned for the official release."
                : " We are working to replenish our registry."}
            </p>
          </div>
        )}
      </div>

      {/* Product Variants (Colors/Sizes/etc) */}
      {product.variants && product.variants.length > 0 && (
        <div className="w-full mb-8 px-[2px]">
          <div className="flex flex-col gap-6">
            {product.variants.map((variant) => (
              <div key={variant.name} className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-black">
                    {variant.name}
                  </span>
                  <span className="text-[11px] font-medium text-gray-400">
                    {selectedVariants[variant.name]}
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
                        className={`px-4 py-2 text-[11px] font-semibold tracking-wider transition-all border ${
                          isSelected
                            ? "bg-black text-white border-black shadow-md"
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

      {/* High-Conversion Bundle Selector - Only if bundles exist */}
      {hasBundles &&
        !["out-of-stock", "upcoming"].includes(product.stockStage) && (
          <div className="w-full mb-10 px-[2px]">
            <div className="flex flex-col text-left w-full mb-6 py-[2px]">
              <h3 className="text-[14px] md:text-[15px] font-semibold tracking-widest text-black uppercase">
                Choose Your Bundle
              </h3>
              <p className="text-[12px] md:text-[13px] text-gray-500 mt-[6px]">
                Select a package below to secure your exclusive discount.
              </p>
            </div>

            <div className="flex flex-col w-full">
              {activeBundles.map((bundle) => {
                const isSelected = selectedBundleId === bundle.id;

                return (
                  <div
                    key={bundle.id}
                    onClick={() => setSelectedBundleId(bundle.id)}
                    className={`relative w-full mb-[14px] p-[16px] md:p-5 flex items-center justify-between cursor-pointer transition-all border-2 ${
                      isSelected
                        ? "bg-white border-black shadow-[0_6px_20px_rgba(0,0,0,0.06)]"
                        : "bg-white border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {bundle.badge && (
                      <div
                        className={`absolute -top-[12px] right-3 md:right-5 px-[10px] md:px-3 py-[4px] text-[9px] md:text-[10px] font-semibold tracking-widest uppercase flex items-center gap-[6px] shadow-sm ${
                          bundle.badge.theme === "dark" || isSelected
                            ? "bg-black text-white"
                            : "bg-white text-black border border-gray-200"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-[4px] h-[4px] rounded-full bg-white opacity-80"></div>
                        )}
                        {bundle.badge.text}
                      </div>
                    )}

                    <div className="flex items-center justify-start gap-4 md:gap-5 w-[65%]">
                      <div
                        className={`w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? "bg-black border-[1.5px] border-black"
                            : "bg-transparent border-[1.5px] border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <Check
                            size={12}
                            className="text-white"
                            strokeWidth={4}
                          />
                        )}
                      </div>

                      <div className="flex flex-col text-left">
                        <div className="flex flex-wrap items-center gap-2 md:gap-3">
                          <span className="text-[13px] md:text-[15px] font-semibold tracking-[0.05em] uppercase text-black">
                            {bundle.title}
                          </span>
                          {bundle.discount && (
                            <span
                              className={`px-[6px] py-[3px] text-[9px] md:text-[10px] font-semibold tracking-widest leading-none mt-px md:mt-0 ${
                                isSelected
                                  ? "bg-black text-white"
                                  : "bg-gray-100 text-black border border-gray-200"
                              }`}
                            >
                              {bundle.discount}
                            </span>
                          )}
                        </div>
                        <span
                          className={`text-[10px] md:text-[11px] font-bold tracking-[0.15em] uppercase mt-[4px] md:mt-1 ${
                            isSelected ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          {bundle.subtitle}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end text-right w-[35%] shrink-0">
                      <span className="text-[18px] md:text-[22px] font-semibold tracking-tight text-black">
                        <span className="mr-[2px]">৳</span>
                        {bundle.price.toLocaleString()}
                      </span>
                      <span
                        className={`text-[9px] md:text-[11px] font-bold tracking-widest uppercase mt-[2px] ${
                          isSelected ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        <span className="mr-px">৳</span>
                        {bundle.unitPrice} / UNIT
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
          <div className="flex items-center justify-between w-full mt-4 md:mt-8 pt-6 pb-2 border-t border-gray-200">
            <div className="text-[11px] md:text-[12px] font-semibold tracking-widest text-black uppercase">
              Adjust Quantity
            </div>
            <div className="flex items-center border border-gray-300 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <Button
                variant="ghost"
                size="icon"
                showHoverIcon={false}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 md:w-12 h-[38px] md:h-12 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-50 transition-colors"
              >
                <Minus size={14} />
              </Button>
              <div className="w-10 md:w-14 h-[38px] md:h-12 flex items-center justify-center border-l border-r border-gray-200 text-black text-[13px] font-bold tracking-widest">
                {quantity < 10 ? `0${quantity}` : quantity}
              </div>
              <Button
                variant="ghost"
                size="icon"
                showHoverIcon={false}
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 md:w-12 h-[38px] md:h-12 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-50 transition-colors"
              >
                <Plus size={14} />
              </Button>
            </div>
          </div>

          <div className="flex flex-col w-full mb-10 mt-6 overflow-hidden border-2 border-black bg-white shadow-[4px_4px_0px_#000]">
            {/* Ticket Banner Header */}
            <div className="flex flex-col md:flex-row items-center justify-between w-full bg-black text-white px-4 md:px-5 py-[14px] gap-2 md:gap-0">
              <div className="flex items-center gap-2 w-full md:w-auto justify-center md:justify-start">
                {product.saleEndDate ? (
                  <>
                    <Clock
                      size={16}
                      strokeWidth={2.5}
                      className="text-[#c8ab5c]"
                    />
                    <span className="text-[11px] md:text-[12px] font-semibold tracking-widest uppercase">
                      Order within {timeLeft}
                    </span>
                  </>
                ) : (
                  <span className="text-[11px] md:text-[12px] font-semibold tracking-widest uppercase text-gray-400">
                    Exclusive Collection Offer
                  </span>
                )}
              </div>
              <div className="text-[10px] md:text-[11px] font-bold tracking-[0.15em] uppercase w-full md:w-auto text-center md:text-right text-gray-400">
                Est. Delivery{" "}
                <span className="text-white ml-[6px] border-b border-white pb-px inline-block -mb-px">
                  {dates.delivered}
                </span>
              </div>
            </div>

            {/* 3-Column Ticket Grid */}
            <div className="grid grid-cols-3 divide-x-2 divide-black w-full bg-white relative">
              {/* Active Indicator Arrow - Moved to FIRST column (Purchased) */}
              <div className="absolute top-[-2px] left-[16.66%] -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-black z-10"></div>

              <div className="flex flex-col items-center text-center p-3 md:p-4 py-8 bg-gray-50 transition-colors">
                <ShoppingBag
                  size={24}
                  strokeWidth={1.5}
                  className="text-black mb-[14px]"
                />
                <span className="text-[9px] md:text-[10px] font-semibold tracking-widest uppercase text-black mb-1">
                  Purchased
                </span>
                <span className="text-[10px] font-bold text-black tracking-wide mt-1">
                  {dates.purchased}
                </span>
              </div>

              <div className="flex flex-col items-center text-center p-3 md:p-4 py-8 hover:bg-gray-50 transition-colors">
                <Truck
                  size={24}
                  strokeWidth={1.5}
                  className="text-black mb-[14px] opacity-60"
                />
                <span className="text-[9px] md:text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-1">
                  Processing
                </span>
                <span className="text-[10px] font-bold text-gray-400 tracking-wide mt-1">
                  {dates.processing}
                </span>
              </div>

              <div className="flex flex-col items-center text-center p-3 md:p-4 py-8 hover:bg-gray-50 transition-colors opacity-40">
                <div className="relative">
                  <MapPin
                    size={24}
                    strokeWidth={1.5}
                    className="text-black mb-[14px]"
                  />
                </div>
                <span className="text-[9px] md:text-[10px] font-semibold tracking-widest uppercase text-black mb-1">
                  Delivered
                </span>
                <span className="text-[10px] font-bold text-gray-600 tracking-wide mt-1">
                  {dates.delivered}
                </span>
              </div>
            </div>
          </div>

          <div ref={cartRef} className="flex flex-col gap-3 w-full mb-12">
            <Button
              variant="primary"
              size="lg"
              className="w-full h-14 shadow-lg shadow-black/10 text-[13px] tracking-[0.2em]"
              onClick={() => {
                if (!user) {
                  const redirectPath = encodeURIComponent(pathname);
                  router.push(`/login?redirect=${redirectPath}`);
                  return;
                }

                // Construct the standardized item payload
                const variantString = Object.entries(selectedVariants)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(", ");

                const cartProduct = {
                  id: product._id,
                  title: product.title,
                  price: product.price,
                  salePrice: product.salePrice,
                  image: product.images?.[0] || "",
                  bundleId: selectedBundleId,
                  bundleTitle: selectedBundle?.title,
                  // If it's a bundle, the effective price is the bundle price
                  // If not, it's already handled in CartContext/Sidebar via salePrice
                };

                // If a bundle is selected (and it's not the virtual SINGLE UNIT),
                // the price in the cart should probably reflect the bundle price
                if (hasBundles && selectedBundleId > 0) {
                  cartProduct.price = selectedBundle.price;
                  cartProduct.salePrice = undefined; // Bundles have fixed prices for now
                }

                addItem({
                  product: cartProduct,
                  variant: variantString || "Standard",
                });

                toast.success(
                  product.stockStage === "pre-order"
                    ? "Pre-order added to bag"
                    : "Added to your shopping bag",
                );
              }}
            >
              {product.stockStage === "pre-order"
                ? "PRE-ORDER NOW"
                : "ADD TO CART"}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full h-14 shadow-sm text-[13px] tracking-[0.2em]"
              onClick={() => {
                if (!user) {
                  const redirectPath = encodeURIComponent(pathname);
                  router.push(`/login?redirect=${redirectPath}`);
                  return;
                }
                // Buy It Now logic would typically redirect to checkout
                const variantString = Object.entries(selectedVariants)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(", ");

                addItem({
                  product: {
                    id: product._id,
                    title: product.title,
                    price: selectedBundle?.price || product.price,
                    salePrice: selectedBundle ? undefined : product.salePrice,
                    image: product.images?.[0] || "",
                  },
                  variant: variantString || "Standard",
                });
                router.push("/checkout");
              }}
            >
              BUY IT NOW
            </Button>
          </div>
        </>
      )}

      {/* Premium Tab System */}
      <div className="w-full flex flex-col bg-white">
        <div className="flex items-center gap-10 border-b border-gray-100">
          {["description", "specifications"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 text-[11px] font-medium uppercase tracking-[0.15em] transition-all relative ${
                activeTab === tab
                  ? "text-black"
                  : "text-gray-400 hover:text-black"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute -bottom-px left-0 w-full h-px bg-black"></div>
              )}
            </button>
          ))}
        </div>

        <div className="py-10 w-full">
          {activeTab === "description" && (
            <div className="flex flex-col text-[13px] md:text-[14px] text-gray-600 leading-relaxed max-w-none">
              <div
                className="leading-loose text-gray-700 prose prose-sm max-w-none prose-p:mb-6"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}
          {activeTab === "specifications" && (
            <div className="flex flex-col text-[13px] md:text-[14px] text-gray-600 leading-relaxed">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
                {product.specifications?.flatMap((group) =>
                  group.items.map((item, itemIdx) => (
                    <div
                      key={`${group.group}-${itemIdx}`}
                      className="flex items-center justify-between py-4 border-b border-gray-50 group"
                    >
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-black transition-colors">
                        {item.label}
                      </span>
                      <span className="text-[12px] font-medium text-gray-900">
                        {item.value}
                      </span>
                    </div>
                  )),
                )}
              </div>
              {!product.specifications?.length && (
                <div className="py-4 text-gray-400 italic text-[12px]">
                  No specifications listed.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
