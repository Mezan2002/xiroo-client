import { ShieldCheck, ShieldAlert, ShieldX, Shield } from "lucide-react";

const FRAUD_CONFIG = {
  cleared: { icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", label: "Cleared" },
  flagged: { icon: ShieldAlert, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", label: "Flagged" },
  blocked: { icon: ShieldX, color: "text-red-600", bg: "bg-red-50", border: "border-red-100", label: "Blocked" },
};

export default function FraudOverview({ fraudStats = [] }) {
  const stats = fraudStats.map((s) => ({
    ...s,
    ...(FRAUD_CONFIG[s._id] || { icon: Shield, color: "text-zinc-500", bg: "bg-zinc-50", border: "border-zinc-100", label: s._id || "Unknown" }),
  }));

  return (
    <div className="bg-white border border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <p className="text-[10px] font-bold text-zinc-900 uppercase tracking-[0.15em]">
          Fraud Detection
        </p>
        <Shield size={14} className="text-zinc-300" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s._id} className={`${s.bg} border ${s.border} p-5 flex flex-col items-center justify-center gap-2`}>
            <s.icon size={20} className={s.color} />
            <p className="text-[20px] font-extrabold text-zinc-800">{s.count}</p>
            <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-semibold">{s.label}</p>
          </div>
        ))}
        {stats.length === 0 && (
          <p className="col-span-2 text-[11px] text-zinc-400 text-center py-4">No fraud data</p>
        )}
      </div>
    </div>
  );
}
