"use client";
import { Plus, Search, Trash2 } from "lucide-react";

const SectionHeader = ({ label, title, action }) => (
  <div className="flex items-center justify-between border-b border-zinc-200 pb-8 mb-12">
    <div className="space-y-2">
      <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.3em]">{label}</h2>
      <p className="text-2xl font-light text-black tracking-tight">{title}</p>
    </div>
    {action}
  </div>
);

export default function ItemsSection({ items, addItem, removeItem, updateItem, subtotal }) {
  return (
    <section>
      <SectionHeader
        label="Block 02" title="Order Registry"
        action={
          <button onClick={addItem} className="text-[11px] font-bold text-zinc-400 hover:text-black uppercase tracking-widest flex items-center gap-2">
            <Plus size={14} /> Add Product
          </button>
        }
      />
      {items.length === 0 ? (
        <div className="bg-zinc-50 border border-zinc-100 p-20 text-center">
          <p className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest italic opacity-60">Registry empty. Add products to populate.</p>
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
                <tr key={item.id} className="group">
                  <td className="py-6 pr-6">
                    <div className="relative group">
                      <input placeholder="Search product..." className="bg-transparent border-b border-zinc-100 focus:border-black outline-none w-full text-[14px] font-medium py-1" />
                      <Search className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-200" size={12} />
                    </div>
                  </td>
                  <td className="py-6 px-6 text-center">
                    <input type="number" value={item.qty} onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value))} className="w-16 bg-zinc-50 border-b border-zinc-200 text-center text-[13px] font-bold py-1 outline-none" />
                  </td>
                  <td className="py-6 px-6 text-right">
                    <input placeholder="0.00" value={item.price} onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value))} className="w-24 bg-transparent border-b border-zinc-100 text-right text-[13px] font-medium py-1 outline-none" />
                  </td>
                  <td className="py-6 pl-6 text-right text-[14px] font-bold text-black">৳{(item.price * item.qty).toLocaleString()}</td>
                  <td className="py-6 pl-6 text-right">
                    <button onClick={() => removeItem(item.id)} className="text-zinc-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end pt-8 border-t border-zinc-100">
            <div className="w-full max-w-[200px] flex justify-between items-center">
              <span className="text-[11px] font-bold text-zinc-200 uppercase tracking-widest">Registry Subtotal</span>
              <span className="text-xl font-light text-black">৳{subtotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
