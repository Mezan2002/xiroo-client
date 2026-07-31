import {
  Users, Package, Star, Shield, AlertTriangle,
  Headphones, BadgeCheck, Megaphone, Ticket,
  UserCheck,
} from "lucide-react";

const MetricItem = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center justify-between py-3 border-b border-zinc-50 last:border-0">
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 flex items-center justify-center ${color}`}>
        <Icon size={14} />
      </div>
      <span className="text-[11px] text-zinc-500">{label}</span>
    </div>
    <span className="text-[13px] font-bold text-zinc-800">{value}</span>
  </div>
);

export default function BusinessMetrics({ stats }) {
  return (
    <div className="bg-white border border-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 md:p-8">
      <p className="text-[10px] font-bold text-zinc-900 uppercase tracking-[0.15em] mb-6">
        Business Overview
      </p>
      <div className="space-y-0">
        <MetricItem icon={Users} label="Registered Users" value={stats?.users?.total || 0} color="bg-blue-50 text-blue-500" />
        <MetricItem icon={UserCheck} label="New Users (30d)" value={stats?.users?.newLast30Days || 0} color="bg-blue-50 text-blue-500" />
        <MetricItem icon={Shield} label="Customer Records" value={stats?.customers?.total || 0} color="bg-cyan-50 text-cyan-500" />
        <MetricItem icon={AlertTriangle} label="Blacklisted" value={stats?.customers?.blacklisted || 0} color="bg-red-50 text-red-500" />
        <MetricItem icon={Package} label="Total Products" value={stats?.products?.total || 0} color="bg-purple-50 text-purple-500" />
        <MetricItem icon={AlertTriangle} label="Low Stock Items" value={stats?.products?.lowStock || 0} color="bg-amber-50 text-amber-500" />
        <MetricItem icon={Star} label="Total Reviews" value={stats?.reviews?.total || 0} color="bg-yellow-50 text-yellow-500" />
        <MetricItem icon={Star} label="Pending Reviews" value={stats?.reviews?.pending || 0} color="bg-yellow-50 text-yellow-500" />
        <MetricItem icon={BadgeCheck} label="Pending Testimonials" value={stats?.testimonials?.pending || 0} color="bg-emerald-50 text-emerald-500" />
        <MetricItem icon={Headphones} label="Active Conversations" value={stats?.conversations?.active || 0} color="bg-pink-50 text-pink-500" />
        <MetricItem icon={Ticket} label="Active Discounts" value={stats?.discounts?.active || 0} color="bg-orange-50 text-orange-500" />
        <MetricItem icon={Megaphone} label="Events (7d)" value={stats?.marketing?.eventsLast7Days || 0} color="bg-indigo-50 text-indigo-500" />
      </div>
    </div>
  );
}
