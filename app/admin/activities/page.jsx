"use client";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import { useOrders } from "@/hooks/api/useOrders";
import { useUsers } from "@/hooks/api/useUsers";
import {
  Clock,
  ShoppingBag,
  UserPlus,
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export default function AdminActivities() {
  const router = useRouter();
  const { useOrderHistory } = useOrders();
  const { useAllUsers } = useUsers();

  const { data: recentOrders, isLoading: ordersLoading } = useOrderHistory({
    limit: 100,
    sort: "-createdAt",
  });
  const { data: recentUsers, isLoading: usersLoading } = useAllUsers({
    limit: 100,
    sort: "-createdAt",
  });

  const allActivities = useMemo(() => {
    const orderActivities = (recentOrders || []).map((o) => ({
      id: o._id,
      type: "order",
      title: o.user
        ? `${o.user.firstName} ${o.user.lastName}`
        : `${o.guestInfo?.firstName} ${o.guestInfo?.lastName}`,
      description: `Placed Order ${o.orderId}`,
      meta: `৳${o.totalPrice?.toLocaleString()}`,
      time: new Date(o.createdAt),
      icon: ShoppingBag,
      link: `/admin/orders/${o._id}`,
      badge: o.user ? "Member" : "Guest",
    }));

    const userActivities = (recentUsers || []).map((u) => ({
      id: u._id,
      type: "user",
      title: `${u.firstName} ${u.lastName}`,
      description: `New Identity Registered: ${u.email}`,
      meta: u.role?.toUpperCase(),
      time: new Date(u.createdAt),
      icon: UserPlus,
      link: `/admin/users`,
      badge: "New User",
    }));

    return [...orderActivities, ...userActivities]
      .sort((a, b) => b.time - a.time);
  }, [recentOrders, recentUsers]);

  return (
    <div className="space-y-8 md:space-y-12 pb-24">
      <ModuleHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Activities", active: true }
        ]}
        title="All Activities"
        icon={Clock}
      />

      <div className="bg-white border border-black/5 p-6 md:p-8">
        <div className="space-y-4">
          {ordersLoading || usersLoading ? (
            <div className="p-12 text-center text-[10px] font-bold uppercase tracking-widest text-zinc-300 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Synchronizing Global Feed...
            </div>
          ) : allActivities.length > 0 ? (
            allActivities.map((activity) => (
              <div
                key={`${activity.type}-${activity.id}`}
                className="flex items-center justify-between p-5 bg-white border border-zinc-100 hover:border-black transition-all group cursor-pointer"
                onClick={() => router.push(activity.link)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-zinc-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                    <activity.icon size={16} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-zinc-900 tracking-tight">
                      {activity.title}
                      <span className="ml-2 text-[8px] font-black px-1 py-0.5 border border-zinc-100 uppercase tracking-widest">
                        {activity.badge}
                      </span>
                    </p>
                    <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest mt-0.5">
                      {activity.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-black text-zinc-900 tracking-tight">
                    {activity.meta}
                  </p>
                  <p className="text-[8px] text-zinc-400 font-black uppercase tracking-widest mt-0.5">
                    {activity.time.toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    {activity.time.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              No Registry Activity Detected
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
