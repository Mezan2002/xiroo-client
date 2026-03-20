"use client";
import { Button } from "@/components/ui/Button";
import {
  Check,
  Clock,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

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
  const [selectedBundle, setSelectedBundle] = useState(3);
  const [quantity, setQuantity] = useState(3);
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="flex flex-col w-full pb-20 px-0 md:px-6 lg:px-10">
      {/* Top Main Entry */}
      <div className="flex flex-col items-center text-center w-full mb-10 font-mono pt-4 lg:pt-8">
        <h1 className="text-[26px] md:text-4xl lg:text-5xl font-normal tracking-tight text-[#111] leading-[1.3] mb-4 max-w-[95%]">
          {product.title}
        </h1>
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-[17px] md:text-[19px] font-normal text-black">
            <span className="mr-1">৳</span>
            {(
              bundles.find((b) => b.id === selectedBundle)?.price * quantity
            ).toLocaleString()}
          </span>
        </div>
        <span className="text-[11px] md:text-[12px] text-gray-500 tracking-wide mt-1">
          {product.shipping}
        </span>
      </div>

      {/* High-Conversion Bundle Selector (Pure Monochrome Minimal Block) */}
      <div className="w-full mb-10 px-[2px]">
        {/* Added Native Heading and Subheading Elements */}
        <div className="flex flex-col text-left w-full mb-6 py-[2px]">
          <h3 className="text-[14px] md:text-[15px] font-black tracking-widest text-black uppercase">
            Choose Your Bundle
          </h3>
          <p className="text-[12px] md:text-[13px] text-gray-500 mt-[6px]">
            Select a package below to secure your exclusive discount.
          </p>
        </div>

        <div className="flex flex-col w-full">
          {bundles.map((bundle) => {
            const isSelected = selectedBundle === bundle.id;

            return (
              <div
                key={bundle.id}
                onClick={() => setSelectedBundle(bundle.id)}
                className={`relative w-full mb-[14px] p-[16px] md:p-5 flex items-center justify-between cursor-pointer transition-all border-2 ${
                  isSelected
                    ? "bg-white border-black shadow-[0_6px_20px_rgba(0,0,0,0.06)]"
                    : "bg-white border-gray-200 hover:border-gray-400"
                }`}
              >
                {/* Absolute Floating UI Badges */}
                {bundle.badge && (
                  <div
                    className={`absolute -top-[12px] right-3 md:right-5 px-[10px] md:px-3 py-[4px] text-[9px] md:text-[10px] font-black tracking-widest uppercase flex items-center gap-[6px] shadow-sm ${
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
                  {/* SVG Checkmark Geometry */}
                  <div
                    className={`w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? "bg-black border-[1.5px] border-black"
                        : "bg-transparent border-[1.5px] border-gray-300"
                    }`}
                  >
                    {isSelected && (
                      <Check size={12} className="text-white" strokeWidth={4} />
                    )}
                  </div>

                  {/* Pack Title & Discount Badging */}
                  <div className="flex flex-col text-left">
                    <div className="flex flex-wrap items-center gap-2 md:gap-3">
                      <span
                        className={`text-[13px] md:text-[15px] font-black tracking-[0.05em] uppercase text-black`}
                      >
                        {bundle.title}
                      </span>
                      {bundle.discount && (
                        <span
                          className={`px-[6px] py-[3px] text-[9px] md:text-[10px] font-black tracking-widest leading-none mt-px md:mt-0 ${
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

                {/* Pricing Outputs */}
                <div className="flex flex-col items-end text-right w-[35%] shrink-0">
                  <span
                    className={`text-[18px] md:text-[22px] font-black tracking-tight text-black`}
                  >
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

        {/* Dynamic Adjust Quantity Terminal Row */}
        <div className="flex items-center justify-between w-full mt-4 md:mt-8 pt-6 pb-2 border-t border-gray-200">
          <div className="text-[11px] md:text-[12px] font-black tracking-widest text-black uppercase">
            Adjust Quantity
          </div>
          <div className="flex items-center border border-gray-300 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 md:w-12 h-[38px] md:h-12 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-50 transition-colors"
            >
              <Minus size={14} />
            </button>
            <div className="w-10 md:w-14 h-[38px] md:h-12 flex items-center justify-center border-l border-r border-gray-200 text-black text-[13px] font-bold tracking-widest">
              {quantity < 10 ? `0${quantity}` : quantity}
            </div>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 md:w-12 h-[38px] md:h-12 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-50 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Creative Brutalist Ticket Stepper */}
      <div className="flex flex-col w-full mb-10 mt-6 overflow-hidden border-2 border-black bg-white shadow-[4px_4px_0px_#000]">
        {/* Ticket Banner Header */}
        <div className="flex flex-col md:flex-row items-center justify-between w-full bg-black text-white px-4 md:px-5 py-[14px] gap-2 md:gap-0">
          <div className="flex items-center gap-2 w-full md:w-auto justify-center md:justify-start">
            <Clock size={16} strokeWidth={2.5} className="text-[#c8ab5c]" />
            <span className="text-[11px] md:text-[12px] font-black tracking-widest uppercase">
              Order within 21:13:06
            </span>
          </div>
          <div className="text-[10px] md:text-[11px] font-bold tracking-[0.15em] uppercase w-full md:w-auto text-center md:text-right text-gray-400">
            Est. Delivery{" "}
            <span className="text-white ml-[6px] border-b border-white pb-px inline-block -mb-px">
              Apr 03 &mdash; 08
            </span>
          </div>
        </div>

        {/* 3-Column Ticket Grid */}
        <div className="grid grid-cols-3 divide-x-2 divide-black w-full bg-white">
          <div className="flex flex-col items-center text-center p-3 md:p-4 py-8 hover:bg-gray-50 transition-colors">
            <ShoppingBag
              size={24}
              strokeWidth={1.5}
              className="text-black mb-[14px]"
            />
            <span className="text-[9px] md:text-[10px] font-black tracking-widest uppercase text-black mb-1">
              Purchased
            </span>
            <span className="text-[10px] font-bold text-gray-500 tracking-wide mt-1">
              Mar 20
            </span>
          </div>

          <div className="flex flex-col items-center text-center p-3 md:p-4 py-8 bg-gray-50 transition-colors relative">
            {/* Active Indicator Arrow */}
            <div className="absolute -top-px left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-black"></div>
            <Truck
              size={24}
              strokeWidth={1.5}
              className="text-black mb-[14px]"
            />
            <span className="text-[9px] md:text-[10px] font-black tracking-widest uppercase text-black mb-1">
              Processing
            </span>
            <span className="text-[10px] font-bold text-black tracking-wide mt-1">
              Mar 20 &mdash; 25
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
            <span className="text-[9px] md:text-[10px] font-black tracking-widest uppercase text-black mb-1">
              Delivered
            </span>
            <span className="text-[10px] font-bold text-gray-600 tracking-wide mt-1">
              Apr 03 &mdash; 08
            </span>
          </div>
        </div>
      </div>

      {/* Cart & Conversion Actions */}
      <div ref={cartRef} className="flex flex-col gap-3 w-full mb-10">
        <Button
          variant="primary"
          className="w-full h-[52px] text-[13px] font-bold tracking-widest bg-black text-white hover:bg-gray-900 transition-colors shadow-lg shadow-black/10"
        >
          ADD TO CART
        </Button>
        <Button
          variant="outline"
          className="w-full h-[52px] text-[13px] font-bold tracking-widest border border-gray-300 bg-white hover:bg-gray-50 transition-colors text-black"
        >
          BUY IT NOW
        </Button>
      </div>

      {/* Product Details Tabs (Description & Specifications) */}
      <div className="w-full mt-2 flex flex-col bg-white">
        <div className="flex items-center gap-6 md:gap-10 border-b-2 border-gray-100">
          <button
            onClick={() => setActiveTab("description")}
            className={`pb-3 text-[11px] md:text-[12px] font-black tracking-widest uppercase transition-colors relative ${activeTab === "description" ? "text-black" : "text-gray-400 hover:text-gray-700"}`}
          >
            Description
            {activeTab === "description" && (
              <div className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-black"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("specifications")}
            className={`pb-3 text-[11px] md:text-[12px] font-black tracking-widest uppercase transition-colors relative ${activeTab === "specifications" ? "text-black" : "text-gray-400 hover:text-gray-700"}`}
          >
            Specifications
            {activeTab === "specifications" && (
              <div className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-black"></div>
            )}
          </button>
        </div>

        <div className="pt-6 pb-12 w-full">
          {activeTab === "description" && (
            <div className="flex flex-col text-[13px] md:text-[14px] text-gray-600 leading-[1.8]">
              <p className="mb-6 leading-loose text-gray-700">
                {product.description ||
                  "Designed with minimal aesthetics and premium materials, this product blends seamlessly into your modern lifestyle. Featuring robust construction and an elegant silhouette, it guarantees both durability and timeless style."}
              </p>

              <table className="w-full text-left border-collapse text-[12px] md:text-[13px]">
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 font-bold text-black w-[35%] md:w-[40%] uppercase tracking-wider text-[10px] md:text-[11px]">
                      Primary Function
                    </td>
                    <td className="py-3 text-gray-600">
                      Ambient Lighting & Accent Decor
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 font-bold text-black w-[35%] md:w-[40%] uppercase tracking-wider text-[10px] md:text-[11px]">
                      Design Style
                    </td>
                    <td className="py-3 text-gray-600">
                      Minimalist Neo-Industrial
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 font-bold text-black w-[35%] md:w-[40%] uppercase tracking-wider text-[10px] md:text-[11px]">
                      Key Features
                    </td>
                    <td className="py-3 text-gray-600">
                      Energy-efficient, tactile finish, stable base
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Detailed Product Images Structure */}
              <div className="mt-8 flex flex-col gap-4 w-full">
                {/* Full Width Detail Wrap */}
                <div className="relative w-full aspect-4/3 md:aspect-video bg-[#f8f8f8] overflow-hidden rounded-[4px]">
                  <Image
                    src="/images/comparison-dark.png"
                    alt="Detailed View"
                    fill
                    className="w-full h-full object-cover object-center hover:scale-[1.03] transition-transform duration-700"
                  />
                </div>
                {/* Split Detail Structure */}
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="relative w-full aspect-4/5 md:aspect-square bg-[#f8f8f8] overflow-hidden rounded-[4px]">
                    <Image
                      src="/images/comparison-light.png"
                      fill
                      alt="Detailed Structure Focus"
                      className="w-full h-full object-cover object-center hover:scale-[1.03] transition-transform duration-700"
                    />
                  </div>
                  <div className="relative w-full aspect-4/5 md:aspect-square bg-[#f8f8f8] overflow-hidden rounded-[4px]">
                    <Image
                      src="/images/comparison-dark.png"
                      alt="Detailed Material Focus"
                      fill
                      className="w-full h-full object-cover object-center hover:scale-[1.03] transition-transform duration-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "specifications" && (
            <div className="flex flex-col text-[13px] md:text-[14px] text-gray-600 leading-[1.8]">
              <table className="w-full text-left border-collapse text-[12px] md:text-[13px]">
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 font-bold text-black w-[35%] md:w-[40%] uppercase tracking-wider text-[10px] md:text-[11px]">
                      Material Structure
                    </td>
                    <td className="py-3 text-gray-600">
                      {product.materials ||
                        "Premium Silicone and Aluminum Alloy"}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 font-bold text-black w-[35%] md:w-[40%] uppercase tracking-wider text-[10px] md:text-[11px]">
                      Dimensions
                    </td>
                    <td className="py-3 text-gray-600">
                      12.5&quot; H x 6&quot; W x 4&quot; D
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 font-bold text-black w-[35%] md:w-[40%] uppercase tracking-wider text-[10px] md:text-[11px]">
                      Net Weight
                    </td>
                    <td className="py-3 text-gray-600">1.2 lbs (0.54 kg)</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 font-bold text-black w-[35%] md:w-[40%] uppercase tracking-wider text-[10px] md:text-[11px]">
                      Power Input
                    </td>
                    <td className="py-3 text-gray-600">
                      5W Standard USB / Battery Output
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 font-bold text-black w-[35%] md:w-[40%] uppercase tracking-wider text-[10px] md:text-[11px]">
                      Warranty
                    </td>
                    <td className="py-3 text-gray-600">
                      1-Year Limited Manufacturer Defect
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
