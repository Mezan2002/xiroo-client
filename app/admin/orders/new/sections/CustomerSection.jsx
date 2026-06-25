/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { BANGLADESH_LOCATIONS, DISTRICTS } from "@/lib/bangladeshLocations";
import {
  Check,
  ChevronDown,
  Mail,
  MapPin,
  Phone,
  Search,
  Truck,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const Label = ({ children, optional }) => (
  <label className="text-[10px] font-bold text-zinc-900 uppercase block mb-3 tracking-[0.2em] flex items-center gap-2">
    {children}
    {optional && (
      <span className="text-zinc-300 font-normal normal-case tracking-normal text-[9px]">
        (optional)
      </span>
    )}
  </label>
);

const SectionHeader = ({ label, title }) => (
  <div className="flex items-center justify-between border-b border-zinc-200 pb-8 mb-12">
    <div className="space-y-2">
      <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.3em]">
        {label}
      </h2>
      <p className="text-2xl font-light text-black tracking-tight">{title}</p>
    </div>
  </div>
);

const SubHeader = ({ children }) => (
  <div className="border-b border-zinc-100 pb-4 mb-8">
    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.25em]">
      {children}
    </p>
  </div>
);

const LocationDropdown = ({
  value,
  onChange,
  options,
  placeholder,
  allowCustom = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const [openAbove, setOpenAbove] = useState(false);
  const ref = useRef(null);
  const portalRef = useRef(null);
  const searchRef = useRef(null);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase()),
  );

  const hasExactMatch = options.some(
    (o) => o.toLowerCase() === search.toLowerCase(),
  );
  const showCustomOption = allowCustom && search.trim() && !hasExactMatch;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        portalRef.current &&
        !portalRef.current.contains(e.target)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggle = () => {
    if (!isOpen && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setCoords({
        top: rect.top + window.scrollY,
        bottom: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
      setOpenAbove(spaceBelow < 320 && rect.top > spaceBelow);
    }
    setIsOpen((v) => !v);
  };

  const selectOption = (opt) => {
    onChange(opt);
    setIsOpen(false);
    setSearch("");
  };

  const useCustomValue = () => {
    const trimmed = search.trim();
    if (trimmed) {
      onChange(trimmed);
      setIsOpen(false);
      setSearch("");
    }
  };

  return (
    <div className="relative" ref={ref}>
      <div
        onClick={toggle}
        className={`w-full border-b ${isOpen ? "border-black" : "border-zinc-200"} flex items-center justify-between py-4 cursor-pointer transition-all`}
      >
        <span
          className={`text-xl font-light ${value ? "text-black" : "text-zinc-200"}`}
        >
          {value || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-zinc-300 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>
      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={portalRef}
            className="fixed z-[9999] bg-white border border-zinc-100 shadow-[0_20px_50px_rgba(0,0,0,0.12)] flex flex-col animate-in fade-in zoom-in-95 duration-150"
            style={{
              left: coords.left,
              width: coords.width,
              ...(openAbove
                ? {
                    bottom:
                      window.innerHeight - (coords.top - window.scrollY) + 4,
                  }
                : { top: coords.bottom - window.scrollY + 4 }),
            }}
          >
            <div className="p-3 border-b border-zinc-50 flex items-center gap-3">
              <Search className="w-4 h-4 text-zinc-300" />
              <input
                ref={searchRef}
                autoFocus
                className="flex-1 outline-none text-sm font-medium"
                placeholder={
                  allowCustom ? "search or type custom..." : "search..."
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && showCustomOption) {
                    e.preventDefault();
                    useCustomValue();
                  }
                }}
              />
            </div>
            <div className="max-h-64 overflow-y-auto">
              {filtered.length > 0 &&
                filtered.map((o) => (
                  <div
                    key={o}
                    onClick={() => selectOption(o)}
                    className={`px-5 py-3 text-sm font-medium cursor-pointer transition-colors hover:bg-zinc-50 ${value === o ? "bg-zinc-50 text-black border-l-2 border-black" : "text-zinc-500"}`}
                  >
                    {o}
                  </div>
                ))}
              {showCustomOption && (
                <div
                  onClick={useCustomValue}
                  className="px-5 py-3 text-sm font-medium cursor-pointer transition-colors hover:bg-zinc-50 text-black border-t border-zinc-100 flex items-center gap-2"
                >
                  <span className="text-zinc-400">Use</span>
                  <span className="font-semibold">
                    &quot;{search.trim()}&quot;
                  </span>
                  <span className="text-zinc-400">as custom value</span>
                </div>
              )}
              {filtered.length === 0 && !showCustomOption && (
                <div className="px-5 py-8 text-[11px] font-bold uppercase tracking-widest text-center text-zinc-300">
                  No results
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default function CustomerSection({ order, setOrder }) {
  const thanas = order.shipping?.district
    ? BANGLADESH_LOCATIONS[order.shipping.district] || []
    : [];

  const handleShipping = (field, value) => {
    setOrder((prev) => ({
      ...prev,
      shipping: { ...prev.shipping, [field]: value },
    }));
  };

  const handleDistrictChange = (val) => {
    setOrder((prev) => {
      const isInsideDhaka = val === "Dhaka";
      const fee = prev.deliveryMethod === "normal"
        ? (isInsideDhaka ? 80 : 150)
        : (isInsideDhaka ? 130 : 200);
      return {
        ...prev,
        shippingFee: fee,
        shipping: { ...prev.shipping, district: val, thana: "" },
      };
    });
  };

  const handleDeliveryMethodChange = (methodId) => {
    setOrder((prev) => {
      const isInsideDhaka = prev.shipping?.district === "Dhaka";
      const fee = methodId === "normal"
        ? (isInsideDhaka ? 80 : 150)
        : (isInsideDhaka ? 130 : 200);
      return {
        ...prev,
        deliveryMethod: methodId,
        shippingFee: fee,
      };
    });
  };

  const isInsideDhaka = order.shipping?.district === "Dhaka";

  const deliveryMethods = [
    {
      id: "normal",
      label: "Normal Delivery",
      fee: isInsideDhaka ? 80 : 150,
      desc: isInsideDhaka ? "2-3 Days" : "3-4 Days",
    },
    {
      id: "fast",
      label: "Fast Delivery",
      fee: isInsideDhaka ? 130 : 200,
      desc: "24-48 Hours",
    },
  ];

  const paymentMethods = [
    { id: "cod", label: "Cash on Delivery" },
    { id: "online", label: "Online Payment" },
  ];

  return (
    <section className="space-y-16">
      <SectionHeader label="Block 01" title="Customer & Delivery" />

      {/* Customer Details */}
      <div>
        <SubHeader>Customer Details</SubHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-3">
            <Label>First Name</Label>
            <div className="relative group">
              <input
                type="text"
                placeholder="John"
                value={order.firstName || ""}
                className="w-full bg-transparent border-b border-zinc-200 focus:border-black outline-none transition-all text-xl font-light py-4 placeholder:text-zinc-200"
                onChange={(e) =>
                  setOrder({
                    ...order,
                    firstName: e.target.value,
                    customer:
                      `${e.target.value} ${order.lastName || ""}`.trim(),
                  })
                }
              />
              <User
                className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black"
                size={18}
              />
            </div>
          </div>
          <div className="space-y-3">
            <Label>Last Name</Label>
            <div className="relative group">
              <input
                type="text"
                placeholder="Doe"
                value={order.lastName || ""}
                className="w-full bg-transparent border-b border-zinc-200 focus:border-black outline-none transition-all text-xl font-light py-4 placeholder:text-zinc-200"
                onChange={(e) =>
                  setOrder({
                    ...order,
                    lastName: e.target.value,
                    customer:
                      `${order.firstName || ""} ${e.target.value}`.trim(),
                  })
                }
              />
              <User
                className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black"
                size={18}
              />
            </div>
          </div>
          <div className="space-y-3">
            <Label>Phone Number</Label>
            <div className="relative group">
              <input
                type="tel"
                placeholder="017XXXXXXXX"
                value={order.phone}
                className="w-full bg-transparent border-b border-zinc-200 focus:border-black outline-none transition-all text-xl font-light py-4 placeholder:text-zinc-200"
                onChange={(e) => setOrder({ ...order, phone: e.target.value })}
              />
              <Phone
                className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black"
                size={18}
              />
            </div>
          </div>
          <div className="space-y-3">
            <Label optional>Email Address</Label>
            <div className="relative group">
              <input
                type="email"
                placeholder="john@example.com"
                value={order.email}
                className="w-full bg-transparent border-b border-zinc-200 focus:border-black outline-none transition-all text-xl font-light py-4 placeholder:text-zinc-200"
                onChange={(e) => setOrder({ ...order, email: e.target.value })}
              />
              <Mail
                className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black"
                size={18}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      <div>
        <SubHeader>Delivery Address</SubHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-3">
            <Label>District</Label>
            <LocationDropdown
              value={order.shipping?.district || ""}
              onChange={handleDistrictChange}
              options={DISTRICTS}
              placeholder="Select District"
            />
          </div>
          <div className="space-y-3">
            <Label>Thana / Upazila</Label>
            <LocationDropdown
              value={order.shipping?.thana || ""}
              onChange={(val) => handleShipping("thana", val)}
              options={thanas}
              allowCustom
              placeholder={
                order.shipping?.district
                  ? "Select or type Thana"
                  : "Select district first"
              }
            />
          </div>

          <div className="space-y-3 md:col-span-2">
            <Label>Detailed Address</Label>
            <div className="relative group">
              <input
                type="text"
                placeholder="Road no, House no, Block, Area..."
                value={order.shipping?.address || ""}
                className="w-full bg-transparent border-b border-zinc-200 focus:border-black outline-none transition-all text-xl font-light py-4 placeholder:text-zinc-200"
                onChange={(e) => handleShipping("address", e.target.value)}
              />
              <MapPin
                className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black"
                size={18}
              />
            </div>
          </div>
          <div className="space-y-3">
            <Label optional>Postal Code</Label>
            <input
              type="text"
              placeholder="1230"
              value={order.shipping?.postcode || ""}
              className="w-full bg-transparent border-b border-zinc-200 focus:border-black outline-none transition-all text-[16px] font-medium py-4 placeholder:text-zinc-200"
              onChange={(e) => handleShipping("postcode", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Delivery Velocity & Payment Strategy */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-8 border-t border-zinc-100">
        <div className="md:col-span-8 space-y-6">
          <Label>Delivery Velocity</Label>
          <div className="flex gap-4">
            {deliveryMethods.map((method) => (
              <button
                type="button"
                key={method.id}
                onClick={() => handleDeliveryMethodChange(method.id)}
                className={`flex-1 flex flex-col items-start justify-between p-5 border transition-all ${order.deliveryMethod === method.id ? "bg-black text-white border-black shadow-md" : "bg-white text-zinc-400 border-zinc-100 hover:border-zinc-300"}`}
              >
                <div className="flex items-center gap-3 w-full justify-between">
                  <div className="flex items-center gap-3">
                    <Truck size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      {method.label}
                    </span>
                  </div>
                  <span className="text-[12px] font-bold">
                    {method.fee === 0 ? "Free" : `৳${method.fee}`}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-medium mt-2 uppercase tracking-wider ${order.deliveryMethod === method.id ? "text-zinc-300" : "text-zinc-400"}`}
                >
                  {method.desc}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="md:col-span-4 bg-zinc-50 border border-zinc-100 p-8 space-y-6">
          <Label>Payment Strategy</Label>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <button
                type="button"
                key={method.id}
                onClick={() => setOrder({ ...order, paymentMethod: method.id })}
                className={`w-full flex items-center justify-between p-4 border transition-all ${order.paymentMethod === method.id ? "bg-black text-white border-black shadow-md" : "bg-white text-zinc-400 border-zinc-100 hover:border-zinc-300"}`}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {method.label}
                </span>
                {order.paymentMethod === method.id && <Check size={12} />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
