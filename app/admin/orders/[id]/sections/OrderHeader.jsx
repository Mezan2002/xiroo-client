"use client";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import { Select } from "@/components/ui/Select";
import dynamic from "next/dynamic";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  ShoppingBag,
  Truck,
  XCircle,
  PauseCircle,
  Undo2,
  Ban,
} from "lucide-react";

const AdminInvoiceDownload = dynamic(
  () => import("@/components/admin/orders/AdminInvoiceDownload"),
  { ssr: false }
);

const statusStyles = {
  pending:    { dot: "bg-zinc-400",    text: "text-zinc-600",    bg: "bg-zinc-100",   border: "border-zinc-200" },
  processing: { dot: "bg-blue-500",    text: "text-blue-600",    bg: "bg-blue-50",    border: "border-blue-200" },
  shipped:    { dot: "bg-blue-500",    text: "text-blue-600",    bg: "bg-blue-50",    border: "border-blue-200" },
  delivered:  { dot: "bg-emerald-500", text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  cancelled:  { dot: "bg-rose-500",    text: "text-rose-600",    bg: "bg-rose-50",    border: "border-rose-200" },
  failed:     { dot: "bg-rose-500",    text: "text-rose-600",    bg: "bg-rose-50",    border: "border-rose-200" },
  returned:   { dot: "bg-rose-500",    text: "text-rose-600",    bg: "bg-rose-50",    border: "border-rose-200" },
  "on-hold":  { dot: "bg-amber-500",  text: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-200" },
  refused:    { dot: "bg-rose-500",    text: "text-rose-600",    bg: "bg-rose-50",    border: "border-rose-200" },
};

const terminalStatuses = ["delivered", "cancelled", "failed", "returned", "refused"];

export default function OrderHeader({ order, isUpdatingStatus, handleStatusChange }) {
  const styles = statusStyles[order.status] || statusStyles.pending;
  const label = order.status?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Unknown";

  const statusOptions = [
    { value: "pending",    label: "Pending",    icon: Clock },
    { value: "processing", label: "Processing", icon: Clock },
    { value: "on-hold",    label: "On Hold",    icon: PauseCircle },
    { value: "shipped",    label: "Shipped",    icon: Truck },
    { value: "delivered",  label: "Delivered",  icon: CheckCircle2 },
    { value: "returned",   label: "Returned",   icon: Undo2 },
    { value: "refused",    label: "Refused",    icon: Ban },
    { value: "cancelled",  label: "Cancelled",  icon: AlertCircle },
    { value: "failed",     label: "Failed",     icon: XCircle },
  ];

  return (
    <ModuleHeader
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Orders", href: "/admin/orders" },
        { label: order.orderId, active: true },
      ]}
      title={`#${order.orderId}`}
      icon={ShoppingBag}
      actions={
        <div className="flex items-center gap-3">
          {/* Status pill */}
          <div className={`inline-flex items-center gap-2 px-3.5 py-2 ${styles.bg} border ${styles.border}`}>
            <span className={`w-2 h-2 rounded-full ${styles.dot}`} />
            <span className={`text-[11px] font-bold tracking-wide ${styles.text}`}>{label}</span>
          </div>

          {/* Status dropdown */}
          <div className="w-44">
            {isUpdatingStatus && (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-400 absolute ml-[-20px] mt-2.5" />
            )}
            <Select
              options={statusOptions}
              value={order.status}
              onChange={handleStatusChange}
              size="sm"
              disabled={isUpdatingStatus || terminalStatuses.includes(order.status)}
            />
          </div>

          {/* Invoice download */}
          <AdminInvoiceDownload order={order} />
        </div>
      }
    />
  );
}
