"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import { Save, Image as ImageIcon, RotateCcw, Palette } from "lucide-react";

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

  return (
    <div className="space-y-12 pb-24">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Basic Information */}
        <div className="space-y-10">
          <div className="space-y-8">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black pb-2 border-b-2 border-black w-fit">
              Basic Information
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Brand Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={branding.name}
                  onChange={handleChange}
                  className="w-full h-14 px-6 bg-white border border-gray-100 focus:border-black outline-none transition-all text-sm font-semibold tracking-tight"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Slogan</label>
                <input 
                  type="text" 
                  name="slogan"
                  value={branding.slogan}
                  onChange={handleChange}
                  className="w-full h-14 px-6 bg-white border border-gray-100 focus:border-black outline-none transition-all text-sm font-medium"
                />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black pb-2 border-b-2 border-black w-fit">
              Brand Assets
            </h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Logo (Dark)</label>
                <div className="aspect-square bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-gray-100 transition-colors group">
                  <ImageIcon size={24} className="text-gray-300 group-hover:text-black transition-colors" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Upload</span>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Favicon</label>
                <div className="aspect-square bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-gray-100 transition-colors group">
                  <ImageIcon size={24} className="text-gray-300 group-hover:text-black transition-colors" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Upload</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Customizer */}
        <div className="space-y-10">
          <div className="space-y-8">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black pb-2 border-b-2 border-black w-fit">
              Theme Engine
            </h3>
            
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Primary Color</label>
                  <div className="flex items-center gap-3 h-14 px-4 bg-white border border-gray-100">
                    <input 
                      type="color" 
                      name="primaryColor"
                      value={branding.primaryColor}
                      onChange={handleChange}
                      className="w-8 h-8 rounded-full overflow-hidden border-none"
                    />
                    <span className="text-[11px] font-mono font-bold uppercase">{branding.primaryColor}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Border Radius</label>
                  <select 
                    name="borderRadius"
                    value={branding.borderRadius}
                    onChange={handleChange}
                    className="w-full h-14 px-6 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[11px] font-bold uppercase tracking-widest"
                  >
                    <option value="0">Sharp (0px)</option>
                    <option value="4">Subtle (4px)</option>
                    <option value="8">Rounded (8px)</option>
                    <option value="20">Circular (20px)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Font Family</label>
                <select 
                  name="fontFamily"
                  value={branding.fontFamily}
                  onChange={handleChange}
                  className="w-full h-14 px-6 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[11px] font-bold uppercase tracking-widest"
                >
                  <option value="Inter">Inter (Sans Serif)</option>
                  <option value="Roboto">Roboto (Mechanical)</option>
                  <option value="Outfit">Outfit (Modern)</option>
                  <option value="Playfair">Playfair Display (Serif)</option>
                </select>
              </div>

              {/* Preview Box */}
              <div className="p-8 bg-gray-50 border border-gray-100 space-y-6">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-4">Live Style Preview</label>
                <div className="space-y-4">
                  <h4 
                    style={{ fontFamily: branding.fontFamily }}
                    className="text-xl font-bold uppercase tracking-tight"
                  >
                    Heading Example
                  </h4>
                  <p 
                    style={{ fontFamily: branding.fontFamily }}
                    className="text-sm text-gray-600 leading-none"
                  >
                    Sample body text for style verification.
                  </p>
                  <button 
                    style={{ 
                      backgroundColor: branding.primaryColor,
                      borderRadius: `${branding.borderRadius}px`,
                      fontFamily: branding.fontFamily
                    }}
                    className="px-8 py-4 text-white text-[10px] font-bold tracking-widest uppercase transition-opacity hover:opacity-90"
                  >
                    Sample Button
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
