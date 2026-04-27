"use client";
import { Truck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

const Card = ({ children, title, action, className = "" }) => (
  <div className={`bg-white border border-zinc-200 rounded-none overflow-hidden ${className}`}>
    {(title || action) && (
      <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
        <h3 className="text-[13px] font-bold text-zinc-900 tracking-tight">{title}</h3>
        {action}
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

export default function CourierLogisticsCard({
  deliveryInfo,
  selectedCourier,
  setSelectedCourier,
  manualTrackingId,
  setManualTrackingId,
  handleCourierDispatch,
  isDispatching,
  isCancelled,
}) {
  return (
    <Card title="Courier Logistics">
      {deliveryInfo?.trackingId ? (
        <div className="space-y-4">
          <div className="p-3 bg-zinc-50 border border-zinc-100 space-y-2">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
              <span className="text-zinc-400">Provider</span>
              <span className="text-zinc-900">{deliveryInfo.provider}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
              <span className="text-zinc-400">Tracking ID</span>
              <span className="text-black font-mono">{deliveryInfo.trackingId}</span>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full h-10 text-[10px] font-bold uppercase tracking-widest border-zinc-200"
            onClick={() => {
              const trackingUrls = {
                steadfast: `https://portal.steadfast.com.bd/tracking/${deliveryInfo.trackingId}`,
                pathao: `https://pathao.com/courier/tracking?tracking_id=${deliveryInfo.trackingId}`,
                redx: `https://redx.com.bd/tracking/?trackingId=${deliveryInfo.trackingId}`,
              };
              const url = trackingUrls[deliveryInfo.provider];
              if (url) window.open(url, "_blank");
            }}
          >
            Track on {deliveryInfo.provider}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Select Courier</label>
            <select
              value={selectedCourier}
              onChange={(e) => setSelectedCourier(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-zinc-200 text-[11px] font-bold text-zinc-900 focus:outline-none focus:ring-1 focus:ring-black rounded-none appearance-none"
            >
              <option value="steadfast">SteadFast Courier</option>
              <option value="pathao">Pathao Courier</option>
              <option value="redx">RedX Courier</option>
              <option value="manual">SA Paribahan (Manual)</option>
            </select>
          </div>

          {selectedCourier === "manual" && (
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Manual Tracking ID</label>
              <input
                type="text"
                placeholder="Enter Tracking ID"
                value={manualTrackingId}
                onChange={(e) => setManualTrackingId(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-zinc-200 text-[11px] font-bold text-zinc-900 focus:outline-none rounded-none"
              />
            </div>
          )}

          <Button
            className="w-full h-11 bg-black text-white hover:bg-zinc-800 rounded-none text-[10px] font-bold uppercase tracking-widest mt-2"
            onClick={handleCourierDispatch}
            disabled={isDispatching || isCancelled}
          >
            {isDispatching ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Truck className="w-4 h-4 mr-2" />}
            {selectedCourier === "manual" ? "Record Dispatch" : `Dispatch to ${selectedCourier}`}
          </Button>
        </div>
      )}
    </Card>
  );
}
