"use client";

import Breadcrumb from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API Protocol
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Your message has been synchronized with our support registry.");
    }, 1500);
  };

  return (
    <div className="w-full min-h-screen bg-white pt-32 pb-24 px-6 lg:px-12 max-w-[1600px] mx-auto font-montserrat">
      <div className="flex flex-col items-center mb-20">
        <Breadcrumb />
        <h1 className="text-4xl md:text-5xl lg:text-[56px] font-light tracking-tight text-black uppercase leading-tight mt-6">
          Contact Us
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 max-w-[1200px] mx-auto">
        {/* Left Side: Identity Details */}
        <div className="space-y-12">
          <div className="space-y-6">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black border-b border-zinc-100 pb-4">
              Get in Touch
            </h2>
            <p className="text-[14px] text-gray-500 leading-relaxed max-w-[400px]">
              Whether you have an architectural inquiry or need logistics support, 
              our dedicated team is ready to synchronize with you.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-zinc-50 flex items-center justify-center rounded-sm text-black">
                <MapPin size={18} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-black mb-1">Our Studio</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Gulshan 1, Dhaka, Bangladesh<br />
                  Central Business District
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-zinc-50 flex items-center justify-center rounded-sm text-black">
                <Mail size={18} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-black mb-1">Digital Identity</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  support@xirooshop.com<br />
                  press@xirooshop.com
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-zinc-50 flex items-center justify-center rounded-sm text-black">
                <Phone size={18} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-black mb-1">Voice Protocol</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  +880 1700 000 000<br />
                  Mon - Fri: 10AM - 6PM
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="bg-[#fcfcfc] p-8 md:p-12 border border-zinc-100 rounded-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400">First Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="IDENTITY"
                  className="w-full bg-transparent border-b border-zinc-200 py-3 outline-none focus:border-black transition-colors text-[13px] uppercase tracking-wider"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="EMAIL@DOMAIN.COM"
                  className="w-full bg-transparent border-b border-zinc-200 py-3 outline-none focus:border-black transition-colors text-[13px] uppercase tracking-wider"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Subject</label>
              <input 
                type="text" 
                required
                placeholder="NATURE OF INQUIRY"
                className="w-full bg-transparent border-b border-zinc-200 py-3 outline-none focus:border-black transition-colors text-[13px] uppercase tracking-wider"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Message</label>
              <textarea 
                rows="4" 
                required
                placeholder="HOW CAN WE ASSIST?"
                className="w-full bg-transparent border-b border-zinc-200 py-3 outline-none focus:border-black transition-colors text-[13px] uppercase tracking-wider resize-none"
              ></textarea>
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              className="w-full group"
              disabled={isSubmitting}
            >
              <span className="mr-2">{isSubmitting ? "SYNCHRONIZING..." : "SEND PROTOCOL"}</span>
              {!isSubmitting && <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
