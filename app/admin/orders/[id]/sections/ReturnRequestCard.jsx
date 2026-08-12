"use client";

import { useOrders } from "@/hooks/api/useOrders";
import { useToast } from "@/hooks/useToast";
import {
  ArrowRight,
  ArrowRightLeft,
  Check,
  CheckCircle2,
  Eye,
  ImageIcon,
  Loader2,
  Package,
  RotateCcw,
  Video,
  X,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function ReturnRequestCard({ returnRequest, orderId }) {
  const { updateReturnRequestStatus } = useOrders();
  const { toast } = useToast();
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [adminNote, setAdminNote] = useState("");
  const [isNoteOpen, setIsNoteOpen] = useState(false);

  if (!returnRequest) return null;

  const isExchange = returnRequest.type === "exchange";

  const statusStyles = {
    requested: {
      badge: "bg-purple-50 border-purple-200 text-purple-700",
      label: "Requested",
    },
    approved: {
      badge: "bg-blue-50 border-blue-200 text-blue-700",
      label: "Approved / Accepted",
    },
    received: {
      badge: "bg-emerald-50 border-emerald-200 text-emerald-700",
      label: "Received & Processed",
    },
    rejected: {
      badge: "bg-rose-50 border-rose-200 text-rose-700",
      label: "Rejected",
    },
  };

  const currentStatusStyle =
    statusStyles[returnRequest.status] || statusStyles.requested;

  const handleStatusUpdate = (targetStatus) => {
    updateReturnRequestStatus.mutate(
      {
        orderId,
        status: targetStatus,
        adminNote: adminNote.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.success(
            `Customer ${isExchange ? "Exchange" : "Return"} request marked as ${targetStatus}!`,
          );
          setAdminNote("");
          setIsNoteOpen(false);
        },
        onError: (err) => {
          toast.error(err.message || "Failed to update request status");
        },
      },
    );
  };

  const isPending = updateReturnRequestStatus.isPending;

  return (
    <>
      <div className="bg-white border border-zinc-200 overflow-hidden shadow-xs">
        {/* Header */}
        <div className="px-5 py-4 bg-zinc-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isExchange ? (
              <ArrowRightLeft size={16} className="text-purple-400" />
            ) : (
              <RotateCcw size={16} className="text-rose-400" />
            )}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">
                Customer {isExchange ? "Exchange" : "Return"} Request
              </h3>
              <p className="text-[10px] text-zinc-400 mt-0.5">
                Requested on{" "}
                {returnRequest.requestedAt
                  ? new Date(returnRequest.requestedAt).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric", year: "numeric" },
                    )
                  : "N/A"}
              </p>
            </div>
          </div>
          <span
            className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest border ${currentStatusStyle.badge}`}
          >
            {currentStatusStyle.label}
          </span>
        </div>

        <div className="p-5 space-y-6">
          {/* Reason & Customer Note */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-50 p-4 border border-zinc-100">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
                Reason
              </p>
              <p className="text-[13px] font-bold text-zinc-900">
                {returnRequest.reason}
              </p>
            </div>
            {returnRequest.note && (
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
                  Customer Note
                </p>
                <p className="text-[12px] text-zinc-700 font-medium leading-relaxed">
                  {returnRequest.note}
                </p>
              </div>
            )}
          </div>

          {/* Detailed Item List */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">
              {isExchange ? "Exchange Item Details" : "Returned Items"}
            </p>

            <div className="space-y-4">
              {returnRequest.items?.map((item, idx) => {
                const origProd = item.product;
                const origTitle =
                  typeof origProd === "object"
                    ? origProd?.title || "Product"
                    : "Product";
                const origImg =
                  typeof origProd === "object" ? origProd?.images?.[0] : null;

                const exDetails = item.exchangeDetails;
                const replProd = exDetails?.replacementProduct;
                const replTitle =
                  typeof replProd === "object"
                    ? replProd?.title
                    : isExchange
                    ? origTitle
                    : null;
                const replImg =
                  typeof replProd === "object"
                    ? replProd?.images?.[0]
                    : origImg;

                if (isExchange) {
                  return (
                    <div
                      key={idx}
                      className="border border-purple-100 bg-purple-50/20 p-4 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        {/* Original Product */}
                        <div className="flex-1 flex items-center gap-3 w-full sm:w-auto">
                          <div className="relative shrink-0">
                            {origImg ? (
                              <div className="w-12 h-12 relative overflow-hidden bg-zinc-100 border border-zinc-200">
                                <Image
                                  src={origImg}
                                  alt={origTitle}
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                                <Package className="w-6 h-6 text-zinc-300" />
                              </div>
                            )}
                            <span className="absolute -top-2 -left-2 bg-rose-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-xs uppercase tracking-tighter">
                              Return
                            </span>
                          </div>
                          <div>
                            <p className="text-[12px] font-bold text-zinc-900 leading-tight">
                              {origTitle}
                            </p>
                            {item.variant && (
                              <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mt-0.5">
                                Variant: {item.variant}
                              </p>
                            )}
                            <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>

                        {/* Arrow Divider */}
                        <div className="flex flex-col items-center justify-center shrink-0 px-2 py-1 bg-purple-100/60 rounded-full text-purple-700 my-1 sm:my-0">
                          <ArrowRight size={14} className="rotate-90 sm:rotate-0" />
                        </div>

                        {/* Replacement Product */}
                        <div className="flex-1 flex items-center gap-3 w-full sm:w-auto sm:justify-end">
                          <div className="text-left sm:text-right">
                            <p className="text-[12px] font-bold text-zinc-900 leading-tight">
                              {replTitle || origTitle}
                            </p>
                            {exDetails?.replacementVariant ? (
                              <p className="text-[10px] text-purple-700 font-bold uppercase tracking-wider mt-0.5">
                                Variant: {exDetails.replacementVariant}
                              </p>
                            ) : exDetails ? (
                              <p className="text-[10px] text-zinc-400 italic mt-0.5">
                                Same variant
                              </p>
                            ) : (
                              <p className="text-[10px] text-amber-600 font-medium italic mt-0.5">
                                Replacement details not stored on earlier request
                              </p>
                            )}
                            <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                              Qty: {exDetails?.replacementQuantity || item.quantity}
                            </p>
                          </div>
                          <div className="relative shrink-0 order-first sm:order-last">
                            {replImg ? (
                              <div className="w-12 h-12 relative overflow-hidden bg-zinc-100 border border-purple-200">
                                <Image
                                  src={replImg}
                                  alt={replTitle || origTitle}
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 bg-zinc-100 border border-purple-200 flex items-center justify-center">
                                <Package className="w-6 h-6 text-zinc-300" />
                              </div>
                            )}
                            <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-xs uppercase tracking-tighter">
                              New Item
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Return request item view
                return (
                  <div
                    key={idx}
                    className="p-3.5 border border-zinc-100 bg-zinc-50/50 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      {origImg ? (
                        <div className="w-12 h-12 relative overflow-hidden bg-white border border-zinc-200 shrink-0">
                          <Image
                            src={origImg}
                            alt={origTitle}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-white border border-zinc-200 flex items-center justify-center shrink-0">
                          <Package className="w-6 h-6 text-zinc-300" />
                        </div>
                      )}
                      <div>
                        <p className="text-[12px] font-bold text-zinc-900">
                          {origTitle}
                        </p>
                        {item.variant && (
                          <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mt-0.5">
                            {item.variant}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] font-mono font-bold text-zinc-900">
                        Qty: {item.quantity}
                      </p>
                      {item.price > 0 && (
                        <p className="text-[10px] text-zinc-400 font-mono">
                          ৳{item.price.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer Attachments */}
          {returnRequest.attachments && returnRequest.attachments.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-2">
                <ImageIcon size={12} /> Customer Attachments (
                {returnRequest.attachments.length})
              </p>
              <div className="flex flex-wrap gap-3">
                {returnRequest.attachments.map((att, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedMedia(att)}
                    className="relative w-20 h-20 bg-zinc-100 border border-zinc-200 cursor-pointer overflow-hidden group"
                  >
                    {att.type === "video" ? (
                      <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 bg-zinc-900">
                        <Video size={20} className="text-white" />
                        <span className="text-[8px] font-bold uppercase text-white/70 mt-1">
                          Video
                        </span>
                      </div>
                    ) : (
                      <Image
                        src={att.url}
                        alt="Attachment"
                        fill
                        sizes="80px"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Eye size={14} className="text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Admin Action Buttons */}
          <div className="pt-4 border-t border-zinc-100 space-y-3">
            {isNoteOpen && (
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Optional admin note or reason for customer..."
                rows={2}
                className="w-full p-3 border border-zinc-200 bg-zinc-50 text-[12px] text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-black resize-none"
              />
            )}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsNoteOpen(!isNoteOpen)}
                className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-zinc-700"
              >
                {isNoteOpen ? "- Hide Admin Note" : "+ Add Admin Note"}
              </button>

              <div className="flex items-center gap-3">
                {returnRequest.status !== "rejected" && (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleStatusUpdate("rejected")}
                    className="px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isPending ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <XCircle size={12} />
                    )}
                    Reject Request
                  </button>
                )}

                {returnRequest.status === "requested" && (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleStatusUpdate("approved")}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-xs"
                  >
                    {isPending ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={12} />
                    )}
                    Approve & Accept {isExchange ? "Exchange" : "Return"}
                  </button>
                )}

                {returnRequest.status === "approved" && (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleStatusUpdate("received")}
                    className="px-5 py-2 bg-black hover:bg-zinc-800 text-white text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-xs"
                  >
                    {isPending ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Check size={12} />
                    )}
                    Mark as Received & Completed
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Media Lightbox Modal */}
      {selectedMedia && (
        <div
          onClick={() => setSelectedMedia(null)}
          className="fixed inset-0 z-[999] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full max-h-[85vh] flex items-center justify-center bg-black overflow-hidden"
          >
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/60 text-white flex items-center justify-center rounded-full hover:bg-white hover:text-black transition-colors text-xs font-bold"
            >
              ✕
            </button>
            {selectedMedia.type === "video" ? (
              <video
                src={selectedMedia.url}
                controls
                autoPlay
                className="max-h-[80vh] w-full"
              />
            ) : (
              <img
                src={selectedMedia.url}
                alt="Attachment Preview"
                className="max-h-[80vh] max-w-full object-contain"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
