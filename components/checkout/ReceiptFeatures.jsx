"use client";

import { useState } from "react";
import { Check, Copy, Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/useToast";

export default function ReceiptFeatures({ order, receiptRef }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleCopyOrderId = async () => {
    if (!order?.orderId) return;
    try {
      await navigator.clipboard.writeText(order.orderId);
      setCopied(true);
      toast.success("Order ID copied to registry memory.");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Registry copy failed.");
    }
  };

  const handleDownloadReceipt = async () => {
    if (!receiptRef.current) return;
    setDownloading(true);
    toast.info("Generating PDF Registry Record...");

    try {
      const [htmlToImage, jsPDFModule] = await Promise.all([
        import("html-to-image"),
        import("jspdf"),
      ]);

      const element = receiptRef.current;
      await new Promise((resolve) => setTimeout(resolve, 500));

      const imgData = await htmlToImage.toPng(element, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });

      const pdf = new jsPDFModule.jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // A4 page dimensions in points
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 0;
      const usablePageHeight = pageHeight - margin;

      // If content fits on one page, add it directly
      if (pdfHeight <= usablePageHeight) {
        pdf.addImage(imgData, "PNG", 0, margin, pdfWidth, pdfHeight);
      } else {
        // Multi-page: slice the image across pages
        const totalImgHeight = imgProps.height;
        const totalImgWidth = imgProps.width;

        // How many pixels of the source image fit on one page
        const pixelsPerPage = (usablePageHeight / pdfHeight) * totalImgHeight;
        const totalPages = Math.ceil(totalImgHeight / pixelsPerPage);

        // Create a canvas to crop slices
        const canvas = document.createElement("canvas");
        canvas.width = totalImgWidth;
        const ctx = canvas.getContext("2d");

        // Load the full image onto an offscreen element
        const img = new window.Image();
        img.src = imgData;
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        for (let i = 0; i < totalPages; i++) {
          const srcY = i * pixelsPerPage;
          const srcSliceHeight = Math.min(pixelsPerPage, totalImgHeight - srcY);

          // Set canvas to the slice height
          canvas.height = srcSliceHeight;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, srcY, totalImgWidth, srcSliceHeight, 0, 0, totalImgWidth, srcSliceHeight);

          const sliceData = canvas.toDataURL("image/png");
          const slicePdfHeight = (srcSliceHeight / totalImgWidth) * pdfWidth;

          if (i > 0) {
            pdf.addPage();
          }
          pdf.addImage(sliceData, "PNG", 0, margin, pdfWidth, slicePdfHeight);
        }
      }

      pdf.save(`RECEIPT-${order.orderId}.pdf`);
      toast.success("PDF Registry Downloaded.");
    } catch (error) {
      console.error("PDF Export Error:", error);
      toast.error("Failed to generate PDF registry.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex items-center justify-between w-full mb-10">
      <div className="space-y-1">
        <label className="text-[10px] font-medium text-gray-500 uppercase tracking-tighter leading-none">
          Receipt
        </label>
        <div 
          className="flex items-center gap-2 text-black/80 font-medium text-[13px] tracking-tight group/copy cursor-pointer" 
          onClick={handleCopyOrderId}
        >
          {order.orderId}
          {copied ? (
            <Check className="w-3 h-3 text-green-500" />
          ) : (
            <Copy className="w-3 h-3 text-gray-500 group-hover/copy:text-black transition-colors" />
          )}
        </div>
      </div>
      
      <div className="flex items-center">
        {downloading ? (
          <Loader2 className="w-5 h-5 text-black animate-spin" />
        ) : (
          <Download 
            className="w-5 h-5 text-gray-500 hover:text-black transition-colors cursor-pointer" 
            onClick={handleDownloadReceipt}
          />
        )}
      </div>
    </div>
  );
}
