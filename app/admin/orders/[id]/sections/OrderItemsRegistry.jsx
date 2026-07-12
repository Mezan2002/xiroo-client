"use client";
import { Button } from "@/components/ui/Button";
import { AlertCircle, ShoppingBag } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";

const AdminInvoiceDownload = dynamic(
  () => import("@/components/admin/orders/AdminInvoiceDownload"),
  { ssr: false }
);

export default function OrderItemsRegistry({ order, handleCancelOrder }) {
  const rawSubtotal = order.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const bundleGroups = {};
  order.items.forEach((item) => {
    const itemSubtotal = item.price * item.quantity;
    if (item.bundleId) {
      if (!bundleGroups[item.bundleId]) {
        bundleGroups[item.bundleId] = { quantity: 0, subtotal: 0 };
      }
      bundleGroups[item.bundleId].quantity += item.quantity;
      bundleGroups[item.bundleId].subtotal += itemSubtotal;
    }
  });

  let autoBundleDiscountAmount = 0;
  Object.values(bundleGroups).forEach((group) => {
    if (group.quantity >= 2) {
      autoBundleDiscountAmount += group.subtotal * 0.10;
    }
  });

  const subtotal = rawSubtotal - autoBundleDiscountAmount;
  const delivery = order.shippingFee !== undefined ? order.shippingFee : (order.totalPrice - subtotal);

  return (
    <div className="space-y-6">
      {/* Items Table */}
      <div className="bg-white border border-zinc-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="text-[13px] font-bold text-zinc-900 tracking-tight">Order Items</h3>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            {order.items.length} units
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 border-b border-zinc-100">
              <tr>
                <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Product</th>
                <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">Qty</th>
                <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Price</th>
                <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {order.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 bg-white border border-zinc-100 flex items-center justify-center overflow-hidden shrink-0">
                        {item.product?.images?.[0] ? (
                          <Image
                            fill
                            src={item.product.images[0]}
                            alt={item.product.title || "Product"}
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <ShoppingBag size={16} strokeWidth={1} className="text-zinc-200" />
                        )}
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-[100px]">
                        <span className="text-[13px] font-bold text-zinc-900 tracking-tight leading-tight line-clamp-1">
                          {item.product?.title || "Unknown Product"}
                        </span>
                        {item.variant && item.variant !== "Standard" && (
                          <span className="text-[10px] text-zinc-500 font-medium">{item.variant}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-[12px] font-bold text-zinc-500 font-mono">
                    x{item.quantity}
                  </td>
                  <td className="px-6 py-4 text-right text-[12px] font-bold text-zinc-500 whitespace-nowrap font-mono">
                    ৳{item.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right text-[13px] font-black text-zinc-900 whitespace-nowrap font-mono">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pricing Summary */}
      <div className="bg-white border border-zinc-200 p-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-[12px]">
            <span className="text-zinc-500 font-medium">Subtotal</span>
            <span className="text-zinc-900 font-bold font-mono">৳{rawSubtotal.toLocaleString()}</span>
          </div>
          {autoBundleDiscountAmount > 0 && (
            <div className="flex justify-between items-center text-[12px] text-green-600">
              <span className="font-medium">Bundle Discount (10%)</span>
              <span className="font-bold font-mono">-৳{autoBundleDiscountAmount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-[12px]">
            <span className="text-zinc-500 font-medium">Shipping</span>
            <span className="text-zinc-900 font-bold font-mono">৳{delivery.toLocaleString()}</span>
          </div>
          <div className="pt-3 flex justify-between items-baseline border-t border-zinc-200">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Total</span>
            <span className="text-[20px] font-black text-zinc-900 tracking-tight font-mono">৳{order.totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white border border-zinc-200 p-6 space-y-4">
        <AdminInvoiceDownload order={order} />
        <Button
          onClick={handleCancelOrder}
          disabled={order.status !== "pending"}
          variant="outline"
          className="w-full h-11 border-zinc-200 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:border-rose-500 hover:text-rose-500! hover:bg-rose-50/30! transition-all disabled:opacity-20"
        >
          Cancel Order
        </Button>
        {order.status !== "pending" && (
          <p className="text-[10px] text-zinc-400 text-center">Only pending orders can be cancelled</p>
        )}
      </div>
    </div>
  );
}
