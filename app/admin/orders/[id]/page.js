"use client";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { Loader2, FileX, ArrowLeft, DollarSign, MapPin, Truck, Package, Pencil, X, Check } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import CourierLogisticsCard from "./sections/CourierLogisticsCard";
import CustomerIdentityCard from "./sections/CustomerIdentityCard";
import EventHistoryCard from "./sections/EventHistoryCard";
import CustomerHistoryCard from "./sections/CustomerHistoryCard";
import FraudBDCheckCard from "./sections/FraudBDCheckCard";
import AdvancePaymentCard from "./sections/AdvancePaymentCard";
import RequestAdvancePaymentModal from "./sections/RequestAdvancePaymentModal";
import OrderHeader from "./sections/OrderHeader";
import { useOrderManagement } from "./sections/useOrderManagement";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const {
    order, loading, isError, isCancelModalOpen, setIsCancelModalOpen,
    isAdvancePaymentModalOpen, setIsAdvancePaymentModalOpen,
    advancePaymentAmount, setAdvancePaymentAmount,
    advancePaymentReason, setAdvancePaymentReason,
    selectedCourier, setSelectedCourier, manualTrackingId, setManualTrackingId,
    selectedCityId, setSelectedCityId, selectedZoneId, setSelectedZoneId,
    carrybeeWeight, setCarrybeeWeight,
    carrybeeCodAmount, setCarrybeeCodAmount,
    carrybeeProductType, setCarrybeeProductType,
    carrybeeDeliveryType, setCarrybeeDeliveryType,
    handleStatusChange, handleConfirmCancellation, handleCourierDispatch,
    handleRequestAdvancePayment, handleConfirmAdvancePayment, handleWaiveAdvancePayment,
    isUpdatingStatus, isCancelling, isDispatching,
    isRequestingAdvancePayment, isConfirmingAdvancePayment, isWaivingAdvancePayment,
    isEditingPrices, setIsEditingPrices, editedItems, editedShippingFee, setEditedShippingFee,
    handleEditedItemChange, handlePriceOverrideSave, handleCancelPriceEdit, isSavingPrices,
  } = useOrderManagement(id);

  if (loading) {
    return (
      <div className="h-[600px] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-300" strokeWidth={1.5} />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-[500px] flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center space-y-5">
          <div className="w-12 h-12 bg-zinc-100 flex items-center justify-center mx-auto">
            <FileX className="w-6 h-6 text-zinc-400" strokeWidth={1.5} />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-[14px] font-bold text-zinc-900">Order not found</h2>
            <p className="text-[12px] text-zinc-400">This order may have been deleted.</p>
          </div>
          <Link href="/admin/orders" className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-black text-white text-[10px] font-bold uppercase tracking-[0.15em] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const phone = order.guestInfo?.phone || order.user?.phoneNumber;
  const totalQty = order.items.reduce((s, i) => s + i.quantity, 0);
  const canEditPrices = ["pending", "processing", "on-hold"].includes(order.status);

  const rawSubtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const delivery = order.shippingFee !== undefined ? order.shippingFee : Math.max(0, order.totalPrice - rawSubtotal);

  // Compute live pricing in edit mode
  const editedRawSubtotal = editedItems.reduce((acc, item) => acc + (Number(item.price) || 0) * item.quantity, 0);

  const editedBundleGroups = {};
  editedItems.forEach((item) => {
    const itemSubtotal = (Number(item.price) || 0) * item.quantity;
    if (item.bundleId) {
      if (!editedBundleGroups[item.bundleId]) {
        editedBundleGroups[item.bundleId] = { quantity: 0, subtotal: 0 };
      }
      editedBundleGroups[item.bundleId].quantity += item.quantity;
      editedBundleGroups[item.bundleId].subtotal += itemSubtotal;
    }
  });
  let editedBundleDiscount = 0;
  Object.values(editedBundleGroups).forEach((group) => {
    if (group.quantity >= 2) {
      editedBundleDiscount += group.subtotal * 0.10;
    }
  });
  const editedSubtotal = editedRawSubtotal - editedBundleDiscount;
  const editedCouponDiscount = order.discount
    ? order.discount.type === "percentage"
      ? Math.min(editedSubtotal * (order.discount.value / 100), editedSubtotal)
      : order.discount.type === "fixed"
        ? Math.min(order.discount.value, editedSubtotal)
        : 0
    : 0;
  const editedTotal = Math.round((editedSubtotal - editedCouponDiscount + (Number(editedShippingFee) || 0)) * 100) / 100;

  return (
    <div className="max-w-[1200px] mx-auto pb-16 animate-in fade-in duration-300">
      <OrderHeader order={order} isUpdatingStatus={isUpdatingStatus} handleStatusChange={handleStatusChange} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">

        {/* ── Left Column ── */}
        <div className="lg:col-span-7 space-y-5">

          {/* Items */}
          <div className="bg-white border border-zinc-200 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.15em]">Items</h3>
              <div className="flex items-center gap-3">
                {isEditingPrices ? (
                  <>
                    <button
                      onClick={handleCancelPriceEdit}
                      disabled={isSavingPrices}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-200 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:border-zinc-400 hover:text-zinc-600 transition-colors disabled:opacity-50"
                    >
                      <X size={10} /> Cancel
                    </button>
                    <button
                      onClick={handlePriceOverrideSave}
                      disabled={isSavingPrices}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors disabled:opacity-50"
                    >
                      {isSavingPrices ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />}
                      {isSavingPrices ? "Saving..." : "Save Prices"}
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">{totalQty} units</span>
                    {canEditPrices && (
                      <button
                        onClick={() => setIsEditingPrices(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-200 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:border-black hover:text-black transition-colors"
                      >
                        <Pencil size={10} /> Edit Prices
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {isEditingPrices ? (
              <>
                <table className="w-full text-left">
                  <thead className="bg-zinc-50 border-b border-zinc-100">
                    <tr>
                      <th className="px-5 py-2.5 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Product</th>
                      <th className="px-5 py-2.5 text-[9px] font-bold text-zinc-400 uppercase tracking-widest text-center">Qty</th>
                      <th className="px-5 py-2.5 text-[9px] font-bold text-zinc-400 uppercase tracking-widest text-right">Unit Price</th>
                      <th className="px-5 py-2.5 text-[9px] font-bold text-zinc-400 uppercase tracking-widest text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {editedItems.map((item, idx) => {
                      const isOverridden = item.originalPrice && Number(item.price) !== item.originalPrice;
                      return (
                        <tr key={idx} className="hover:bg-zinc-50/50 transition-colors">
                          <td className="px-5 py-3 max-w-[300px]">
                            <div className="flex items-center gap-3">
                              <div className="min-w-0">
                                <p className="text-[12px] font-bold text-zinc-900 truncate">{item.title}</p>
                                {item.variant && item.variant !== "Standard" && (
                                  <p className="text-[10px] text-zinc-400">{item.variant}</p>
                                )}
                                {isOverridden && (
                                  <p className="text-[9px] text-amber-500 font-medium mt-0.5">
                                    orig: ৳{item.originalPrice.toLocaleString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-center text-[12px] font-bold text-zinc-500 font-mono">x{item.quantity}</td>
                          <td className="px-5 py-3 text-right">
                            <input
                              type="number"
                              min="0"
                              step="1"
                              value={item.price}
                              onChange={(e) => handleEditedItemChange(idx, "price", parseFloat(e.target.value) || 0)}
                              className={`w-24 bg-transparent border-b text-right text-[12px] font-bold py-1 outline-none font-mono ${
                                isOverridden
                                  ? "border-amber-300 text-amber-600"
                                  : "border-zinc-200 text-zinc-900 focus:border-black"
                              }`}
                            />
                          </td>
                          <td className="px-5 py-3 text-right text-[12px] font-black text-zinc-900 font-mono">
                            ৳{((Number(item.price) || 0) * item.quantity).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Editable Pricing Summary */}
                <div className="px-5 py-4 bg-zinc-50 border-t border-zinc-100 space-y-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-zinc-400 font-medium">Subtotal</span>
                    <span className="text-zinc-700 font-bold font-mono">৳{editedRawSubtotal.toLocaleString()}</span>
                  </div>
                  {editedBundleDiscount > 0 && (
                    <div className="flex justify-between text-[11px] text-green-600">
                      <span className="font-medium">Bundle Discount (10%)</span>
                      <span className="font-bold font-mono">-৳{editedBundleDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  {order.discount && (
                    <div className="flex justify-between text-[11px] text-green-600">
                      <span className="font-medium">Coupon ({order.discount.code})</span>
                      <span className="font-bold font-mono">-৳{editedCouponDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-zinc-400 font-medium">Shipping</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={editedShippingFee}
                      onChange={(e) => setEditedShippingFee(parseFloat(e.target.value) || 0)}
                      className="w-20 bg-transparent border-b border-zinc-200 text-right text-[11px] font-bold text-zinc-700 py-1 outline-none font-mono focus:border-black"
                    />
                  </div>
                  <div className="flex justify-between pt-2 border-t border-zinc-200">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total</span>
                    <span className="text-[16px] font-black text-zinc-900 font-mono">৳{editedTotal.toLocaleString()}</span>
                  </div>
                  {editedItems.some((item) => item.originalPrice && Number(item.price) !== item.originalPrice) && (
                    <div className="flex items-center gap-2 pt-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">
                        Admin Price Override Active
                      </span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <table className="w-full text-left">
                  <thead className="bg-zinc-50 border-b border-zinc-100">
                    <tr>
                      <th className="px-5 py-2.5 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Product</th>
                      <th className="px-5 py-2.5 text-[9px] font-bold text-zinc-400 uppercase tracking-widest text-center">Qty</th>
                      <th className="px-5 py-2.5 text-[9px] font-bold text-zinc-400 uppercase tracking-widest text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {order.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="px-5 py-3 max-w-[300px]">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 bg-zinc-50 border border-zinc-100 flex items-center justify-center overflow-hidden shrink-0">
                              {item.product?.images?.[0] ? (
                                <Image fill src={item.product.images[0]} alt="" sizes="40px" className="object-cover" />
                              ) : (
                                <Package size={14} strokeWidth={1} className="text-zinc-200" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[12px] font-bold text-zinc-900 truncate">{item.product?.title || "Unknown"}</p>
                              {item.variant && item.variant !== "Standard" && (
                                <p className="text-[10px] text-zinc-400">{item.variant}</p>
                              )}
                              {item.originalPrice && item.price !== item.originalPrice && (
                                <p className="text-[9px] text-amber-500 font-medium">
                                  orig: ৳{item.originalPrice.toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-center text-[12px] font-bold text-zinc-500 font-mono">x{item.quantity}</td>
                        <td className="px-5 py-3 text-right text-[12px] font-black text-zinc-900 font-mono">৳{(item.price * item.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pricing */}
                <div className="px-5 py-4 bg-zinc-50 border-t border-zinc-100 space-y-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-zinc-400 font-medium">Subtotal</span>
                    <span className="text-zinc-700 font-bold font-mono">৳{rawSubtotal.toLocaleString()}</span>
                  </div>
                  {order.discount && (
                    <div className="flex justify-between text-[11px] text-green-600">
                      <span className="font-medium">Coupon ({order.discount.code})</span>
                      <span className="font-bold font-mono">-৳{(order.discount.amount || 0).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[11px]">
                    <span className="text-zinc-400 font-medium">Shipping</span>
                    <span className="text-zinc-700 font-bold font-mono">৳{delivery.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-zinc-200">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total</span>
                    <span className="text-[16px] font-black text-zinc-900 font-mono">৳{order.totalPrice.toLocaleString()}</span>
                  </div>
                  {order.isAdminOverride && (
                    <div className="flex items-center gap-2 pt-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">
                        Admin Price Override Active
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Order Note */}
            {order.note && (
              <div className="px-5 py-4 bg-amber-50 border-t border-zinc-100">
                <div className="flex items-start gap-2">
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest shrink-0">Note</span>
                  <p className="text-[12px] text-amber-800 font-medium leading-relaxed">{order.note}</p>
                </div>
              </div>
            )}
          </div>

          {/* Customer Identity */}
          <CustomerIdentityCard
            user={order.user}
            guestInfo={order.guestInfo}
            createdByAdmin={order.createdByAdmin}
            order={order}
          />

          {/* Shipping Address */}
          <div className="bg-white border border-zinc-200 p-5">
            <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.15em] mb-4">Shipping Address</h3>
            <div className="flex items-start gap-2.5">
              <MapPin size={14} className="text-zinc-300 mt-0.5 shrink-0" strokeWidth={1.5} />
              <p className="text-[12px] font-bold text-zinc-900 leading-relaxed uppercase">{order.shippingAddress || "No address"}</p>
            </div>
            {order.deliveryInfo?.trackingId && (
              <div className="mt-4 pt-4 border-t border-zinc-100">
                <div className="flex items-center gap-2">
                  <Truck size={12} className="text-zinc-400" strokeWidth={1.5} />
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Tracking</span>
                </div>
                <p className="text-[12px] font-mono font-bold text-zinc-900 mt-1.5">{order.deliveryInfo.trackingId}</p>
                <p className="text-[10px] text-zinc-400 mt-0.5 capitalize">{order.deliveryInfo.provider} &middot; {order.deliveryInfo.status || "pending"}</p>
              </div>
            )}
          </div>

          {/* Cancel only */}
          {order.status === "pending" && (
            <button
              onClick={() => setIsCancelModalOpen(true)}
              className="px-5 py-2.5 border border-zinc-200 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:border-rose-300 hover:text-rose-500 transition-colors"
            >
              Cancel Order
            </button>
          )}
        </div>

        {/* ── Right Column ── */}
        <div className="lg:col-span-5 space-y-5">
          <EventHistoryCard order={order} />

          <CourierLogisticsCard
            deliveryInfo={order.deliveryInfo}
            selectedCourier={selectedCourier}
            setSelectedCourier={setSelectedCourier}
            manualTrackingId={manualTrackingId}
            setManualTrackingId={setManualTrackingId}
            selectedCityId={selectedCityId}
            setSelectedCityId={setSelectedCityId}
            selectedZoneId={selectedZoneId}
            setSelectedZoneId={setSelectedZoneId}
            carrybeeWeight={carrybeeWeight}
            setCarrybeeWeight={setCarrybeeWeight}
            carrybeeCodAmount={carrybeeCodAmount}
            setCarrybeeCodAmount={setCarrybeeCodAmount}
            carrybeeProductType={carrybeeProductType}
            setCarrybeeProductType={setCarrybeeProductType}
            carrybeeDeliveryType={carrybeeDeliveryType}
            setCarrybeeDeliveryType={setCarrybeeDeliveryType}
            handleCourierDispatch={handleCourierDispatch}
            isDispatching={isDispatching}
            isCancelled={order.status === "cancelled"}
          />

          <AdvancePaymentCard
            advancePayment={order.advancePayment}
            onConfirm={handleConfirmAdvancePayment}
            onWaive={handleWaiveAdvancePayment}
            isConfirming={isConfirmingAdvancePayment}
            isWaiving={isWaivingAdvancePayment}
          />

          {(!order.advancePayment?.required || order.advancePayment?.status === "waived") &&
           order.status !== "delivered" && order.status !== "cancelled" && (
            <button
              onClick={() => setIsAdvancePaymentModalOpen(true)}
              className="w-full py-2.5 border border-dashed border-zinc-200 hover:border-zinc-400 text-zinc-500 hover:text-zinc-700 text-[10px] font-bold uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2"
            >
              <DollarSign className="w-3.5 h-3.5" /> Request Advance Payment
            </button>
          )}

          {phone && <CustomerHistoryCard phone={phone} />}
          {phone && <FraudBDCheckCard phone={phone} />}
        </div>
      </div>

      <ConfirmModal
        isOpen={isCancelModalOpen}
        onClose={() => !isCancelling && setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancellation}
        title="Cancel Order"
        message={`Cancel order ${order.orderId}? Inventory will be restored.`}
        confirmLabel={isCancelling ? "Cancelling..." : "Yes, Cancel"}
        variant="danger"
      />

      <RequestAdvancePaymentModal
        isOpen={isAdvancePaymentModalOpen}
        onClose={() => !isRequestingAdvancePayment && setIsAdvancePaymentModalOpen(false)}
        onConfirm={handleRequestAdvancePayment}
        amount={advancePaymentAmount}
        setAmount={setAdvancePaymentAmount}
        reason={advancePaymentReason}
        setReason={setAdvancePaymentReason}
        isProcessing={isRequestingAdvancePayment}
        orderTotal={order.totalPrice}
      />
    </div>
  );
}
