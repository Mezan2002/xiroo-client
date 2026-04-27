import React from "react";

export const Label = ({ children }) => (
  <label className="text-[10px] font-bold text-zinc-900 uppercase block mb-3 font-montserrat tracking-[0.2em]">
    {children}
  </label>
);

export const SectionHeader = ({ label, title, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 pb-6 md:pb-8 mb-8 md:mb-12 font-montserrat gap-4">
    <div className="space-y-2">
      <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.3em]">
        {label}
      </h2>
      <p className="text-2xl font-light text-black tracking-tight">{title}</p>
    </div>
    {action}
  </div>
);
