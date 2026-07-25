"use client";

import Breadcrumb from "@/components/ui/Breadcrumb";
import { Mail, MapPin, Phone } from "lucide-react";
import { useStoreSettings } from "@/hooks/api/useStoreSettings";

export default function ContactPage() {
  const { settings: storeSettings } = useStoreSettings();
  const supportEmail = storeSettings?.contact?.supportEmail || "support@xirooshop.com";
  const phone = storeSettings?.contact?.phone || "+880 1XXX-XXXXXX";

  const CONTACT_INFO = [
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["Dhaka, Bangladesh"],
    },
    {
      icon: Mail,
      title: "Email Us",
      details: [supportEmail],
    },
    {
      icon: Phone,
      title: "Call Us",
      details: [phone],
    },
  ];

  return (
    <div className="w-full min-h-screen bg-white pt-32 pb-24 px-6 lg:px-12 max-w-[1600px] mx-auto font-montserrat">
      <div className="max-w-[800px] mx-auto mb-20">
        <div className="flex flex-col gap-6 items-center text-center">
          <Breadcrumb />
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-light tracking-tight text-black uppercase leading-tight">
            Contact Us
          </h1>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">
            <span className="w-8 h-px bg-gray-200" />
            Get In Touch
            <span className="w-8 h-px bg-gray-200" />
          </div>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-100 mb-20">
        {CONTACT_INFO.map((info, idx) => {
          const Icon = info.icon;
          return (
            <div
              key={idx}
              className="bg-white p-10 flex flex-col items-center text-center gap-4"
            >
              <Icon size={24} strokeWidth={1.5} className="text-gray-400" />
              <h3 className="text-xs font-bold tracking-widest uppercase text-black">
                {info.title}
              </h3>
              {info.details.map((detail, i) => (
                <p key={i} className="text-sm text-gray-500 font-light">
                  {detail}
                </p>
              ))}
            </div>
          );
        })}
      </div>

      <div className="max-w-[600px] mx-auto">
        <h2 className="text-xl font-medium tracking-wide text-black uppercase mb-8 text-center">
          Send Us a Message
        </h2>
        <form className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full px-4 py-3 border border-gray-200 text-sm text-black placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
                Email
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-200 text-sm text-black placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
              Subject
            </label>
            <input
              type="text"
              placeholder="How can we help?"
              className="w-full px-4 py-3 border border-gray-200 text-sm text-black placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
              Message
            </label>
            <textarea
              rows={5}
              placeholder="Your message..."
              className="w-full px-4 py-3 border border-gray-200 text-sm text-black placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full border border-black px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-black hover:bg-black hover:text-white transition-all mt-2"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
