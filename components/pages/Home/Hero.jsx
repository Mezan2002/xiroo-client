import { Button } from "@/components/ui/Button";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="relative w-full h-screen min-h-[600px] flex items-end justify-start pb-10 overflow-hidden">
      {/* Background Image Layer */}
      <div className="absolute inset-0 w-full h-full -z-20">
        <Image
          src="/images/hero-image.png"
          alt="Premium Quality Minimal Design"
          fill
          priority
          className="object-cover object-center"
          quality={90}
          sizes="100vw"
        />
      </div>

      {/* Dark gradient mapping to ensure text legibility */}
      <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/40 to-transparent -z-10"></div>
      <div className="absolute inset-0 bg-black/20 -z-10"></div>

      {/* Hero Content */}
      <div className="relative z-10 w-full px-6 lg:px-12 max-w-[1600px] mx-auto">
        <h1 className="text-white text-4xl sm:text-5xl lg:text-[64px] font-medium leading-[1.35] mb-12">
          PREMIUM QUALITY
          <br />
          MINIMAL DESIGN
        </h1>

        <Button href="/collections" variant="white" size="lg">
          VIEW OUR COLLECTIONS
        </Button>
      </div>
    </section>
  );
};

export default Hero;
