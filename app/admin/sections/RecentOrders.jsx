import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

const STATUS_COLORS = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-purple-50 text-purple-700 border-purple-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  failed: "bg-zinc-50 text-zinc-600 border-zinc-200",
  returned: "bg-orange-50 text-orange-700 border-orange-200",
  "on-hold": "bg-amber-50 text-amber-700 border-amber-200",
  refused: "bg-red-50 text-red-600 border-red-200",
};

export default function RecentOrders({ orders = [] }) {
  const router = useRouter();

  return (
    <div className="bg-white border border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <p className="text-[10px] font-bold text-zinc-900 uppercase tracking-[0.15em]">
          Recent Orders
        </p>
        <button
          onClick={() => router.push("/admin/orders")}
          className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest hover:text-zinc-900 transition-colors flex items-center gap-1"
        >
          View All <ArrowUpRight size={10} />
        </button>
      </div>
      <div className="space-y-3">
        {orders.map((order) => {
          const name = order.user
            ? `${order.user.firstName} ${order.user.lastName}`
            : order.guestInfo
              ? `${order.guestInfo.firstName} ${order.guestInfo.lastName}`
              : "Guest";
          return (
            <div
              key={order._id}
              onClick={() => router.push(`/admin/orders/${order._id}`)}
              className="flex items-center justify-between py-3 border-b border-zinc-50 last:border-0 cursor-pointer hover:bg-zinc-50 transition-colors px-2 -mx-2 rounded"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-500">
                  {name.charAt(0)}
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-zinc-800">{name}</p>
                  <p className="text-[9px] text-zinc-400 mt-0.5">{order.orderId}</p>
                </div>
              </div>
              <div className="text-right flex items-center gap-3">
                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 border ${STATUS_COLORS[order.status] || "bg-zinc-50 text-zinc-600 border-zinc-200"}`}>
                  {order.status}
                </span>
                <p className="text-[12px] font-bold text-zinc-700 w-20 text-right">
                  ৳{order.totalPrice?.toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
