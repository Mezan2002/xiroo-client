"use client";
import { useOrders } from "@/hooks/api/useOrders";
import { useToast } from "@/hooks/useToast";
import { useState, useEffect } from "react";

export const useOrderManagement = (id) => {
  const { toast } = useToast();
  const { useOrderDetail, updateStatus, cancelOrder, dispatchCourier, requestAdvancePayment, confirmAdvancePayment, waiveAdvancePayment, updateOrderPrices, updateOrder } = useOrders();
  const { data: order, isLoading: loading, error, isError } = useOrderDetail(id);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isAdvancePaymentModalOpen, setIsAdvancePaymentModalOpen] = useState(false);
  const [advancePaymentAmount, setAdvancePaymentAmount] = useState("");
  const [advancePaymentReason, setAdvancePaymentReason] = useState("");
  const [selectedCourier, setSelectedCourier] = useState("carrybee");
  const [manualTrackingId, setManualTrackingId] = useState("");
  const [selectedCityId, setSelectedCityId] = useState("");
  const [selectedZoneId, setSelectedZoneId] = useState("");
  const [carrybeeWeight, setCarrybeeWeight] = useState("");
  const [carrybeeCodAmount, setCarrybeeCodAmount] = useState("");
  const [carrybeeProductType, setCarrybeeProductType] = useState("1");
  const [carrybeeDeliveryType, setCarrybeeDeliveryType] = useState("1");
  const [carrybeeSecondaryPhone, setCarrybeeSecondaryPhone] = useState("");

  // Return note state
  const [isReturnNoteModalOpen, setIsReturnNoteModalOpen] = useState(false);
  const [returnNote, setReturnNote] = useState("");
  const [pendingStatus, setPendingStatus] = useState(null);

  // Edit return note state
  const [isEditingReturnNote, setIsEditingReturnNote] = useState(false);
  const [editedReturnNote, setEditedReturnNote] = useState("");

  // Price override editing state
  const [isEditingPrices, setIsEditingPrices] = useState(false);
  const [editedItems, setEditedItems] = useState([]);
  const [editedShippingFee, setEditedShippingFee] = useState(0);

  // Initialize edited items when order loads or edit mode is entered
  useEffect(() => {
    if (order && isEditingPrices) {
      setEditedItems(
        order.items.map((item) => ({
          productId: item.product?._id || item.product,
          variant: item.variant,
          quantity: item.quantity,
          price: item.price,
          originalPrice: item.originalPrice,
          bundleId: item.bundleId,
          title: item.product?.title || "Unknown",
        }))
      );
      setEditedShippingFee(order.shippingFee || 0);
    }
  }, [order, isEditingPrices]);

  const handleStatusChange = async (newStatus) => {
    // Show return note modal only when changing to "returned" status (not return-received)
    if (newStatus === "returned") {
      setPendingStatus(newStatus);
      setReturnNote("");
      setIsReturnNoteModalOpen(true);
      return;
    }

    updateStatus.mutate({ id, status: newStatus }, {
      onSuccess: () => toast.success(`Order status updated to ${newStatus.replace(/-/g, " ")}`),
      onError: (err) => toast.error(err.message || "Failed to update status")
    });
  };

  const handleReturnNoteConfirm = async () => {
    if (!returnNote.trim()) {
      toast.error("Please enter a reason for the return");
      return;
    }
    updateStatus.mutate({ id, status: pendingStatus, returnNote: returnNote.trim() }, {
      onSuccess: () => {
        toast.success(`Order status updated to ${pendingStatus.replace(/-/g, " ")}`);
        setIsReturnNoteModalOpen(false);
        setPendingStatus(null);
        setReturnNote("");
      },
      onError: (err) => toast.error(err.message || "Failed to update status")
    });
  };

  const handleReturnNoteCancel = () => {
    setIsReturnNoteModalOpen(false);
    setPendingStatus(null);
    setReturnNote("");
  };

  // Edit return note handlers
  const handleEditReturnNote = () => {
    setEditedReturnNote(order?.returnNote || "");
    setIsEditingReturnNote(true);
  };

  const handleSaveReturnNote = async () => {
    if (!editedReturnNote.trim()) {
      toast.error("Please enter a return reason");
      return;
    }
    updateOrder.mutate({ id, data: { returnNote: editedReturnNote.trim() } }, {
      onSuccess: () => {
        toast.success("Return note updated");
        setIsEditingReturnNote(false);
      },
      onError: (err) => toast.error(err.message || "Failed to update return note")
    });
  };

  const handleRemoveReturnNote = async () => {
    updateOrder.mutate({ id, data: { returnNote: "" } }, {
      onSuccess: () => {
        toast.success("Return note removed");
        setIsEditingReturnNote(false);
        setEditedReturnNote("");
      },
      onError: (err) => toast.error(err.message || "Failed to remove return note")
    });
  };

  const handleCancelEditReturnNote = () => {
    setIsEditingReturnNote(false);
    setEditedReturnNote("");
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
    if (selectedCourier === "carrybee") {
      if (!selectedCityId || !selectedZoneId) {
        toast.error("Please select City and Zone for CarryBee dispatch");
        return;
      }
      if (!carrybeeWeight || Number(carrybeeWeight) <= 0) {
        toast.error("Please enter a valid weight for CarryBee dispatch");
        return;
      }
    }
    dispatchCourier.mutate({
      id,
      provider: selectedCourier,
      trackingId: selectedCourier === "manual" ? manualTrackingId : undefined,
      cityId: selectedCourier === "carrybee" ? Number(selectedCityId) : undefined,
      zoneId: selectedCourier === "carrybee" ? Number(selectedZoneId) : undefined,
      itemWeight: selectedCourier === "carrybee" ? Number(carrybeeWeight) || 500 : undefined,
      collectableAmount: selectedCourier === "carrybee" ? Number(carrybeeCodAmount) || 0 : undefined,
      productType: selectedCourier === "carrybee" ? Number(carrybeeProductType) : undefined,
      deliveryType: selectedCourier === "carrybee" ? Number(carrybeeDeliveryType) : undefined,
      secondaryPhone: selectedCourier === "carrybee" && carrybeeSecondaryPhone ? carrybeeSecondaryPhone : undefined,
    }, {
      onSuccess: (res) => toast.success(res.message || `Dispatched to ${selectedCourier}`),
      onError: (err) => toast.error(err.message || "Dispatch failed")
    });
  };

  const handleRequestAdvancePayment = async () => {
    const amount = parseFloat(advancePaymentAmount);
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    requestAdvancePayment.mutate({ id, amount, reason: advancePaymentReason }, {
      onSuccess: () => {
        toast.success("Advance payment requested successfully");
        setIsAdvancePaymentModalOpen(false);
        setAdvancePaymentAmount("");
        setAdvancePaymentReason("");
      },
      onError: (err) => toast.error(err.message || "Failed to request advance payment")
    });
  };

  const handleConfirmAdvancePayment = async () => {
    confirmAdvancePayment.mutate(id, {
      onSuccess: () => toast.success("Advance payment confirmed"),
      onError: (err) => toast.error(err.message || "Failed to confirm advance payment")
    });
  };

  const handleWaiveAdvancePayment = async () => {
    waiveAdvancePayment.mutate(id, {
      onSuccess: () => toast.success("Advance payment waived"),
      onError: (err) => toast.error(err.message || "Failed to waive advance payment")
    });
  };

  const handleEditedItemChange = (index, field, value) => {
    setEditedItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handlePriceOverrideSave = async () => {
    const hasZeroOrNegativePrice = editedItems.some((item) => !item.price || item.price <= 0);
    if (hasZeroOrNegativePrice) {
      toast.error("All items must have a price greater than 0");
      return;
    }

    const payload = editedItems.map((item) => ({
      productId: item.productId,
      variant: item.variant,
      quantity: item.quantity,
      price: Number(item.price),
      bundleId: item.bundleId,
    }));

    updateOrderPrices.mutate(
      { id, items: payload, shippingFee: Number(editedShippingFee) || 0 },
      {
        onSuccess: () => {
          toast.success("Order prices updated successfully");
          setIsEditingPrices(false);
        },
        onError: (err) => toast.error(err.message || "Failed to update prices"),
      }
    );
  };

  const handleCancelPriceEdit = () => {
    setIsEditingPrices(false);
    setEditedItems([]);
  };

  return {
    order, loading, error, isError, isCancelModalOpen, setIsCancelModalOpen,
    isAdvancePaymentModalOpen, setIsAdvancePaymentModalOpen,
    advancePaymentAmount, setAdvancePaymentAmount,
    advancePaymentReason, setAdvancePaymentReason,
    selectedCourier, setSelectedCourier, manualTrackingId, setManualTrackingId,
    selectedCityId, setSelectedCityId, selectedZoneId, setSelectedZoneId,
    carrybeeWeight, setCarrybeeWeight,
    carrybeeCodAmount, setCarrybeeCodAmount,
    carrybeeProductType, setCarrybeeProductType,
    carrybeeDeliveryType, setCarrybeeDeliveryType,
    carrybeeSecondaryPhone, setCarrybeeSecondaryPhone,
    handleStatusChange, handleConfirmCancellation, handleCourierDispatch,
    handleRequestAdvancePayment, handleConfirmAdvancePayment, handleWaiveAdvancePayment,
    isEditingPrices, setIsEditingPrices, editedItems, editedShippingFee, setEditedShippingFee,
    handleEditedItemChange, handlePriceOverrideSave, handleCancelPriceEdit,
    // Return note modal
    isReturnNoteModalOpen, setIsReturnNoteModalOpen,
    returnNote, setReturnNote,
    pendingStatus, setPendingStatus,
    handleReturnNoteConfirm, handleReturnNoteCancel,
    // Edit return note
    isEditingReturnNote, setIsEditingReturnNote,
    editedReturnNote, setEditedReturnNote,
    handleEditReturnNote, handleSaveReturnNote, handleRemoveReturnNote, handleCancelEditReturnNote,
    isUpdatingStatus: updateStatus.isPending,
    isCancelling: cancelOrder.isPending,
    isDispatching: dispatchCourier.isPending,
    isRequestingAdvancePayment: requestAdvancePayment.isPending,
    isConfirmingAdvancePayment: confirmAdvancePayment.isPending,
    isWaivingAdvancePayment: waiveAdvancePayment.isPending,
    isSavingPrices: updateOrderPrices.isPending,
  };
};
