"use client";

import { useState, useRef, useEffect } from "react";
import { Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/useToast";
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

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
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
        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-zinc-200 text-zinc-700 text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-zinc-50 hover:border-zinc-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {downloading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Download className="w-3.5 h-3.5" />
        )}
        {downloading ? "Generating..." : "Download Invoice"}
      </button>
    </>
  );
}
