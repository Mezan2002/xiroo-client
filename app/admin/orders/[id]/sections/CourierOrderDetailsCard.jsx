"use client";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useOrders } from "@/hooks/api/useOrders";
import {
  RefreshCw, Loader2, Package, Truck, MapPin, Phone,
  DollarSign, Clock, ChevronDown, ChevronUp, Hash, Weight,
  User, FileText, Calendar,
} from "lucide-react";

const Row = ({ label, value, icon: Icon, mono, accent }) => (
  <div className="flex justify-between items-center text-[10px] py-1.5">
    <div className="flex items-center gap-1.5">
      {Icon && <Icon size={10} className="text-zinc-400" strokeWidth={1.5} />}
      <span className="text-zinc-400 font-bold uppercase tracking-widest">{label}</span>
    </div>
    <span className={`font-bold ${mono ? "font-mono" : ""} ${accent ? "text-emerald-600" : "text-zinc-900"}`}>
      {value || "N/A"}
    </span>
  </div>
);

export default function CourierOrderDetailsCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const queryClient = useQueryClient();
  const { useCourierDetails } = useOrders();
  const { data: response, isLoading, refetch } = useCourierDetails(order?._id, {
    enabled: false,
  });

  const courierData = response?.data;
  const provider = order?.deliveryInfo?.provider;
  const isSupported = provider === "carrybee" || provider === "steadfast";
  const hasTrackingId = !!order?.deliveryInfo?.trackingId;
  const hasCharge = (order?.deliveryInfo?.deliveryCharge || 0) > 0;

  // Auto-fetch on mount if dispatched and no delivery charge yet
  useEffect(() => {
    if (hasTrackingId && isSupported && !hasCharge && order?._id) {
      const timer = setTimeout(() => {
        refetch();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [order?._id, hasTrackingId, isSupported, hasCharge]);

  // When courier data is fetched, invalidate order query to refresh delivery charge
  useEffect(() => {
    if (courierData && courierData.deliveryFee > 0) {
      queryClient.invalidateQueries({ queryKey: ["order", order?._id] });
    }
  }, [courierData, order?._id]);

  if (!hasTrackingId || !isSupported) return null;

  const handleFetch = () => {
    refetch();
  };

  return (
    <div className="bg-white border border-zinc-200 overflow-hidden">
      <div className="px-5 py-3.5 border-b border-zinc-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Truck size={14} className="text-zinc-400" strokeWidth={1.5} />
          <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.15em]">
            Courier Details
          </h3>
          <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-200">
            {provider}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleFetch}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-2.5 py-1 border border-zinc-200 text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:border-blue-400 hover:text-blue-600 transition-colors disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={9} className="animate-spin" /> : <RefreshCw size={9} />}
            {isLoading ? "Loading..." : "Refresh"}
          </button>
          {courierData && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
        </div>
      </div>

      <div className="p-5">
        {!courierData ? (
          <div className="text-center py-6">
            {isLoading ? (
              <>
                <Loader2 size={20} className="mx-auto text-blue-400 mb-2 animate-spin" strokeWidth={1.5} />
                <p className="text-[10px] text-zinc-400 font-medium">
                  Fetching live data from {provider}...
                </p>
              </>
            ) : (
              <>
                <Truck size={20} className="mx-auto text-zinc-200 mb-2" strokeWidth={1.5} />
                <p className="text-[10px] text-zinc-400 font-medium">
                  Click "Refresh" to get live data from {provider}
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {/* Core Info */}
            <div className="p-3 bg-zinc-50 border border-zinc-100 space-y-1">
              <Row label="Status" value={courierData.status} icon={Clock} />
              <Row label="Consignment ID" value={courierData.consignmentId} icon={Hash} mono />
              {courierData.trackingCode && (
                <Row label="Tracking Code" value={courierData.trackingCode} icon={Hash} mono />
              )}
              {courierData.invoice && (
                <Row label="Invoice" value={courierData.invoice} icon={FileText} mono />
              )}
            </div>

            {/* Financial - Always visible */}
            <div className="p-3 bg-zinc-50 border border-zinc-100 space-y-1">
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Financial</p>
              {provider === "carrybee" && (
                <>
                  <Row label="Delivery Fee" value={courierData.deliveryFee ? `\u09F3${courierData.deliveryFee}` : null} icon={DollarSign} accent />
                  <Row label="Collectable" value={courierData.collectableAmount ? `\u09F3${courierData.collectableAmount}` : null} icon={DollarSign} mono />
                  <Row label="Collected" value={courierData.collectedAmount ? `\u09F3${courierData.collectedAmount}` : null} icon={DollarSign} mono />
                  <Row label="COD" value={courierData.codAmount ? `\u09F3${courierData.codAmount}` : null} icon={DollarSign} mono />
                </>
              )}
              {provider === "steadfast" && (
                <>
                  <Row label="Delivery Charge" value={courierData.deliveryCharge ? `\u09F3${courierData.deliveryCharge}` : null} icon={DollarSign} accent />
                  <Row label="COD Amount" value={courierData.codAmount ? `\u09F3${courierData.codAmount}` : null} icon={DollarSign} mono />
                </>
              )}
            </div>

            {/* Expanded Details */}
            {expanded && (
              <div className="space-y-3 animate-in fade-in duration-200">
                {/* Recipient Info */}
                <div className="p-3 bg-zinc-50 border border-zinc-100 space-y-1">
                  <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Recipient</p>
                  <Row label="Name" value={courierData.recipientName} icon={User} />
                  <Row label="Phone" value={courierData.recipientPhone} icon={Phone} mono />
                  <Row label="Address" value={courierData.recipientAddress} icon={MapPin} />
                </div>

                {/* Package Info */}
                {provider === "carrybee" && (
                  <div className="p-3 bg-zinc-50 border border-zinc-100 space-y-1">
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Package</p>
                    <Row label="Weight" value={courierData.itemWeight ? `${courierData.itemWeight}g` : null} icon={Weight} />
                    <Row label="Quantity" value={courierData.itemQuantity} icon={Package} />
                    <Row label="Delivery Type" value={courierData.deliveryType === 1 ? "Normal" : courierData.deliveryType === 2 ? "Express" : courierData.deliveryType} icon={Truck} />
                    <Row label="Product Type" value={courierData.productType === 1 ? "Parcel" : courierData.productType === 2 ? "Book" : courierData.productType === 3 ? "Document" : courierData.productType} icon={Package} />
                  </div>
                )}

                {/* Description */}
                {(courierData.specialInstruction || courierData.productDescription || courierData.note) && (
                  <div className="p-3 bg-zinc-50 border border-zinc-100 space-y-1">
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Description</p>
                    {courierData.specialInstruction && (
                      <Row label="Instruction" value={courierData.specialInstruction} icon={FileText} />
                    )}
                    {courierData.productDescription && (
                      <Row label="Product" value={courierData.productDescription} icon={Package} />
                    )}
                    {courierData.note && (
                      <Row label="Note" value={courierData.note} icon={FileText} />
                    )}
                  </div>
                )}

                {/* Tracking History */}
                {courierData.trackingHistory?.length > 0 && (
                  <div className="p-3 bg-zinc-50 border border-zinc-100">
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Tracking History</p>
                    <div className="space-y-2">
                      {courierData.trackingHistory.slice(-5).reverse().map((event, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-[10px]">
                          <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 mt-1.5 shrink-0" />
                          <div>
                            <p className="text-zinc-700 font-bold">{event.status || event.event || "Update"}</p>
                            {event.timestamp && (
                              <p className="text-zinc-400 font-mono text-[9px]">
                                {new Date(event.timestamp).toLocaleString()}
                              </p>
                            )}
                            {event.message && (
                              <p className="text-zinc-500 text-[9px] mt-0.5">{event.message}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="p-3 bg-zinc-50 border border-zinc-100 space-y-1">
                  <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Timestamps</p>
                  <Row label="Created" value={courierData.createdAt ? new Date(courierData.createdAt).toLocaleString() : null} icon={Calendar} />
                  <Row label="Updated" value={courierData.updatedAt ? new Date(courierData.updatedAt).toLocaleString() : null} icon={Calendar} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
