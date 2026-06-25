"use client";
import { Button } from "@/components/ui/Button";
import { AlertCircle, ShoppingBag } from "lucide-react";
import Image from "next/image";

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
    <div className="space-y-8 md:space-y-10">
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
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest whitespace-nowrap">
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
                      <div className="relative w-16 h-16 bg-white border border-zinc-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                        {item.product?.images?.[0] ? (
                          <Image
                            fill
                            src={item.product.images[0]}
                            alt={item.product.title || "Product"}
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <ShoppingBag
                            size={20}
                            strokeWidth={1}
                            className="text-zinc-200"
                          />
                        )}
                      </div>
                      <div className="flex flex-col gap-1 min-w-[120px]">
                        <span className="text-[14px] font-bold text-zinc-900 tracking-tight leading-tight line-clamp-2">
                          {item.product?.title || "Unknown Product"}
                        </span>
                        {item.variant && item.variant !== "Standard" && (
                          <span className="text-[11px] text-zinc-500 font-medium">
                            {item.variant}
                          </span>
                        )}
                        <span className="text-[10px] text-zinc-600 font-medium uppercase tracking-widest">
                          ID:{" "}
                          {item.product?.sku ||
                            item.product?._id?.slice(-8) ||
                            "N/A"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center text-[13px] font-bold text-zinc-500 font-mono">
                    x{item.quantity}
                  </td>
                  <td className="px-6 py-6 text-right text-[13px] font-bold text-zinc-500 whitespace-nowrap font-mono">
                    ৳{item.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-6 text-right text-[15px] font-black text-zinc-900 whitespace-nowrap font-mono">
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
              <span className="text-zinc-900 font-bold font-mono">
                ৳{rawSubtotal.toLocaleString()}
              </span>
            </div>
            {autoBundleDiscountAmount > 0 && (
              <div className="flex justify-between items-center text-[13px] text-green-600">
                <span className="font-medium">
                  Bundle Discount (10%)
                </span>
                <span className="font-bold font-mono">
                  -৳{autoBundleDiscountAmount.toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-zinc-500 font-medium">
                Logistics Allocation
              </span>
              <span className="text-zinc-900 font-bold font-mono">
                ৳{delivery.toLocaleString()}
              </span>
            </div>
            <div className="pt-6 flex justify-between items-baseline border-t border-zinc-900">
              <span className="text-[14px] font-black text-zinc-900 uppercase tracking-widest">
                Total Valuation
              </span>
              <span className="text-3xl font-black text-black tracking-tighter font-mono">
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
          <div className="flex items-start gap-3 p-4 bg-zinc-50 border border-zinc-100">
            <AlertCircle size={14} className="text-zinc-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-zinc-400 font-bold leading-relaxed uppercase tracking-wider">
              Immediate termination is restricted to &apos;Pending&apos; states
              to maintain fiscal integrity.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
