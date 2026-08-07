"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

const RATING_COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#10b981"];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const rating = payload[0]?.payload?._id;
  const count = payload[0]?.value;
  return (
    <div className="bg-white border border-zinc-100 shadow-xl px-4 py-3">
      <p className="text-[9px] text-zinc-400 uppercase tracking-widest mb-1">
        {"★".repeat(rating)} ({rating} Star{rating !== 1 ? "s" : ""})
      </p>
      <p className="text-[13px] font-bold text-zinc-900">
        {count} review{count !== 1 ? "s" : ""}
      </p>
    </div>
  );
};

export default function RatingDistribution({ data = [] }) {
  const chartData = [1, 2, 3, 4, 5].map((rating) => {
    const found = data.find((d) => d._id === rating);
    return { _id: rating, count: found?.count || 0 };
  });

  const total = chartData.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="bg-white border border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] font-bold text-zinc-900 uppercase tracking-[0.15em]">
            Rating Distribution
          </p>
          <p className="text-[11px] text-zinc-400 mt-1">{total} total reviews</p>
        </div>
      </div>
      <div className="h-[200px] md:h-[240px]">
        {total === 0 ? (
          <div className="h-full flex items-center justify-center text-[11px] text-zinc-400">
            No reviews yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
              <XAxis
                dataKey="_id"
                tick={{ fill: "#a1a1aa", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}★`}
              />
              <YAxis
                tick={{ fill: "#a1a1aa", fontSize: 9 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.02)" }} />
              <Bar dataKey="count" radius={[3, 3, 0, 0]} maxBarSize={36}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={RATING_COLORS[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
