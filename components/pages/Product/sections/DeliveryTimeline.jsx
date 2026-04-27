"use client";
import { Clock, MapPin, ShoppingBag, Truck } from "lucide-react";

export default function DeliveryTimeline({ timeLeft, dates }) {
  const steps = [
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
  ];

  return (
    <div className="flex flex-col w-full mb-12 mt-8 overflow-hidden border border-black bg-white">
      <div className="flex flex-col lg:flex-row items-center justify-between w-full bg-black text-white px-4 py-3 lg:px-6 lg:py-4 gap-2 lg:gap-0">
        <div className="flex items-center gap-2 lg:gap-3 w-full lg:w-auto justify-center lg:justify-start">
          <Clock
            className="w-[14px] h-[14px] lg:w-[16px] lg:h-[16px] text-white"
            strokeWidth={2.5}
          />
          <span className="text-[10px] font-semibold tracking-[0.2em] uppercase">
            Place order IN {timeLeft}
          </span>
        </div>
        <div className="text-[9px] font-semibold tracking-[0.2em] uppercase text-gray-500">
          Arriving{" "}
          <span className="text-white ml-1.5 lg:ml-2">
            {dates.delivered}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-gray-200 w-full bg-white relative">
        {steps.map((step, idx) => (
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
  );
}
