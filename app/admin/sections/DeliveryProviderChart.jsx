"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

const PROVIDER_COLORS = ["#10b981", "#6366f1", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="bg-white border border-zinc-100 shadow-xl px-4 py-3">
      <p className="text-[9px] text-zinc-400 uppercase tracking-widest mb-1">{d?._id}</p>
      <p className="text-[13px] font-bold text-zinc-900">
        {d?.count} order{d?.count !== 1 ? "s" : ""}
      </p>
      <p className="text-[11px] text-zinc-400 mt-0.5">
        ৳{d?.revenue?.toLocaleString()} revenue
      </p>
    </div>
  );
};

export default function DeliveryProviderChart({ data = [] }) {
  const chartData = data.map((d) => ({
    _id: d._id?.charAt(0).toUpperCase() + d._id?.slice(1) || "Unknown",
    count: d.count || 0,
    revenue: d.revenue || 0,
  }));

  return (
    <div className="bg-white border border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] font-bold text-zinc-900 uppercase tracking-[0.15em]">
            Delivery Providers
          </p>
          <p className="text-[11px] text-zinc-400 mt-1">Orders by courier service</p>
        </div>
      </div>
      <div className="h-[200px] md:h-[240px]">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[11px] text-zinc-400">
            No delivery data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
              <XAxis
                dataKey="_id"
                tick={{ fill: "#52525b", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: "#a1a1aa", fontSize: 9 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.02)" }} />
              <Bar dataKey="count" radius={[3, 3, 0, 0]} maxBarSize={40}>
                {chartData.map((_, index) => (
                  <Cell key={index} fill={PROVIDER_COLORS[index % PROVIDER_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
