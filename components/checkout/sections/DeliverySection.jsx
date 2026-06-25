"use client";

export default function DeliverySection({ deliveryMethod, setDeliveryMethod, district }) {
  const isInsideDhaka = district === "Dhaka";

  const methods = [
    { 
      id: "normal", 
      label: "Normal Delivery", 
      desc: isInsideDhaka ? "2-3 Days" : "3-4 Days", 
      price: !district ? "Select district" : isInsideDhaka ? "৳80" : "৳150"
    },
    { 
      id: "fast", 
      label: "Fast Delivery", 
      desc: "24-48 Hours", 
      price: !district ? "Select district" : isInsideDhaka ? "৳120" : "৳200" 
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
