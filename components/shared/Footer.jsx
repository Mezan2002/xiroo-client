import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Instagram, Facebook, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-black pt-20 pb-0 flex flex-col mt-24 overflow-hidden">
      <div className="max-w-[1600px] w-full mx-auto flex flex-col gap-16 lg:gap-24 text-white px-6 lg:px-12">
        
        {/* Top Section: Brand & Navigation */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 lg:gap-8 xl:gap-24">
          
          {/* Brand Identity Section (Wider) */}
          <div className="flex flex-col lg:col-span-2 space-y-10 lg:pr-20">
            <div className="space-y-6">
              <h3 className="text-[20px] md:text-[24px] font-bold tracking-[-0.04em] uppercase text-white leading-none">
                XIROO<span className="text-zinc-500 font-light ml-1">.</span>
              </h3>
              <p className="text-[11px] md:text-[12px] text-zinc-400 leading-[1.8] font-medium max-w-[400px]">
                Redefining the digital storefront through a fusion of high-performance engineering and professional-grade culinary mastery. Architectural artifacts for the modern home.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-500">Connect Protocol</h4>
              <div className="flex items-center gap-6">
                <a href="#" className="text-white hover:text-zinc-400 transition-all duration-300" aria-label="Instagram">
                  <Instagram size={18} strokeWidth={1.5} />
                </a>
                <a href="#" className="text-white hover:text-zinc-400 transition-all duration-300" aria-label="Facebook">
                  <Facebook size={18} strokeWidth={1.5} />
                </a>
                <a href="#" className="text-white hover:text-zinc-400 transition-all duration-300" aria-label="TikTok">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Links (Right) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:col-span-3 gap-12">
            {/* Shop Column */}
            <div className="flex flex-col gap-6">
              <h4 className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-white">Shop</h4>
              <div className="flex flex-col gap-4">
                <Link href="/collections/all" className="text-[11px] text-zinc-400 hover:text-white transition-colors">All Products</Link>
                <Link href="/collections/smart-home" className="text-[11px] text-zinc-400 hover:text-white transition-colors">Smart Home</Link>
                <Link href="/collections/lifestyle" className="text-[11px] text-zinc-400 hover:text-white transition-colors">Lifestyle</Link>
                <Link href="/collections/kitchen" className="text-[11px] text-zinc-400 hover:text-white transition-colors">Kitchen</Link>
              </div>
            </div>

            {/* Support Column */}
            <div className="flex flex-col gap-6">
              <h4 className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-white">Support</h4>
              <div className="flex flex-col gap-4">
                <Link href="/faq" className="text-[11px] text-zinc-400 hover:text-white transition-colors">FAQ</Link>
                <Link href="/shipping" className="text-[11px] text-zinc-400 hover:text-white transition-colors">Shipping</Link>
                <Link href="/refund" className="text-[11px] text-zinc-400 hover:text-white transition-colors">Refund & Returns</Link>
                <Link href="/contact" className="text-[11px] text-zinc-400 hover:text-white transition-colors">Contact Us</Link>
              </div>
            </div>

            {/* About Column */}
            <div className="flex flex-col gap-6">
              <h4 className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-white">About</h4>
              <div className="flex flex-col gap-4">
                <Link href="/about" className="text-[11px] text-zinc-400 hover:text-white transition-colors">Our Story</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: Legal & Region */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/10">
          <div className="text-[9px] md:text-[10px] text-gray-500 tracking-widest uppercase">
            © {currentYear} XIROO™. All Rights Reserved.
          </div>
          
          <div className="flex gap-6">
            <Link href="/privacy" className="text-[9px] md:text-[10px] text-gray-500 tracking-widest uppercase hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-[9px] md:text-[10px] text-gray-500 tracking-widest uppercase hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>

      </div>

      {/* Bottom Section: Huge Brand Text (Absolute Bottom, Edge-to-Edge Bleed) */}
      <div className="w-full flex justify-center overflow-hidden pt-6 -mb-[6vw] pointer-events-none mt-4 lg:mt-8">
        <h1 className="w-full text-center text-[27vw] font-semibold tracking-tighter text-white/5 leading-[0.75] select-none pointer-events-auto hover:text-white/10 transition-colors duration-700 m-0 p-0">
          XIROO
        </h1>
      </div>
    </footer>
  );
}
