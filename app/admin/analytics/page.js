"use client";
import React, { useState, useEffect, useCallback } from "react";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import axiosInstance from "@/lib/axios";
import {
  BarChart3,
  TrendingUp,
  Users,
  Globe,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Filter,
  Eye,
  ShoppingCart,
  MousePointerClick,
  CreditCard,
  Layout,
  Search,
  X,
  Loader2,
} from "lucide-react";

const EVENT_ICONS = {
  PageView: Layout,
  ViewContent: Eye,
  AddToCart: ShoppingCart,
  InitiateCheckout: MousePointerClick,
  Purchase: CreditCard,
};

const EVENT_COLORS = {
  PageView: "bg-blue-50 text-blue-600",
  ViewContent: "bg-purple-50 text-purple-600",
  AddToCart: "bg-amber-50 text-amber-600",
  InitiateCheckout: "bg-orange-50 text-orange-600",
  Purchase: "bg-green-50 text-green-600",
};

const SOURCE_COLORS = {
  browser: "bg-blue-100 text-blue-700",
  server: "bg-emerald-100 text-emerald-700",
};

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);

  // Filters
  const [days, setDays] = useState(7);
  const [filterEvent, setFilterEvent] = useState("");
  const [filterSource, setFilterSource] = useState("");
  const [searchUrl, setSearchUrl] = useState("");

  const fetchStats = useCallback(async () => {
    try {
      const resp = await axiosInstance.get(`/marketing/stats?days=${days}`);
      setStats(resp?.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }, [days]);

  const fetchLogs = useCallback(
    async (page = 1) => {
      setLogsLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: "50",
          days: String(days),
        });
        if (filterEvent) params.set("eventName", filterEvent);
        if (filterSource) params.set("source", filterSource);

        const resp = await axiosInstance.get(`/marketing/logs?${params}`);
        setLogs(resp?.data?.logs || []);
        setPagination(resp?.data?.pagination || { page: 1, limit: 50, total: 0, totalPages: 0 });
      } catch (err) {
        console.error("Failed to fetch logs:", err);
      } finally {
        setLogsLoading(false);
      }
    },
    [days, filterEvent, filterSource]
  );

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchStats(), fetchLogs(1)]).finally(() => setLoading(false));
  }, [fetchStats, fetchLogs]);

  const handleRefresh = () => {
    setLoading(true);
    Promise.all([fetchStats(), fetchLogs(pagination.page)]).finally(() =>
      setLoading(false)
    );
  };

  const filteredLogs = logs.filter((log) => {
    if (!searchUrl) return true;
    return log.url?.toLowerCase().includes(searchUrl.toLowerCase());
  });

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const totalBySource = stats?.sourceBreakdown || {};
  const browserCount = totalBySource.browser || 0;
  const serverCount = totalBySource.server || 0;

  return (
    <div className="space-y-24 font-montserrat antialiased text-zinc-900 animate-in fade-in duration-700 pb-20">
      <ModuleHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Analytics", active: true },
        ]}
        title="Event Analytics"
        icon={BarChart3}
        primaryAction={{
          label: "Refresh",
          icon: RefreshCw,
          onClick: handleRefresh,
        }}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Events"
          value={stats?.totalEvents?.toLocaleString() || "0"}
          icon={BarChart3}
          loading={loading}
        />
        <StatCard
          label="Unique Pages"
          value={stats?.uniquePages?.toLocaleString() || "0"}
          icon={Globe}
          loading={loading}
        />
        <StatCard
          label="Browser Events"
          value={browserCount.toLocaleString()}
          icon={MousePointerClick}
          loading={loading}
          subtext={`${stats?.totalEvents ? Math.round((browserCount / stats.totalEvents) * 100) : 0}%`}
        />
        <StatCard
          label="Server Events (CAPI)"
          value={serverCount.toLocaleString()}
          icon={TrendingUp}
          loading={loading}
          subtext={`${stats?.totalEvents ? Math.round((serverCount / stats.totalEvents) * 100) : 0}%`}
        />
      </div>

      {/* Event Breakdown */}
      {stats?.summary?.length > 0 && (
        <section>
          <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.3em] mb-6">
            Events by Type
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {stats.summary.map((item) => {
              const Icon = EVENT_ICONS[item._id] || BarChart3;
              const color = EVENT_COLORS[item._id] || "bg-gray-50 text-gray-600";
              return (
                <div
                  key={item._id}
                  className={`p-5 border border-zinc-100 flex flex-col gap-3 hover:border-black transition-colors cursor-pointer ${
                    filterEvent === item._id ? "border-black ring-1 ring-black" : ""
                  }`}
                  onClick={() =>
                    setFilterEvent(filterEvent === item._id ? "" : item._id)
                  }
                >
                  <div className={`w-10 h-10 flex items-center justify-center ${color}`}>
                    <Icon size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      {item._id}
                    </p>
                    <p className="text-2xl font-bold mt-1">{item.total.toLocaleString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Event Log Table */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.3em]">
            Event Log
          </h3>
          <div className="flex flex-wrap items-center gap-3">
            {/* Days filter */}
            <div className="flex items-center gap-1 bg-zinc-50 border border-zinc-100 p-1">
              {[3, 7, 14, 30].map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                    days === d
                      ? "bg-black text-white"
                      : "text-zinc-400 hover:text-black"
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>

            {/* Source filter */}
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="h-8 px-3 bg-zinc-50 border border-zinc-100 text-[11px] font-bold outline-none uppercase tracking-widest"
            >
              <option value="">All Sources</option>
              <option value="browser">Browser</option>
              <option value="server">Server (CAPI)</option>
            </select>

            {/* URL search */}
            <div className="relative">
              <Search
                size={12}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-300"
              />
              <input
                placeholder="Filter URL..."
                value={searchUrl}
                onChange={(e) => setSearchUrl(e.target.value)}
                className="h-8 pl-7 pr-6 bg-zinc-50 border border-zinc-100 text-[11px] font-medium outline-none w-48"
              />
              {searchUrl && (
                <button
                  onClick={() => setSearchUrl("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-black"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Active filters */}
        {filterEvent && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              Filter:
            </span>
            <span className="px-2 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
              {filterEvent}
              <button onClick={() => setFilterEvent("")}>
                <X size={10} />
              </button>
            </span>
          </div>
        )}

        {/* Table */}
        <div className="border border-zinc-100 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 border-b border-zinc-100">
              <tr>
                <th className="px-4 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Event
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Source
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  URL
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Customer
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {logsLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <Loader2 className="w-5 h-5 animate-spin text-zinc-300 mx-auto" />
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-[12px] text-zinc-300 italic"
                  >
                    No events found
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const Icon = EVENT_ICONS[log.eventName] || BarChart3;
                  const color =
                    EVENT_COLORS[log.eventName] || "bg-gray-50 text-gray-600";
                  const sourceColor =
                    SOURCE_COLORS[log.source] || "bg-gray-100 text-gray-700";
                  return (
                    <tr
                      key={log._id}
                      className="hover:bg-zinc-50/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-7 h-7 flex items-center justify-center shrink-0 ${color}`}
                          >
                            <Icon size={14} strokeWidth={1.5} />
                          </div>
                          <span className="text-[12px] font-bold">{log.eventName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${sourceColor}`}
                        >
                          {log.source}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] text-zinc-400 truncate max-w-[200px] block">
                          {log.url
                            ? new URL(log.url).pathname
                            : "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-0.5">
                          {log.userData?.email && (
                            <span className="text-[10px] font-bold text-zinc-600">
                              {log.userData.email}
                            </span>
                          )}
                          {log.userData?.phone && (
                            <span className="text-[10px] text-zinc-500">
                              {log.userData.phone}
                            </span>
                          )}
                          {log.userData?.firstName && (
                            <span className="text-[10px] text-zinc-400">
                              {log.userData.firstName} {log.userData.lastName || ""}
                            </span>
                          )}
                          {log.userData?.ip && (
                            <span className="text-[9px] text-zinc-300">
                              IP: {log.userData.ip}
                            </span>
                          )}
                          {!log.userData?.email && !log.userData?.phone && log.customData?.value && (
                            <span className="text-[10px] font-bold text-zinc-500">
                              ৳{log.customData.value} {log.customData.currency || ""}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-[11px] text-zinc-400 font-medium whitespace-nowrap">
                          {formatTime(log.timestamp)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <span className="text-[11px] text-zinc-400 font-medium">
              {pagination.total.toLocaleString()} events · Page{" "}
              {pagination.page} of {pagination.totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchLogs(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="h-8 w-8 flex items-center justify-center border border-zinc-100 hover:border-black disabled:opacity-30 disabled:hover:border-zinc-100 transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => fetchLogs(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="h-8 w-8 flex items-center justify-center border border-zinc-100 hover:border-black disabled:opacity-30 disabled:hover:border-zinc-100 transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, loading, subtext }) {
  return (
    <div className="bg-white border border-zinc-100 p-6 space-y-3 hover:border-black transition-colors group">
      <div className="flex justify-between items-start">
        <div className="w-9 h-9 bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-black group-hover:text-white transition-all">
          <Icon size={18} strokeWidth={1.5} />
        </div>
        {subtext && (
          <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest">
            {subtext}
          </span>
        )}
      </div>
      <div>
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
          {label}
        </p>
        {loading ? (
          <div className="h-8 mt-1 bg-zinc-50 animate-pulse w-20" />
        ) : (
          <p className="text-2xl font-bold mt-1">{value}</p>
        )}
      </div>
    </div>
  );
}
