/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { Button } from "@/components/ui/Button";
import {
  fetchCarrybeeCities,
  fetchCarrybeeZones,
} from "@/lib/carrybeeLocations";
import { ExternalLink, Loader2, Truck } from "lucide-react";
import { useEffect, useState } from "react";

const LABEL = "text-[10px] text-zinc-400 font-bold uppercase tracking-widest";
const INPUT =
  "w-full h-10 px-3 bg-white border border-zinc-200 text-[11px] font-bold text-zinc-900 focus:outline-none focus:ring-1 focus:ring-black rounded-none";

export default function CourierLogisticsCard({
  deliveryInfo,
  selectedCourier,
  setSelectedCourier,
  manualTrackingId,
  setManualTrackingId,
  selectedCityId,
  setSelectedCityId,
  selectedZoneId,
  setSelectedZoneId,
  carrybeeWeight,
  setCarrybeeWeight,
  carrybeeCodAmount,
  setCarrybeeCodAmount,
  carrybeeProductType,
  setCarrybeeProductType,
  carrybeeDeliveryType,
  setCarrybeeDeliveryType,
  carrybeeSecondaryPhone,
  setCarrybeeSecondaryPhone,
  handleCourierDispatch,
  isDispatching,
  isCancelled,
}) {
  const [cities, setCities] = useState([]);
  const [zones, setZones] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingZones, setLoadingZones] = useState(false);

  useEffect(() => {
    if (selectedCourier === "carrybee") {
      setLoadingCities(true);
      fetchCarrybeeCities()
        .then(setCities)
        .catch(() => setCities([]))
        .finally(() => setLoadingCities(false));
    }
  }, [selectedCourier]);

  useEffect(() => {
    if (selectedCourier === "carrybee" && selectedCityId) {
      setLoadingZones(true);
      fetchCarrybeeZones(Number(selectedCityId))
        .then(setZones)
        .catch(() => setZones([]))
        .finally(() => setLoadingZones(false));
    } else {
      setZones([]);
    }
  }, [selectedCourier, selectedCityId]);

  return (
    <div className="bg-white border border-zinc-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-zinc-100">
        <h3 className="text-[13px] font-bold text-zinc-900 tracking-tight">
          Courier Logistics
        </h3>
      </div>
      <div className="p-6">
        {deliveryInfo?.trackingId ? (
          <div className="space-y-4">
            <div className="p-3 bg-zinc-50 border border-zinc-100 space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                <span className="text-zinc-400">Provider</span>
                <span className="text-zinc-900">{deliveryInfo.provider}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                <span className="text-zinc-400">Tracking ID</span>
                <span className="text-black font-mono">
                  {deliveryInfo.trackingId}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full h-10 text-[10px] font-bold uppercase tracking-widest border-zinc-200 flex items-center justify-center gap-2 group"
              onClick={() => {
                const trackingUrls = {
                  steadfast: `https://portal.steadfast.com.bd/tracking/${deliveryInfo.trackingId}`,
                  pathao: `https://pathao.com/courier/tracking?tracking_id=${deliveryInfo.trackingId}`,
                  redx: `https://redx.com.bd/tracking/?trackingId=${deliveryInfo.trackingId}`,
                  carrybee: `https://merchant.carrybee.com/order-track/${deliveryInfo.consignmentId}`,
                };
                const url = trackingUrls[deliveryInfo.provider];
                if (url) window.open(url, "_blank");
              }}
              icon={ExternalLink}
            >
              Track on {deliveryInfo.provider}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className={LABEL}>Select Courier</label>
              <select
                value={selectedCourier}
                onChange={(e) => {
                  setSelectedCourier(e.target.value);
                  setSelectedCityId("");
                  setSelectedZoneId("");
                }}
                className={INPUT + " appearance-none"}
              >
                <option value="steadfast">SteadFast Courier</option>
                <option value="carrybee">CarryBee Courier</option>
                <option value="pathao">Pathao Courier</option>
                <option value="redx">RedX Courier</option>
                <option value="manual">SA Paribahan (Manual)</option>
              </select>
            </div>

            {selectedCourier === "carrybee" && (
              <>
                <div className="space-y-2">
                  <label className={LABEL}>City</label>
                  <select
                    value={selectedCityId}
                    onChange={(e) => {
                      setSelectedCityId(e.target.value);
                      setSelectedZoneId("");
                    }}
                    className={INPUT + " appearance-none"}
                  >
                    <option value="">
                      {loadingCities ? "Loading cities..." : "Select City"}
                    </option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCityId && (
                  <div className="space-y-2">
                    <label className={LABEL}>Zone</label>
                    <select
                      value={selectedZoneId}
                      onChange={(e) => setSelectedZoneId(e.target.value)}
                      className={INPUT + " appearance-none"}
                    >
                      <option value="">
                        {loadingZones ? "Loading zones..." : "Select Zone"}
                      </option>
                      {zones.map((zone) => (
                        <option key={zone.id} value={zone.id}>
                          {zone.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className={LABEL}>Weight (grams)</label>
                    <input
                      type="number"
                      step="50"
                      min="1"
                      max="25000"
                      placeholder="500"
                      value={carrybeeWeight}
                      onChange={(e) => setCarrybeeWeight(e.target.value)}
                      className={INPUT}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={LABEL}>COD Amount (&#2547;)</label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      placeholder="0"
                      value={carrybeeCodAmount}
                      onChange={(e) => setCarrybeeCodAmount(e.target.value)}
                      className={INPUT}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={LABEL}>Secondary Phone (optional)</label>
                  <input
                    type="text"
                    placeholder="01XXXXXXXXX"
                    value={carrybeeSecondaryPhone}
                    onChange={(e) => setCarrybeeSecondaryPhone(e.target.value)}
                    className={INPUT}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className={LABEL}>Product Type</label>
                    <select
                      value={carrybeeProductType}
                      onChange={(e) => setCarrybeeProductType(e.target.value)}
                      className={INPUT}
                    >
                      <option value="1">Parcel</option>
                      <option value="2">Book</option>
                      <option value="3">Document</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className={LABEL}>Delivery Type</label>
                    <select
                      value={carrybeeDeliveryType}
                      onChange={(e) => setCarrybeeDeliveryType(e.target.value)}
                      className={INPUT}
                    >
                      <option value="1">Normal</option>
                      <option value="2">Express</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {selectedCourier === "manual" && (
              <div className="space-y-2">
                <label className={LABEL}>Manual Tracking ID</label>
                <input
                  type="text"
                  placeholder="Enter Tracking ID"
                  value={manualTrackingId}
                  onChange={(e) => setManualTrackingId(e.target.value)}
                  className={INPUT}
                />
              </div>
            )}

            <Button
              className="w-full h-11 bg-black text-white hover:bg-zinc-800 rounded-none text-[10px] font-bold uppercase tracking-widest mt-2 flex items-center justify-center gap-2 group"
              onClick={handleCourierDispatch}
              disabled={isDispatching || isCancelled}
              icon={isDispatching ? Loader2 : Truck}
              isLoading={isDispatching}
            >
              {selectedCourier === "manual"
                ? "Record Dispatch"
                : `Dispatch to ${selectedCourier}`}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
