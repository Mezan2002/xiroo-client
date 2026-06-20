"use client";

import { Coins, RotateCcw, ShieldCheck, Truck } from "lucide-react";

const FEATURES = [
  {
    icon: Coins,
    title: "Cash On Delivery",
    description:
      "Pay in cash upon receiving and inspecting your items. Zero risk, absolute convenience.",
  },
  {
    icon: RotateCcw,
    title: "Easy 7-Day Returns",
    description:
      "Fit not quite right? Return or exchange any item within 7 days of delivery, hassle-free.",
  },
  {
    icon: ShieldCheck,
    title: "Premium Quality",
    description:
      "Meticulously crafted from high-grade fabrics designed to stand the test of time.",
  },
  {
    icon: Truck,
    title: "Nationwide Shipping",
    description:
      "Fast, reliable, and fully trackable shipping directly to your doorstep across the nation.",
  },
];

export default function StoreFeatures() {
  return (
    <section className="w-full py-16 lg:py-24 px-6 lg:px-12 bg-white border-t border-gray-100">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-12 lg:mb-16">
        <span className="text-[10px] font-bold tracking-[0.4em] text-gray-400 uppercase mb-3">
          Our Guarantees
        </span>
        <h2 className="text-3xl md:text-4xl font-mono tracking-[0.12em] font-medium text-black uppercase">
          Why Shop With Us
        </h2>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-gray-100 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        {FEATURES.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div
              key={idx}
              className="group p-8 lg:p-10 flex flex-col items-start transition-colors duration-300 hover:bg-gray-50/50"
            >
              {/* Icon Wrapper with subtle rotation/bounce on hover */}
              <div className="text-black mb-6 transition-transform duration-300 group-hover:-translate-y-1">
                <Icon size={28} strokeWidth={1.5} className="text-gray-900" />
              </div>

              {/* Title */}
              <h3 className="text-xs font-bold tracking-widest uppercase text-black mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-xs md:text-sm text-gray-500 font-light leading-relaxed max-w-[280px]">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
