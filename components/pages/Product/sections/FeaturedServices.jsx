"use client";

import { Banknote, Headphones, PackageCheck, Truck } from "lucide-react";

const services = [
  {
    icon: Banknote,
    label: "Cash on Delivery",
    description: "Pay at your doorstep",
  },
  {
    icon: Truck,
    label: "Free Delivery",
    description: "On 3+ items",
  },
  {
    icon: PackageCheck,
    label: "100% Authentic",
    description: "Quality guaranteed",
  },
  {
    icon: Headphones,
    label: "24/7 Support",
    description: "We're always here",
  },
];

export default function FeaturedServices() {
  return (
    <div className="w-full mt-4 mb-6 border border-black bg-white">
      <div className="grid grid-cols-2">
        {services.map((service, idx) => {
          const Icon = service.icon;
          const isRight = idx % 2 === 1;
          const isBottom = idx >= 2;

          return (
            <div
              key={service.label}
              className={`flex items-center gap-3 px-4 py-4 md:px-5 md:py-5 ${
                !isRight ? "border-r border-black" : ""
              } ${isBottom ? "border-t border-black" : ""}`}
            >
              <div className="w-9 h-9 bg-black flex items-center justify-center shrink-0">
                <Icon size={15} strokeWidth={1.5} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] md:text-[12px] font-bold text-black uppercase tracking-widest leading-tight mb-0.5">
                  {service.label}
                </span>
                <span className="text-[10px] md:text-[11px] text-gray-500 tracking-wide">
                  {service.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
