"use client";

export default function ProductDetailsBlock({ block, onChange }) {
  const toggles = [
    { key: "showPrice", label: "Show Price" },
    { key: "showSpecs", label: "Show Specifications" },
    { key: "showVariants", label: "Show Variants" },
    { key: "showDescription", label: "Show Description" },
  ];

  return (
    <div className="space-y-3">
      <p className="text-[11px] text-zinc-400 font-medium">
        This block auto-pulls data from the linked product. Toggle what to display.
      </p>
      {toggles.map(({ key, label }) => (
        <label
          key={key}
          className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0 cursor-pointer"
        >
          <span className="text-[13px] font-medium text-zinc-700">{label}</span>
          <button
            type="button"
            onClick={() => onChange({ [key]: !block[key] })}
            className={`relative w-10 h-5 rounded-full transition-colors ${
              block[key] ? "bg-black" : "bg-zinc-200"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                block[key] ? "translate-x-5" : ""
              }`}
            />
          </button>
        </label>
      ))}
    </div>
  );
}
