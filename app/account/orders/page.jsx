"use client";

import { Button } from "@/components/ui/Button";
import { apiRequest } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Package } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
  const {
    data: orders = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await apiRequest("/orders/my-orders");
      if (!response.success) throw new Error("Order Registry Sync Failure");
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-10 animate-pulse">
        <div className="h-8 w-48 bg-gray-100 mb-6" />
        {[1, 2].map((i) => (
          <div key={i} className="h-48 border border-gray-100 bg-gray-50/30" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-montserrat font-semibold">
          Orders History
        </h2>
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 px-3 py-1 border border-gray-100 italic">
          Total {orders.length} orders
        </span>
      </div>

      <div className="space-y-6">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order._id || order.id}
              className="group border border-gray-100 p-8 md:p-12 bg-white transition-all duration-500"
            >
              <div className="flex flex-col md:flex-row justify-between gap-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] w-24">
                      Order ID
                    </span>
                    <span className="text-[14px] font-montserrat font-bold text-black italic tracking-tight">
                      #{order.orderId || order.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] w-24">
                      Placed On
                    </span>
                    <span className="text-[13px] font-montserrat font-bold text-black uppercase tracking-tight">
                      {new Date(
                        order.createdAt || order.date,
                      ).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="space-y-6 md:text-right">
                  <div className="flex items-center md:justify-end gap-10">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                      Status
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] bg-gray-50 text-gray-400 px-4 py-1.5 border border-gray-100">
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center md:justify-end gap-10">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                      Total
                    </span>
                    <span className="text-3xl font-montserrat font-bold text-black tracking-tighter">
                      <span className="font-sans mr-0.5">৳</span>
                      {order.totalPrice || order.total}
                    </span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-50 my-10" />

              <div className="flex justify-between items-center">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] italic">
                  {order.items?.length || 0} Items in this order
                </p>
                <Link
                  href={`/account/orders/${(order._id || order.id).replace("##", "")}`}
                >
                  <Button className="bg-black text-white hover:bg-zinc-800 px-10 h-12 tracking-widest font-bold uppercase text-[11px] rounded-none group">
                    VIEW DETAILS
                  </Button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-gray-50 bg-gray-50/20 rounded-sm">
            <Package className="w-12 h-12 text-gray-200 mx-auto mb-6 stroke-1" />
            <p className="text-gray-400 text-sm font-medium uppercase tracking-widest">
              No orders placed yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
