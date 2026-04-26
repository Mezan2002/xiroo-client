import PolicyPage from "@/components/shared/PolicyPage";
import Image from "next/image";

export const metadata = {
  title: "Our Story | Xiroo Philosophy",
  description:
    "Discover the architectural vision and culinary mastery behind the Xiroo brand.",
};

export default function AboutPage() {
  return (
    <PolicyPage title="Our Story" lastUpdated="Est. 2024">
      <section className="space-y-12">
        <div className="relative w-full aspect-video bg-zinc-50 overflow-hidden mb-12">
          <Image
            src="/images/auth/login.png"
            alt="Xiroo Studio"
            fill
            className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
          />
        </div>

        <div className="space-y-8">
          <p className="text-xl md:text-2xl font-light italic text-black leading-relaxed">
            &quot;Xiroo was founded on the principle that the objects we
            surround ourselves with should be as precise as they are
            beautiful.&quot;
          </p>

          <h2>The Vision</h2>
          <p>
            Born from a fusion of high-performance electronic engineering and
            professional-grade culinary mastery, Xiroo redefines the boundaries
            of modern living. We don&apos;t just create products; we design
            architectural artifacts for the home.
          </p>

          <h2>The Philosophy</h2>
          <p>
            In an era of mass production, Xiroo chooses the path of deliberate
            craftsmanship. Every curve, every circuit, and every material is
            selected to provide a sensory experience that resonates with the
            refined lifestyle of our global community.
          </p>

          <hr />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-black mb-4">
                Precision Engineering
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Our technology is developed in specialized labs where
                performance is measured in microns. We believe reliability is
                the ultimate luxury.
              </p>
            </div>
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-black mb-4">
                Culinary Mastery
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                We collaborate with world-class chefs to ensure our kitchen
                artifacts translate professional techniques into domestic
                excellence.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PolicyPage>
  );
}
