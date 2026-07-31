import { useRouter } from "next/navigation";
import { ShoppingBag, UserPlus, ArrowUpRight } from "lucide-react";

export default function RecentActivity({ orders = [], users = [] }) {
  const router = useRouter();

  const allActivities = [
    ...orders.map((o) => ({
      id: o._id,
      type: "order",
      title: o.user
        ? `${o.user.firstName} ${o.user.lastName}`
        : o.guestInfo
          ? `${o.guestInfo.firstName} ${o.guestInfo.lastName}`
          : "Guest",
      description: `Placed Order ${o.orderId}`,
      meta: `৳${o.totalPrice?.toLocaleString()}`,
      time: new Date(o.createdAt),
      icon: ShoppingBag,
      link: `/admin/orders/${o._id}`,
      badge: o.user ? "Member" : "Guest",
    })),
    ...users.map((u) => ({
      id: u._id,
      type: "user",
      title: `${u.firstName} ${u.lastName}`,
      description: `New account registered: ${u.email}`,
      meta: u.role?.toUpperCase(),
      time: new Date(u.createdAt),
      icon: UserPlus,
      link: "/admin/users",
      badge: "New User",
    })),
  ]
    .sort((a, b) => b.time - a.time)
    .slice(0, 6);

  if (allActivities.length === 0) {
    return (
      <div className="bg-white border border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[10px] font-bold text-zinc-900 uppercase tracking-[0.15em]">
            Recent Activity
          </p>
        </div>
        <p className="text-[11px] text-zinc-400 text-center py-6">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <p className="text-[10px] font-bold text-zinc-900 uppercase tracking-[0.15em]">
          Recent Activity
        </p>
        <button
          onClick={() => router.push("/admin/orders")}
          className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest hover:text-zinc-900 transition-colors flex items-center gap-1"
        >
          View All <ArrowUpRight size={10} />
        </button>
      </div>

      <div className="space-y-1">
        {allActivities.map((activity) => (
          <div
            key={`${activity.type}-${activity.id}`}
            onClick={() => router.push(activity.link)}
            className="flex items-center justify-between py-3.5 border-b border-zinc-50 last:border-0 cursor-pointer hover:bg-zinc-50 transition-colors px-2 -mx-2 rounded"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-zinc-50 flex items-center justify-center flex-shrink-0">
                <activity.icon size={15} strokeWidth={1.5} className="text-zinc-400" />
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-zinc-800 truncate">
                  {activity.title}
                  <span className="ml-2 text-[8px] font-bold px-1.5 py-0.5 bg-zinc-100 text-zinc-500 uppercase tracking-wider">
                    {activity.badge}
                  </span>
                </p>
                <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                  {activity.description}
                </p>
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-3">
              <p className="text-[12px] font-bold text-zinc-700">
                {activity.meta}
              </p>
              <p className="text-[8px] text-zinc-400 font-medium uppercase tracking-wider mt-0.5">
                {activity.time.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
