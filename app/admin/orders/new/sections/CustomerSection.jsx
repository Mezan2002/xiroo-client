"use client";
import { User, Mail, Phone } from "lucide-react";

const Label = ({ children }) => (
  <label className="text-[10px] font-bold text-zinc-900 uppercase block mb-3 tracking-[0.2em]">
    {children}
  </label>
);

const SectionHeader = ({ label, title }) => (
  <div className="flex items-center justify-between border-b border-zinc-200 pb-8 mb-12">
    <div className="space-y-2">
      <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.3em]">{label}</h2>
      <p className="text-2xl font-light text-black tracking-tight">{title}</p>
    </div>
  </div>
);

export default function CustomerSection({ order, setOrder }) {
  return (
    <section>
      <SectionHeader label="Block 01" title="Customer Identity" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="space-y-4">
          <Label>Full Name</Label>
          <div className="relative group">
            <input
              type="text" placeholder="John Doe"
              value={order.customer}
              className="w-full bg-transparent border-b border-zinc-200 focus:border-black outline-none transition-all text-xl font-light py-4 placeholder:text-zinc-200"
              onChange={(e) => setOrder({...order, customer: e.target.value})}
            />
            <User className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black" size={20} />
          </div>
        </div>
        <div className="space-y-4">
          <Label>Phone Number</Label>
          <div className="relative group">
            <input
              type="tel" placeholder="017XXXXXXXX"
              value={order.phone}
              className="w-full bg-transparent border-b border-zinc-200 focus:border-black outline-none transition-all text-xl font-light py-4 placeholder:text-zinc-200"
              onChange={(e) => setOrder({...order, phone: e.target.value})}
            />
            <Phone className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black" size={20} />
          </div>
        </div>
        <div className="space-y-4">
          <Label>Email Address</Label>
          <div className="relative group">
            <input
              type="email" placeholder="john@example.com"
              value={order.email}
              className="w-full bg-transparent border-b border-zinc-200 focus:border-black outline-none transition-all text-xl font-light py-4 placeholder:text-zinc-200"
              onChange={(e) => setOrder({...order, email: e.target.value})}
            />
            <Mail className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black" size={20} />
          </div>
        </div>
      </div>
    </section>
  );
}
