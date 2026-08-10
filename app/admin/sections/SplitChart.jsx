"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b"];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-white border border-zinc-100 shadow-xl px-4 py-3">
      <p className="text-[9px] text-zinc-400 uppercase tracking-widest mb-1">{d.name}</p>
      <p className="text-[13px] font-bold text-zinc-900">{d.value} orders</p>
    </div>
  );
};

export default function SplitChart({ title, subtitle, data = [] }) {
  const chartData = data.map((d) => ({
    name: d._id || "Unknown",
    value: d.count || 0,
  }));

  return (
    <div className="bg-white border border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 md:p-8">
      <div className="mb-6">
        <p className="text-[10px] font-bold text-zinc-900 uppercase tracking-[0.15em]">{title}</p>
        <p className="text-[11px] text-zinc-400 mt-1">{subtitle}</p>
      </div>
      {chartData.length > 0 ? (
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-[100px] h-[100px] flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={26}
                  outerRadius={42}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-2.5 w-full">
            {chartData.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-[11px] text-zinc-500 capitalize truncate">{d.name}</span>
                </div>
                <span className="text-[12px] font-bold text-zinc-700 flex-shrink-0">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-[11px] text-zinc-400">No data</p>
      )}
    </div>
  );
}
