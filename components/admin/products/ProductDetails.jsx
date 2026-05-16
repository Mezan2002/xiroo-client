"use client";
import { ImageIcon, Info, Layers, List, QrCode, Tag } from "lucide-react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";

const Barcode = ({ text }) => {
  if (!text) return null;
  const pattern = text
    .split("")
    .map((c) => c.charCodeAt(0).toString(2))
    .join("");
  return (
    <div className="flex items-center gap-px h-10 w-full overflow-hidden opacity-80">
      {pattern.split("").map((b, i) => (
        <div
          key={i}
          className={`h-full shrink-0 ${b === "1" ? "bg-black" : "bg-transparent"}`}
          style={{ width: i % 3 === 0 ? "2px" : "1px" }}
        />
      ))}
    </div>
  );
};

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center gap-6 border-b border-zinc-100 pb-8 mb-10 group">
    <div className="w-12 h-12 bg-black text-white flex items-center justify-center shrink-0">
      <Icon size={20} />
    </div>
    <div className="space-y-1">
      <h3 className="text-xl font-bold uppercase tracking-tight">{title}</h3>
      <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-[0.2em]">
        {subtitle}
      </p>
    </div>
  </div>
);

const DetailField = ({ label, value, fullWidth = false }) => (
  <div className={`space-y-2 ${fullWidth ? "col-span-full" : ""}`}>
    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
      {label}
    </span>
    <div className="text-[13px] font-medium text-black wrap-break-word">
      {value || <span className="text-zinc-200 italic">Not Specified</span>}
    </div>
  </div>
);

const ProductDetails = ({ product }) => {
  if (!product) return null;

  return (
    <div className="space-y-24 max-w-7xl mx-auto pb-24">
      {/* 01. Basic Information */}
      <section>
        <SectionHeader
          icon={Info}
          title="Basic Information"
          subtitle="General product details"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 px-1">
          <DetailField
            label="Product Title"
            value={product.title}
            fullWidth={true}
          />
          <DetailField label="SKU ID" value={product.sku} />
          <DetailField label="Stock Status" value={product.stockStage} />
          <DetailField
            label="Featured"
            value={product.isFeatured ? "YES" : "NO"}
          />
          <DetailField label="Badge" value={product.badge} />

          <div className="col-span-full space-y-4">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
              Product Description
            </span>
            <div
              className="prose prose-sm max-w-none text-zinc-600 bg-zinc-50 p-8 border border-zinc-100"
              dangerouslySetInnerHTML={{ __html: product.description || "" }}
            />
          </div>
        </div>
      </section>

      {/* 02. Pricing & Inventory */}
      <section>
        <SectionHeader
          icon={Tag}
          title="Pricing & Inventory"
          subtitle="Financial & Stock metrics"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 px-1">
          <DetailField label="Regular Price" value={`৳${product.price}`} />
          <DetailField
            label="Sale Price"
            value={product.salePrice ? `৳${product.salePrice}` : "N/A"}
          />
          <DetailField label="Stock Level" value={product.inventory} />
          <DetailField label="Tax Percentage" value={`${product.tax}%`} />
        </div>
      </section>

      {/* 03. Media Gallery */}
      <section>
        <SectionHeader
          icon={ImageIcon}
          title="Product Media"
          subtitle="Visual Documentation"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 px-1">
          {product.images?.map((img, idx) => (
            <div
              key={idx}
              className={`aspect-square relative bg-white border border-zinc-100 group overflow-hidden ${idx === 0 ? "ring-4 ring-black/5 border-black" : ""}`}
            >
              <Image src={img} alt="" fill className="object-contain" />
              {idx === 0 && (
                <div className="absolute top-2 left-2 bg-black text-white px-2 py-0.5 text-[7px] font-bold uppercase tracking-widest">
                  Featured
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 04. Variants */}
      {product.variants?.length > 0 && (
        <section>
          <SectionHeader
            icon={Layers}
            title="Product Variants"
            subtitle="Available configurations"
          />
          <div className="space-y-8 px-1">
            {product.variants.map((v, i) => (
              <div
                key={i}
                className="bg-zinc-50 p-8 border border-zinc-100 space-y-4"
              >
                <span className="text-[11px] font-bold uppercase tracking-widest border-b border-black pb-1">
                  {v.name}
                </span>
                <div className="flex flex-wrap gap-4 pt-2">
                  {v.values.map((val, j) => (
                    <div
                      key={j}
                      className="bg-white border border-zinc-200 px-4 py-2 flex items-center gap-4"
                    >
                      <span className="text-[11px] font-bold">{val.value}</span>
                      {val.price && (
                        <span className="text-[10px] text-zinc-400 font-bold border-l pl-4">
                          +৳{val.price}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 05. Specifications */}
      {product.specifications?.length > 0 && (
        <section>
          <SectionHeader
            icon={List}
            title="Specifications"
            subtitle="Technical verification"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-1">
            {product.specifications.map((group, i) => (
              <div key={i} className="space-y-6">
                <h4 className="text-[12px] font-bold uppercase tracking-[0.2em] border-l-4 border-black pl-4">
                  {group.group}
                </h4>
                <div className="space-y-4">
                  {group.items.map((item, j) => (
                    <div
                      key={j}
                      className="flex justify-between items-center border-b border-zinc-100 pb-3"
                    >
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        {item.label}
                      </span>
                      <span className="text-[12px] font-medium text-black">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      {/* 06. Product Labels */}
      <section>
        <SectionHeader
          icon={QrCode}
          title="Product Labels"
          subtitle="Physical tag generation"
        />
        <div className="flex flex-col md:flex-row items-center gap-12 bg-white border border-zinc-200 p-8 md:p-12">
          <div className="flex flex-col items-center gap-4 bg-white p-6 border border-black shadow-xl">
            <QRCodeSVG
              value={`${(process.env.NEXT_PUBLIC_CLIENT_URL || "https://xirooshop.com").replace(/\/$/, "")}/product/${product._id || product.id}`}
              size={180}
              level="H"
            />
            <div className="w-full space-y-2">
              <Barcode text={product.sku} />
              <div className="text-center font-bold text-[10px] tracking-[0.3em] uppercase">
                {product.sku}
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <h4 className="text-[14px] font-bold uppercase tracking-widest">
                Digital Product Tag
              </h4>
              <p className="text-[11px] text-zinc-400 font-medium leading-relaxed max-w-md">
                This tag links the physical item to the online catalog. Scan the
                QR code to access live pricing and specifications.
              </p>
            </div>
            <div className="p-4 bg-zinc-50 border border-zinc-100 font-mono text-[10px] text-zinc-500 break-all">
              {`${(process.env.NEXT_PUBLIC_CLIENT_URL || "https://xirooshop.com").replace(/\/$/, "")}/product/${product._id || product.id}`}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
