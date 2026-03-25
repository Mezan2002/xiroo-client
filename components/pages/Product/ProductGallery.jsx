import Image from "next/image";

export default function ProductGallery({ images = [], title }) {
  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 md:gap-5 lg:gap-6 w-full bg-white pb-10">
      {images.map((img, index) => (
        <div
          key={index}
          className="relative w-full aspect-4/5 md:aspect-3/4 xl:aspect-4/5 overflow-hidden bg-[#fafafa] rounded-[2px] group"
        >
          <Image
            src={img}
            alt={`${title} - view ${index + 1}`}
            fill
            className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-[1.2s] ease-[cubic-bezier(0.25,1,0.5,1)]"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
        </div>
      ))}
    </div>
  );
}
