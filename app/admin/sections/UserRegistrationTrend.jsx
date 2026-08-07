"use client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-zinc-100 shadow-xl px-4 py-3">
      <p className="text-[9px] text-zinc-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-[13px] font-bold text-zinc-900">
        {payload[0].value} user{payload[0].value !== 1 ? "s" : ""}
      </p>
    </div>
  );
};

export default function UserRegistrationTrend({ data = [] }) {
  const chartData = data.map((d) => ({
    date: d._id?.slice(5) || "",
    count: d.count || 0,
  }));

  const total = chartData.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="bg-white border border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] font-bold text-zinc-900 uppercase tracking-[0.15em]">
            User Registrations
          </p>
          <p className="text-[11px] text-zinc-400 mt-1">{total} new users in 30 days</p>
        </div>
      </div>
      <div className="h-[200px] md:h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: "#a1a1aa", fontSize: 9 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: "#a1a1aa", fontSize: 9 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#userGrad)"
              dot={false}
              activeDot={{ r: 4, fill: "#6366f1", stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
