"use client";

import { useState } from "react";
import { Check, Copy, Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

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
      const { toPng } = await import("html-to-image");
      const element = receiptRef.current;
      
      // Small delay to ensure all nested images and fonts are fully settled
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const imgData = await toPng(element, { 
        quality: 1, 
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
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
        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter leading-none">
          Receipt
        </label>
        <div 
          className="flex items-center gap-2 text-black/80 font-bold text-[13px] tracking-tight group/copy cursor-pointer" 
          onClick={handleCopyOrderId}
        >
          {order.orderId}
          {copied ? (
            <Check className="w-3 h-3 text-green-500" />
          ) : (
            <Copy className="w-3 h-3 text-gray-400 group-hover/copy:text-black transition-colors" />
          )}
        </div>
      </div>
      
      <div className="flex items-center">
        {downloading ? (
          <Loader2 className="w-5 h-5 text-black animate-spin" />
        ) : (
          <Download 
            className="w-5 h-5 text-gray-400 hover:text-black transition-colors cursor-pointer" 
            onClick={handleDownloadReceipt}
          />
        )}
      </div>
    </div>
  );
}
