import Image from "next/image";
import Link from "next/link";

export default function PromoBanner() {
  return (
    <section className="relative w-full h-[75vh] min-h-[500px] overflow-hidden mt-12 lg:mt-24">
      {/* Background Image Layer */}
      <div className="absolute inset-0 w-full h-full -z-20 bg-black">
        <Image
          src="/images/hero-image.png"
          alt="Curated Nordic Aesthetics Banner"
          fill
          className="object-cover object-center"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent -z-10" />

      {/* Content Container */}
      <div className="relative z-10 w-full h-full px-6 lg:px-12 max-w-[1600px] mx-auto flex flex-col justify-end pb-12 md:pb-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-12 w-full">
          {/* Main Heading */}
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-mono font-bold leading-[1.3] tracking-wide lg:tracking-widest max-w-[1000px] uppercase drop-shadow-lg">
            ELEVATE YOUR DAILY LIVING WITH
            <br />
            CURATED NORDIC AESTHETICS
          </h2>

          {/* Action Link */}
          <Link
            href="/collections/nordic"
            className="text-white text-[10px] md:text-[11px] lg:text-xs font-semibold tracking-[0.2em] uppercase pb-1 border-b-[1.5px] border-white/60 hover:border-white transition-colors whitespace-nowrap mb-1 lg:mb-3"
          >
            SHOP NOW
          </Link>
        </div>
      </div>
    </section>
  );
}
