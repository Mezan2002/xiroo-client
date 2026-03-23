"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import { Save, Image as ImageIcon, Palette, Type, Box } from "lucide-react";

const RADIUS_OPTIONS = [
  { value: "0", label: "Sharp (0px)" },
  { value: "4", label: "Subtle (4px)" },
  { value: "8", label: "Rounded (8px)" },
  { value: "20", label: "Circular (20px)" },
];

const FONT_OPTIONS = [
  { value: "Inter", label: "Inter (Sans Serif)" },
  { value: "Roboto", label: "Roboto (Mechanical)" },
  { value: "Outfit", label: "Outfit (Modern)" },
  { value: "Playfair Display", label: "Playfair Display (Serif)" },
];

export default function AdminBranding() {
  const [branding, setBranding] = useState({
    name: "XIROO",
    slogan: "Premium Quality Minimal Design",
    primaryColor: "#000000",
    secondaryColor: "#FFFFFF",
    borderRadius: "0",
    fontFamily: "Inter",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBranding(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setBranding(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-700">
      <ModuleHeader 
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Branding", active: true }
        ]}
        title="Branding" 
        icon={Palette}
        primaryAction={{
          label: "Save Changes",
          icon: Save,
          onClick: () => console.log("Save Changes")
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Column: Core Identity */}
        <div className="lg:col-span-7 space-y-16">
          {/* Basic Information */}
          <div className="space-y-10">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <Type size={16} className="text-zinc-300" />
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black">
                Basic Information
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Registry Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={branding.name}
                  onChange={handleChange}
                  className="w-full h-14 px-6 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[13px] font-bold uppercase tracking-widest"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Brand Narrative</label>
                <input 
                  type="text" 
                  name="slogan"
                  value={branding.slogan}
                  onChange={handleChange}
                  className="w-full h-14 px-6 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[13px] font-medium text-zinc-500"
                />
              </div>
            </div>
          </div>

          {/* Asset Management */}
          <div className="space-y-10">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <ImageIcon size={16} className="text-zinc-300" />
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black">
                Identity Assets
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Primary Logo</label>
                <div className="aspect-21/9 bg-[#FDFDFB] border border-gray-100 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-black transition-all group">
                  <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-bold text-lg">X</div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 group-hover:text-black">Update Asset</span>
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Merchant Symbol (Favicon)</label>
                <div className="aspect-square bg-[#FDFDFB] border border-gray-100 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-black transition-all group max-w-[140px]">
                  <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold text-sm">X</div>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300 group-hover:text-black text-center">Update Symbol</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Theme Engine */}
        <div className="lg:col-span-5">
          <div className="bg-[#FDFDFB] border border-gray-100 p-10 space-y-12 h-fit sticky top-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <Box size={16} className="text-zinc-400" />
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black">
                Theme Engine
              </h3>
            </div>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Signature Color</label>
                <div className="flex items-center gap-4 h-14 px-6 bg-white border border-gray-100">
                  <input 
                    type="color" 
                    name="primaryColor"
                    value={branding.primaryColor}
                    onChange={handleChange}
                    className="w-8 h-8 cursor-pointer border-none bg-transparent"
                  />
                  <span className="text-[12px] font-mono font-bold uppercase tracking-widest flex-1">{branding.primaryColor}</span>
                  <div className="w-4 h-4" style={{ backgroundColor: branding.primaryColor }} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Border Architecture</label>
                  <Select 
                    options={RADIUS_OPTIONS}
                    value={branding.borderRadius}
                    onChange={(val) => handleSelectChange("borderRadius", val)}
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Typography Registry</label>
                  <Select 
                    options={FONT_OPTIONS}
                    value={branding.fontFamily}
                    onChange={(val) => handleSelectChange("fontFamily", val)}
                  />
                </div>
              </div>

              {/* High-Fidelity Preview */}
              <div className="p-8 bg-white border border-gray-100 space-y-8 mt-12 overflow-hidden">
                <label className="text-[9px] font-bold text-zinc-300 uppercase tracking-[0.3em] block mb-4 italic underline decoration-gray-100 underline-offset-8">Live Style Verification</label>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h4 
                      style={{ fontFamily: branding.fontFamily }}
                      className="text-2xl font-bold uppercase tracking-tight text-black"
                    >
                      {branding.name}
                    </h4>
                    <p 
                      style={{ fontFamily: branding.fontFamily }}
                      className="text-[13px] text-zinc-400 italic"
                    >
                      {branding.slogan}
                    </p>
                  </div>

                  <hr className="border-gray-50" />

                  <div className="space-y-4">
                    <button 
                      style={{ 
                        backgroundColor: branding.primaryColor,
                        borderRadius: `${branding.borderRadius}px`,
                        fontFamily: branding.fontFamily
                      }}
                      className="w-full h-14 text-white text-[10px] font-bold tracking-[0.25em] uppercase shadow-lg shadow-black/5 active:scale-[0.98] transition-all"
                    >
                      Purchase Item
                    </button>
                    <button 
                      style={{ 
                        borderRadius: `${branding.borderRadius}px`,
                        fontFamily: branding.fontFamily
                      }}
                      className="w-full h-14 border border-zinc-200 text-black text-[10px] font-bold tracking-[0.25em] uppercase hover:bg-zinc-50 transition-all"
                    >
                      Add to Registry
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
