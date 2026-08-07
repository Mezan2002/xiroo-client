"use client";
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-zinc-100 shadow-xl px-4 py-3">
      <p className="text-[9px] text-zinc-400 uppercase tracking-widest mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-[13px] font-bold text-zinc-900">
          {p.dataKey === "revenue" ? `৳${p.value?.toLocaleString()}` : `${p.value} orders`}
        </p>
      ))}
    </div>
  );
};

export default function RevenueVsOrders({ data = [] }) {
  const chartData = data.map((d) => ({
    date: d._id?.slice(5) || "",
    revenue: d.revenue || 0,
    orders: d.orders || 0,
  }));

  return (
    <div className="bg-white border border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] font-bold text-zinc-900 uppercase tracking-[0.15em]">
            Revenue vs Orders
          </p>
          <p className="text-[11px] text-zinc-400 mt-1">Last 30 days</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            <span className="text-[9px] text-zinc-400 font-medium">Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-zinc-900 rounded-full" />
            <span className="text-[9px] text-zinc-400 font-medium">Orders</span>
          </div>
        </div>
      </div>
      <div className="h-[200px] md:h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: "#a1a1aa", fontSize: 9 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              yAxisId="revenue"
              tick={{ fill: "#a1a1aa", fontSize: 9 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="orders"
              orientation="right"
              tick={{ fill: "#a1a1aa", fontSize: 9 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.02)" }} />
            <Bar
              yAxisId="revenue"
              dataKey="revenue"
              fill="#10b981"
              radius={[3, 3, 0, 0]}
              maxBarSize={20}
              opacity={0.8}
            />
            <Line
              yAxisId="orders"
              type="monotone"
              dataKey="orders"
              stroke="#18181b"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#18181b", stroke: "#fff", strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
