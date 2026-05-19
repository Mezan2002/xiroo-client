import { Facebook, Instagram } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full bg-black pt-24 pb-0 flex flex-col overflow-hidden font-montserrat text-white">
      {/* Top subtle border */}
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />

      <div className="w-full flex flex-col gap-20 lg:gap-32 px-8 lg:px-16 z-10">
        {/* Top Content Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          {/* Brand Identity Section */}
          <div className="flex flex-col lg:col-span-4 space-y-10 lg:pr-12">
            <div className="space-y-6">
              <h3 className="text-3xl font-black tracking-tighter uppercase text-white leading-none">
                XIROO<span className="text-white/30 ml-1">.</span>
              </h3>
              <p className="text-[11px] text-white/50 leading-loose font-medium max-w-[320px]">
                Redefining modern streetwear through minimal silhouettes and
                premium heavyweight fabrics. Designed for the everyday
                visionary.
              </p>
            </div>
          </div>

          {/* Navigation Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:col-span-8 gap-12 lg:gap-16 lg:pl-16">
            {/* Shop Column */}
            <div className="flex flex-col gap-8">
              <h4 className="text-[10px] font-semibold tracking-widest uppercase text-white">
                Explore
              </h4>
              <div className="flex flex-col gap-5">
                <Link
                  href="/collections"
                  className="text-[11px] text-white/50 hover:text-white transition-colors"
                >
                  Collections
                </Link>
                <Link
                  href="/new-in"
                  className="text-[11px] text-white/50 hover:text-white transition-colors"
                >
                  New In
                </Link>
                <Link
                  href="/hot-sale"
                  className="text-[11px] text-white/50 hover:text-white transition-colors"
                >
                  Hot Sale
                </Link>
              </div>
            </div>

            {/* Support Column */}
            <div className="flex flex-col gap-8">
              <h4 className="text-[10px] font-semibold tracking-widest uppercase text-white">
                Client Care
              </h4>
              <div className="flex flex-col gap-5">
                <Link
                  href="/about"
                  className="text-[11px] text-white/50 hover:text-white transition-colors"
                >
                  Our Story
                </Link>
                <Link
                  href="/contact"
                  className="text-[11px] text-white/50 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
                <Link
                  href="/faq"
                  className="text-[11px] text-white/50 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </div>
            </div>

            {/* Account Column */}
            <div className="flex flex-col gap-8">
              <h4 className="text-[10px] font-semibold tracking-widest uppercase text-white">
                My Account
              </h4>
              <div className="flex flex-col gap-5">
                <Link
                  href="/account/orders"
                  className="text-[11px] text-white/50 hover:text-white transition-colors"
                >
                  Track Orders
                </Link>
                <Link
                  href="/account/profile"
                  className="text-[11px] text-white/50 hover:text-white transition-colors"
                >
                  Profile Settings
                </Link>
                <Link
                  href="/login"
                  className="text-[11px] text-white/50 hover:text-white transition-colors"
                >
                  Login / Register
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Legal & Social */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-8 pt-8 border-t border-white/10 pb-8 lg:pb-12">
          <div className="text-[9px] text-white/40 tracking-[0.2em] uppercase text-center md:text-left">
            © {currentYear} XIROO. ALL RIGHTS RESERVED.
          </div>

          <div className="flex items-center gap-8">
            <Link
              href="/shipping"
              className="text-[9px] text-white/40 tracking-[0.2em] uppercase hover:text-white transition-colors"
            >
              Shipping
            </Link>
            <Link
              href="/return-policy"
              className="text-[9px] text-white/40 tracking-[0.2em] uppercase hover:text-white transition-colors"
            >
              Returns
            </Link>
            <Link
              href="/privacy"
              className="text-[9px] text-white/40 tracking-[0.2em] uppercase hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-[9px] text-white/40 tracking-[0.2em] uppercase hover:text-white transition-colors"
            >
              Terms & Conditions
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="https://www.facebook.com/xirooshop/"
              target="_blank"
              className="text-white/40 hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={16} strokeWidth={1.5} />
            </Link>
            <Link
              href="https://www.instagram.com/xirooshop/"
              target="_blank"
              className="text-white/40 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={16} strokeWidth={1.5} />
            </Link>

            <Link
              href="https://www.tiktok.com/@xirooshop"
              target="_blank"
              className="text-white/40 hover:text-white transition-colors"
              aria-label="TikTok"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-[16px] h-[16px]"
              >
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Massive Brand Watermark at the absolute bottom */}
      <div className="w-full flex justify-center overflow-hidden pt-6 -mb-[5vw] pointer-events-none mt-auto">
        <h1 className="w-full text-center text-[29vw] font-semibold tracking-tighter text-white/5 leading-[0.75] select-none pointer-events-auto hover:text-white/10 transition-colors duration-700 m-0 p-0">
          XIROO
        </h1>
      </div>
    </footer>
  );
}
