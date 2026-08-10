"use client";
import { useState, useEffect } from "react";
import { X, Loader2, Plus, Trash2 } from "lucide-react";
import { useOrders } from "@/hooks/api/useOrders";
import { useToast } from "@/hooks/useToast";

export default function EditOrderModal({ isOpen, onClose, order }) {
  const { toast } = useToast();
  const { updateOrder, updateOrderPrices } = useOrders();

  const [activeTab, setActiveTab] = useState("details");
  const [form, setForm] = useState({
    shippingAddress: "",
    deliveryMethod: "normal",
    shippingFee: 0,
    paymentMethod: "cod",
    paymentStatus: "pending",
    note: "",
    guestFirstName: "",
    guestLastName: "",
    guestEmail: "",
    guestPhone: "",
  });

  const [editedItems, setEditedItems] = useState([]);

  useEffect(() => {
    if (order && isOpen) {
      setForm({
        shippingAddress: order.shippingAddress || "",
        deliveryMethod: order.deliveryMethod || "normal",
        shippingFee: order.shippingFee || 0,
        paymentMethod: order.paymentMethod || "cod",
        paymentStatus: order.paymentStatus || "pending",
        note: order.note || "",
        guestFirstName: order.guestInfo?.firstName || "",
        guestLastName: order.guestInfo?.lastName || "",
        guestEmail: order.guestInfo?.email || "",
        guestPhone: order.guestInfo?.phone || "",
      });
      setEditedItems(
        order.items.map((item) => ({
          productId: item.product?._id || item.product,
          title: item.product?.title || "Product",
          variant: item.variant || "Standard",
          quantity: item.quantity,
          price: item.price,
          bundleId: item.bundleId,
          multiItems: item.multiItems || [],
          originalPrice: item.originalPrice,
        }))
      );
      setActiveTab("details");
    }
  }, [order, isOpen]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index, field, value) => {
    setEditedItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSaveDetails = () => {
    const payload = {
      shippingAddress: form.shippingAddress,
      deliveryMethod: form.deliveryMethod,
      shippingFee: Number(form.shippingFee),
      paymentMethod: form.paymentMethod,
      paymentStatus: form.paymentStatus,
      note: form.note,
    };

    if (!order.user || order.createdByAdmin) {
      payload.guestInfo = {
        firstName: form.guestFirstName,
        lastName: form.guestLastName,
        email: form.guestEmail,
        phone: form.guestPhone,
      };
    }

    updateOrder.mutate(
      { id: order._id, data: payload },
      {
        onSuccess: () => {
          toast.success("Order details updated successfully.");
          onClose();
        },
        onError: (err) => {
          toast.error(err.message || "Failed to update order.");
        },
      }
    );
  };

  const handleSaveItems = () => {
    const items = editedItems.map((item) => ({
      productId: item.productId,
      variant: item.variant,
      quantity: Number(item.quantity),
      price: Number(item.price),
      bundleId: item.bundleId,
      multiItems: item.multiItems.length > 0 ? item.multiItems : undefined,
    }));

    updateOrderPrices.mutate(
      { id: order._id, items, shippingFee: Number(form.shippingFee) },
      {
        onSuccess: () => {
          toast.success("Order items updated successfully.");
          onClose();
        },
        onError: (err) => {
          toast.error(err.message || "Failed to update items.");
        },
      }
    );
  };

  if (!isOpen || !order) return null;

  const editableStatuses = ["pending", "processing", "on-hold"];
  const isEditable = editableStatuses.includes(order.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-[14px] font-bold text-zinc-900">Edit Order</h2>
            <p className="text-[11px] text-zinc-400 mt-0.5">#{order.orderId}</p>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-700 transition-colors">
            <X size={16} />
          </button>
        </div>

        {!isEditable && (
          <div className="px-6 py-3 bg-amber-50 border-b border-amber-100 shrink-0">
            <p className="text-[11px] text-amber-700 font-medium">
              This order is in <strong>{order.status}</strong> status and cannot be edited.
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-zinc-200 shrink-0">
          <button
            onClick={() => setActiveTab("details")}
            className={`flex-1 px-6 py-3 text-[11px] font-bold uppercase tracking-widest transition-colors ${
              activeTab === "details"
                ? "text-black border-b-2 border-black"
                : "text-zinc-400 hover:text-zinc-600"
            }`}
          >
            Order Details
          </button>
          <button
            onClick={() => setActiveTab("items")}
            className={`flex-1 px-6 py-3 text-[11px] font-bold uppercase tracking-widest transition-colors ${
              activeTab === "items"
                ? "text-black border-b-2 border-black"
                : "text-zinc-400 hover:text-zinc-600"
            }`}
          >
            Items ({order.items.length})
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "details" ? (
            <div className="px-6 py-6 space-y-6">
              {/* Customer Info */}
              {(!order.user || order.createdByAdmin) && (
                <fieldset className="space-y-4">
                  <legend className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.15em]">
                    Customer Info
                  </legend>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">First Name</label>
                      <input
                        type="text"
                        value={form.guestFirstName}
                        onChange={(e) => handleChange("guestFirstName", e.target.value)}
                        disabled={!isEditable}
                        className="w-full px-3 py-2 border border-zinc-200 text-[12px] font-medium outline-none focus:border-black disabled:opacity-50 disabled:bg-zinc-50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Last Name</label>
                      <input
                        type="text"
                        value={form.guestLastName}
                        onChange={(e) => handleChange("guestLastName", e.target.value)}
                        disabled={!isEditable}
                        className="w-full px-3 py-2 border border-zinc-200 text-[12px] font-medium outline-none focus:border-black disabled:opacity-50 disabled:bg-zinc-50 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Email</label>
                      <input
                        type="email"
                        value={form.guestEmail}
                        onChange={(e) => handleChange("guestEmail", e.target.value)}
                        disabled={!isEditable}
                        className="w-full px-3 py-2 border border-zinc-200 text-[12px] font-medium outline-none focus:border-black disabled:opacity-50 disabled:bg-zinc-50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Phone</label>
                      <input
                        type="text"
                        value={form.guestPhone}
                        onChange={(e) => handleChange("guestPhone", e.target.value)}
                        disabled={!isEditable}
                        className="w-full px-3 py-2 border border-zinc-200 text-[12px] font-medium outline-none focus:border-black disabled:opacity-50 disabled:bg-zinc-50 transition-colors"
                      />
                    </div>
                  </div>
                </fieldset>
              )}

              {/* Shipping Address */}
              <fieldset className="space-y-4">
                <legend className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.15em]">
                  Shipping Address
                </legend>
                <textarea
                  value={form.shippingAddress}
                  onChange={(e) => handleChange("shippingAddress", e.target.value)}
                  disabled={!isEditable}
                  rows={3}
                  className="w-full px-3 py-2 border border-zinc-200 text-[12px] font-medium outline-none focus:border-black disabled:opacity-50 disabled:bg-zinc-50 transition-colors resize-none"
                />
              </fieldset>

              {/* Delivery & Shipping */}
              <fieldset className="space-y-4">
                <legend className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.15em]">
                  Delivery & Shipping
                </legend>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Delivery Method</label>
                    <select
                      value={form.deliveryMethod}
                      onChange={(e) => handleChange("deliveryMethod", e.target.value)}
                      disabled={!isEditable}
                      className="w-full px-3 py-2 border border-zinc-200 text-[12px] font-medium outline-none focus:border-black disabled:opacity-50 disabled:bg-zinc-50 transition-colors bg-white"
                    >
                      <option value="normal">Standard</option>
                      <option value="fast">Fast Delivery</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Shipping Fee</label>
                    <input
                      type="number"
                      min="0"
                      value={form.shippingFee}
                      onChange={(e) => handleChange("shippingFee", e.target.value)}
                      disabled={!isEditable}
                      className="w-full px-3 py-2 border border-zinc-200 text-[12px] font-medium outline-none focus:border-black disabled:opacity-50 disabled:bg-zinc-50 transition-colors font-mono"
                    />
                  </div>
                </div>
              </fieldset>

              {/* Payment */}
              <fieldset className="space-y-4">
                <legend className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.15em]">
                  Payment
                </legend>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Payment Method</label>
                    <select
                      value={form.paymentMethod}
                      onChange={(e) => handleChange("paymentMethod", e.target.value)}
                      disabled={!isEditable}
                      className="w-full px-3 py-2 border border-zinc-200 text-[12px] font-medium outline-none focus:border-black disabled:opacity-50 disabled:bg-zinc-50 transition-colors bg-white"
                    >
                      <option value="cod">Cash on Delivery</option>
                      <option value="online">Online Payment</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Payment Status</label>
                    <select
                      value={form.paymentStatus}
                      onChange={(e) => handleChange("paymentStatus", e.target.value)}
                      disabled={!isEditable}
                      className="w-full px-3 py-2 border border-zinc-200 text-[12px] font-medium outline-none focus:border-black disabled:opacity-50 disabled:bg-zinc-50 transition-colors bg-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>
              </fieldset>

              {/* Note */}
              <fieldset className="space-y-4">
                <legend className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.15em]">
                  Order Note
                </legend>
                <textarea
                  value={form.note}
                  onChange={(e) => handleChange("note", e.target.value)}
                  disabled={!isEditable}
                  rows={3}
                  placeholder="Internal note for this order..."
                  className="w-full px-3 py-2 border border-zinc-200 text-[12px] font-medium outline-none focus:border-black disabled:opacity-50 disabled:bg-zinc-50 transition-colors resize-none placeholder:text-zinc-300"
                />
              </fieldset>
            </div>
          ) : (
            /* Items Tab */
            <div className="px-6 py-6 space-y-4">
              {editedItems.map((item, idx) => (
                <div key={idx} className="border border-zinc-200 p-4 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-bold text-zinc-900 truncate">{item.title}</p>
                      <p className="text-[10px] text-zinc-400 font-mono mt-0.5">{item.productId}</p>
                    </div>
                    <span className="text-[10px] font-bold text-zinc-400 shrink-0 ml-4">Item {idx + 1}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {/* Variant */}
                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Variant / Size</label>
                      <input
                        type="text"
                        value={item.variant}
                        onChange={(e) => handleItemChange(idx, "variant", e.target.value)}
                        disabled={!isEditable}
                        className="w-full px-3 py-2 border border-zinc-200 text-[12px] font-medium outline-none focus:border-black disabled:opacity-50 disabled:bg-zinc-50 transition-colors"
                        placeholder="e.g. L (42/28)"
                      />
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, "quantity", parseInt(e.target.value) || 1)}
                        disabled={!isEditable}
                        className="w-full px-3 py-2 border border-zinc-200 text-[12px] font-medium outline-none focus:border-black disabled:opacity-50 disabled:bg-zinc-50 transition-colors font-mono"
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Unit Price</label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={item.price}
                        onChange={(e) => handleItemChange(idx, "price", parseFloat(e.target.value) || 0)}
                        disabled={!isEditable}
                        className="w-full px-3 py-2 border border-zinc-200 text-[12px] font-medium outline-none focus:border-black disabled:opacity-50 disabled:bg-zinc-50 transition-colors font-mono"
                      />
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="flex justify-between items-center pt-2 border-t border-zinc-100">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Item Total</span>
                    <span className="text-[14px] font-black text-zinc-900 font-mono">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}

              {/* Order Total Summary */}
              <div className="bg-zinc-50 border border-zinc-200 p-4 space-y-2">
                <div className="flex justify-between text-[12px]">
                  <span className="text-zinc-500 font-medium">Items Subtotal</span>
                  <span className="text-zinc-900 font-bold font-mono">
                    ৳{editedItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span className="text-zinc-500 font-medium">Shipping</span>
                  <span className="text-zinc-900 font-bold font-mono">৳{Number(form.shippingFee).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[12px] pt-2 border-t border-zinc-200">
                  <span className="text-zinc-900 font-bold uppercase tracking-wider">Estimated Total</span>
                  <span className="text-[16px] font-black text-zinc-900 font-mono">
                    ৳{(editedItems.reduce((sum, item) => sum + item.price * item.quantity, 0) + Number(form.shippingFee)).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {isEditable && (
          <div className="bg-white border-t border-zinc-200 px-6 py-4 flex items-center justify-end gap-3 shrink-0">
            <button
              onClick={onClose}
              disabled={updateOrder.isPending || updateOrderPrices.isPending}
              className="px-5 py-2.5 border border-zinc-200 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:border-zinc-400 hover:text-zinc-600 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={activeTab === "details" ? handleSaveDetails : handleSaveItems}
              disabled={updateOrder.isPending || updateOrderPrices.isPending}
              className="px-5 py-2.5 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {(updateOrder.isPending || updateOrderPrices.isPending) && <Loader2 size={10} className="animate-spin" />}
              {updateOrder.isPending || updateOrderPrices.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
