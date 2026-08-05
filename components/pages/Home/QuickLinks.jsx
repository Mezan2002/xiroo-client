"use client";

import SectionHeader from "@/components/ui/SectionHeader";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const LINKS = [
  {
    label: "Our Story",
    href: "/about-us",
    description: "Learn about the XIROO brand",
  },
  {
    label: "FAQ",
    href: "/faq",
    description: "Answers to common questions",
  },
  {
    label: "Contact",
    href: "/contact",
    description: "Get in touch with us",
  },
  {
    label: "Testimonials",
    href: "/testimonials",
    description: "What our customers say",
  },
];

export default function QuickLinks() {
  return (
    <section className="w-full py-16 lg:py-24 px-6 lg:px-12 bg-[#F7F7F5] border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <SectionHeader subtitle="Explore" title="More From XIROO" className="mb-12 lg:mb-16" />

        {/* Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200">
          {LINKS.map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              className="group bg-[#F7F7F5] p-8 lg:p-10 flex flex-col gap-4 hover:bg-white transition-colors duration-300"
            >
              <h3 className="text-sm font-bold tracking-widest uppercase text-black group-hover:tracking-[0.2em] transition-all">
                {link.label}
              </h3>
              <p className="text-xs text-gray-400 font-light leading-relaxed">
                {link.description}
              </p>
              <div className="mt-auto pt-4 flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase group-hover:text-black transition-colors">
                Learn More
                <ArrowRight
                  size={12}
                  className="transition-transform group-hover:translate-x-1"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
