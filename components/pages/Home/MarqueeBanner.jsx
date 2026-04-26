"use client";

/* ─────────────────────────────────────────────
   Row A — scrolls left
   Row B — scrolls right (counter-direction)
───────────────────────────────────────────── */
const ROW_A = [
  { label: "Live Your Dream", accent: true },
  { label: "Xiroo Shop", accent: false },
  { label: "Minimal Design", accent: false },
  { label: "Limited Edition", accent: true },
  { label: "Free Delivery", accent: false },
  { label: "Handcrafted Apparel", accent: false },
];

const Sep = () => (
  <span
    aria-hidden="true"
    className="mx-1 text-[7px]"
    style={{ color: "rgba(255,255,255,0.4)" }}
  >
    ✦
  </span>
);

/** One seamless scrolling track — items duplicated 3× */
const Track = ({ items, direction = "left", speed = 32 }) => (
  <div
    className="flex w-max"
    style={{
      animation: `xiroo-${direction} ${speed}s linear infinite`,
    }}
  >
    {[...Array(3)].map((_, gi) => (
      <div key={gi} className="flex items-center shrink-0">
        {items.map(({ label, accent }, i) => (
          <div key={i} className="flex items-center">
            <span
              className="whitespace-nowrap px-5 text-[10px] font-bold tracking-[0.38em] uppercase font-montserrat"
              style={{
                color: accent
                  ? "rgba(255,255,255,0.8)"
                  : "rgba(255,255,255,0.32)",
              }}
            >
              {label}
            </span>
            <Sep />
          </div>
        ))}
      </div>
    ))}
  </div>
);

const MarqueeBanner = () => (
  <div
    className="relative w-full overflow-hidden select-none"
    style={{
      background: "linear-gradient(180deg,#0a0a0a 0%,#141414 50%,#0a0a0a 100%)",
    }}
  >
    {/* ── Top accent gradient rule ── */}
    <div
      className="absolute top-0 inset-x-0 h-px pointer-events-none"
      style={{
        background:
          "linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.4) 30%,rgba(255,255,255,0.4) 70%,transparent 100%)",
      }}
    />

    {/* ── Bottom subtle rule ── */}
    <div
      className="absolute bottom-0 inset-x-0 h-px pointer-events-none"
      style={{
        background:
          "linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.15) 50%,transparent 100%)",
      }}
    />

    {/* ── Left edge fade ── */}
    <div
      className="absolute left-0 inset-y-0 w-32 z-10 pointer-events-none"
      style={{
        background: "linear-gradient(90deg,#0a0a0a 0%,transparent 100%)",
      }}
    />

    {/* ── Right edge fade ── */}
    <div
      className="absolute right-0 inset-y-0 w-32 z-10 pointer-events-none"
      style={{
        background: "linear-gradient(270deg,#0a0a0a 0%,transparent 100%)",
      }}
    />

    {/* ── Row A — left ── */}
    <div className="overflow-hidden py-[10px] border-b border-white/[0.04]">
      <Track items={ROW_A} direction="left" speed={30} />
    </div>

    <style jsx>{`
      @keyframes xiroo-left {
        from {
          transform: translateX(0);
        }
        to {
          transform: translateX(-33.333%);
        }
      }
      @keyframes xiroo-right {
        from {
          transform: translateX(-33.333%);
        }
        to {
          transform: translateX(0);
        }
      }
    `}</style>
  </div>
);

export default MarqueeBanner;
