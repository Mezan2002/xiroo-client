"use client";

export default function SectionHeader({
  subtitle,
  title,
  align = "center",
  dark = false,
  className = "",
}) {
  const alignClasses =
    align === "center"
      ? "flex flex-col items-center text-center"
      : "flex flex-col items-start text-left";

  return (
    <div className={`${alignClasses} ${className}`}>
      {subtitle && (
        <p
          className={`text-sm font-semibold uppercase tracking-widest mb-1.5 ${
            dark ? "text-white/40" : "text-gray-500"
          }`}
        >
          {subtitle}
        </p>
      )}
      <h2
        className={`text-3xl md:text-4xl font-mono tracking-[0.12em] font-medium uppercase ${
          dark ? "text-white" : "text-gray-900"
        }`}
      >
        {title}
      </h2>
    </div>
  );
}
