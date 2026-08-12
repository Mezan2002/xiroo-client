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

const actionConfig = {
  created: { color: "bg-blue-500", icon: "●", label: "Created" },
  status_changed: { color: "bg-zinc-900", icon: "●", label: "Status" },
  prices_updated: { color: "bg-amber-500", icon: "●", label: "Items Updated" },
  order_updated: { color: "bg-blue-500", icon: "●", label: "Details Updated" },
  cancelled: { color: "bg-rose-500", icon: "●", label: "Cancelled" },
  delivery_updated: { color: "bg-emerald-500", icon: "●", label: "Delivery" },
  advance_payment_requested: { color: "bg-amber-500", icon: "●", label: "Payment Requested" },
  advance_payment_confirmed: { color: "bg-emerald-500", icon: "●", label: "Payment Confirmed" },
  advance_payment_waived: { color: "bg-zinc-400", icon: "●", label: "Payment Waived" },
  return_note_added: { color: "bg-rose-500", icon: "●", label: "Return Note Added" },
  return_note_updated: { color: "bg-amber-500", icon: "●", label: "Return Note Updated" },
  return_note_removed: { color: "bg-zinc-400", icon: "●", label: "Return Note Removed" },
  return_exchange_requested: { color: "bg-purple-600", icon: "●", label: "Return/Exchange Requested" },
};

function getRoleBadge(role) {
  if (role === 'admin') return { label: 'ADMIN', color: 'bg-black text-white' };
  if (role === 'customer') return { label: 'CUSTOMER', color: 'bg-zinc-200 text-zinc-700' };
  return { label: 'SYSTEM', color: 'bg-zinc-100 text-zinc-500' };
}

function renderFieldChanges(changes) {
  if (!changes || Object.keys(changes).length === 0) return null;
  
  const fieldLabels = {
    shippingAddress: 'Shipping Address',
    deliveryMethod: 'Delivery Method',
    shippingFee: 'Shipping Fee',
    paymentMethod: 'Payment Method',
    paymentStatus: 'Payment Status',
    note: 'Note',
    guestInfo: 'Customer Info',
    variant: 'Variant',
    quantity: 'Quantity',
    price: 'Price',
  };

  return (
    <div className="mt-2 space-y-1.5">
      {Object.entries(changes).map(([field, change]) => (
        <div key={field} className="flex items-start gap-2 text-[11px]">
          <span className="font-bold text-zinc-600 shrink-0">{fieldLabels[field] || field}:</span>
          <span className="text-zinc-400 line-through">{formatValue(change.old)}</span>
          <span className="text-zinc-400">→</span>
          <span className="font-medium text-zinc-700">{formatValue(change.new)}</span>
        </div>
      ))}
    </div>
  );
}

function renderItemChanges(itemChanges) {
  if (!itemChanges || itemChanges.length === 0) return null;

  return (
    <div className="mt-2 space-y-2">
      {itemChanges.map((item, idx) => (
        <div key={idx} className="bg-zinc-50 border border-zinc-100 p-2">
          <div className="text-[11px] font-bold text-zinc-700 mb-1">{item.productName}</div>
          <div className="space-y-0.5">
            {item.variant && (
              <div className="flex items-center gap-2 text-[10px]">
                <span className="text-zinc-500">Variant:</span>
                <span className="text-zinc-400 line-through">{item.variant.old || 'None'}</span>
                <span className="text-zinc-400">→</span>
                <span className="font-medium text-zinc-600">{item.variant.new || 'None'}</span>
              </div>
            )}
            {item.quantity && (
              <div className="flex items-center gap-2 text-[10px]">
                <span className="text-zinc-500">Qty:</span>
                <span className="text-zinc-400 line-through">{item.quantity.old}</span>
                <span className="text-zinc-400">→</span>
                <span className="font-medium text-zinc-600">{item.quantity.new}</span>
              </div>
            )}
            {item.price && (
              <div className="flex items-center gap-2 text-[10px]">
                <span className="text-zinc-500">Price:</span>
                <span className="text-zinc-400 line-through">৳{item.price.old}</span>
                <span className="text-zinc-400">→</span>
                <span className="font-medium text-zinc-600">৳{item.price.new}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function formatValue(val) {
  if (val === null || val === undefined) return 'N/A';
  if (typeof val === 'object') {
    if (val.firstName) return `${val.firstName} ${val.lastName || ''}`.trim();
    return JSON.stringify(val);
  }
  return String(val);
}

function renderDetails(event) {
  const { action, details } = event;
  
  if (action === 'created' && details) {
    return (
      <div className="mt-2 grid grid-cols-2 gap-2 text-[10px]">
        {details.customerName && (
          <div><span className="text-zinc-500">Customer:</span> <span className="font-medium">{details.customerName}</span></div>
        )}
        {details.itemCount && (
          <div><span className="text-zinc-500">Items:</span> <span className="font-medium">{details.itemCount}</span></div>
        )}
        {details.totalAmount && (
          <div><span className="text-zinc-500">Total:</span> <span className="font-medium">৳{details.totalAmount.toLocaleString()}</span></div>
        )}
        {details.paymentMethod && (
          <div><span className="text-zinc-500">Payment:</span> <span className="font-medium uppercase">{details.paymentMethod}</span></div>
        )}
      </div>
    );
  }

  if (action === 'status_changed' && details) {
    return (
      <div className="mt-2 flex items-center gap-2 text-[11px]">
        <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 font-bold">{details.fromLabel || details.from}</span>
        <span className="text-zinc-400">→</span>
        <span className="px-2 py-0.5 bg-black text-white font-bold">{details.toLabel || details.to}</span>
      </div>
    );
  }

  if (action === 'order_updated' && details?.changes) {
    return renderFieldChanges(details.changes);
  }

  if (action === 'return_note_added' && details?.changes?.returnNote) {
    const change = details.changes.returnNote;
    return (
      <div className="mt-2 p-2 bg-rose-50 border border-rose-100">
        <p className="text-[10px] text-rose-600 font-bold uppercase tracking-wider mb-1">Return Reason</p>
        <p className="text-[11px] text-rose-800">{change.new}</p>
      </div>
    );
  }

  if (action === 'return_note_updated' && details?.changes?.returnNote) {
    const change = details.changes.returnNote;
    return (
      <div className="mt-2 space-y-1">
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Return Reason Updated</p>
        <div className="text-[11px]">
          <span className="text-zinc-400 line-through">{change.old}</span>
        </div>
        <div className="text-[11px]">
          <span className="font-medium text-zinc-700">{change.new}</span>
        </div>
      </div>
    );
  }

  if (action === 'return_note_removed' && details?.changes?.returnNote) {
    const change = details.changes.returnNote;
    return (
      <div className="mt-2">
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Return Reason Removed</p>
        <p className="text-[11px] text-zinc-400 line-through">{change.old}</p>
      </div>
    );
  }

  if (action === 'prices_updated' && details?.itemChanges) {
    return (
      <div>
        <div className="mt-2 text-[10px] text-zinc-500">
          Total: <span className="line-through">৳{details.previousTotal?.toLocaleString()}</span> → <span className="font-bold text-zinc-700">৳{details.newTotal?.toLocaleString()}</span>
        </div>
        {renderItemChanges(details.itemChanges)}
      </div>
    );
  }

  return null;
}

export default function EventHistoryCard({ order }) {
  const events = order.eventHistory || [];

  // Sort by timestamp (oldest first for timeline)
  const sortedEvents = [...events].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return (
    <div className="bg-white border border-zinc-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-zinc-100">
        <h3 className="text-[13px] font-bold text-zinc-900 tracking-tight">Event History</h3>
        <p className="text-[10px] text-zinc-400 mt-0.5">{sortedEvents.length} events recorded</p>
      </div>
      <div className="p-6 max-h-[500px] overflow-y-auto">
        {sortedEvents.length === 0 ? (
          <div className="text-center py-8 text-[11px] text-zinc-400">No events recorded</div>
        ) : (
          <div className="relative">
            {sortedEvents.map((event, idx) => {
              const config = actionConfig[event.action] || { color: "bg-zinc-400", icon: "●" };
              const isLast = idx === sortedEvents.length - 1;
              const roleBadge = event.performedByRole ? getRoleBadge(event.performedByRole) : null;

              return (
                <div key={idx} className="relative flex gap-4 pb-6 last:pb-0">
                  {/* Connector line */}
                  {idx < sortedEvents.length - 1 && (
                    <div className="absolute left-[5px] top-[14px] bottom-0 w-px bg-zinc-200" />
                  )}
                  
                  {/* Icon */}
                  <div className="relative z-10 mt-1 shrink-0">
                    <div className={`w-[11px] h-[11px] ${config.color} rounded-full`} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className={`text-[12px] font-bold leading-tight ${isLast ? "text-zinc-900" : "text-zinc-600"}`}>
                          {event.label}
                        </p>
                        
                        {/* Performer info */}
                        {event.performedByName && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-zinc-500">by {event.performedByName}</span>
                            {roleBadge && (
                              <span className={`text-[8px] font-bold px-1.5 py-0.5 ${roleBadge.color}`}>
                                {roleBadge.label}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Timestamp */}
                        <p className={`text-[10px] mt-1 ${isLast ? "text-zinc-500 font-semibold uppercase tracking-wider" : "text-zinc-400 font-medium"}`}>
                          {formatTimestamp(event.timestamp)}
                        </p>

                        {/* Details */}
                        {renderDetails(event)}

                        {/* Latest badge */}
                        {isLast && (
                          <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mt-1.5">Latest</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
