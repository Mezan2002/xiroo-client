import { Package } from "lucide-react";

export default function TopProducts({ products = [] }) {
  if (products.length === 0) {
    return (
      <div className="bg-white border border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 md:p-8">
        <p className="text-[10px] font-bold text-zinc-900 uppercase tracking-[0.15em] mb-6">
          Top Selling Products
        </p>
        <p className="text-[11px] text-zinc-400">No sales data yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <p className="text-[10px] font-bold text-zinc-900 uppercase tracking-[0.15em]">
          Top Selling Products
        </p>
        <Package size={14} className="text-zinc-300" />
      </div>
      <div className="space-y-4">
        {products.map((p, i) => (
          <div
            key={p._id || i}
            className="flex items-center justify-between py-3 border-b border-zinc-50 last:border-0"
          >
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-zinc-300 w-4">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="text-[12px] font-semibold text-zinc-800 truncate max-w-[180px]">
                  {p.title || "Untitled"}
                </p>
                <p className="text-[9px] text-zinc-400 mt-0.5">{p.sku}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[12px] font-bold text-zinc-700">{p.totalSold} sold</p>
              <p className="text-[9px] text-emerald-600 font-medium">৳{p.revenue?.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
