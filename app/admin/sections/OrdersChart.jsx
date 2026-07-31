"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const STATUS_COLORS = {
  pending: "#eab308",
  processing: "#3b82f6",
  shipped: "#8b5cf6",
  delivered: "#10b981",
  cancelled: "#ef4444",
  failed: "#6b7280",
  returned: "#f97316",
  "on-hold": "#f59e0b",
  refused: "#dc2626",
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-white border border-zinc-100 shadow-xl px-4 py-3">
      <p className="text-[9px] text-zinc-400 uppercase tracking-widest mb-1">{d.name}</p>
      <p className="text-[13px] font-bold text-zinc-900">
        {d.value} orders
      </p>
      <p className="text-[10px] text-zinc-400">৳{d.payload.revenue?.toLocaleString()}</p>
    </div>
  );
};

export default function OrdersChart({ data = [] }) {
  const chartData = data.map((d) => ({
    name: d._id || "Unknown",
    value: d.count || 0,
    revenue: d.revenue || 0,
  }));

  return (
    <div className="bg-white border border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] font-bold text-zinc-900 uppercase tracking-[0.15em]">
            Order Status
          </p>
          <p className="text-[11px] text-zinc-400 mt-1">All time distribution</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="w-[130px] h-[130px] flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={36}
                outerRadius={58}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={STATUS_COLORS[entry.name] || "#d4d4d8"}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2.5">
          {chartData.map((d) => (
            <div key={d.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: STATUS_COLORS[d.name] || "#d4d4d8" }}
                />
                <span className="text-[11px] text-zinc-500 capitalize">{d.name}</span>
              </div>
              <span className="text-[12px] font-bold text-zinc-700">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
