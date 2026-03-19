import Image from "next/image";
import Link from "next/link";

const PRODUCTS = [
  {
    id: "cat-steam-brush",
    title:
      "CAT STEAM BRUSH STEAMY DOG BRUSH 3 IN 1 ELECTRIC SPRAY CAT HAIR BRUSHES FOR MASSAGE PET...",
    price: "$24.45",
    image: "/images/featured-product-main.png",
  },
  {
    id: "winter-heated-jacket",
    title:
      "WINTER HEATED JACKET USB ELECTRIC COTTON COAT ZIP-UP HEATER THERMAL CLOTHING HEATING...",
    price: "$45.90",
    image: "/images/product-heated-jacket.png",
  },
  {
    id: "xiroo-travel-bottles",
    title: "XIROO™ 4-IN-1 TRAVEL DISPENSING BOTTLES PORTABLE LOTION BOTTLE",
    price: "$28.55",
    image: "/images/product-travel-bottles.png",
  },
  {
    id: "xiroo-vegetable-cutter",
    title: "XIROO™ 5-IN-1 KITCHEN VEGETABLE CUTTER",
    price: "$45.99",
    image: "/images/product-vegetable-cutter.png",
  },
];

export default function NewArrival() {
  return (
    <section className="w-full py-20 lg:py-32 px-6 lg:px-12 max-w-[1600px] mx-auto border-t border-gray-100">
      {/* Section Header */}
      <div className="flex justify-center mb-12 lg:mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-[40px] font-mono tracking-[0.15em] lg:tracking-[0.2em] font-medium text-black uppercase">
          NEW ARRIVAL
        </h2>
      </div>

      {/* Products Display Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 lg:gap-x-8">
        {PRODUCTS.map((product) => (
          <Link
            href={`/product/${product.id}`}
            key={product.id}
            className="group flex flex-col cursor-pointer"
          >
            {/* Product Image Wrapper */}
            <div className="relative w-full aspect-square bg-[#f8f8f8] mb-4 overflow-hidden">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
              />
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              <h3 className="text-[10px] md:text-[11px] font-semibold text-[#555] uppercase leading-[1.6] mb-[2px] line-clamp-4 group-hover:text-black transition-colors">
                {product.title}
              </h3>
              <span className="text-[10px] md:text-[11px] text-gray-500 tracking-wide font-medium">
                {product.price}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
