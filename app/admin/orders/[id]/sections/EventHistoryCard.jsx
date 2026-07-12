"use client";

function formatTimestamp(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  }) + ", " + d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function buildTimeline(order) {
  const events = [];

  events.push({
    id: "created",
    label: "Order Registry Initialized",
    timestamp: order.createdAt,
    active: false,
  });

  const statusLabel = order.status?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Unknown";
  events.push({
    id: "status",
    label: `State: ${statusLabel}`,
    timestamp: order.updatedAt,
    active: true,
    sub: "Last Synchronization Active",
  });

  if (order.deliveryInfo?.lastUpdated && order.deliveryInfo.lastUpdated !== order.updatedAt) {
    events.push({
      id: "delivery",
      label: `Delivery ${order.deliveryInfo.status || "Updated"}`,
      timestamp: order.deliveryInfo.lastUpdated,
      active: false,
    });
  }

  if (order.advancePayment?.requestedAt) {
    events.push({
      id: "adv-request",
      label: `Advance Payment Requested — ৳${order.advancePayment.amount?.toLocaleString()}`,
      timestamp: order.advancePayment.requestedAt,
      active: false,
    });
  }

  if (order.advancePayment?.paidAt) {
    events.push({
      id: "adv-paid",
      label: "Advance Payment Confirmed",
      timestamp: order.advancePayment.paidAt,
      active: false,
    });
  }

  if (order.advancePayment?.waivedAt) {
    events.push({
      id: "adv-waived",
      label: "Advance Payment Waived",
      timestamp: order.advancePayment.waivedAt,
      active: false,
    });
  }

  return events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

export default function EventHistoryCard({ order }) {
  const events = buildTimeline(order);

  return (
    <div className="bg-white border border-zinc-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-zinc-100">
        <h3 className="text-[13px] font-bold text-zinc-900 tracking-tight">Event History</h3>
      </div>
      <div className="p-6">
        <div className="relative">
          {events.map((event, idx) => (
            <div key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
              {idx < events.length - 1 && (
                <div className="absolute left-[5px] top-[14px] bottom-0 w-px bg-zinc-200" />
              )}
              <div className="relative z-10 mt-1 shrink-0">
                {event.active ? (
                  <div className="w-[11px] h-[11px] bg-zinc-900 rounded-sm" />
                ) : (
                  <div className="w-[11px] h-[11px] bg-zinc-300 rounded-full" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-[12px] font-bold leading-tight ${event.active ? "text-zinc-900" : "text-zinc-400"}`}>
                  {event.label}
                </p>
                <p className={`text-[10px] mt-1 ${event.active ? "text-zinc-500 font-semibold uppercase tracking-wider" : "text-zinc-400 font-medium"}`}>
                  {formatTimestamp(event.timestamp)}
                </p>
                {event.sub && (
                  <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mt-0.5">{event.sub}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
