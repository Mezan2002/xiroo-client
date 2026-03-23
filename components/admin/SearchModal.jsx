"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Search, X, Package, ShoppingBag, Users, ArrowRight, Command } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchModal({ isOpen, onClose }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  
  // Memoized search logic for high-performance filtration
  const results = React.useMemo(() => {
    if (query.length <= 1) return { products: [], orders: [], customers: [] };

    return {
      products: [
        { id: "p1", name: "Xiroo™ LED Cap Lamp", price: "৳2,400" },
        { id: "p2", name: "String Cap Holder", price: "৳450" }
      ].filter(p => p.name.toLowerCase().includes(query.toLowerCase())),
      orders: [
        { id: "ORD-8F8C", customer: "John Doe", total: "৳12,400" }
      ].filter(o => o.id.toLowerCase().includes(query.toLowerCase()) || o.customer.toLowerCase().includes(query.toLowerCase())),
      customers: [
        { id: "c1", name: "Sarah Smith", email: "sarah@example.com" }
      ].filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
    };
  }, [query]);

  // Handle Esc key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-start justify-center pt-[10vh] px-4 font-montserrat antialiased">
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-white/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Command Palette */}
      <div className="relative w-full max-w-2xl bg-[#F7F7F5] border border-[#EDECE9] shadow-2xl shadow-black/10 rounded-none overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input HUD */}
        <div className="flex items-center gap-4 px-6 h-16 border-b border-[#EDECE9] bg-white">
          <Search size={20} className="text-[#37352F40]" />
          <input 
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, orders, or customers..."
            className="flex-1 bg-transparent border-none outline-none text-[15px] font-medium text-[#37352F] placeholder:text-[#37352F20]"
          />
          <div className="flex items-center gap-2 px-2 py-1 bg-[#F7F7F5] border border-[#EDECE9] rounded-none">
             <span className="text-[10px] font-bold text-[#37352F40] uppercase tracking-widest">Esc</span>
          </div>
        </div>

        {/* Dynamic Results Grid */}
        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
          {query.length > 0 ? (
            <div className="space-y-6 p-4">
              {/* Products Segment */}
              {results.products.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#37352F10] px-2 flex items-center justify-between">
                    Products
                    <Package size={12} />
                  </h4>
                  <div className="space-y-1">
                    {results.products.map(product => (
                      <button 
                        key={product.id}
                        onClick={() => { router.push(`/admin/products/${product.id}`); onClose(); }}
                        className="w-full flex items-center justify-between p-3 hover:bg-white border border-transparent hover:border-[#EDECE9] transition-all group rounded-none text-left"
                      >
                        <span className="text-[13px] font-bold text-[#37352F]">{product.name}</span>
                        <span className="text-[11px] text-[#37352F40] font-bold">{product.price}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Orders Segment */}
              {results.orders.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#37352F10] px-2 flex items-center justify-between">
                    Orders
                    <ShoppingBag size={12} />
                  </h4>
                  <div className="space-y-1">
                    {results.orders.map(order => (
                      <button 
                        key={order.id}
                        onClick={() => { router.push(`/admin/orders/${order.id}`); onClose(); }}
                        className="w-full flex items-center justify-between p-3 hover:bg-white border border-transparent hover:border-[#EDECE9] transition-all group rounded-none text-left"
                      >
                        <div className="flex flex-col">
                           <span className="text-[13px] font-bold text-[#37352F]">{order.id}</span>
                           <span className="text-[10px] text-[#37352FA6] font-medium uppercase tracking-wider">{order.customer}</span>
                        </div>
                        <span className="text-[11px] text-[#37352F40] font-bold">{order.total}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Customers Segment */}
              {results.customers.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#37352F10] px-2 flex items-center justify-between">
                    Customers
                    <Users size={12} />
                  </h4>
                  <div className="space-y-1">
                    {results.customers.map(customer => (
                      <button 
                        key={customer.id}
                        onClick={() => { router.push(`/admin/customers/${customer.id}`); onClose(); }}
                        className="w-full flex items-center justify-between p-3 hover:bg-white border border-transparent hover:border-[#EDECE9] transition-all group rounded-none text-left"
                      >
                        <div className="flex flex-col">
                           <span className="text-[13px] font-bold text-[#37352F]">{customer.name}</span>
                           <span className="text-[10px] text-[#37352FA6] font-medium tracking-tight">{customer.email}</span>
                        </div>
                        <ArrowRight size={14} className="text-[#37352F20] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {results.products.length === 0 && results.orders.length === 0 && results.customers.length === 0 && (
                <div className="py-20 text-center space-y-4">
                   <div className="flex justify-center flex-col items-center gap-3">
                      <Command size={32} className="text-[#37352F10] rotate-45" />
                      <p className="text-[11px] font-bold text-[#37352F40] uppercase tracking-[0.3em]">No direct intelligence found</p>
                   </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-10 text-center space-y-4 opacity-50">
               <div className="flex justify-center flex-col items-center gap-2">
                  <Search size={24} className="text-[#37352F20]" />
                  <p className="text-[10px] font-bold text-[#37352F40] uppercase tracking-[0.4em]">Start typing to explore Xiroo Core</p>
               </div>
            </div>
          )}
        </div>

        {/* Palette Footer */}
        <div className="h-12 bg-white border-t border-[#EDECE9] flex items-center justify-between px-6">
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 grayscale opacity-50">
                 <Package size={12} />
                 <span className="text-[9px] font-bold text-[#37352F] uppercase tracking-widest">Products</span>
              </div>
           </div>
           <div className="flex items-center gap-1.5 opacity-30">
              <Command size={10} />
              <span className="text-[9px] font-bold text-[#37352FA6] uppercase tracking-widest leading-none">Global Index</span>
           </div>
        </div>
      </div>
    </div>
  );
}
