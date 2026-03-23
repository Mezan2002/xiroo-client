"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import { 
  Layout, 
  Layers, 
  Plus, 
  GripVertical, 
  Eye, 
  EyeOff,
  Files,
  Edit,
  Trash2,
  Upload,
  Monitor
} from "lucide-react";

export default function AdminLayoutCustomizer() {
  const [sections, setSections] = useState([
    { id: "hero", title: "Hero Section", type: "Hero Section", enabled: true },
    { id: "categories", title: "Featured Categories", type: "Grid Registry", enabled: true },
    { id: "featured", title: "Featured Product", type: "Highlight Module", enabled: true },
    { id: "new", title: "New Arrivals", type: "Carousel Engine", enabled: true },
    { id: "promo", title: "Promo Banner", type: "Banner Logic", enabled: false },
  ]);

  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-700">
      <ModuleHeader 
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Store Layout", active: true }
        ]}
        title="Visual Architecture" 
        icon={Layers}
        primaryAction={{
          label: "Publish Changes",
          icon: Upload,
          onClick: () => console.log("Publish Changes")
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Homepage Sections */}
        <div className="lg:col-span-7 space-y-10">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <Layers size={16} className="text-zinc-300" />
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black">
              Homepage Module Registry
            </h3>
          </div>

          <div className="space-y-3">
            {sections.map((section) => (
              <div key={section.id} className="p-6 bg-[#FDFDFB] border border-gray-100 flex items-center justify-between group hover:border-black transition-all rounded-none ring-1 ring-black/0 hover:ring-black/5">
                <div className="flex items-center gap-6">
                  <GripVertical size={14} className="text-zinc-200 cursor-grab group-hover:text-zinc-400 transition-colors" />
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-black">{section.title}</span>
                    <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-[0.2em] leading-none">{section.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button className="p-2 text-zinc-300 hover:text-black transition-colors">
                    {section.enabled ? <Eye size={16} strokeWidth={1.5} /> : <EyeOff size={16} strokeWidth={1.5} />}
                  </button>
                  <Button variant="outline" className="text-[9px] font-bold uppercase tracking-[0.2em] h-10 px-6 rounded-none border-gray-100 hover:border-black transition-all">
                    Refine
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="dashed" className="w-full h-16 border-2 border-dashed border-gray-100 text-zinc-300 hover:border-black hover:text-black transition-all gap-3 uppercase text-[10px] font-bold tracking-[0.25em] bg-transparent rounded-none mt-6">
              <Plus size={16} /> Orchestrate New Module
            </Button>
          </div>
        </div>

        {/* Custom Pages */}
        <div className="lg:col-span-5 space-y-10">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <Files size={16} className="text-zinc-300" />
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black">
              Static Content Registry
            </h3>
          </div>

          <div className="bg-[#FDFDFB] border border-gray-100 p-8 space-y-4">
            {["About Us", "Privacy Policy", "Terms & Conditions", "Sustainability"].map((page) => (
              <div key={page} className="p-5 border border-gray-50 flex items-center justify-between group hover:border-zinc-200 transition-all bg-white mb-3 last:mb-0">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-black">{page}</span>
                  <span className="text-[9px] font-bold text-zinc-300 tracking-[0.15em] leading-none lowercase italic">xiroo.shop/{page.toLowerCase().replace(/ /g, "-")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2 text-zinc-200 hover:text-black transition-colors rounded-none">
                    <Edit size={14} strokeWidth={1.5} />
                  </button>
                  <button className="p-2 text-zinc-200 hover:text-red-500 transition-colors rounded-none">
                    <Trash2 size={14} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full h-12 text-[10px] font-bold tracking-[0.25em] uppercase rounded-none border-gray-100 hover:border-black transition-all mt-4">
              Draft Custom Page
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
