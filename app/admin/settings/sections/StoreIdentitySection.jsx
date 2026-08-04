"use client";
import { Store, Mail, Phone, MessageCircle, Image as ImageIcon, Trash2 } from "lucide-react";
import { ImageUploader } from "@/components/shared/ImageUploader";
import Image from "next/image";

export default function StoreIdentitySection({ identity, setIdentity, contact, setContact, social, setSocial }) {
  const handleModalImageUpload = (url) => {
    setIdentity({ ...identity, initialModalImage: url });
  };

  const handleRemoveModalImage = () => {
    setIdentity({ ...identity, initialModalImage: "" });
  };
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Store Identity */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
          <Store size={16} className="text-zinc-300" />
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">Store Identity</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Store Name</label>
            <input
              type="text"
              value={identity.name || ""}
              onChange={(e) => setIdentity({ ...identity, name: e.target.value })}
              className="w-full h-12 px-4 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[13px] font-bold rounded-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Tagline</label>
            <input
              type="text"
              value={identity.tagline || ""}
              onChange={(e) => setIdentity({ ...identity, tagline: e.target.value })}
              className="w-full h-12 px-4 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[13px] font-bold rounded-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Domain</label>
            <input
              type="text"
              value={identity.domain || ""}
              onChange={(e) => setIdentity({ ...identity, domain: e.target.value })}
              className="w-full h-12 px-4 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[13px] font-bold rounded-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Logo URL</label>
            <input
              type="text"
              value={identity.logo || ""}
              onChange={(e) => setIdentity({ ...identity, logo: e.target.value })}
              placeholder="https://..."
              className="w-full h-12 px-4 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[13px] font-bold rounded-none placeholder:text-gray-300"
            />
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
          <Mail size={16} className="text-zinc-300" />
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">Contact Information</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Support Email</label>
            <input
              type="email"
              value={contact.supportEmail || ""}
              onChange={(e) => setContact({ ...contact, supportEmail: e.target.value })}
              className="w-full h-12 px-4 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[13px] font-bold rounded-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Info Email</label>
            <input
              type="email"
              value={contact.infoEmail || ""}
              onChange={(e) => setContact({ ...contact, infoEmail: e.target.value })}
              className="w-full h-12 px-4 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[13px] font-bold rounded-none placeholder:text-gray-300"
              placeholder="Optional"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">WhatsApp Number</label>
            <div className="relative">
              <input
                type="text"
                value={contact.whatsapp || ""}
                onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
                placeholder="8801XXXXXXXXX"
                className="w-full h-12 px-4 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[13px] font-bold rounded-none placeholder:text-gray-300 pl-10"
              />
              <MessageCircle size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-300" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Phone</label>
            <div className="relative">
              <input
                type="text"
                value={contact.phone || ""}
                onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                placeholder="+880..."
                className="w-full h-12 px-4 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[13px] font-bold rounded-none placeholder:text-gray-300 pl-10"
              />
              <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
          <span className="text-zinc-300 text-[14px] font-bold">@</span>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">Social Links</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { key: "facebook", label: "Facebook URL" },
            { key: "instagram", label: "Instagram URL" },
            { key: "tiktok", label: "TikTok URL" },
          ].map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{field.label}</label>
              <input
                type="url"
                value={social[field.key] || ""}
                onChange={(e) => setSocial({ ...social, [field.key]: e.target.value })}
                placeholder="https://..."
                className="w-full h-12 px-4 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[13px] font-bold rounded-none placeholder:text-gray-300"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Initial Modal Image */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
          <ImageIcon size={16} className="text-zinc-300" />
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">Initial Modal Image</h3>
        </div>

        <p className="text-[11px] text-gray-400">
          This image will be shown in the popup modal when visitors first arrive at your store.
        </p>

        <div className="bg-[#FDFDFB] border border-gray-100 p-6 space-y-5">
          {/* Preview */}
          <div
            className="relative w-full bg-gray-50 border border-gray-100 overflow-hidden group"
            style={{ aspectRatio: "2400 / 1792" }}
          >
            {identity.initialModalImage ? (
              <>
                <Image
                  src={identity.initialModalImage}
                  alt="Initial modal preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                <button
                  onClick={handleRemoveModalImage}
                  className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-all shadow-sm opacity-0 group-hover:opacity-100"
                  title="Remove image"
                >
                  <Trash2 size={14} />
                </button>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-300">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                  <ImageIcon size={20} className="text-gray-300" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-300">No Image Set</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-4">
            <div className="text-[9px] text-gray-300 space-y-0.5">
              <p className="font-medium">Required: 2400 x 1792px</p>
              <p>JPG, PNG, or WebP</p>
            </div>
            <div className="flex items-center gap-2">
              {identity.initialModalImage && (
                <button
                  onClick={handleRemoveModalImage}
                  className="h-9 px-4 border border-gray-200 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 hover:text-red-500 hover:border-red-200 transition-all"
                >
                  Remove
                </button>
              )}
              <ImageUploader
                onUploadSuccess={handleModalImageUpload}
                onUploadError={(err) => console.error("Upload failed:", err)}
              >
                <div className="h-9 px-6 bg-black hover:bg-black/80 flex items-center justify-center gap-2 cursor-pointer transition-all">
                  <ImageIcon size={12} className="text-white" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white">
                    {identity.initialModalImage ? "Replace" : "Upload"}
                  </span>
                </div>
              </ImageUploader>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
