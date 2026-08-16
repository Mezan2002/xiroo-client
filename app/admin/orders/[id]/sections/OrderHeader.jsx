"use client";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import { Select } from "@/components/ui/Select";
import {
  AlertCircle,
  Ban,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  Package,
  PackageCheck,
  Palette,
  PauseCircle,
  RotateCcw,
  ShoppingBag,
  Truck,
  Undo2,
  UserCheck,
  XCircle,
  ArrowRightLeft,
} from "lucide-react";
import dynamic from "next/dynamic";

const AdminInvoiceDownload = dynamic(
  () => import("@/components/admin/orders/AdminInvoiceDownload"),
  { ssr: false },
);

const statusStyles = {
  pending: {
    dot: "bg-zinc-400",
    text: "text-zinc-600",
    bg: "bg-zinc-100",
    border: "border-zinc-200",
  },
  processing: {
    dot: "bg-blue-500",
    text: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  "given-for-design": {
    dot: "bg-purple-500",
    text: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  "ready-to-pack": {
    dot: "bg-amber-500",
    text: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  "packed-for-delivery": {
    dot: "bg-orange-500",
    text: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  shipped: {
    dot: "bg-blue-500",
    text: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  "at-last-hub": {
    dot: "bg-cyan-500",
    text: "text-cyan-600",
    bg: "bg-cyan-50",
    border: "border-cyan-200",
  },
  "assigned-for-delivery": {
    dot: "bg-indigo-500",
    text: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
  },
  delivered: {
    dot: "bg-emerald-500",
    text: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  "partially-delivered": {
    dot: "bg-teal-500",
    text: "text-teal-600",
    bg: "bg-teal-50",
    border: "border-teal-200",
  },
  returned: {
    dot: "bg-rose-500",
    text: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-200",
  },
  "return-received": {
    dot: "bg-rose-500",
    text: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-200",
  },
  "on-hold": {
    dot: "bg-amber-500",
    text: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  cancelled: {
    dot: "bg-rose-500",
    text: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-200",
  },
  failed: {
    dot: "bg-rose-500",
    text: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-200",
  },
  refused: {
    dot: "bg-rose-500",
    text: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-200",
  },
  "exchange-requested": {
    dot: "bg-violet-500",
    text: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
  },
  "exchange-accepted": {
    dot: "bg-blue-500",
    text: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  "exchange-shipped": {
    dot: "bg-cyan-500",
    text: "text-cyan-600",
    bg: "bg-cyan-50",
    border: "border-cyan-200",
  },
  "exchange-delivered": {
    dot: "bg-emerald-500",
    text: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
};

const terminalStatuses = ["delivered", "cancelled", "failed", "refused", "exchange-delivered"];

// Status flow order for the dropdown
const statusOptions = [
  { value: "pending", label: "Pending", icon: Clock },
  { value: "processing", label: "Processing", icon: Loader2 },
  { value: "given-for-design", label: "Given for Design", icon: Palette },
  { value: "ready-to-pack", label: "Ready to Pack", icon: Package },
  {
    value: "packed-for-delivery",
    label: "Packed for Delivery",
    icon: PackageCheck,
  },
  { value: "shipped", label: "Shipped", icon: Truck },
  { value: "at-last-hub", label: "At Last Hub", icon: MapPin },
  {
    value: "assigned-for-delivery",
    label: "Assigned for Delivery",
    icon: UserCheck,
  },
  { value: "delivered", label: "Delivered", icon: CheckCircle2 },
  { value: "partially-delivered", label: "Partially Delivered", icon: Truck },
  { value: "returned", label: "Returned", icon: Undo2 },
  { value: "return-received", label: "Return Received", icon: RotateCcw },
  { value: "on-hold", label: "On Hold", icon: PauseCircle },
  { value: "cancelled", label: "Cancelled", icon: AlertCircle },
  { value: "failed", label: "Failed", icon: XCircle },
  { value: "refused", label: "Refused", icon: Ban },
];

export default function OrderHeader({
  order,
  isUpdatingStatus,
  handleStatusChange,
  handleTogglePaid,
  isTogglingPaid,
}) {
  const hasActiveExchange = order.exchange && ["requested", "accepted", "shipped"].includes(order.exchange.status);

  const displayStatus = hasActiveExchange
    ? `exchange-${order.exchange.status}`
    : order.status;

  const styles = statusStyles[displayStatus] || statusStyles.pending;
  const label =
    displayStatus?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) ||
    "Unknown";

  const exchangeStatusOptions = hasActiveExchange
    ? [
        { value: "exchange-requested", label: "Exchange Requested", icon: ArrowRightLeft },
        { value: "exchange-accepted", label: "Exchange Accepted", icon: CheckCircle2 },
        { value: "exchange-shipped", label: "Exchange Shipped", icon: Truck },
        { value: "exchange-delivered", label: "Exchange Delivered", icon: PackageCheck },
      ]
    : [];

  const activeStatusOptions = hasActiveExchange ? exchangeStatusOptions : statusOptions;

  return (
    <ModuleHeader
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Orders", href: "/admin/orders" },
        { label: order.orderId, active: true },
      ]}
      title={
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-between lg:justify-normal">
          <span className="text-xl sm:text-2xl md:text-3xl">#{order.orderId}</span>
          <div
            className={`inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 h-7 sm:h-8 ${styles.bg} border ${styles.border}`}
          >
            <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${styles.dot}`} />
            <span
              className={`text-[9px] sm:text-[10px] font-bold tracking-wide ${styles.text} whitespace-nowrap`}
            >
              {label}
            </span>
          </div>
        </div>
      }
      icon={ShoppingBag}
      actions={
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Paid/Unpaid Toggle */}
          <button
            onClick={() => handleTogglePaid(!order.isPaid)}
            disabled={isTogglingPaid}
            className={`h-9 sm:h-10 px-3 sm:px-4 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em] border transition-all flex items-center gap-2 ${
              order.isPaid
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
            } ${isTogglingPaid ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {isTogglingPaid ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <span className={`w-2 h-2 rounded-full ${order.isPaid ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            )}
            {order.isPaid ? 'Paid' : 'Unpaid'}
          </button>

          {/* Status dropdown */}
          <div className="w-36 sm:w-52">
            {isUpdatingStatus && (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-400 absolute ml-[-20px] mt-2.5" />
            )}
            <Select
              options={activeStatusOptions}
              value={displayStatus}
              onChange={handleStatusChange}
              className="!h-9 sm:!h-10"
              disabled={isUpdatingStatus || terminalStatuses.includes(displayStatus)}
            />
          </div>

          {/* Invoice download */}
          <AdminInvoiceDownload order={order} />
        </div>
      }
    />
  );
}
