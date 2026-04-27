"use client";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import { Select } from "@/components/ui/Select";
import { Clock, Truck, CheckCircle2, AlertCircle, Loader2, ShoppingBag } from "lucide-react";

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-zinc-100 text-zinc-600 border-zinc-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    warning: "bg-amber-50 text-amber-700 border-amber-100",
    danger: "bg-rose-50 text-rose-700 border-rose-100",
    info: "bg-zinc-900 text-white border-zinc-900",
  };
  return (
    <span className={`px-2 py-0.5 rounded-none text-[10px] font-bold border uppercase tracking-widest ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default function OrderHeader({ order, isUpdatingStatus, handleStatusChange }) {
  const statusOptions = [
    { value: "pending", label: "Pending", icon: Clock },
    { value: "processing", label: "Processing", icon: Clock },
    { value: "shipped", label: "Shipped", icon: Truck },
    { value: "delivered", label: "Delivered", icon: CheckCircle2 },
    { value: "cancelled", label: "Cancelled", icon: AlertCircle },
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
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2 sm:pr-4 sm:border-r border-zinc-100">
            <Badge
              variant={order.status === "cancelled" ? "danger" : order.status === "delivered" ? "success" : "info"}
              className="w-full sm:w-auto text-center"
            >
              ORDER: {order.status}
            </Badge>
          </div>
          <div className="flex flex-col gap-1 w-full sm:w-40">
            <div className="flex items-center gap-2">
              {isUpdatingStatus && <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />}
              <Select
                options={statusOptions}
                value={order.status}
                onChange={handleStatusChange}
                className="w-full h-10 text-[12px] font-bold rounded-none"
                disabled={isUpdatingStatus || ["delivered", "cancelled", "failed"].includes(order.status)}
              />
            </div>
          </div>
        </div>
      }
    />
  );
}
