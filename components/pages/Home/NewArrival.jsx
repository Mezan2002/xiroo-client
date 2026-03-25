import ProductCard from "@/components/ui/ProductCard";

const PRODUCTS = [
  {
    id: "cat-steam-brush",
    title: "CAT STEAM BRUSH STEAMY DOG BRUSH 3 IN 1 ELECTRIC SPRAY CAT HAIR BRUSHES",
    price: "$24.45",
    image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "winter-heated-jacket",
    title: "WINTER HEATED JACKET USB ELECTRIC COTTON COAT",
    price: "$45.90",
    image: "https://images.unsplash.com/photo-1551028719-00160b23e035?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "xiroo-travel-bottles",
    title: "XIROO™ 4-IN-1 TRAVEL DISPENSING BOTTLES PORTABLE LOTION BOTTLE",
    price: "$28.55",
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "xiroo-vegetable-cutter",
    title: "XIROO™ 5-IN-1 KITCHEN VEGETABLE CUTTER",
    price: "$45.99",
    image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=800",
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
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}
