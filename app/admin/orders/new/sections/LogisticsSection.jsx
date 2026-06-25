"use client";
import { MapPin, Check, Truck } from "lucide-react";

const Label = ({ children }) => (
  <label className="text-[10px] font-bold text-zinc-900 uppercase block mb-3 tracking-[0.2em]">
    {children}
  </label>
);

const SectionHeader = ({ label, title }) => (
  <div className="flex items-center justify-between border-b border-zinc-200 pb-8 mb-12">
    <div className="space-y-2">
      <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.3em]">{label}</h2>
      <p className="text-2xl font-light text-black tracking-tight">{title}</p>
    </div>
  </div>
);

export default function LogisticsSection({ order, setOrder }) {
  const paymentMethods = [
    { id: "cod", label: "Cash on Delivery" },
    { id: "online", label: "Online Payment" }
  ];

  const deliveryMethods = [
    { id: "normal", label: "Normal Delivery", fee: 60 },
    { id: "fast", label: "Fast Delivery", fee: 130 }
  ];

  const handleShippingChange = (field, value) => {
    setOrder(prev => ({
      ...prev,
      shipping: { ...prev.shipping, [field]: value }
    }));
  };

  return (
    <section>
      <SectionHeader label="Block 03" title="Logistics Anchor" />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-20">
        <div className="md:col-span-8 space-y-12">
          <div className="space-y-4">
            <Label>Shipping Destination</Label>
            <div className="relative group">
              <input 
                placeholder="House 12, Road 4, Sector 7" 
                value={order.shipping.address}
                onChange={(e) => handleShippingChange('address', e.target.value)}
                className="w-full bg-transparent border-b border-zinc-200 focus:border-black outline-none transition-all text-xl font-light py-4" 
              />
              <MapPin className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black" size={20} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-12">
            <div className="space-y-4">
              <Label>Fulfillment Area</Label>
              <input 
                placeholder="Uttara" 
                value={order.shipping.area}
                onChange={(e) => handleShippingChange('area', e.target.value)}
                className="w-full bg-transparent border-b border-zinc-200 focus:border-black outline-none text-[13px] font-medium py-2" 
              />
            </div>
            <div className="space-y-4">
              <Label>Registry Postcode</Label>
              <input 
                placeholder="1230" 
                value={order.shipping.postcode}
                onChange={(e) => handleShippingChange('postcode', e.target.value)}
                className="w-full bg-transparent border-b border-zinc-200 focus:border-black outline-none text-[13px] font-medium py-2" 
              />
            </div>
          </div>

          <div className="space-y-6 pt-4">
            <Label>Delivery Velocity</Label>
            <div className="flex gap-4">
              {deliveryMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setOrder({ ...order, deliveryMethod: method.id, shippingFee: method.fee })}
                  className={`flex-1 flex items-center justify-between p-6 border transition-all ${order.deliveryMethod === method.id ? 'bg-black text-white border-black shadow-lg' : 'bg-white text-zinc-400 border-zinc-100 hover:border-zinc-300'}`}
                >
                  <div className="flex items-center gap-4">
                    <Truck size={18} />
                    <span className="text-[11px] font-bold uppercase tracking-widest">{method.label}</span>
                  </div>
                  <span className="text-[12px] font-bold">৳{method.fee}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="md:col-span-4 bg-zinc-50 border border-zinc-100 p-12 space-y-8">
          <Label>Payment Strategy</Label>
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <button
                key={method.id} onClick={() => setOrder({...order, paymentMethod: method.id})}
                className={`w-full flex items-center justify-between p-4 border transition-all ${order.paymentMethod === method.id ? 'bg-black text-white border-black shadow-lg scale-[1.02]' : 'bg-white text-zinc-400 border-zinc-100 hover:border-zinc-300'}`}
              >
                <span className="text-[11px] font-bold uppercase tracking-widest">{method.label}</span>
                {order.paymentMethod === method.id && <Check size={14} />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
