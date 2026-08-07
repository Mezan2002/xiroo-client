"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-zinc-100 shadow-xl px-4 py-3">
      <p className="text-[9px] text-zinc-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-[13px] font-bold text-zinc-900">
        ৳{payload[0].value?.toLocaleString()}
      </p>
      {payload[0]?.payload?.orders && (
        <p className="text-[11px] text-zinc-400 mt-0.5">
          {payload[0].payload.orders} orders
        </p>
      )}
    </div>
  );
};

export default function RevenueByCategory({ data = [] }) {
  const chartData = data.map((d) => ({
    category: d._id || "Unknown",
    revenue: d.revenue || 0,
    orders: d.orders || 0,
  }));

  return (
    <div className="bg-white border border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] font-bold text-zinc-900 uppercase tracking-[0.15em]">
            Revenue by Category
          </p>
          <p className="text-[11px] text-zinc-400 mt-1">Top categories by revenue</p>
        </div>
      </div>
      <div className="h-[200px] md:h-[240px]">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[11px] text-zinc-400">
            No category data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 5, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: "#a1a1aa", fontSize: 9 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="category"
                tick={{ fill: "#52525b", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                width={90}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.02)" }} />
              <Bar
                dataKey="revenue"
                fill="#10b981"
                radius={[0, 3, 3, 0]}
                maxBarSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
