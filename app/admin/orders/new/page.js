"use client";
import React, { useState } from "react";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import { 
  ShoppingBag, 
  Save, 
  Plus, 
  Trash2, 
  User, 
  MapPin, 
  Search,
  Check,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

// --- Sub-components ---
const Label = ({ children }) => (
  <label className="text-[10px] font-bold text-zinc-900 uppercase block mb-3 font-montserrat tracking-[0.2em]">
    {children}
  </label>
);

const SectionHeader = ({ label, title, action }) => (
  <div className="flex items-center justify-between border-b border-zinc-200 pb-8 mb-12 font-montserrat">
    <div className="space-y-2">
      <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.3em]">
        {label}
      </h2>
      <p className="text-2xl font-light text-black tracking-tight">{title}</p>
    </div>
    {action}
  </div>
);

export default function NewOrderPage() {
  const router = useRouter();
  const [order, setOrder] = useState({
    customer: "",
    email: "",
    items: [],
    shipping: {
      address: "",
      area: "",
      city: "Dhaka",
      postcode: ""
    },
    paymentMethod: "COD"
  });

  // Items Logic
  const addItem = () => {
    setOrder(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now(), name: "Select Product", price: 0, qty: 1 }]
    }));
  };

  const removeItem = (id) => {
    setOrder(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const calculateSubtotal = () => order.items.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div className="space-y-24 font-montserrat antialiased text-zinc-900 animate-in fade-in duration-700 pb-20">
      <ModuleHeader 
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Orders", href: "/admin/orders" },
          { label: "Draft", active: true }
        ]}
        title="Draft Order"
        icon={ShoppingBag}
        primaryAction={{
          label: "Create Order",
          icon: Save,
          onClick: () => console.log("Order Registry:", order)
        }}
      />

      <div className="space-y-32">
        {/* Customer Identity */}
        <section>
          <SectionHeader label="Block 01" title="Customer Identity" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <Label>Full Name</Label>
              <div className="relative group">
                <input 
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-transparent border-b border-zinc-200 focus:border-black outline-none transition-all text-xl font-light py-4 placeholder:text-zinc-200"
                  onChange={(e) => setOrder({...order, customer: e.target.value})}
                />
                <User className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black transition-colors" size={20} />
              </div>
            </div>
            <div className="space-y-4">
              <Label>Email Address</Label>
              <div className="relative group">
                <input 
                  type="email"
                  placeholder="john@example.com"
                  className="w-full bg-transparent border-b border-zinc-200 focus:border-black outline-none transition-all text-xl font-light py-4 placeholder:text-zinc-200"
                  onChange={(e) => setOrder({...order, email: e.target.value})}
                />
                <Mail className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black transition-colors" size={20} />
              </div>
            </div>
          </div>
        </section>

        {/* Order Items */}
        <section>
          <SectionHeader 
            label="Block 02" 
            title="Order Registry" 
            action={
              <button 
                onClick={addItem}
                className="text-[11px] font-bold text-zinc-400 hover:text-black uppercase tracking-widest transition-colors flex items-center gap-2"
              >
                <Plus size={14} /> Add Product
              </button>
            }
          />
          {order.items.length === 0 ? (
            <div className="bg-zinc-50 border border-zinc-100 p-20 text-center">
              <p className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest italic opacity-60">
                Registry currently empty. Add products to populate.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <table className="w-full text-left">
                <thead className="border-b border-zinc-100">
                  <tr>
                    <th className="pb-6 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Item Narrative</th>
                    <th className="pb-6 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">Qty</th>
                    <th className="pb-6 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Unit Price</th>
                    <th className="pb-6 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Total</th>
                    <th className="pb-6 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {order.items.map((item) => (
                    <tr key={item.id} className="group">
                      <td className="py-6 pr-6">
                        <div className="relative group">
                          <input 
                            placeholder="Search product..."
                            className="bg-transparent border-b border-zinc-100 focus:border-black outline-none w-full text-[14px] font-medium py-1 transition-all"
                          />
                          <Search className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-200 group-focus-within:text-zinc-400" size={12} />
                        </div>
                      </td>
                      <td className="py-6 px-6 text-center">
                        <input 
                          type="number"
                          defaultValue={1}
                          className="w-16 bg-zinc-50 border-b border-zinc-200 text-center text-[13px] font-bold py-1 outline-none focus:border-black"
                        />
                      </td>
                      <td className="py-6 px-6 text-right">
                        <input 
                          placeholder="0.00"
                          className="w-24 bg-transparent border-b border-zinc-100 text-right text-[13px] font-medium py-1 outline-none focus:border-black"
                        />
                      </td>
                      <td className="py-6 pl-6 text-right text-[14px] font-bold text-black">
                        ৳0.00
                      </td>
                      <td className="py-6 pl-6 text-right">
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-zinc-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end pt-8 border-t border-zinc-100">
                <div className="w-full max-w-[200px] flex justify-between items-center">
                  <span className="text-[11px] font-bold text-zinc-200 uppercase tracking-widest">Registry Subtotal</span>
                  <span className="text-xl font-light text-black">৳{calculateSubtotal().toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Logistics Anchor */}
        <section>
          <SectionHeader label="Block 03" title="Logistics Anchor" />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-20">
            <div className="md:col-span-8 space-y-12">
              <div className="space-y-4">
                <Label>Shipping Destination</Label>
                <div className="relative group">
                  <input 
                    placeholder="House 12, Road 4, Sector 7"
                    className="w-full bg-transparent border-b border-zinc-200 focus:border-black outline-none transition-all text-xl font-light py-4 placeholder:text-zinc-200"
                  />
                  <MapPin className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black transition-colors" size={20} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-4">
                  <Label>Fulfillment Area</Label>
                  <input 
                    placeholder="Uttara"
                    className="w-full bg-transparent border-b border-zinc-200 focus:border-black outline-none text-[13px] font-medium py-2 placeholder:text-zinc-200"
                  />
                </div>
                <div className="space-y-4">
                  <Label>Registry Postcode</Label>
                  <input 
                    placeholder="1230"
                    className="w-full bg-transparent border-b border-zinc-200 focus:border-black outline-none text-[13px] font-medium py-2 placeholder:text-zinc-200"
                  />
                </div>
              </div>
            </div>
            <div className="md:col-span-4 bg-zinc-50 border border-zinc-100 p-12 space-y-8">
              <Label>Payment Strategy</Label>
              <div className="space-y-4">
                {["Cash on Delivery", "Bank Transfer", "Digital Wallet"].map((method) => (
                  <button 
                    key={method}
                    onClick={() => setOrder({...order, paymentMethod: method})}
                    className={`w-full flex items-center justify-between p-4 border transition-all ${order.paymentMethod === method ? 'bg-black text-white border-black' : 'bg-white text-zinc-400 border-zinc-100 hover:border-zinc-300'}`}
                  >
                    <span className="text-[11px] font-bold uppercase tracking-widest">{method}</span>
                    {order.paymentMethod === method && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Global Action Flow */}
        <section className="pt-32 border-t border-zinc-50 flex justify-end items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="h-12 px-8 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 border-zinc-200 hover:text-black hover:border-black transition-colors rounded-none"
          >
            Discard Draft
          </Button>
          <Button 
            className="h-12 px-12 bg-black text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-none transition-all hover:bg-zinc-800"
            onClick={() => console.log("Registering fulfillment:", order)}
          >
            Complete Registration
          </Button>
        </section>
      </div>
    </div>
  );
}
