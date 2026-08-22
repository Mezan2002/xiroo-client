"use client";
import { TrendingUp, TrendingDown, Package, Truck, Receipt, Wallet } from "lucide-react";

const formatCurrency = (value) => `\u09F3${(value || 0).toLocaleString()}`;

export default function OrderProfitSummary({ order }) {
  if (!order) return null;

  const rawSubtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalCOGS = order.items.reduce((acc, item) => acc + (item.costPrice || 0) * item.quantity, 0);
  const grossProfit = rawSubtotal - totalCOGS;
  const grossMargin = rawSubtotal > 0 ? Math.round((grossProfit / rawSubtotal) * 1000) / 10 : 0;

  const shippingFee = order.shippingFee || 0;
  const courierCharge = order.deliveryInfo?.deliveryCharge || 0;
  const codFee = order.deliveryInfo?.codFee || 0;
  const totalCourierCost = courierCharge + codFee;
  const shippingProfit = shippingFee - totalCourierCost;

  const netProfit = grossProfit - totalCourierCost;
  const netMargin = rawSubtotal > 0 ? Math.round((netProfit / rawSubtotal) * 1000) / 10 : 0;

  const isProfitable = netProfit >= 0;

  return (
    <div className="bg-white border border-zinc-200 overflow-hidden">
      <div className="px-5 py-3.5 border-b border-zinc-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet size={14} className="text-zinc-400" strokeWidth={1.5} />
          <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.15em]">
            Order Profit
          </h3>
        </div>
        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 border ${
          isProfitable
            ? "text-emerald-600 bg-emerald-50 border-emerald-200"
            : "text-rose-600 bg-rose-50 border-rose-200"
        }`}>
          {isProfitable ? "Profitable" : "Loss"}
        </span>
      </div>

      <div className="p-5 space-y-3">
        {/* Revenue */}
        <div className="flex justify-between items-center text-[11px]">
          <div className="flex items-center gap-2">
            <Package size={12} className="text-zinc-400" strokeWidth={1.5} />
            <span className="text-zinc-500 font-medium">Item Revenue</span>
          </div>
          <span className="text-zinc-900 font-bold font-mono">{formatCurrency(rawSubtotal)}</span>
        </div>

        {/* COGS */}
        <div className="flex justify-between items-center text-[11px]">
          <div className="flex items-center gap-2">
            <Receipt size={12} className="text-zinc-400" strokeWidth={1.5} />
            <span className="text-zinc-500 font-medium">Cost of Goods</span>
          </div>
          <span className="text-rose-600 font-bold font-mono">-{formatCurrency(totalCOGS)}</span>
        </div>

        {/* Gross Profit */}
        <div className="flex justify-between items-center text-[11px] pt-2 border-t border-zinc-100">
          <span className="text-zinc-500 font-medium">Gross Profit</span>
          <div className="flex items-center gap-2">
            <span className={`font-bold font-mono ${grossProfit >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {formatCurrency(grossProfit)}
            </span>
            <span className="text-[9px] text-zinc-400 font-mono">({grossMargin}%)</span>
          </div>
        </div>

        {/* Shipping breakdown */}
        {shippingFee > 0 && (
          <>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-500 font-medium pl-5">Customer Shipping Fee</span>
              <span className="text-emerald-600 font-bold font-mono">+{formatCurrency(shippingFee)}</span>
            </div>
            {courierCharge > 0 && (
              <div className="flex justify-between items-center text-[11px]">
                <div className="flex items-center gap-2 pl-5">
                  <Truck size={12} className="text-zinc-400" strokeWidth={1.5} />
                  <span className="text-zinc-500 font-medium">Courier Delivery Fee</span>
                </div>
                <span className="text-rose-600 font-bold font-mono">-{formatCurrency(courierCharge)}</span>
              </div>
            )}
            {codFee > 0 && (
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-zinc-500 font-medium pl-5">COD Fee (CarryBee)</span>
                <span className="text-rose-600 font-bold font-mono">-{formatCurrency(codFee)}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-[11px] pt-2 border-t border-zinc-100">
              <span className="text-zinc-500 font-medium">Shipping Margin</span>
              <span className={`font-bold font-mono ${shippingProfit >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                {formatCurrency(shippingProfit)}
              </span>
            </div>
          </>
        )}

        {/* Net Profit */}
        <div className="flex justify-between items-center pt-3 border-t border-zinc-200">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            Net Profit
          </span>
          <div className="flex items-center gap-2">
            {isProfitable ? (
              <TrendingUp size={14} className="text-emerald-600" />
            ) : (
              <TrendingDown size={14} className="text-rose-600" />
            )}
            <span className={`text-[16px] font-black font-mono ${isProfitable ? "text-emerald-600" : "text-rose-600"}`}>
              {formatCurrency(netProfit)}
            </span>
          </div>
        </div>
        <div className="flex justify-end">
          <span className={`text-[9px] font-bold font-mono ${
            isProfitable ? "text-emerald-500" : "text-rose-500"
          }`}>
            {netMargin}% margin
          </span>
        </div>
      </div>
    </div>
  );
}
