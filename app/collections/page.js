import Breadcrumb from "@/components/ui/Breadcrumb";
import Image from "next/image";
import Link from "next/link";

const COLLECTIONS = [
  {
    id: "lifestyle",
    title: "NORDIC LIFESTYLE",
    itemCount: "24 ITEMS",
    image: "/images/promo-banner.png",
    link: "/collections/lifestyle",
  },
  {
    id: "smart-home",
    title: "SMART HOME",
    itemCount: "12 ITEMS",
    image: "/images/featured-product-main.png",
    link: "/collections/smart-home",
  },
  {
    id: "kitchen",
    title: "KITCHEN ESSENTIALS",
    itemCount: "18 ITEMS",
    image: "/images/product-vegetable-cutter.png",
    link: "/collections/kitchen",
  },
  {
    id: "new-in",
    title: "NEW ARCHIVE",
    itemCount: "8 ITEMS",
    image: "/images/hero-image.png",
    link: "/collections/new-in",
  },
];

export default function CollectionsIndexPage() {
  return (
    <div className="w-full flex flex-col min-h-screen bg-white pt-32 pb-24 px-6 lg:px-12 max-w-[1600px] mx-auto">
      {/* Super Minimal Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end border-b border-gray-100 pb-6 mb-16 gap-6">
        <div className="flex flex-col gap-4">
          <Breadcrumb />
          <h1 className="text-3xl md:text-4xl lg:text-[44px] font-light tracking-wide text-black uppercase leading-none">
            Collections
          </h1>
        </div>
        <div className="flex pb-1">
          <Link
            href="/collections/all"
            className="text-[10px] md:text-[11px] font-bold tracking-[0.15em] text-gray-400 uppercase hover:text-black transition-colors"
          >
            View All Products
          </Link>
        </div>
      </div>

      {/* Ultra-Clean Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 lg:gap-x-8 gap-y-16">
        {COLLECTIONS.map((collection) => (
          <Link
            href={collection.link}
            key={collection.id}
            className="group flex flex-col w-full"
          >
            {/* Raw Image Box */}
            <div className="relative w-full aspect-3/4 bg-[#f8f8f8] overflow-hidden mb-5">
              <Image
                src={collection.image}
                alt={collection.title}
                fill
                className="object-cover object-center transition-transform duration-1200 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.03]"
              />
            </div>

            {/* Split Text Below Image */}
            <div className="flex justify-between items-start w-full px-1">
              <h2 className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] text-[#222] uppercase group-hover:text-black transition-colors">
                {collection.title}
              </h2>
              <span className="text-[9px] md:text-[10px] tracking-widest text-gray-400 font-semibold">
                {collection.itemCount}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
