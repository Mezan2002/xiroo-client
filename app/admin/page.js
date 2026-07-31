"use client";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import { useDashboard } from "@/hooks/api/useDashboard";
import { useUsers } from "@/hooks/api/useUsers";
import {
  LayoutDashboard, TrendingUp, ShoppingBag, Package, Users,
  DollarSign, BarChart3, CreditCard,
} from "lucide-react";
import StatCard from "./sections/StatCard";
import RevenueChart from "./sections/RevenueChart";
import OrdersChart from "./sections/OrdersChart";
import OrdersOverTime from "./sections/OrdersOverTime";
import TopProducts from "./sections/TopProducts";
import RecentOrders from "./sections/RecentOrders";
import BusinessMetrics from "./sections/BusinessMetrics";
import SplitChart from "./sections/SplitChart";
import UserTiers from "./sections/UserTiers";
import FraudOverview from "./sections/FraudOverview";
import RecentActivity from "./sections/RecentActivity";

const SkeletonCard = () => (
  <div className="h-40 md:h-44 bg-zinc-50 animate-pulse border border-zinc-100" />
);

const SkeletonChart = () => (
  <div className="h-[300px] bg-zinc-50 animate-pulse border border-zinc-100" />
);

export default function AdminDashboard() {
  const { useDashboardStats } = useDashboard();
  const { useAllUsers } = useUsers();
  const { data: response, isLoading } = useDashboardStats();
  const { data: recentUsers } = useAllUsers({ limit: 10, sort: "-createdAt" });
  const stats = response?.data;

  return (
    <div className="space-y-8 md:space-y-12 pb-24">
      <ModuleHeader
        label="Dashboard"
        title="Dashboard"
        icon={LayoutDashboard}
        tabs={["Overview", "Live", "Reports"]}
      />

      {/* Hero Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)
          : (
            <>
              <StatCard
                label="Total Revenue"
                value={`৳${(stats?.revenue?.total || 0).toLocaleString()}`}
                icon={TrendingUp}
                trend={stats?.revenue?.ordersGrowth}
                trendLabel="vs last 30 days"
              />
              <StatCard
                label="Completed Revenue"
                value={`৳${(stats?.revenue?.completed || 0).toLocaleString()}`}
                icon={DollarSign}
                trendLabel={`${stats?.orders?.completed || 0} orders`}
                accent
              />
              <StatCard
                label="Total Orders"
                value={(stats?.orders?.total || 0).toLocaleString()}
                icon={ShoppingBag}
                trend={stats?.revenue?.ordersGrowth}
                trendLabel="vs last 30 days"
              />
              <StatCard
                label="Avg. Order Value"
                value={`৳${(stats?.revenue?.averageOrderValue || 0).toLocaleString()}`}
                icon={CreditCard}
                trendLabel="per order"
              />
            </>
          )}
      </div>

      {/* Secondary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isLoading
          ? [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)
          : (
            <>
              <StatCard
                label="Total Users"
                value={(stats?.users?.total || 0).toLocaleString()}
                icon={Users}
                trendLabel={`${stats?.users?.newLast30Days || 0} new (30d)`}
              />
              <StatCard
                label="Products"
                value={(stats?.products?.total || 0).toLocaleString()}
                icon={Package}
                trendLabel={`${stats?.products?.lowStock || 0} low stock`}
              />
              <StatCard
                label="Active Discounts"
                value={(stats?.discounts?.active || 0).toLocaleString()}
                icon={BarChart3}
                trendLabel={`${stats?.discounts?.total || 0} total`}
                accent
              />
              <StatCard
                label="Customer Records"
                value={(stats?.customers?.total || 0).toLocaleString()}
                icon={Users}
                trendLabel={`${stats?.customers?.blacklisted || 0} blacklisted`}
              />
            </>
          )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {isLoading ? (
          <>
            <SkeletonChart />
            <SkeletonChart />
          </>
        ) : (
          <>
            <RevenueChart data={stats?.orders?.revenueByDay || []} />
            <OrdersOverTime data={stats?.orders?.byDay || []} />
          </>
        )}
      </div>

      {/* Recent Activity */}
      <RecentActivity
        orders={stats?.recentOrders || []}
        users={recentUsers || []}
      />

      {/* Status + Payment + Delivery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isLoading ? (
          [1, 2, 3].map((i) => <SkeletonChart key={i} />)
        ) : (
          <>
            <OrdersChart data={stats?.orders?.byStatus || []} />
            <SplitChart
              title="Payment Methods"
              subtitle="COD vs Online"
              data={stats?.orders?.paymentMethod || []}
            />
            <SplitChart
              title="Delivery Methods"
              subtitle="Normal vs Fast"
              data={stats?.orders?.deliveryMethod || []}
            />
          </>
        )}
      </div>

      {/* Products + Recent Orders + Tiers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {isLoading ? (
          [1, 2, 3].map((i) => <SkeletonChart key={i} />)
        ) : (
          <>
            <TopProducts products={stats?.products?.topSelling || []} />
            <RecentOrders orders={stats?.recentOrders || []} />
            <UserTiers tiers={stats?.users?.tiers || []} />
          </>
        )}
      </div>

      {/* Business Metrics + Fraud */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {isLoading ? (
          [1, 2].map((i) => <SkeletonChart key={i} />)
        ) : (
          <>
            <BusinessMetrics stats={stats} />
            <FraudOverview fraudStats={stats?.fraud?.byStatus || []} />
          </>
        )}
      </div>
    </div>
  );
}
