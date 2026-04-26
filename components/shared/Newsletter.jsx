"use client";

export default function Newsletter() {
  return (
    <div className="relative w-full flex flex-col items-center justify-center text-center py-20  overflow-hidden bg-black">
      {/* ── Premium Grain/Noise Overlay & Glow ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mb-10 max-w-[600px] flex flex-col items-center">
        {/* Eyebrow label */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-4 h-px bg-white/40" />
          <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-white/60">
            Exclusive Access
          </span>
          <div className="w-4 h-px bg-white/40" />
        </div>

        {/* Main Headline */}
        <h2 className="text-[36px] md:text-[52px] font-black uppercase tracking-[-0.02em] text-white leading-[1] mb-5">
          Join The Inner Circle.
        </h2>

        {/* Subtitle */}
        <p className="text-[10px] md:text-[11px] font-medium text-white/40 tracking-[0.2em] uppercase leading-[1.8]">
          Sign up to receive early notifications on limited drops, new
          collections, and insider protocol.
        </p>
      </div>

      {/* Input Form - Sharp Minimalist Box */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="w-full max-w-[540px] flex border border-white/20 focus-within:border-white transition-colors duration-500"
      >
        <input
          type="email"
          placeholder="ENTER EMAIL ADDRESS"
          className="flex-1 bg-transparent px-6 py-5 text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white placeholder:text-white/20 outline-none"
          required
        />
        <button
          type="submit"
          className="bg-transparent border-l border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 px-8 lg:px-10 py-5 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.25em] whitespace-nowrap"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}
