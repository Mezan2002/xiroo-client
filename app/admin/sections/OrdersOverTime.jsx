"use client";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-zinc-100 shadow-xl px-4 py-3">
      <p className="text-[9px] text-zinc-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-[13px] font-bold text-zinc-900">
        {payload[0].value} orders
      </p>
    </div>
  );
};

function generateAllDates(days = 30) {
  const dates = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    dates.push(`${d.getFullYear()}-${mm}-${dd}`);
  }
  return dates;
}

export default function OrdersOverTime({ data = [] }) {
  const chartData = useMemo(() => {
    const allDates = generateAllDates(30);
    const dataMap = new Map(data.map((d) => [d._id, d.orders || 0]));
    return allDates.map((date) => ({
      date: date.slice(5),
      orders: dataMap.get(date) || 0,
    }));
  }, [data]);

  return (
    <div className="bg-white border border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] font-bold text-zinc-900 uppercase tracking-[0.15em]">
            Orders Over Time
          </p>
          <p className="text-[11px] text-zinc-400 mt-1">Last 30 days</p>
        </div>
      </div>
      <div className="h-[250px] md:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 20 }}>
            <XAxis
              dataKey="date"
              tick={{ fill: "#a1a1aa", fontSize: 8 }}
              tickLine={false}
              axisLine={false}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={50}
            />
            <YAxis
              tick={{ fill: "#a1a1aa", fontSize: 9 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.02)" }} />
            <Bar
              dataKey="orders"
              fill="#10b981"
              radius={[3, 3, 0, 0]}
              maxBarSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
