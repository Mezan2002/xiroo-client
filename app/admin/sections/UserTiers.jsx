import { Award } from "lucide-react";

const TIER_STYLES = {
  bronze: { color: "text-orange-600", bg: "bg-orange-50" },
  silver: { color: "text-zinc-500", bg: "bg-zinc-50" },
  gold: { color: "text-yellow-600", bg: "bg-yellow-50" },
  platinum: { color: "text-cyan-600", bg: "bg-cyan-50" },
  diamond: { color: "text-purple-600", bg: "bg-purple-50" },
};

export default function UserTiers({ tiers = [] }) {
  const allTiers = ["bronze", "silver", "gold", "platinum", "diamond"];
  const tierData = allTiers.map((t) => {
    const found = tiers.find((x) => x._id === t);
    return { tier: t, count: found?.count || 0, ...(TIER_STYLES[t] || TIER_STYLES.bronze) };
  });

  return (
    <div className="bg-white border border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <p className="text-[10px] font-bold text-zinc-900 uppercase tracking-[0.15em]">
          User Loyalty Tiers
        </p>
        <Award size={14} className="text-zinc-300" />
      </div>
      <div className="space-y-3">
        {tierData.map((t) => (
          <div key={t.tier} className="flex items-center justify-between py-2.5 border-b border-zinc-50 last:border-0">
            <div className="flex items-center gap-2.5">
              <div className={`w-7 h-7 ${t.bg} flex items-center justify-center`}>
                <Award size={12} className={t.color} />
              </div>
              <span className="text-[11px] text-zinc-600 capitalize font-medium">{t.tier}</span>
            </div>
            <span className="text-[12px] font-bold text-zinc-800">{t.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
