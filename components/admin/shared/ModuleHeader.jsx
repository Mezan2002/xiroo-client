import { Button } from "@/components/ui/Button";
import { Globe } from "lucide-react";
import Link from "next/link";
import Breadcrumb from "./Breadcrumb";

export default function ModuleHeader({
  title,
  breadcrumbs = [],
  label,
  labelHref = "/admin",
  primaryAction,
  actions,
  tabs = [],
  icon: Icon = Globe,
}) {
  const breadcrumbItems =
    breadcrumbs.length > 0
      ? breadcrumbs
      : [
          { label: "Admin", href: "/admin" },
          { label: label || "Catalog", href: labelHref, active: !title },
        ];

  return (
    <div className="mb-8 md:mb-14 font-montserrat">
      {/* Refined Navigation Bar */}
      <div className="flex flex-col gap-8">
        {/* Top Tier: Context & Breadcrumbs */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <Link
              href="/admin"
              className="w-7 h-7 md:w-8 md:h-8 bg-zinc-50 flex items-center justify-center border border-zinc-100 hover:bg-zinc-100 transition-colors shrink-0"
            >
              <Icon size={12} className="md:size-[14px] text-zinc-400" />
            </Link>
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        {/* Middle Tier: Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 md:gap-6">
          <h1 className="text-2xl md:text-3xl font-light tracking-tight text-black truncate">
            {title}
          </h1>

          <div className="flex items-center gap-3 md:gap-4">
            {actions}
            {primaryAction && (
              <Button
                size="sm"
                onClick={primaryAction.onClick}
                className="h-10 md:h-12 px-6 md:px-10 bg-black hover:bg-zinc-800 text-white text-[10px] md:text-[11px] font-semibold rounded-none transition-all uppercase tracking-[0.2em] md:tracking-[0.3em] flex-1 sm:flex-none"
              >
                {primaryAction.label || "Add New"}
              </Button>
            )}
          </div>
        </div>

        {/* Bottom Tier: Segmented Navigation */}
        {tabs && tabs.length > 0 && (
          <div className="flex items-center p-1 bg-zinc-50 border border-zinc-100 w-full md:w-fit rounded-none overflow-x-auto custom-scrollbar whitespace-nowrap">
            {tabs.map((tab, idx) => (
              <button
                key={tab}
                className={`px-4 md:px-6 py-2 text-[11px] md:text-[12px] font-bold transition-all rounded-none ${
                  idx === 0
                    ? "bg-white text-black border border-zinc-200"
                    : "text-zinc-400 hover:text-black hover:bg-white/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
