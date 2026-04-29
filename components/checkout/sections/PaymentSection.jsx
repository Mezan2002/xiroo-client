"use client";
import Link from "next/link";

export default function PaymentSection({ user, formData, handleChange }) {
  const methods = [
    { id: "cod", label: "Cash on Delivery", active: true },
    { id: "card", label: "Credit Card (Coming Soon)", active: false },
    { id: "mobile", label: "Mobile Banking (Coming Soon)", active: false },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">

      {/* Payment Method */}
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

      {/* Register with checkout info — only shown to guests */}
      {!user && (
        <div className="border border-gray-100 bg-gray-50/40 p-6 sm:p-8 space-y-6 animate-in fade-in duration-500">
          <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-widest text-black">
              Save Your Info for Next Time
            </p>
            <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
              Your name, email and address are already filled in. Just add a
              password to create your free account.
            </p>
          </div>

          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              className={`w-5 h-5 border-2 flex items-center justify-center transition-all shrink-0 ${
                formData.shouldRegister
                  ? "border-black bg-black"
                  : "border-gray-300 bg-white group-hover:border-gray-500"
              }`}
            >
              {formData.shouldRegister && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <input
              type="checkbox"
              name="shouldRegister"
              checked={formData.shouldRegister}
              onChange={handleChange}
              className="sr-only"
            />
            <span className="text-[11px] font-bold uppercase tracking-widest select-none">
              Yes, create my account
            </span>
          </label>

          {formData.shouldRegister && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                Choose a Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={formData.shouldRegister}
                minLength={8}
                placeholder="At least 8 characters"
                className="w-full h-14 px-6 bg-white border border-gray-200 focus:border-black outline-none transition-all text-sm font-medium placeholder:text-gray-300"
              />
              <p className="text-[9px] text-gray-400 uppercase tracking-widest font-medium">
                A verification email will be sent after your order is placed.
              </p>
            </div>
          )}

          <p className="text-[9px] text-gray-400 font-medium">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-black font-bold underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
