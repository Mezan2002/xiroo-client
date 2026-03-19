import Link from "next/link";
import { ArrowRight, Instagram, Facebook, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-black pt-20 pb-0 flex flex-col mt-24 overflow-hidden">
      <div className="max-w-[1600px] w-full mx-auto flex flex-col gap-16 lg:gap-24 text-white px-6 lg:px-12">
        
        {/* Top Section: Links & Newsletter (5-Column Grid) */}
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 lg:gap-8 xl:gap-12">
          
          {/* Newsletter Column */}
          <div className="flex flex-col col-span-2 md:col-span-1 lg:col-span-1 lg:pr-6">
            <h3 className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase mb-6 md:mb-8 text-white">
              Newsletter
            </h3>
            <p className="text-[11px] text-gray-400 mb-8 leading-[1.8] pr-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form className="relative flex items-center w-full border-b border-gray-600 hover:border-white transition-colors pb-3 group">
              <input 
                type="email" 
                placeholder="ENTER EMAIL" 
                className="w-full bg-transparent text-[10px] md:text-[11px] tracking-widest placeholder-gray-500 focus:outline-none uppercase text-white"
                required
              />
              <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" aria-label="Subscribe">
                <ArrowRight size={16} strokeWidth={1.5} />
              </button>
            </form>
          </div>

          {/* Shop Column */}
          <div className="flex flex-col gap-5 lg:pl-6">
            <h4 className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-white mb-4 md:mb-8">Shop</h4>
            <Link href="/collections/all" className="text-[11px] text-gray-400 hover:text-white transition-colors">All Products</Link>
            <Link href="/collections/smart-home" className="text-[11px] text-gray-400 hover:text-white transition-colors">Smart Home</Link>
            <Link href="/collections/lifestyle" className="text-[11px] text-gray-400 hover:text-white transition-colors">Lifestyle</Link>
            <Link href="/collections/kitchen" className="text-[11px] text-gray-400 hover:text-white transition-colors">Kitchen</Link>
          </div>

          {/* Support Column */}
          <div className="flex flex-col gap-5 lg:pl-4">
            <h4 className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-white mb-4 md:mb-8">Support</h4>
            <Link href="/faq" className="text-[11px] text-gray-400 hover:text-white transition-colors">FAQ</Link>
            <Link href="/shipping" className="text-[11px] text-gray-400 hover:text-white transition-colors">Shipping</Link>
            <Link href="/returns" className="text-[11px] text-gray-400 hover:text-white transition-colors">Returns</Link>
            <Link href="/contact" className="text-[11px] text-gray-400 hover:text-white transition-colors">Contact Us</Link>
          </div>

          {/* About Column */}
          <div className="flex flex-col gap-5 lg:pl-2">
            <h4 className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-white mb-4 md:mb-8">About</h4>
            <Link href="/our-story" className="text-[11px] text-gray-400 hover:text-white transition-colors">Our Story</Link>
            <Link href="/journal" className="text-[11px] text-gray-400 hover:text-white transition-colors">Journal</Link>
            <Link href="/sustainability" className="text-[11px] text-gray-400 hover:text-white transition-colors">Sustainability</Link>
          </div>

          {/* Social Column */}
          <div className="flex flex-col gap-5">
            <h4 className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-white mb-4 md:mb-8">Social</h4>
            <div className="flex items-center gap-5 pt-1">
              <a href="#" className="text-gray-400 hover:text-white hover:-translate-y-1 transform transition-all duration-300" aria-label="Instagram">
                <Instagram size={18} strokeWidth={1.5} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white hover:-translate-y-1 transform transition-all duration-300" aria-label="Facebook">
                <Facebook size={18} strokeWidth={1.5} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white hover:-translate-y-1 transform transition-all duration-300" aria-label="Twitter">
                <Twitter size={18} strokeWidth={1.5} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white hover:-translate-y-1 transform transition-all duration-300" aria-label="YouTube">
                <Youtube size={20} strokeWidth={1.5} />
              </a>
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
        <h1 className="w-full text-center text-[27vw] font-black tracking-tighter text-white/5 leading-[0.75] select-none pointer-events-auto hover:text-white/10 transition-colors duration-700 m-0 p-0">
          XIROO
        </h1>
      </div>
    </footer>
  );
}
