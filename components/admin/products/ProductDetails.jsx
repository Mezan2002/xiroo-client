"use client";
import { ImageIcon, Info, Layers, List, QrCode, Tag, Download } from "lucide-react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { useRef } from "react";
import { toPng } from "html-to-image";

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
  const qrTagRef = useRef(null);

  if (!product) return null;

  const productUrl = `${(process.env.NEXT_PUBLIC_CLIENT_URL || "https://xirooshop.com").replace(/\/$/, "")}/product/${product._id || product.id}`;

  const downloadTag = () => {
    if (qrTagRef.current === null) return;
    
    toPng(qrTagRef.current, { 
      cacheBust: true, 
      backgroundColor: '#ffffff', 
      pixelRatio: 3 
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `product-qr-${product.sku}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Could not generate QR image', err);
      });
  };

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
          title="Product QR System"
          subtitle="Digital asset generation"
        />
        
        <div className="flex flex-col lg:grid lg:grid-cols-12 items-center gap-12 bg-white border border-zinc-200 p-8 md:p-16">
          {/* Tag Preview Area */}
          <div className="lg:col-span-4 flex flex-col items-center">
            <div 
              ref={qrTagRef}
              className="bg-white p-10 border-2 border-black shadow-2xl flex flex-col items-center gap-6 w-fit"
            >
              <QRCodeSVG value={productUrl} size={200} level="H" />
              <div className="text-center font-bold text-[10px] tracking-[0.5em] uppercase pt-4 border-t border-zinc-100 w-full">
                {product.sku}
              </div>
            </div>
          </div>

          {/* Tag Information & Actions */}
          <div className="lg:col-span-8 space-y-8 w-full">
            <div className="space-y-3">
              <h4 className="text-xl font-bold uppercase tracking-tight">Digital Product QR</h4>
              <p className="text-[12px] text-zinc-400 font-medium leading-relaxed max-w-lg">
                Generate a professional-grade QR code linked directly to your production catalog. This tag allows customers to access real-time specifications and pricing instantly.
              </p>
            </div>

            <div className="space-y-4">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Linked Production URL</span>
              <div className="p-5 bg-zinc-50 border border-zinc-100 font-mono text-[11px] text-zinc-500 break-all select-all flex justify-between items-center group">
                {productUrl}
                <button 
                   onClick={() => {
                     navigator.clipboard.writeText(productUrl);
                     alert("Copied!");
                   }}
                   className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-bold uppercase tracking-widest text-black border-b border-black"
                >
                  Copy
                </button>
              </div>
            </div>

            <button
              onClick={downloadTag}
              className="w-full md:w-fit h-14 px-12 bg-black text-white flex items-center justify-center gap-4 text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-zinc-800 transition-all group"
            >
              <Download size={16} className="group-hover:-translate-y-0.5 transition-transform" />
              Download QR Tag
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
