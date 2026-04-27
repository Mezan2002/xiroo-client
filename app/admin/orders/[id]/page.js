"use client";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import CourierLogisticsCard from "./sections/CourierLogisticsCard";
import CustomerIdentityCard from "./sections/CustomerIdentityCard";
import OrderHeader from "./sections/OrderHeader";
import OrderItemsRegistry from "./sections/OrderItemsRegistry";
import ShippingDestinationCard from "./sections/ShippingDestinationCard";
import { useOrderManagement } from "./sections/useOrderManagement";

const StatusTimelineItem = ({ status, date, current }) => (
  <div className="flex gap-4 pb-8 last:pb-0 relative group">
    <div className="flex flex-col items-center shrink-0">
      <div className={`w-2.5 h-2.5 rounded-none mt-1.5 ${current ? "bg-black ring-4 ring-zinc-50" : "bg-zinc-200"}`} />
      <div className="w-px h-full bg-zinc-100 absolute top-4 left-[4.5px] group-last:hidden" />
    </div>
    <div className="flex-1">
      <p className={`text-[13px] font-bold tracking-tight ${current ? "text-zinc-900" : "text-zinc-400"}`}>{status}</p>
      <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest mt-1">{date}</p>
    </div>
  </div>
);

export default function OrderDetailsPage() {
  const { id } = useParams();
  const {
    order, loading, isCancelModalOpen, setIsCancelModalOpen,
    selectedCourier, setSelectedCourier, manualTrackingId, setManualTrackingId,
    handleStatusChange, handleConfirmCancellation, handleCourierDispatch,
    isUpdatingStatus, isCancelling, isDispatching
  } = useOrderManagement(id);

  if (loading) {
    return (
      <div className="h-[600px] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-zinc-200" strokeWidth={1} />
      </div>
    );
  }

  if (!order) {
    return <div className="p-12 text-center text-zinc-400">Order record not found.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 rounded-none pb-12">
      <OrderHeader
        order={order}
        isUpdatingStatus={isUpdatingStatus}
        handleStatusChange={handleStatusChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
        <div className="md:col-span-12 lg:col-span-8 space-y-8 md:space-y-10">
          <OrderItemsRegistry order={order} handleCancelOrder={() => setIsCancelModalOpen(true)} />
        </div>

        <div className="col-span-1 md:col-span-12 lg:col-span-4 space-y-8 md:space-y-10">
          <CustomerIdentityCard user={order.user} />
          <ShippingDestinationCard shippingAddress={order.shippingAddress} />
          <CourierLogisticsCard
            deliveryInfo={order.deliveryInfo}
            selectedCourier={selectedCourier}
            setSelectedCourier={setSelectedCourier}
            manualTrackingId={manualTrackingId}
            setManualTrackingId={setManualTrackingId}
            handleCourierDispatch={handleCourierDispatch}
            isDispatching={isDispatching}
            isCancelled={order.status === "cancelled"}
          />

          <div className="bg-white border border-zinc-200 p-6 space-y-4">
            <h3 className="text-[13px] font-bold text-zinc-900 tracking-tight">Event History</h3>
            <div className="space-y-2">
              <StatusTimelineItem status="Order Registry Initialized" date={new Date(order.createdAt).toLocaleString()} current={order.status === "pending"} />
              {order.status !== "pending" && <StatusTimelineItem status={`State: ${order.status.toUpperCase()}`} date="Last Synchronization Active" current />}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isCancelModalOpen}
        onClose={() => !isCancelling && setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancellation}
        title="Terminate Order Flow"
        message={`Notice: Terminating order ${order.orderId} will permanently mark it as 'Cancelled' and restore product inventory levels.`}
        confirmLabel={isCancelling ? "Processing..." : "Confirm Termination"}
        variant="danger"
      />
    </div>
  );
}
