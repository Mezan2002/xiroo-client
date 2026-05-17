"use client";
import { Plus, Search, Trash2, Loader2, Package } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useProducts } from "@/hooks/api/useProducts";
import Image from "next/image";

const SectionHeader = ({ label, title, action }) => (
  <div className="flex items-center justify-between border-b border-zinc-200 pb-8 mb-12">
    <div className="space-y-2">
      <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.3em]">{label}</h2>
      <p className="text-2xl font-light text-black tracking-tight">{title}</p>
    </div>
    {action}
  </div>
);

const ProductSearchDropdown = ({ onSelect, onClose }) => {
  const [query, setQuery] = useState("");
  const { useSearchProducts } = useProducts();
  const { data: response, isLoading } = useSearchProducts(query);
  const products = response?.data?.data || [];
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div ref={dropdownRef} className="absolute top-full left-0 w-full min-w-[400px] bg-white border border-black shadow-2xl z-[100] mt-2 animate-in slide-in-from-top-2 duration-200">
      <div className="p-4 border-b border-zinc-100 flex items-center gap-3">
        <Search size={14} className="text-zinc-400" />
        <input 
          autoFocus
          placeholder="Type product name or SKU..." 
          className="flex-1 bg-transparent outline-none text-[13px] font-medium"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {isLoading && <Loader2 size={14} className="animate-spin text-zinc-400" />}
      </div>
      <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
        {products.length > 0 ? (
          products.map((p) => (
            <button
              key={p._id}
              onClick={() => onSelect(p)}
              className="w-full p-4 flex items-center gap-4 hover:bg-zinc-50 transition-colors text-left group border-b border-zinc-50 last:border-0"
            >
              <div className="w-10 h-10 relative bg-zinc-100 shrink-0">
                {p.images?.[0] && <Image src={p.images[0]} alt="" fill className="object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-black truncate">{p.title}</p>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{p.sku}</p>
              </div>
              <div className="text-right">
                <p className="text-[13px] font-bold text-black">৳{p.salePrice || p.price}</p>
                <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">{p.inventory} in stock</p>
              </div>
            </button>
          ))
        ) : query ? (
          <div className="p-12 text-center text-zinc-400 italic text-[12px]">No products found for "{query}"</div>
        ) : (
          <div className="p-12 text-center text-zinc-400 italic text-[12px]">Start typing to search...</div>
        )}
      </div>
    </div>
  );
};

export default function ItemsSection({ items, addItem, removeItem, updateItem, subtotal, shippingFee, total, setOrder }) {
  const [activeSearchId, setActiveSearchId] = useState(null);

  const handleProductSelect = (id, product) => {
    updateItem(id, 'product', product._id);
    updateItem(id, 'name', product.title);
    updateItem(id, 'price', product.salePrice || product.price);
    setActiveSearchId(null);
  };

  return (
    <section>
      <SectionHeader
        label="Block 02" title="Order Registry"
        action={
          <button onClick={() => addItem()} className="text-[11px] font-bold text-zinc-400 hover:text-black uppercase tracking-widest flex items-center gap-2">
            <Plus size={14} /> Add Manual Item
          </button>
        }
      />
      {items.length === 0 ? (
        <div className="bg-zinc-50 border border-zinc-100 p-20 text-center group hover:border-black transition-colors cursor-pointer" onClick={() => addItem()}>
          <Package className="w-12 h-12 text-zinc-200 mx-auto mb-6 group-hover:text-black transition-colors" />
          <p className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest italic group-hover:text-black">Registry empty. Click here to add products.</p>
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
              {items.map((item) => (
                <tr key={item.id} className="group relative">
                  <td className="py-6 pr-6">
                    <div className="relative">
                      <div className="flex items-center gap-3">
                        <input 
                          readOnly
                          value={item.name}
                          placeholder="Search product..." 
                          onClick={() => setActiveSearchId(item.id)}
                          className="bg-transparent border-b border-zinc-100 focus:border-black outline-none w-full text-[14px] font-medium py-1 cursor-pointer" 
                        />
                        <button onClick={() => setActiveSearchId(item.id)} className="text-zinc-300 hover:text-black transition-colors">
                          <Search size={14} />
                        </button>
                      </div>
                      {activeSearchId === item.id && (
                        <ProductSearchDropdown 
                          onSelect={(p) => handleProductSelect(item.id, p)} 
                          onClose={() => setActiveSearchId(null)}
                        />
                      )}
                    </div>
                  </td>
                  <td className="py-6 px-6 text-center">
                    <input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)} className="w-16 bg-zinc-50 border-b border-zinc-200 text-center text-[13px] font-bold py-1 outline-none" />
                  </td>
                  <td className="py-6 px-6 text-right">
                    <input placeholder="0.00" value={item.price} onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)} className="w-24 bg-transparent border-b border-zinc-100 text-right text-[13px] font-medium py-1 outline-none" />
                  </td>
                  <td className="py-6 pl-6 text-right text-[14px] font-bold text-black">৳{(item.price * item.quantity).toLocaleString()}</td>
                  <td className="py-6 pl-6 text-right">
                    <button onClick={() => removeItem(item.id)} className="text-zinc-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="flex flex-col items-end gap-6 pt-12 border-t border-zinc-100">
            <div className="w-full max-w-[300px] space-y-4">
              <div className="flex justify-between items-center opacity-60">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Subtotal</span>
                <span className="text-[14px] font-bold text-black">৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Shipping Fee</span>
                <input 
                  type="number" 
                  value={shippingFee}
                  onChange={(e) => setOrder(prev => ({ ...prev, shippingFee: parseFloat(e.target.value) || 0 }))}
                  className="w-20 bg-zinc-50 border-b border-zinc-200 text-right text-[13px] font-bold py-1 outline-none"
                />
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-zinc-900">
                <span className="text-[12px] font-black text-black uppercase tracking-widest">Total Registry</span>
                <span className="text-2xl font-light text-black">৳{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
