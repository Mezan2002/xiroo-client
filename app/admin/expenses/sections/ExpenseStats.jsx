"use client";
import { DollarSign, TrendingUp, Package, Truck, CreditCard, Settings } from "lucide-react";

const CATEGORY_ICONS = {
  marketing: TrendingUp,
  packaging: Package,
  shipping: Truck,
  platform_fees: CreditCard,
  operations: Settings,
  other: DollarSign,
};

const CATEGORY_COLORS = {
  marketing: "bg-purple-50 text-purple-600",
  packaging: "bg-amber-50 text-amber-600",
  shipping: "bg-blue-50 text-blue-600",
  platform_fees: "bg-green-50 text-green-600",
  operations: "bg-zinc-100 text-zinc-600",
  other: "bg-gray-50 text-gray-600",
};

const formatCurrency = (value) => `৳${(value || 0).toLocaleString()}`;

const ExpenseStats = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-24 bg-zinc-50 animate-pulse border border-zinc-100" />
        ))}
      </div>
    );
  }

  const totalExpenses = stats?.totalExpenses || 0;
  const categoryBreakdown = stats?.categoryBreakdown || [];

  return (
    <section>
      <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.3em] mb-4">
        Expense Summary
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Expenses */}
        <div className="p-4 border border-zinc-100 bg-white">
          <div className="w-8 h-8 bg-zinc-50 flex items-center justify-center text-zinc-400 mb-2">
            <DollarSign size={16} strokeWidth={1.5} />
          </div>
          <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
            Total Expenses
          </p>
          <p className="text-xl font-black mt-1">{formatCurrency(totalExpenses)}</p>
        </div>

        {/* Category Cards */}
        {categoryBreakdown.map((cat) => {
          const Icon = CATEGORY_ICONS[cat._id] || DollarSign;
          const color = CATEGORY_COLORS[cat._id] || "bg-gray-50 text-gray-600";
          return (
            <div key={cat._id} className="p-4 border border-zinc-100 bg-white">
              <div className={`w-8 h-8 flex items-center justify-center mb-2 ${color}`}>
                <Icon size={16} strokeWidth={1.5} />
              </div>
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                {cat._id?.replace("_", " ") || "Other"}
              </p>
              <p className="text-xl font-black mt-1">{formatCurrency(cat.total)}</p>
              <p className="text-[9px] text-zinc-300 mt-1">{cat.count} entries</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ExpenseStats;
