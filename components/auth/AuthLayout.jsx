import { useAuthLayout } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children, showEditorialBorder = true }) {
  const { layoutProps } = useAuthLayout();
  const { imageSrc, imageAlt, heading, description, badgeText } = layoutProps;

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-black flex flex-col font-montserrat selection:bg-black selection:text-white">
      <div className="flex-1 flex flex-col lg:flex-row h-screen">
        {/* Left Side: Sophisticated Form Area */}
        <div className="w-full lg:w-[45%] flex flex-col p-8 lg:p-16 xl:p-24 bg-white relative overflow-y-auto">
          {/* Top Brand & Navigation */}
          <div className="flex items-center justify-center mb-16 lg:mb-24">
            <Link
              href="/"
              className="transition-all hover:opacity-80 hover:scale-105 duration-500"
            >
              <Image
                src="/images/logo.png"
                alt="Xiroo Shop Logo"
                width={130}
                height={130}
                className="brightness-0"
              />
            </Link>
          </div>

          <div className="max-w-[420px] mx-auto w-full pb-12">{children}</div>
        </div>

        {/* Right Side: Immersive Narrative */}
        <div className="hidden lg:block lg:flex-1 relative">
          <div className="relative h-full w-full overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] group">
            <Image
              src={imageSrc || "/images/auth/login.png"}
              alt={imageAlt || "Xiroo Elite Experience"}
              fill
              className="object-cover transition-transform duration-3000 group-hover:scale-110"
              priority
            />
            {/* Double Overlay for Depth */}
            <div className="absolute inset-0 bg-black/40 pointer-events-none group-hover:bg-black/30 transition-colors duration-1000" />
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-black/30 pointer-events-none" />

            {/* Text Content Overlay */}
            <div className="absolute bottom-16 left-16 right-16 max-w-lg z-10 animate-in slide-in-from-bottom-5 duration-700 delay-300">
              {badgeText && (
                <div className="w-max px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-none border border-white/20 mb-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
                    {badgeText}
                  </p>
                </div>
              )}

              <h2 className="text-[64px] font-playfair text-white leading-none mb-8 tracking-tighter">
                {heading}
              </h2>

              {description && (
                <p className="text-[16px] text-white font-light leading-relaxed max-w-sm tracking-tight border-l-2 border-zinc-500/50 pl-6">
                  {description}
                </p>
              )}
            </div>

            {/* Editorial Inner Border - Optional based on design */}
            {showEditorialBorder && (
              <div className="absolute inset-8 border border-white/20 pointer-events-none" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
