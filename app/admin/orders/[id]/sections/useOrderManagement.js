"use client";
import { useOrders } from "@/hooks/api/useOrders";
import { useToast } from "@/hooks/useToast";
import { useState } from "react";

export const useOrderManagement = (id) => {
  const { toast } = useToast();
  const { useOrderDetail, updateStatus, cancelOrder, dispatchCourier } = useOrders();
  const { data: order, isLoading: loading, error, isError } = useOrderDetail(id);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState("steadfast");
  const [manualTrackingId, setManualTrackingId] = useState("");

  const handleStatusChange = async (newStatus) => {
    updateStatus.mutate({ id, status: newStatus }, {
      onSuccess: () => toast.success(`Order status updated to ${newStatus}`),
      onError: (err) => toast.error(err.message || "Failed to update status")
    });
  };

  const handleConfirmCancellation = async () => {
    cancelOrder.mutate(id, {
      onSuccess: () => {
        toast.success("Order cancelled and inventory restored.");
        setIsCancelModalOpen(false);
      },
      onError: (err) => toast.error(err.message || "Cancellation failed")
    });
  };

  const handleCourierDispatch = async () => {
    if (selectedCourier === "manual" && !manualTrackingId) {
      toast.error("Please enter a Tracking ID for manual dispatch");
      return;
    }
    dispatchCourier.mutate({
      id,
      provider: selectedCourier,
      trackingId: selectedCourier === "manual" ? manualTrackingId : undefined,
    }, {
      onSuccess: (res) => toast.success(res.message || `Dispatched to ${selectedCourier}`),
      onError: (err) => toast.error(err.message || "Dispatch failed")
    });
  };

  return {
    order, loading, error, isError, isCancelModalOpen, setIsCancelModalOpen,
    selectedCourier, setSelectedCourier, manualTrackingId, setManualTrackingId,
    handleStatusChange, handleConfirmCancellation, handleCourierDispatch,
    isUpdatingStatus: updateStatus.isPending,
    isCancelling: cancelOrder.isPending,
    isDispatching: dispatchCourier.isPending
  };
};
