"use client";

import { useToast } from "@/hooks/useToast";
import { Download, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AdminInvoiceTemplate from "./AdminInvoiceTemplate";

export default function AdminInvoiceDownload({ order }) {
  const { toast } = useToast();
  const [downloading, setDownloading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const invoiceRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDownloadInvoice = async () => {
    if (!invoiceRef.current || !order) return;
    setDownloading(true);
    toast.info("Generating invoice...");

    try {
      const [htmlToImage, jsPDFModule] = await Promise.all([
        import("html-to-image"),
        import("jspdf"),
      ]);

      const element = invoiceRef.current;
      await new Promise((resolve) => setTimeout(resolve, 300));

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
          ctx.drawImage(
            img,
            0,
            srcY,
            totalImgWidth,
            srcSliceHeight,
            0,
            0,
            totalImgWidth,
            srcSliceHeight,
          );

          const sliceData = canvas.toDataURL("image/png");
          const slicePdfHeight = (srcSliceHeight / totalImgWidth) * pdfWidth;

          if (i > 0) {
            pdf.addPage();
          }
          pdf.addImage(sliceData, "PNG", 0, margin, pdfWidth, slicePdfHeight);
        }
      }

      pdf.save(`INVOICE-${order.orderId}.pdf`);
      toast.success("Invoice downloaded successfully.");
    } catch (error) {
      console.error("Invoice PDF Error:", error);
      toast.error("Failed to generate invoice.");
    } finally {
      setDownloading(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      <AdminInvoiceTemplate order={order} invoiceRef={invoiceRef} />

      <button
        onClick={handleDownloadInvoice}
        disabled={downloading}
        className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 h-9 sm:h-10 bg-white border border-zinc-200 text-zinc-700 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.12em] sm:tracking-[0.15em] hover:bg-zinc-50 hover:border-zinc-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {downloading ? (
          <Loader2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin" />
        ) : (
          <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        )}
        {downloading ? "Generating..." : "Download Invoice"}
      </button>
    </>
  );
}
