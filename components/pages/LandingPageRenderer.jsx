"use client";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

function HeroSection({ block }) {
  const hasImage = !!block.backgroundImage;

  return (
    <section
      className="relative min-h-[70vh] flex items-center justify-center text-center px-6"
      style={
        hasImage
          ? { backgroundImage: `url(${block.backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" }
          : {}
      }
    >
      {hasImage && <div className="absolute inset-0 bg-black/40" />}

      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        {block.heading && (
          <h1
            className={`text-4xl md:text-6xl font-bold tracking-tight uppercase ${
              hasImage ? "text-white" : "text-black"
            }`}
          >
            {block.heading}
          </h1>
        )}
        {block.subheading && (
          <p
            className={`text-lg font-medium max-w-xl mx-auto ${
              hasImage ? "text-white/80" : "text-zinc-600"
            }`}
          >
            {block.subheading}
          </p>
        )}
        {block.ctaLabel && block.ctaLink && (
          <Link
            href={block.ctaLink}
            className={`inline-block px-10 py-4 text-[12px] font-bold uppercase tracking-widest transition-colors mt-4 ${
              hasImage
                ? "bg-white text-black hover:bg-zinc-100"
                : "bg-black text-white hover:bg-zinc-800"
            }`}
          >
            {block.ctaLabel}
          </Link>
        )}
      </div>
    </section>
  );
}

function GallerySection({ block }) {
  if (!block.images?.length) return null;
  return (
    <section className="py-16 px-6">
      <div
        className={`max-w-6xl mx-auto grid gap-4 ${
          block.layout === "carousel"
            ? "grid-flow-col auto-cols-[300px] overflow-x-auto snap-x"
            : "grid-cols-2 md:grid-cols-3"
        }`}
      >
        {block.images.map((img, i) => (
          <div key={i} className="relative aspect-square bg-zinc-100 overflow-hidden snap-start">
            <img src={img} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}

function ProductDetailsSection({ block, product }) {
  if (!product) return null;
  const activePrice = product.salePrice || product.price;

  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {product.images?.[0] && (
          <div className="relative aspect-square bg-zinc-100 overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">{product.title}</h2>
          {block.showPrice && (
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold">৳{activePrice}</span>
              {product.salePrice && product.price && (
                <span className="text-lg text-zinc-400 line-through">৳{product.price}</span>
              )}
            </div>
          )}
          {block.showDescription && product.description && (
            <p className="text-zinc-600 leading-relaxed">{product.description}</p>
          )}
          {block.showSpecs && product.specifications?.length > 0 && (
            <div className="space-y-3">
              {product.specifications.map((group, gi) => (
                <div key={gi}>
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-2">
                    {group.group}
                  </h4>
                  <div className="space-y-1">
                    {group.items.map((item, ii) => (
                      <div key={ii} className="flex justify-between text-sm py-1 border-b border-zinc-100">
                        <span className="text-zinc-500">{item.label}</span>
                        <span className="font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {block.showVariants && product.variants?.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                Variants
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v, vi) => (
                  <div key={vi}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
                      {v.name}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {v.values.map((val, vali) => (
                        <span
                          key={vali}
                          className="px-3 py-1.5 text-[11px] border border-zinc-200 font-medium"
                        >
                          {val.value}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <Link
            href={`/product/${product.slug || product._id}`}
            className="inline-block px-8 py-4 bg-black text-white text-[12px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
          >
            View Product
          </Link>
        </div>
      </div>
    </section>
  );
}

function RichTextSection({ block }) {
  if (!block.content) return null;
  return (
    <section className="py-16 px-6">
      <div
        className="max-w-3xl mx-auto prose prose-zinc prose-lg"
        dangerouslySetInnerHTML={{ __html: block.content }}
      />
    </section>
  );
}

function ImageSection({ block }) {
  if (!block.url) return null;
  return (
    <section className="py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <img src={block.url} alt={block.alt || ""} className="w-full" />
        {block.caption && (
          <p className="text-center text-sm text-zinc-400 mt-3">{block.caption}</p>
        )}
      </div>
    </section>
  );
}

function VideoSection({ block }) {
  if (!block.url) return null;
  return (
    <section className="py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="relative aspect-video bg-black">
          <iframe
            src={block.url}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}

function FaqSection({ block }) {
  if (!block.items?.length) return null;
  return (
    <section className="py-16 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {block.heading && (
          <h2 className="text-3xl font-bold tracking-tight text-center">
            {block.heading}
          </h2>
        )}
        <div className="space-y-4">
          {block.items.map((item, i) => (
            <details key={i} className="border border-zinc-200 group">
              <summary className="px-6 py-4 cursor-pointer text-[14px] font-medium flex items-center justify-between list-none">
                {item.question}
                <ChevronRight className="w-4 h-4 text-zinc-400 transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-6 pb-4 text-sm text-zinc-600 leading-relaxed">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection({ block }) {
  return (
    <section className="py-20 px-6 bg-zinc-950 text-center">
      <div className="max-w-2xl mx-auto space-y-6">
        {block.heading && (
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white uppercase">
            {block.heading}
          </h2>
        )}
        {block.subheading && (
          <p className="text-zinc-400 font-medium">{block.subheading}</p>
        )}
        {block.buttonLabel && block.buttonLink && (
          <Link
            href={block.buttonLink}
            className="inline-block px-10 py-4 bg-white text-black text-[12px] font-bold uppercase tracking-widest hover:bg-zinc-100 transition-colors mt-4"
          >
            {block.buttonLabel}
          </Link>
        )}
      </div>
    </section>
  );
}

function CustomHtmlSection({ block }) {
  if (!block.content) return null;
  return (
    <section className="py-8 px-6">
      <div
        className="max-w-4xl mx-auto"
        dangerouslySetInnerHTML={{ __html: block.content }}
      />
    </section>
  );
}

const SECTION_MAP = {
  hero: HeroSection,
  gallery: GallerySection,
  "product-details": ProductDetailsSection,
  "rich-text": RichTextSection,
  image: ImageSection,
  video: VideoSection,
  faq: FaqSection,
  cta: CtaSection,
  "custom-html": CustomHtmlSection,
};

export default function LandingPageRenderer({ page }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Minimal header */}
      <header className="border-b border-zinc-100 py-6 px-6">
        <Link href="/" className="text-2xl font-bold tracking-tighter">
          XIROO
        </Link>
      </header>

      {/* Blocks */}
      {(page.blocks || []).map((block, index) => {
        const Section = SECTION_MAP[block.type];
        if (!Section) return null;
        return <Section key={index} block={block} product={page.product} />;
      })}

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-10 px-6 text-center">
        <Link href="/" className="text-sm font-medium text-zinc-400 hover:text-black transition-colors">
          Return to Store
        </Link>
      </footer>
    </div>
  );
}
