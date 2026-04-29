"use client";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import { Button } from "@/components/ui/Button";
import { useOrders } from "@/hooks/api/useOrders";
import { useUsers } from "@/hooks/api/useUsers";
import {
  BarChart3,
  Clock,
  ExternalLink,
  LayoutDashboard,
  ShoppingBag,
  TrendingUp,
  UserPlus,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export default function AdminDashboard() {
  const router = useRouter();
  const { useOrderStats, useOrderHistory } = useOrders();
  const { useAllUsers } = useUsers();

  const { data: statsData, isLoading: statsLoading } = useOrderStats();
  const { data: recentOrders, isLoading: ordersLoading } = useOrderHistory({
    limit: 10,
    sort: "-createdAt",
  });
  const { data: recentUsers, isLoading: usersLoading } = useAllUsers({
    limit: 10,
    sort: "-createdAt",
  });

  const stats = [
    {
      label: "Total Revenue",
      value: `৳${(statsData?.totalRevenue || 0).toLocaleString()}`,
      icon: TrendingUp,
    },
    {
      label: "Total Orders",
      value: (statsData?.totalOrders || 0).toString(),
      icon: ShoppingBag,
    },
    {
      label: "Pending Registry",
      value: (
        statsData?.statusDistribution?.find((s) => s._id === "pending")
          ?.count || 0
      ).toString(),
      icon: Clock,
    },
  ];

  // Merge and sort activities
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
      .sort((a, b) => b.time - a.time)
      .slice(0, 6);
  }, [recentOrders, recentUsers]);

  return (
    <div className="space-y-8 md:space-y-12 pb-24">
      <ModuleHeader
        label="Dashboard"
        title="Dashboard"
        icon={LayoutDashboard}
        tabs={["Overview", "Live", "Reports"]}
      />

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
        {statsLoading
          ? [1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-40 md:h-48 bg-gray-50 animate-pulse border border-black/5"
              ></div>
            ))
          : stats.map((stat) => (
              <div
                key={stat.label}
                className="group relative p-6 md:p-8 bg-white border border-black/5 hover:border-black transition-all cursor-default"
              >
                <div className="flex justify-between items-start mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                    <stat.icon
                      className="w-5 h-5 md:w-6 md:h-6"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] md:text-[10px] font-bold text-black/40 uppercase tracking-[0.2em]">
                    {stat.label}
                  </p>
                  <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-black">
                    {stat.value}
                  </h3>
                </div>
              </div>
            ))}
      </div>

      {/* Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        {/* Activity feed */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <div className="flex items-center justify-between border-b border-black/5 pb-4">
            <h3 className="text-[11px] md:text-[12px] font-bold uppercase tracking-widest flex items-center gap-2">
              <Clock size={14} /> Recent Activity
            </h3>
            <Button
              variant="ghost"
              icon={ExternalLink}
              onClick={() => router.push("/admin/orders")}
              className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-black/40 hover:text-black"
            >
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {ordersLoading || usersLoading ? (
              <div className="p-12 text-center text-[10px] font-bold uppercase tracking-widest text-zinc-300 animate-pulse">
                Synchronizing Global Feed...
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

        {/* Live Pulse */}
        <div className="space-y-6 md:space-y-8">
          <div className="flex items-center border-b border-black/5 pb-4">
            <h3 className="text-[11px] md:text-[12px] font-bold uppercase tracking-widest flex items-center gap-2">
              <Zap size={14} className="text-yellow-500 fill-yellow-500" /> Live
              Store Pulse
            </h3>
          </div>

          <div className="aspect-4/5 bg-black p-6 md:p-8 flex flex-col justify-between text-white relative overflow-hidden group">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>

            <div className="space-y-2 relative z-10">
              <p className="text-[9px] md:text-[10px] font-bold text-white/40 uppercase tracking-widest">
                Active Sessions
              </p>
              <h4 className="text-5xl md:text-6xl font-extrabold tracking-tighter">
                0
              </h4>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
                    All systems normal
                  </span>
                </div>
                <BarChart3 size={20} className="text-white/20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
