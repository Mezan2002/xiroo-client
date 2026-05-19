"use client";
import { ChevronRight } from "lucide-react";

export default function StepIndicator({ step }) {
  const steps = [
    { id: 1, label: "Information" },
    { id: 2, label: "Delivery" },
    { id: 3, label: "Payment" },
  ];

  return (
    <div className="flex flex-wrap gap-2 md:gap-8">
      {steps.map((s) => (
        <div key={s.id} className="flex items-center gap-2 md:gap-3">
          <span
            className={`text-[10px] md:text-[11px] font-medium uppercase tracking-wider ${step === s.id ? "text-black" : "text-gray-300"}`}
          >
            {s.label}
          </span>
          {s.id < 3 && <ChevronRight className="w-3 h-3 text-gray-200" />}
        </div>
      ))}
    </div>
  );
}
