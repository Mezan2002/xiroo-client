"use client";

import { Button } from "@/components/ui/Button";
import { useOrders } from "@/hooks/api/useOrders";
import axiosInstance from "@/lib/axios";
import {
  AlertCircle,
  ArrowRightLeft,
  Check,
  ChevronLeft,
  Package,
  RotateCcw,
  Search,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ReasonForm from "./sections/ReasonForm";
import ReturnItemSelector from "./sections/ReturnItemSelector";
import ExchangeItemSelector from "./sections/ExchangeItemSelector";

const STATUS_LABELS = {
  pending: "Pending",
  processing: "Processing",
  "given-for-design": "Given for Design",
  "ready-to-pack": "Ready to Pack",
  "packed-for-delivery": "Packed for Delivery",
  shipped: "Shipped",
  "at-last-hub": "At Last Hub",
  "assigned-for-delivery": "Out for Delivery",
  delivered: "Delivered",
  returned: "Returned",
  "return-received": "Return Received",
  "on-hold": "On Hold",
  cancelled: "Cancelled",
  failed: "Failed",
  refused: "Refused",
};

const STATUS_STYLES = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  "given-for-design": "bg-purple-50 text-purple-700 border-purple-200",
  "ready-to-pack": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "packed-for-delivery": "bg-sky-50 text-sky-700 border-sky-200",
  shipped: "bg-blue-50 text-blue-700 border-blue-200",
  "at-last-hub": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "assigned-for-delivery": "bg-teal-50 text-teal-700 border-teal-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  returned: "bg-rose-50 text-rose-700 border-rose-200",
  "return-received": "bg-pink-50 text-pink-700 border-pink-200",
  "on-hold": "bg-amber-50 text-amber-700 border-amber-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  failed: "bg-red-50 text-red-700 border-red-200",
  refused: "bg-red-50 text-red-700 border-red-200",
};

export default function ReturnExchangePage() {
  const { requestReturnExchange } = useOrders();
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [orderFound, setOrderFound] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [lookupError, setLookupError] = useState("");
  const [isLookingUp, setIsLookingUp] = useState(false);

  const [requestType, setRequestType] = useState("return");
  const [selectedItems, setSelectedItems] = useState([]);
  // Exchange-specific: [{key, orderItem, wantSameProduct, replacementProduct, selectedVariants, originalQuantity, replacementQuantity}]
  const [exchangeSelections, setExchangeSelections] = useState([]);
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const handleLookup = async () => {
    if (!orderId || !phone) return;
    setLookupError("");
    setIsLookingUp(true);

    try {
      // Clean the order ID - remove # prefix and whitespace
      const cleanOrderId = orderId.replace(/^#/, "").trim();
      const cleanPhone = phone.trim();

      const response = await axiosInstance.get(
        `/orders/${cleanOrderId}?phone=${encodeURIComponent(cleanPhone)}`,
      );
      const order = response.data?.data || response.data;

      if (order && order._id) {
        // Verify phone matches
        const orderPhone =
          order.guestInfo?.phone ||
          order.user?.phoneNumber ||
          order.user?.phone;
        const normalizePhone = (p) =>
          p ? p.replace(/[^0-9]/g, "").slice(-10) : "";

        const normOrderPhone = normalizePhone(orderPhone);
        const normInputPhone = normalizePhone(cleanPhone);

        if (
          normOrderPhone &&
          normInputPhone &&
          normOrderPhone === normInputPhone
        ) {
          setOrderData(order);
          setOrderFound(true);
        } else if (!normOrderPhone) {
          // No phone stored on order, allow access
          setOrderData(order);
          setOrderFound(true);
        } else {
          setLookupError("Phone number does not match our records.");
        }
      } else {
        setLookupError("Order not found. Please check your Order ID.");
      }
    } catch (error) {
      console.error("Lookup error:", error);
      if (error.response?.status === 403) {
        setLookupError("Phone number does not match our records.");
      } else if (error.response?.status === 404) {
        setLookupError("Order not found. Please check your Order ID.");
      } else {
        setLookupError(
          error.response?.data?.message ||
            "Order not found. Please check your Order ID.",
        );
      }
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleSubmit = async () => {
    const isExchange = requestType === "exchange";
    if (!reason || !orderData) return;
    if (!isExchange && selectedItems.length === 0) return;
    if (isExchange && exchangeSelections.length === 0) return;

    try {
      let items;
      if (isExchange) {
        items = exchangeSelections.map((sel) => {
          const variantStr =
            Object.values(sel.selectedVariants || {}).filter(Boolean).join(" / ") ||
            undefined;
          const origProdId =
            typeof sel.orderItem?.product === "object"
              ? sel.orderItem?.product?._id
              : sel.orderItem?.product;
          const replProdId = sel.replacementProduct
            ? typeof sel.replacementProduct === "object"
              ? sel.replacementProduct?._id
              : sel.replacementProduct
            : origProdId;

          return {
            originalProduct: origProdId,
            originalVariant: sel.orderItem?.variant || undefined,
            originalQuantity: sel.originalQuantity || 1,
            replacementProduct: replProdId,
            replacementVariant: variantStr,
            replacementQuantity: sel.replacementQuantity || 1,
          };
        });
      } else {
        items = selectedItems.map((si) => ({
          product:
            typeof si.product === "object" ? si.product?._id : si.product,
          variant: si.variant || undefined,
          quantity: si.quantity,
          price: si.price,
        }));
      }

      await requestReturnExchange.mutateAsync({
        orderId: orderData._id,
        type: requestType,
        reason,
        items,
        note: note || undefined,
        attachments: attachments.map((att) => ({
          url: att.url,
          type: att.type || "image",
        })),
        guestPhone: phone || undefined,
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Return/Exchange request failed:", error);
    }
  };

  const isDelivered = orderData?.status === "delivered";
  const hasExistingRequest =
    orderData?.returnRequest && orderData.returnRequest.status !== "rejected";

  if (submitted) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-6 py-24 text-center animate-in fade-in duration-500">
          <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-montserrat font-semibold mb-2">
            Request Submitted
          </h1>
          <p className="text-[13px] text-gray-500 mb-8">
            Your {requestType === "return" ? "return" : "exchange"} request has
            been received. We&apos;ll review it and get back to you soon.
          </p>
          <Link href="/">
            <Button
              variant="outline"
              className="text-[10px] px-8 tracking-[0.2em] h-12"
            >
              BACK TO HOME
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Link
          href="/"
          className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors mb-8"
        >
          <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="mb-10">
          <h1 className="text-2xl font-montserrat uppercase font-semibold">
            Return or Exchange Request
          </h1>
          <p className="text-xs text-gray-400 mt-1 uppercase">
            Enter your order details to get started
          </p>
        </div>

        {!orderFound ? (
          <div className="space-y-6">
            <div className="p-6 border border-gray-200 bg-gray-50/50">
              <div className="flex items-center gap-3 mb-6">
                <Search className="w-4 h-4 text-gray-400" />
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  Find Your Order
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                    Order ID *
                  </label>
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="e.g., XR-CILJ6H"
                    className="w-full px-4 py-3 border border-gray-200 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g., 01727309292"
                    className="w-full px-4 py-3 border border-gray-200 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 bg-white"
                  />
                </div>

                <p className="text-[10px] text-gray-400">
                  Provide the phone number used during checkout
                </p>

                {lookupError && (
                  <div className="p-3 border border-red-200 bg-red-50 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <p className="text-[11px] text-red-600">{lookupError}</p>
                  </div>
                )}

                <Button
                  onClick={handleLookup}
                  disabled={!orderId || !phone || isLookingUp}
                  className="w-full text-[10px] px-6 tracking-[0.2em] h-12 bg-black text-white disabled:bg-gray-200 disabled:text-gray-400"
                >
                  {isLookingUp ? "SEARCHING..." : "FIND ORDER"}
                </Button>
              </div>
            </div>
          </div>
        ) : !isDelivered ? (
          <div className="py-16 text-center border border-gray-200 bg-gray-50/50">
            <Package className="w-10 h-10 text-gray-400 mx-auto mb-4" />
            <p className="text-[13px] font-bold text-gray-700">
              Return/Exchange requests can only be made for delivered orders.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="text-[11px] text-gray-500 font-medium">
                Current status:
              </span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wider border ${STATUS_STYLES[orderData.status] || "bg-gray-100 text-gray-700 border-gray-200"}`}
              >
                {STATUS_LABELS[orderData.status] ||
                  orderData.status?.replace(/-/g, " ")}
              </span>
            </div>
            <Button
              onClick={() => {
                setOrderFound(false);
                setOrderData(null);
                setOrderId("");
                setPhone("");
              }}
              variant="outline"
              className="mt-6 text-[10px] px-6 tracking-[0.2em] h-10"
            >
              TRY ANOTHER ORDER
            </Button>
          </div>
        ) : hasExistingRequest ? (
          <div className="py-16 text-center border border-gray-200 bg-gray-50/50">
            <Package className="w-10 h-10 text-gray-400 mx-auto mb-4" />
            <p className="text-[13px] font-bold text-gray-700">
              A return/exchange request already exists for this order.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="text-[11px] text-gray-500 font-medium">
                Request status:
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wider bg-amber-50 text-amber-700 border border-amber-200 capitalize">
                {orderData.returnRequest.status}
              </span>
            </div>
            <Button
              onClick={() => {
                setOrderFound(false);
                setOrderData(null);
                setOrderId("");
                setPhone("");
              }}
              variant="outline"
              className="mt-6 text-[10px] px-6 tracking-[0.2em] h-10"
            >
              TRY ANOTHER ORDER
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Rejection Notice — shown when previous request was rejected */}
            {orderData?.returnRequest?.status === "rejected" && (
              <div className="p-4 border border-red-200 bg-red-50 flex gap-3">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[12px] font-bold text-red-700 mb-1">
                    Previous Request Rejected
                  </p>
                  <p className="text-[11px] text-red-600 leading-relaxed">
                    Your previous {orderData.returnRequest.type} request was
                    rejected
                    {orderData.returnRequest.adminNote
                      ? ` — "${orderData.returnRequest.adminNote}"`
                      : "."}{" "}
                    You may submit a new request below.
                  </p>
                </div>
              </div>
            )}

            {/* Order Info */}
            <div className="p-4 border border-gray-200 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                    Order
                  </p>
                  <p className="text-[13px] font-bold font-mono">
                    {orderData.orderId}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                    Delivered On
                  </p>
                  <p className="text-[13px] font-bold">
                    {new Date(
                      orderData.updatedAt || orderData.createdAt,
                    ).toLocaleDateString("en-BD", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Request Type Selection */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setRequestType("return")}
                className={`p-6 border text-left transition-all ${
                  requestType === "return"
                    ? "border-black bg-black text-white"
                    : "border-gray-200 bg-white text-gray-500 hover:border-gray-400"
                }`}
              >
                <RotateCcw
                  className={`w-5 h-5 mb-3 ${requestType === "return" ? "text-white" : "text-gray-400"}`}
                />
                <p className="text-[11px] font-bold uppercase tracking-widest">
                  Return Item
                </p>
                <p
                  className={`text-[10px] mt-1 ${requestType === "return" ? "text-white/70" : "text-gray-400"}`}
                >
                  Return for a refund
                </p>
              </button>
              <button
                onClick={() => setRequestType("exchange")}
                className={`p-6 border text-left transition-all ${
                  requestType === "exchange"
                    ? "border-black bg-black text-white"
                    : "border-gray-200 bg-white text-gray-500 hover:border-gray-400"
                }`}
              >
                <ArrowRightLeft
                  className={`w-5 h-5 mb-3 ${requestType === "exchange" ? "text-white" : "text-gray-400"}`}
                />
                <p className="text-[11px] font-bold uppercase tracking-widest">
                  Exchange Item
                </p>
                <p
                  className={`text-[10px] mt-1 ${requestType === "exchange" ? "text-white/70" : "text-gray-400"}`}
                >
                  Exchange for a different item
                </p>
              </button>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 flex items-center justify-center text-[10px] font-bold ${step >= 1 ? "bg-black text-white" : "bg-gray-100 text-gray-400"}`}
              >
                1
              </div>
              <div
                className={`flex-1 h-px ${step >= 2 ? "bg-black" : "bg-gray-100"}`}
              />
              <div
                className={`w-6 h-6 flex items-center justify-center text-[10px] font-bold ${step >= 2 ? "bg-black text-white" : "bg-gray-100 text-gray-400"}`}
              >
                2
              </div>
            </div>

            {/* Step 1: Select Items */}
            {step === 1 && requestType === "return" && (
              <ReturnItemSelector
                items={orderData.items}
                selectedItems={selectedItems}
                onSelectItems={setSelectedItems}
                requestType={requestType}
              />
            )}

            {step === 1 && requestType === "exchange" && (
              <ExchangeItemSelector
                orderItems={orderData.items}
                exchangeSelections={exchangeSelections}
                onExchangeSelectionsChange={setExchangeSelections}
              />
            )}

            {/* Step 2: Reason */}
            {step === 2 && (
              <ReasonForm
                reason={reason}
                onReasonChange={setReason}
                note={note}
                onNoteChange={setNote}
                requestType={requestType}
                attachments={attachments}
                onAttachmentsChange={setAttachments}
              />
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => (step === 1 ? setOrderFound(false) : setStep(1))}
                className="text-[10px] px-6 tracking-[0.2em] h-10"
              >
                {step === 1 ? "BACK" : "PREVIOUS"}
              </Button>
              {step === 1 ? (
                <Button
                  onClick={() => setStep(2)}
                  disabled={
                    requestType === "exchange"
                      ? exchangeSelections.length === 0
                      : selectedItems.length === 0
                  }
                  className="text-[10px] px-6 tracking-[0.2em] h-10 bg-black text-white disabled:bg-gray-200 disabled:text-gray-400"
                >
                  CONTINUE
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!reason || requestReturnExchange.isPending}
                  className="text-[10px] px-6 tracking-[0.2em] h-10 bg-black text-white disabled:bg-gray-200 disabled:text-gray-400"
                >
                  {requestReturnExchange.isPending
                    ? "SUBMITTING..."
                    : "SUBMIT REQUEST"}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
