import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({ label, value, icon: Icon, trend, trendLabel, accent, count }) {
  const isPositive = trend > 0;
  const isNegative = trend < 0;

  return (
    <div className="group relative p-4 sm:p-6 md:p-8 bg-white border border-zinc-100 hover:border-zinc-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all cursor-default">
      <div className="flex justify-between items-start mb-3 sm:mb-5">
        <div className={`w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 flex items-center justify-center ${accent ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-50 text-zinc-500 group-hover:bg-zinc-900 group-hover:text-white'} transition-all`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-[9px] sm:text-[10px] font-bold ${isPositive ? 'text-emerald-600' : isNegative ? 'text-red-500' : 'text-zinc-400'}`}>
            {isPositive ? <TrendingUp size={11} /> : isNegative ? <TrendingDown size={11} /> : null}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="space-y-0.5 sm:space-y-1">
        <p className="text-[8px] sm:text-[9px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-[0.15em] sm:tracking-[0.2em]">
          {label}{count !== undefined && <span className="ml-1.5 text-black font-extrabold">({count})</span>}
        </p>
        <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900">
          {value}
        </h3>
        {trendLabel && (
          <p className="text-[9px] sm:text-[10px] text-zinc-400 font-medium">{trendLabel}</p>
        )}
      </div>
    </div>
  );
}
