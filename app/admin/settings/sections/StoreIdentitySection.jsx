"use client";
import { Store, Mail, Phone, MessageCircle } from "lucide-react";

export default function StoreIdentitySection({ identity, setIdentity, contact, setContact, social, setSocial }) {
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
    </div>
  );
}
