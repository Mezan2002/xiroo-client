"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Search, Package, Clock, Truck, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { useOrders } from "@/hooks/api/useOrders";
import { useStoreSettings } from "@/hooks/api/useStoreSettings";
import Image from "next/image";
import Link from "next/link";

export default function TrackOrderPage() {
  const [orderIdInput, setOrderIdInput] = useState("");
  const [searchId, setSearchId] = useState("");
  const { settings: storeSettings } = useStoreSettings();
  const whatsapp = storeSettings?.contact?.whatsapp || "8801XXXXXXXXX";
  const supportEmail = storeSettings?.contact?.supportEmail || "support@xiroo.shop";

  const { useOrderDetail } = useOrders();
  const { data: order, isLoading, error } = useOrderDetail(searchId, {
    enabled: !!searchId,
    retry: false,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (!orderIdInput.trim()) return;
    setSearchId(orderIdInput.trim());
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "processing":
        return <Package className="w-5 h-5 text-blue-500" />;
      case "given-for-design":
      case "ready-to-pack":
      case "packed-for-delivery":
        return <Package className="w-5 h-5 text-amber-500" />;
      case "shipped":
      case "at-last-hub":
      case "assigned-for-delivery":
        return <Truck className="w-5 h-5 text-blue-500" />;
      case "delivered":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "partially-delivered":
        return <CheckCircle2 className="w-5 h-5 text-teal-500" />;
      case "returned":
      case "return-received":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "on-hold":
        return <Clock className="w-5 h-5 text-amber-500" />;
      case "cancelled":
      case "failed":
      case "refused":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Order Received";
      case "processing":
        return "Processing";
      case "given-for-design":
        return "Given for Design";
      case "ready-to-pack":
        return "Ready to Pack";
      case "packed-for-delivery":
        return "Packed for Delivery";
      case "shipped":
        return "Shipped";
      case "at-last-hub":
        return "At Delivery Hub";
      case "assigned-for-delivery":
        return "Out for Delivery";
      case "delivered":
        return "Delivered";
      case "partially-delivered":
        return "Partially Delivered";
      case "returned":
        return "Returned";
      case "return-received":
        return "Return Received";
      case "on-hold":
        return "On Hold";
      case "cancelled":
        return "Cancelled";
      case "failed":
        return "Failed";
      case "refused":
        return "Refused";
      default:
        return status;
    }
  };

  // Customer-friendly status flow (simplified)
  const statuses = ["pending", "processing", "shipped", "delivered"];
  const currentStatusIndex = order ? statuses.indexOf(order.status) : -1;

  return (
    <div className="min-h-screen bg-[#fafafa] pt-32 pb-24 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tighter uppercase text-black">
            Track Your Order
          </h1>
          <p className="text-xs font-medium tracking-widest text-gray-400 uppercase">
            Enter your Order ID to see real-time updates
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="relative group">
          <input
            type="text"
            placeholder="Enter Order ID (e.g. 64abc123...)"
            value={orderIdInput}
            onChange={(e) => setOrderIdInput(e.target.value)}
            className="w-full h-14 pl-6 pr-32 bg-white border border-gray-200 text-sm tracking-wide shadow-sm focus:border-black focus:ring-1 focus:ring-black transition-all outline-none"
            required
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="absolute right-1 top-1 h-12 px-6 bg-black text-white hover:bg-zinc-800 text-[10px] tracking-widest font-bold uppercase rounded-none transition-colors"
          >
            {isLoading ? "Searching..." : "Track"}
          </Button>
        </form>

        {/* Error State */}
        {error && searchId && (
          <div className="p-6 bg-white border border-red-100 flex flex-col items-center justify-center text-center space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <div>
              <h3 className="text-sm font-bold text-black uppercase tracking-widest">Order Not Found</h3>
              <p className="text-xs text-gray-500 mt-1">Please check the ID and try again.</p>
            </div>
          </div>
        )}

        {/* Result State */}
        {order && (
          <div className="bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-gray-100">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">
                  Order ID
                </p>
                <p className="text-sm font-bold text-black tracking-widest select-all">
                  {order.orderId || order._id}
                </p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">
                  Placed On
                </p>
                <p className="text-sm font-bold text-black uppercase tracking-wider">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="py-12 relative w-full">
              <div className="flex flex-col sm:flex-row justify-between relative z-10 gap-8 sm:gap-0">
                {statuses.map((status, index) => {
                  const isActive = index <= currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;
                  
                  return (
                    <div key={status} className="flex sm:flex-col items-center sm:justify-center gap-4 sm:gap-4 flex-1 relative">
                      {/* Connecting Line (Only for non-last items) */}
                      {index < statuses.length - 1 && (
                        <div className="hidden sm:block absolute top-5 left-[50%] right-[-50%] h-[2px] bg-gray-100 z-[-1]">
                          <div 
                            className="h-full bg-black transition-all duration-1000 ease-in-out" 
                            style={{ width: currentStatusIndex > index ? "100%" : "0%" }}
                          />
                        </div>
                      )}

                      {/* Icon Circle */}
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center bg-white border-2 transition-all duration-500 z-10 ${
                          isActive ? "border-black shadow-md scale-110" : "border-gray-200"
                        }`}
                      >
                        {isActive ? (
                          <div className="text-black">
                            {getStatusIcon(status)}
                          </div>
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-gray-200" />
                        )}
                      </div>

                      {/* Status Text */}
                      <div className="text-left sm:text-center sm:absolute sm:top-14 sm:w-32">
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${
                          isActive ? "text-black" : "text-gray-400"
                        }`}>
                          {getStatusText(status)}
                        </p>
                        {isCurrent && order.dispatchInfo?.trackingId && status === "shipped" && (
                          <p className="text-[9px] font-medium text-gray-500 mt-1 uppercase">
                            ID: {order.dispatchInfo.trackingId}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Items Summary */}
            <div className="pt-6 border-t border-gray-100 space-y-4">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Order Items ({order.items?.length || 0})
              </h3>
              <div className="space-y-4">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 border border-gray-100 relative shrink-0">
                      {item.product?.images?.[0] && (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.title || "Product"}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      {item.product?._id ? (
                        <Link 
                          href={`/product/${item.product._id}`}
                          className="text-[11px] font-bold text-black uppercase tracking-wider truncate block hover:underline underline-offset-4"
                        >
                          {item.product.title || "Product"}
                        </Link>
                      ) : (
                        <p className="text-[11px] font-bold text-black uppercase tracking-wider truncate">
                          {item.product?.title || "Product"}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium uppercase mt-0.5">
                        <span>Qty: {item.quantity}</span>
                        {item.variant && item.variant !== "Standard" && (
                          <>
                            <span>•</span>
                            <span>{item.variant}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-xs font-bold text-black tracking-widest">
                      ৳{item.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financials */}
            <div className="pt-6 mt-6 border-t border-gray-100 flex justify-between items-center">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Total Amount
              </div>
              <div className="text-xl font-bold text-black tracking-tighter">
                ৳{order.totalPrice}
              </div>
            </div>

            {/* Advance Payment Notice */}
            {order.advancePayment?.required && order.advancePayment?.status === "pending" && (
              <div className="mt-6 p-6 bg-amber-50 border border-amber-200 space-y-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <h3 className="text-[13px] font-bold text-amber-800 uppercase tracking-wider">
                      Advance Payment Required
                    </h3>
                    <p className="text-[12px] text-amber-700 leading-relaxed">
                      Your order requires an advance payment of <strong className="text-amber-900">৳{order.advancePayment.amount?.toLocaleString()}</strong> before processing.
                    </p>
                    {order.advancePayment.reason && (
                      <p className="text-[11px] text-amber-600">
                        Reason: {order.advancePayment.reason}
                      </p>
                    )}
                  </div>
                </div>
                <div className="bg-white border border-amber-100 p-4 space-y-3">
                  <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">How to Pay</p>
                  <ol className="space-y-2 text-[11px] text-amber-700">
                    <li className="flex gap-2">
                      <span className="shrink-0 w-4 h-4 bg-amber-600 text-white text-[9px] font-bold flex items-center justify-center">1</span>
                      <span>Transfer <strong>৳{order.advancePayment.amount}</strong> via bKash / Nagad</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="shrink-0 w-4 h-4 bg-amber-600 text-white text-[9px] font-bold flex items-center justify-center">2</span>
                      <span>Send screenshot to WhatsApp or email with this Order ID</span>
                    </li>
                  </ol>
                </div>
                <div className="flex gap-3">
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2.5 bg-[#25D366] hover:bg-[#128C7E] text-white text-[10px] font-bold uppercase tracking-wider text-center transition-colors"
                  >
                    Pay via WhatsApp
                  </a>
                  <a
                    href={`mailto:${supportEmail}?subject=Advance Payment - Order ${order.orderId}`}
                    className="flex-1 px-4 py-2.5 border border-amber-300 hover:bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider text-center transition-colors"
                  >
                    Pay via Email
                  </a>
                </div>
              </div>
            )}

            {order.advancePayment?.required && order.advancePayment?.status === "paid" && (
              <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-[12px] font-bold text-emerald-800">Advance Payment Confirmed</p>
                  <p className="text-[11px] text-emerald-600">Your order is now being processed.</p>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
