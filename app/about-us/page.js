"use client";

import Breadcrumb from "@/components/ui/Breadcrumb";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const VALUES = [
  {
    number: "01",
    title: "Quality Without Compromise",
    description:
      "Every fabric is handpicked, every stitch meticulously placed. We never cut corners because our customers deserve the best.",
  },
  {
    number: "02",
    title: "Designed For Expression",
    description:
      "Our pieces aren't just clothes — they're statements. Created for those who refuse to blend into the background.",
  },
  {
    number: "03",
    title: "Community First",
    description:
      "XIROO is more than a brand. It's a movement. We grow with our community, listen to our people, and evolve together.",
  },
  {
    number: "04",
    title: "Sustainable Approach",
    description:
      "We're committed to responsible production. Less waste, better materials, and a future we can all be proud of.",
  },
];

const MILESTONES = [
  { year: "2023", event: "XIROO Founded" },
  { year: "2024", event: "First Collection Drop" },
  { year: "2024", event: "10,000+ Happy Customers" },
  { year: "2025", event: "Nationwide Expansion" },
];

export default function AboutUsPage() {
  return (
    <div className="w-full min-h-screen bg-white font-montserrat">
      {/* Hero Section */}
      <div className="pt-32 pb-20 px-6 lg:px-12 max-w-[1600px] mx-auto">
        <div className="max-w-[800px] mx-auto mb-20">
          <div className="flex flex-col gap-6 items-center text-center">
            <Breadcrumb />
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-light tracking-tight text-black uppercase leading-tight">
              About XIROO
            </h1>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">
              <span className="w-8 h-px bg-gray-200" />
              Our Story
              <span className="w-8 h-px bg-gray-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="bg-[#F7F7F5] py-20 lg:py-32 px-6 lg:px-12">
        <div className="max-w-[900px] mx-auto text-center">
          <p className="text-2xl md:text-3xl lg:text-4xl font-light text-black leading-relaxed">
            &ldquo;To bring premium streetwear to Bangladesh — designed for
            those who refuse to settle for ordinary.&rdquo;
          </p>
        </div>
      </div>

      {/* Origin Story */}
      <div className="py-20 lg:py-32 px-6 lg:px-12 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="order-2 lg:order-1">
            <div className="aspect-[4/5] bg-gray-100 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-sm uppercase tracking-widest">
                  Brand Image
                </span>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 flex flex-col gap-6">
            <span className="text-[10px] font-bold tracking-[0.4em] text-gray-400 uppercase">
              How It Started
            </span>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-black uppercase leading-tight">
              From A Dream
              <br />
              To A Movement
            </h2>
            <div className="w-12 h-px bg-black" />
            <p className="text-sm md:text-base text-gray-500 font-light leading-relaxed">
              XIROO was born from a frustration. Too many people in Bangladesh
              had to choose between style and quality, between looking good and
              wearing something that lasts. We decided that choice shouldn't
              exist.
            </p>
            <p className="text-sm md:text-base text-gray-500 font-light leading-relaxed">
              Starting with a small collection and a big vision, we set out to
              create streetwear that could stand shoulder to shoulder with
              international brands — while staying true to our roots.
            </p>
            <p className="text-sm md:text-base text-gray-500 font-light leading-relaxed">
              Today, XIROO is more than clothing. It's a statement of intent.
              Every thread carries our commitment to quality, every design
              reflects our passion for self-expression.
            </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-[#F7F7F5] py-20 lg:py-32 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-[10px] font-bold tracking-[0.4em] text-gray-400 uppercase mb-3">
              What We Stand For
            </span>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-black uppercase">
              Our Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200 border border-gray-200">
            {VALUES.map((value, idx) => (
              <div
                key={idx}
                className="bg-[#F7F7F5] p-10 lg:p-14 flex flex-col gap-4"
              >
                <span className="text-[11px] font-bold tracking-widest text-gray-300">
                  {value.number}
                </span>
                <h3 className="text-lg font-bold tracking-widest uppercase text-black">
                  {value.title}
                </h3>
                <p className="text-sm text-gray-500 font-light leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="py-20 lg:py-32 px-6 lg:px-12 max-w-[1600px] mx-auto">
        <div className="max-w-[800px] mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-[10px] font-bold tracking-[0.4em] text-gray-400 uppercase mb-3">
              Our Journey
            </span>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-black uppercase">
              Milestones
            </h2>
          </div>

          <div className="space-y-0">
            {MILESTONES.map((milestone, idx) => (
              <div
                key={idx}
                className="flex items-center gap-8 py-6 border-b border-gray-100 last:border-0"
              >
                <span className="text-sm font-bold tracking-widest text-gray-300 w-16 shrink-0">
                  {milestone.year}
                </span>
                <span className="text-sm md:text-base font-light text-black tracking-wide">
                  {milestone.event}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-black py-20 lg:py-24 px-6 lg:px-12">
        <div className="max-w-[800px] mx-auto text-center flex flex-col items-center gap-8">
          <h2 className="text-3xl md:text-4xl font-light text-white uppercase tracking-tight">
            Join The Movement
          </h2>
          <p className="text-sm text-gray-400 font-light leading-relaxed max-w-[480px]">
            Be part of a community that values quality, style, and
            self-expression. Discover what makes XIROO different.
          </p>
          <Link
            href="/collections"
            className="inline-flex items-center gap-3 border border-white px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black transition-all group"
          >
            Shop Now
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
