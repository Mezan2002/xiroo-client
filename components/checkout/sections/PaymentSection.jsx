"use client";

export default function PaymentSection() {
  const methods = [
    { id: "cod", label: "Cash on Delivery", active: true },
    { id: "card", label: "Credit Card (Coming Soon)", active: false },
    { id: "mobile", label: "Mobile Banking (Coming Soon)", active: false },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="space-y-4">
        <h2 className="text-[18px] font-bold uppercase tracking-widest">
          Payment Method
        </h2>
        <div className="space-y-4">
          {methods.map((m) => (
            <label
              key={m.id}
              className={`flex items-center gap-4 p-4 sm:p-6 border cursor-pointer transition-colors ${
                m.active
                  ? "border-black bg-gray-50/50"
                  : "border-gray-100 opacity-50 grayscale hover:bg-gray-50/50"
              }`}
            >
              <input
                type="radio"
                name="payment"
                defaultChecked={m.id === "cod"}
                disabled={!m.active}
                className="w-4 h-4 accent-black shrink-0"
              />
              <span className="text-[13px] md:text-sm font-bold uppercase tracking-widest leading-tight mt-px">
                {m.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
