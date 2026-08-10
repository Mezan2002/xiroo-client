"use client";
import { DollarSign, TrendingUp, TrendingDown, ShoppingBag, BarChart3 } from "lucide-react";
import StatCard from "./StatCard";

const formatCurrency = (value) => `৳${(value || 0).toLocaleString()}`;

const ProfitOverview = ({ profit }) => {
  if (!profit) return null;

  const {
    revenue = 0,
    cogs = 0,
    grossProfit = 0,
    grossMargin = 0,
    totalExpenses = 0,
    netProfit = 0,
    netMargin = 0,
    expenseByCategory = [],
    profitByProduct = [],
    profitByCategory = [],
  } = profit;

  return (
    <section className="space-y-8">
      {/* Profit Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Revenue"
          value={formatCurrency(revenue)}
          icon={DollarSign}
          trendLabel="last 30 days"
        />
        <StatCard
          label="COGS"
          value={formatCurrency(cogs)}
          icon={ShoppingBag}
          trendLabel="cost of goods"
        />
        <StatCard
          label="Gross Profit"
          value={formatCurrency(grossProfit)}
          icon={TrendingUp}
          trend={grossMargin}
          trendLabel={`${grossMargin}% margin`}
          accent
        />
        <StatCard
          label="Expenses"
          value={formatCurrency(totalExpenses)}
          icon={BarChart3}
          trendLabel={`${expenseByCategory.length} categories`}
        />
        <StatCard
          label="Net Profit"
          value={formatCurrency(netProfit)}
          icon={netProfit >= 0 ? TrendingUp : TrendingDown}
          trend={netMargin}
          trendLabel={`${netMargin}% margin`}
          accent
        />
        <StatCard
          label="Net Margin"
          value={`${netMargin}%`}
          icon={netMargin >= 0 ? TrendingUp : TrendingDown}
          trendLabel={netMargin >= 0 ? "profitable" : "loss"}
        />
      </div>

      {/* Top Products + Expense Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Profit by Product */}
        <div className="border border-zinc-100 bg-white p-6">
          <p className="text-[10px] font-bold text-zinc-900 uppercase tracking-[0.15em] mb-4">
            Top Profitable Products
          </p>
          <div className="space-y-3">
            {profitByProduct.length > 0 ? (
              profitByProduct.slice(0, 5).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-zinc-300 w-4">{idx + 1}</span>
                    <div>
                      <p className="text-[11px] font-bold">{item.title || "Unknown"}</p>
                      <p className="text-[9px] text-zinc-400">{item.quantity} sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold text-emerald-600">{formatCurrency(item.profit)}</p>
                    <p className="text-[9px] text-zinc-400">{formatCurrency(item.revenue)} rev</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[10px] text-zinc-300 text-center py-8">No profit data yet</p>
            )}
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="border border-zinc-100 bg-white p-6">
          <p className="text-[10px] font-bold text-zinc-900 uppercase tracking-[0.15em] mb-4">
            Expense Breakdown
          </p>
          <div className="space-y-3">
            {expenseByCategory.length > 0 ? (
              expenseByCategory.map((item, idx) => {
                const percentage = totalExpenses > 0 ? Math.round((item.total / totalExpenses) * 100) : 0;
                return (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        {item._id?.replace("_", " ") || "Other"}
                      </span>
                      <span className="text-[11px] font-bold">{formatCurrency(item.total)}</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-100">
                      <div
                        className="h-full bg-zinc-900"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-[10px] text-zinc-300 text-center py-8">No expenses recorded</p>
            )}
          </div>
        </div>
      </div>

      {/* Profit by Category */}
      {profitByCategory.length > 0 && (
        <div className="border border-zinc-100 bg-white p-6">
          <p className="text-[10px] font-bold text-zinc-900 uppercase tracking-[0.15em] mb-4">
            Profit by Category
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {profitByCategory.slice(0, 5).map((item, idx) => (
              <div key={idx} className="p-4 border border-zinc-100 bg-zinc-50 hover:bg-zinc-100 transition-colors">
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest truncate">
                  {item._id || "Uncategorized"}
                </p>
                <p className="text-lg font-black mt-1">{formatCurrency(item.profit)}</p>
                <p className="text-[9px] text-zinc-400 mt-1">
                  {item.revenue > 0 ? Math.round((item.profit / item.revenue) * 100) : 0}% margin
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ProfitOverview;
