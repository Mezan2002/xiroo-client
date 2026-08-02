"use client";

export default function DeliverySection({ deliveryMethod, setDeliveryMethod, district, deliveryFeeData, hasFreeDelivery }) {
  if (hasFreeDelivery) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
        <div className="space-y-4">
          <h2 className="text-[18px] font-medium uppercase tracking-wider">
            Delivery Method
          </h2>
          <div className="p-6 bg-green-50 border border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <span className="text-sm font-bold text-green-800 uppercase tracking-wider">
                  Free Delivery
                </span>
                <p className="text-[11px] text-green-600 mt-0.5">
                  This order qualifies for free shipping
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const normalFee = deliveryFeeData?.normal ?? null;
  const fastFee = deliveryFeeData?.fast ?? null;
  const estimatedDays = deliveryFeeData?.estimatedDays || {};

  const methods = [
    { 
      id: "normal", 
      label: "Normal Delivery", 
      desc: estimatedDays.normal || (district === "Dhaka" ? "2-3 Days" : "3-4 Days"), 
      price: !district ? "Select district" : normalFee !== null ? `৳${normalFee}` : "Loading..."
    },
    { 
      id: "fast", 
      label: "Fast Delivery", 
      desc: estimatedDays.fast || "24-48 Hours", 
      price: !district ? "Select district" : fastFee !== null ? `৳${fastFee}` : "Loading..."
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="space-y-4">
        <h2 className="text-[18px] font-medium uppercase tracking-wider">
          Delivery Method
        </h2>
        <div className="border border-gray-100 divide-y divide-gray-100 overflow-hidden">
          {methods.map((m) => (
            <label
              key={m.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 gap-3 sm:gap-0 cursor-pointer hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  name="shipping"
                  checked={deliveryMethod === m.id}
                  onChange={() => setDeliveryMethod(m.id)}
                  className="w-4 h-4 accent-black shrink-0"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium uppercase tracking-wider leading-tight">
                    {m.label}
                  </span>
                  <span className="text-[11px] text-gray-400 font-medium mt-0.5">
                    {m.desc}
                  </span>
                </div>
              </div>
              <span className="text-sm font-medium uppercase sm:text-right pl-8 sm:pl-0">
                {m.price}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
