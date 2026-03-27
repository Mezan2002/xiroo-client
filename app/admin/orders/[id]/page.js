"use client";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import { Button } from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/context/ToastContext";
import { apiRequest } from "@/lib/api";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
  ShoppingBag,
  Truck,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

// --- Sub-components ---
const Card = ({ children, title, action, className = "" }) => (
  <div
    className={`bg-white border border-zinc-200 rounded-none overflow-hidden ${className}`}
  >
    {(title || action) && (
      <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
        <h3 className="text-[13px] font-bold text-zinc-900 tracking-tight">
          {title}
        </h3>
        {action}
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-zinc-100 text-zinc-600 border-zinc-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    warning: "bg-amber-50 text-amber-700 border-amber-100",
    danger: "bg-rose-50 text-rose-700 border-rose-100",
    info: "bg-zinc-900 text-white border-zinc-900",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-none text-[10px] font-bold border uppercase tracking-widest ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

const StatusTimelineItem = ({ status, date, current }) => (
  <div className="flex gap-4 pb-8 last:pb-0 relative group">
    <div className="flex flex-col items-center shrink-0">
      <div
        className={`w-2.5 h-2.5 rounded-none mt-1.5 ${current ? "bg-black ring-4 ring-zinc-50" : "bg-zinc-200"}`}
      ></div>
      <div className="w-px h-full bg-zinc-100 absolute top-4 left-[4.5px] group-last:hidden"></div>
    </div>
    <div className="flex-1">
      <p
        className={`text-[13px] font-bold tracking-tight ${current ? "text-zinc-900" : "text-zinc-400"}`}
      >
        {status}
      </p>
      <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest mt-1">
        {date}
      </p>
    </div>
  </div>
);

const LabelValue = ({ label, value, className = "" }) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
      {label}
    </span>
    <span className="text-[13px] font-bold text-zinc-900 tracking-tight">
      {value}
    </span>
  </div>
);

const DetailSection = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">
      {label}
    </span>
    <span className="text-[12px] font-bold text-zinc-900 tracking-tight">
      {value}
    </span>
  </div>
);

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState("steadfast");
  const [manualTrackingId, setManualTrackingId] = useState("");

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiRequest(`/orders/${params.id}`);
      if (response.success) {
        setOrder(response.data);
      } else {
        toast.error("Failed to retrieve order record.");
      }
    } catch (error) {
      console.error("Order detail fetch error:", error);
      toast.error("Registry synchronization failure.");
    } finally {
      setLoading(false);
    }
  }, [params.id, toast]);

  useEffect(() => {
    if (params.id) fetchOrder();
  }, [fetchOrder, params.id]);

  const handleStatusChange = async (newStatus) => {
    try {
      setIsUpdatingStatus(true);
      const response = await apiRequest(`/orders/${params.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.success) {
        toast.success(`Order status updated to ${newStatus}`);
        await fetchOrder(); // High-Fidelity Refresh: Ensure all nested data is restored
      } else {
        toast.error(response.message || "Failed to update status");
      }
    } catch (error) {
      toast.error("Status synchronization error.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleCancelOrder = () => {
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancellation = async () => {
    try {
      setIsCancelling(true);
      const response = await apiRequest(`/orders/${params.id}/cancel`, {
        method: "PATCH",
      });

      if (response.success) {
        toast.success("Order cancelled and inventory restored.");
        setIsCancelModalOpen(false);
        await fetchOrder(); // High-Fidelity Refresh: Ensure all nested data is restored
      } else {
        toast.error(response.message || "Cancellation failed");
      }
    } catch (error) {
      toast.error("System error during cancellation.");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCourierDispatch = async () => {
    try {
      if (selectedCourier === "manual" && !manualTrackingId) {
        toast.error("Please enter a Tracking ID for manual dispatch");
        return;
      }

      setIsDispatching(true);
      const response = await apiRequest(`/orders/${params.id}/dispatch`, {
        method: "POST",
        body: JSON.stringify({
          provider: selectedCourier,
          trackingId:
            selectedCourier === "manual" ? manualTrackingId : undefined,
        }),
      });

      if (response.success) {
        toast.success(response.message || `Dispatched to ${provider}`);
        await fetchOrder();
      } else {
        toast.error(response.message || "Dispatch failed");
      }
    } catch (error) {
      console.error("Dispatch Error:", error);
      toast.error(
        error.message || "System error during courier synchronization.",
      );
    } finally {
      setIsDispatching(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[600px] flex items-center justify-center">
        <Loader2
          className="w-10 h-10 animate-spin text-zinc-200"
          strokeWidth={1}
        />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-12 text-center text-zinc-400">
        Order record not found.
      </div>
    );
  }

  const statusOptions = [
    { value: "pending", label: "Pending", icon: Clock },
    { value: "processing", label: "Processing", icon: Clock },
    { value: "shipped", label: "Shipped", icon: Truck },
    { value: "delivered", label: "Delivered", icon: CheckCircle2 },
    { value: "cancelled", label: "Cancelled", icon: AlertCircle },
  ];

  const subtotal = order.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const delivery = order.totalPrice - subtotal;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 rounded-none pb-12">
      <ModuleHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Orders", href: "/admin/orders" },
          { label: order.orderId, active: true },
        ]}
        title={`#${order.orderId}`}
        icon={ShoppingBag}
        actions={
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 pr-4 border-r border-zinc-100">
              <Badge
                variant={
                  order.status === "cancelled"
                    ? "danger"
                    : order.status === "delivered"
                      ? "success"
                      : "info"
                }
              >
                ORDER: {order.status}
              </Badge>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                {isUpdatingStatus && (
                  <Loader2 className="w-4 h-4 animate-spin mr-2 text-zinc-400" />
                )}
                <Select
                  options={statusOptions}
                  value={order.status}
                  onChange={handleStatusChange}
                  className="w-40 h-10! text-[12px]! font-bold! rounded-none!"
                  disabled={
                    isUpdatingStatus ||
                    ["delivered", "cancelled", "failed"].includes(order.status)
                  }
                />
              </div>
            </div>
          </div>
        }
      />

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-12 lg:col-span-8 space-y-10">
          <Card
            title="Items Registry"
            action={
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                {order.items.length} units detected
              </span>
            }
          >
            <div className="overflow-x-auto -mx-6 -mt-6">
              <table className="w-full text-left">
                <thead className="bg-zinc-50 border-b border-zinc-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      Product Description
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">
                      Qty
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">
                      Unit Price
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {order.items.map((item, idx) => (
                    <tr
                      key={idx}
                      className="group hover:bg-zinc-50/50 transition-colors"
                    >
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-5">
                          <div className="relative w-16 h-16 bg-white border border-zinc-100 rounded-none flex items-center justify-center text-zinc-200 overflow-hidden shrink-0 shadow-sm">
                            {item.product?.images?.[0] ? (
                              <Image
                                fill
                                src={item.product.images[0]}
                                alt={item.product.title || "Product"}
                                sizes="64px"
                                className="object-cover"
                              />
                            ) : (
                              <ShoppingBag size={20} strokeWidth={1} />
                            )}
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[14px] font-bold text-zinc-900 tracking-tight leading-tight line-clamp-1">
                              {item.product?.title || "Unknown Product"}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                              ID:{" "}
                              {item.product?.sku ||
                                item.product?._id?.slice(-8) ||
                                "N/A"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center text-[13px] font-bold text-zinc-500 tracking-tight">
                        x{item.quantity}
                      </td>
                      <td className="px-6 py-6 text-right text-[13px] font-bold text-zinc-500 tracking-tight">
                        ৳{item.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-6 text-right text-[15px] font-black text-zinc-900 tracking-tight">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-10 pt-10 border-t border-zinc-100 flex justify-end">
              <div className="w-full max-w-[320px] space-y-4">
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-zinc-500 font-medium">
                    Registry Subtotal
                  </span>
                  <span className="text-zinc-900 font-bold">
                    ৳{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-zinc-500 font-medium">
                    Logistics Allocation (Shipping)
                  </span>
                  <span className="text-zinc-900 font-bold">
                    ৳{delivery.toLocaleString()}
                  </span>
                </div>
                <div className="pt-6 flex justify-between items-baseline border-t border-zinc-900">
                  <span className="text-[14px] font-black text-zinc-900 uppercase tracking-widest">
                    Total Valuation
                  </span>
                  <span className="text-3xl font-black text-black tracking-tighter">
                    ৳{order.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Registry Operations">
            <div className="space-y-6">
              <Button
                onClick={handleCancelOrder}
                disabled={order.status !== "pending"}
                variant="outline"
                className="w-full h-14 border-zinc-200 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:border-rose-500 hover:text-rose-500! hover:bg-rose-50/30! transition-all disabled:opacity-20"
              >
                Terminate Order Flow
              </Button>
              <div className="flex items-start gap-3 p-4 bg-zinc-50 rounded-none border border-zinc-100">
                <AlertCircle
                  size={14}
                  className="text-zinc-400 shrink-0 mt-0.5"
                />
                <p className="text-[10px] text-zinc-400 font-bold leading-relaxed uppercase tracking-wider">
                  Immediate termination is restricted to &apos;Pending&apos;
                  states to maintain fiscal integrity.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-10">
          <Card title="Customer Identity">
            <div className="space-y-8">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-black text-white flex items-center justify-center text-[18px] font-black">
                  {order.user?.firstName?.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-[16px] font-black text-zinc-900 tracking-tighter">
                    {order.user?.firstName} {order.user?.lastName}
                  </span>
                  <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest mt-1">
                    {order.user?.email}
                  </span>
                </div>
              </div>
              <div className="pt-6 border-t border-zinc-100 flex flex-col gap-4">
                <DetailSection
                  label="Communication"
                  value={order.user?.phoneNumber || "NO_CONTACT_DATA"}
                />
                <DetailSection
                  label="Account Tier"
                  value={order.user?.tier || "Standard"}
                />
              </div>
            </div>
          </Card>

          <Card title="Shipping Destination">
            <div className="space-y-6">
              <div className="p-6 bg-zinc-900 text-white rounded-none border border-zinc-800 shadow-xl">
                <Truck
                  size={18}
                  className="mb-4 text-zinc-400"
                  strokeWidth={1}
                />
                <p className="text-[13px] font-bold tracking-tight leading-relaxed uppercase">
                  {order.shippingAddress}
                </p>
              </div>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest text-center px-4">
                Verified Logistics Access Point
              </p>
            </div>
          </Card>

          <Card title="Courier Logistics">
            {order.deliveryInfo?.trackingId ? (
              <div className="space-y-4">
                <div className="p-3 bg-zinc-50 border border-zinc-100 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                      Provider
                    </span>
                    <span className="text-[10px] text-zinc-900 font-bold uppercase">
                      {order.deliveryInfo.provider}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                      Tracking ID
                    </span>
                    <span className="text-[11px] text-black font-mono font-bold">
                      {order.deliveryInfo.trackingId}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                      Courier State
                    </span>
                    <span className="text-[10px] bg-black text-white px-2 py-0.5 font-bold uppercase">
                      {order.deliveryInfo.status || "Pending"}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full h-10 text-[10px] font-bold uppercase tracking-widest border-zinc-200"
                  onClick={() => {
                    const trackingUrls = {
                      steadfast: `https://portal.steadfast.com.bd/tracking/${order.deliveryInfo.trackingId}`,
                      pathao: `https://pathao.com/courier/tracking?tracking_id=${order.deliveryInfo.trackingId}`,
                      redx: `https://redx.com.bd/tracking/?trackingId=${order.deliveryInfo.trackingId}`,
                    };
                    const url = trackingUrls[order.deliveryInfo.provider];
                    if (url) window.open(url, "_blank");
                    else
                      toast.info(
                        "Manual tracking - Please check with the provider.",
                      );
                  }}
                >
                  Track on {order.deliveryInfo.provider}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                    Select Courier
                  </label>
                  <select
                    value={selectedCourier}
                    onChange={(e) => setSelectedCourier(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-zinc-200 text-[11px] font-bold text-zinc-900 focus:outline-none focus:ring-1 focus:ring-black rounded-none appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 0.75rem center",
                      backgroundSize: "1rem",
                    }}
                  >
                    <option value="steadfast">SteadFast Courier</option>
                    <option value="pathao">Pathao Courier</option>
                    <option value="redx">RedX Courier</option>
                    <option value="manual">SA Paribahan (Manual)</option>
                  </select>
                </div>

                {selectedCourier === "manual" && (
                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                      Manual Tracking ID
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Tracking ID (e.g. SA-12345)"
                      value={manualTrackingId}
                      onChange={(e) => setManualTrackingId(e.target.value)}
                      className="w-full h-10 px-3 bg-white border border-zinc-200 text-[11px] font-bold text-zinc-900 focus:outline-none focus:ring-1 focus:ring-black rounded-none"
                    />
                  </div>
                )}

                <Button
                  className="w-full h-11 bg-black text-white hover:bg-zinc-800 rounded-none text-[10px] font-bold uppercase tracking-widest mt-2"
                  onClick={handleCourierDispatch}
                  disabled={isDispatching || order.status === "cancelled"}
                >
                  {isDispatching ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Truck className="w-4 h-4 mr-2" />
                  )}
                  {selectedCourier === "manual"
                    ? "Record Dispatch"
                    : `Dispatch to ${selectedCourier === "steadfast" ? "SteadFast" : selectedCourier.charAt(0).toUpperCase() + selectedCourier.slice(1)}`}
                </Button>
              </div>
            )}
          </Card>

          <Card title="Event History">
            <div className="space-y-2">
              <StatusTimelineItem
                status="Order Registry Initialized"
                date={new Date(order.createdAt).toLocaleString()}
                current={order.status === "pending"}
              />
              {order.status !== "pending" && (
                <StatusTimelineItem
                  status={`State: ${order.status.toUpperCase()}`}
                  date="Last Synchronization Active"
                  current
                />
              )}
            </div>
          </Card>
        </div>
      </div>
      <ConfirmModal
        isOpen={isCancelModalOpen}
        onClose={() => !isCancelling && setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancellation}
        title="Terminate Order Flow"
        message={`Notice: Terminating order ${order.orderId} will permanently mark it as 'Cancelled' and restore product inventory levels. This action is irreversible.`}
        confirmLabel={isCancelling ? "Processing..." : "Confirm Termination"}
        variant="danger"
      />
    </div>
  );
}
