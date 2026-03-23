import Link from "next/link";
import Breadcrumb from "./Breadcrumb";
import { Button } from "@/components/ui/Button";
import {
  Globe,
  MoreHorizontal,
  Plus,
  Search,
  Share2,
  Star,
} from "lucide-react";

export default function ModuleHeader({ 
  title, 
  breadcrumbs = [], 
  label, 
  labelHref = "/admin/products", 
  primaryAction, 
  actions,
  tabs = [], 
  icon: Icon = Globe 
}) {
  const breadcrumbItems = breadcrumbs.length > 0 ? breadcrumbs : [
    { label: "Admin", href: "/admin" },
    { label: label || "Catalog", href: labelHref, active: !title }
  ];

  return (
    <div className="mb-14 font-montserrat">
      {/* Refined Navigation Bar */}
      <div className="flex flex-col gap-8">
        {/* Top Tier: Context & Breadcrumbs */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="w-8 h-8 bg-zinc-50 flex items-center justify-center border border-zinc-100 hover:bg-zinc-100 transition-colors">
              <Icon size={14} className="text-zinc-400" />
            </Link>
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        {/* Middle Tier: Title & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h1 className="text-3xl font-light tracking-tight text-black">
            {title}
          </h1>

          <div className="flex items-center gap-4">
            {actions}
            {primaryAction && (
              <Button 
                size="sm" 
                onClick={primaryAction.onClick}
                className="h-12 px-10 bg-black hover:bg-zinc-800 text-white text-[11px] font-semibold rounded-none transition-all uppercase tracking-[0.3em]"
              >
                {primaryAction.label || "Add New"}
              </Button>
            )}
          </div>
        </div>

        {/* Bottom Tier: Segmented Navigation */}
        {tabs && tabs.length > 0 && (
          <div className="flex items-center p-1 bg-zinc-50 border border-zinc-100 w-fit rounded-none">
            {tabs.map((tab, idx) => (
              <button 
                key={tab}
                className={`px-6 py-2 text-[12px] font-bold transition-all rounded-none ${
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
