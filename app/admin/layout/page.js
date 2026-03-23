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
    { id: "hero", title: "Hero Section", type: "hero", enabled: true },
    { id: "categories", title: "Featured Categories", type: "grid", enabled: true },
    { id: "featured", title: "Featured Product", type: "highlight", enabled: true },
    { id: "new", title: "New Arrivals", type: "carousel", enabled: true },
    { id: "promo", title: "Promo Banner", type: "banner", enabled: false },
  ]);

  return (
    <div className="space-y-12 pb-24">
      <ModuleHeader 
        label="Visual Architecture" 
        title="Store Layout" 
        primaryAction={{
          label: "Publish Changes",
          icon: Upload,
          onClick: () => console.log("Publish Changes")
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Homepage Sections */}
        <div className="space-y-10">
          <div className="flex items-center gap-4 border-b-2 border-black pb-3 w-fit">
            <Layers size={18} />
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black pt-1">
              Home Page Modules
            </h3>
          </div>

          <div className="space-y-4">
            {sections.map((section) => (
              <div key={section.id} className="p-6 bg-white border border-gray-100 flex items-center justify-between group hover:border-black transition-colors">
                <div className="flex items-center gap-6">
                  <GripVertical size={16} className="text-gray-300 cursor-grab" />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold uppercase tracking-tight">{section.title}</span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{section.type} module</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="ghost" className="p-2 text-gray-400 hover:text-black">
                    {section.enabled ? <Eye size={16} /> : <EyeOff size={16} />}
                  </Button>
                  <Button variant="outline" className="text-[9px] font-bold uppercase tracking-widest h-8 px-4">Edit</Button>
                </div>
              </div>
            ))}
            <Button variant="dashed" className="w-full h-16 border-2 border-dashed border-gray-100 text-gray-400 hover:border-black hover:text-black transition-all gap-3 uppercase text-[10px] font-bold tracking-widest">
              <Plus size={16} /> Add New Section
            </Button>
          </div>
        </div>

        {/* Custom Pages */}
        <div className="space-y-10">
          <div className="flex items-center gap-4 border-b-2 border-black pb-3 w-fit">
            <Files size={18} />
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black pt-1">
              Custom Pages
            </h3>
          </div>

          <div className="space-y-4">
            {["About Us", "Privacy Policy", "Terms & Conditions", "Sustainability"].map((page) => (
              <div key={page} className="p-6 bg-white border border-gray-100 flex items-center justify-between group hover:border-black transition-colors">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold uppercase tracking-tight">{page}</span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">xiroo.shop/{page.toLowerCase().replace(/ /g, "-")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" className="p-2 text-gray-400 hover:text-black">
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" className="p-2 text-gray-400 hover:text-red-500">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full h-12 text-[10px] font-bold tracking-widest uppercase">
              Create Page
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
