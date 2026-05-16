"use client";
import { Download, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useRef } from "react";
import { Label, SectionHeader } from "./Shared";

const Barcode = ({ text }) => {
  if (!text) return null;
  // Create a stylized barcode-like pattern for the SKU
  const pattern = text.split("").map(c => c.charCodeAt(0).toString(2)).join("");
  return (
    <div className="flex items-center gap-[1px] h-10 w-full overflow-hidden opacity-80">
      {pattern.split("").map((b, i) => (
        <div 
          key={i} 
          className={`h-full shrink-0 ${b === "1" ? "bg-black" : "bg-transparent"}`} 
          style={{ width: i % 3 === 0 ? '2px' : '1px' }}
        />
      ))}
    </div>
  );
};

const QRManager = ({ product }) => {
  const qrRef = useRef();
  
  // Only show for existing products
  if (!product._id && !product.id) return null;

  const productUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL || "https://xirooshop.com"}/product/${product._id || product.id}`;

  const downloadQRCode = () => {
    const svg = qrRef.current.querySelector("svg");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 20, 20);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `Tag-${product.sku || "product"}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <SectionHeader
        label="Block 07"
        title="Product Labels"
      />

      <div className="flex flex-col md:flex-row items-center gap-12 bg-white border border-zinc-200 p-8 md:p-12 group transition-all hover:bg-zinc-50/50">
        <div className="flex flex-col items-center gap-4">
          <div ref={qrRef} className="p-6 bg-white border border-black shadow-2xl shadow-black/5 shrink-0">
            <QRCodeSVG
              value={productUrl}
              size={180}
              level="H"
              includeMargin={false}
            />
          </div>
          <div className="w-full space-y-2">
            <Barcode text={product.sku} />
            <div className="text-center font-bold text-[10px] tracking-[0.3em] uppercase">
              {product.sku}
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-6 text-center md:text-left">
          <div className="space-y-2">
            <h3 className="text-[14px] font-bold text-black uppercase tracking-widest flex items-center justify-center md:justify-start gap-3">
              <QrCode size={16} />
              Digital Product Tag
            </h3>
            <p className="text-[11px] text-zinc-400 font-medium leading-relaxed max-w-md">
              This tag connects your physical product to your online store. 
              Scan the QR code to view product details, or use the SKU barcode for inventory tracking.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="p-4 bg-zinc-50 border border-zinc-100 font-mono text-[10px] text-zinc-500 break-all">
              {productUrl}
            </div>

            <button
              onClick={downloadQRCode}
              className="flex items-center justify-center md:justify-start gap-3 px-8 py-4 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all active:scale-[0.98]"
            >
              <Download size={14} />
              Download Product Tag
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QRManager;
