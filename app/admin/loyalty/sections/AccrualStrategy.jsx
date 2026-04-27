"use client";

export default function AccrualStrategy({ settings, setSettings }) {
  return (
    <section className="space-y-10">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-black" />
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black">Point Accrual Strategy</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Points Per 100 BDT Spent</label>
          <div className="relative group">
            <input
              type="number" value={settings.pointsPerHundred}
              onChange={(e) => setSettings({ ...settings, pointsPerHundred: Number(e.target.value) })}
              className="w-full h-14 px-6 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[14px] font-bold tracking-tight"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-300 uppercase tracking-widest">PTS / 100 ৳</div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Delivery Success Bonus</label>
          <div className="relative group">
            <input
              type="number" value={settings.pointsPerOrder}
              onChange={(e) => setSettings({ ...settings, pointsPerOrder: Number(e.target.value) })}
              className="w-full h-14 px-6 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[14px] font-bold tracking-tight"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-300 uppercase tracking-widest">PTS / Order</div>
          </div>
        </div>
      </div>
    </section>
  );
}
