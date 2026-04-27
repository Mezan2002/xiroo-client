"use client";

export default function OrderDetailHero({ orderData }) {
  return (
    <div className="bg-white border border-gray-100 p-5 sm:p-8 md:p-12">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
        <div className="space-y-2 md:space-y-4">
          <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Order ID</p>
          <p className="text-[13px] md:text-lg font-montserrat font-bold text-black tracking-tight italic break-all">#{orderData.id}</p>
        </div>
        <div className="space-y-2 md:space-y-4">
          <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Placed On</p>
          <p className="text-[13px] md:text-lg font-montserrat font-bold text-black tracking-tight uppercase">{orderData.date}</p>
        </div>
        <div className="space-y-2 md:space-y-4">
          <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Status</p>
          <span className="inline-block bg-zinc-50 text-gray-400 text-[9px] md:text-[10px] font-bold px-3 md:px-5 py-1 md:py-1.5 border border-gray-100 uppercase tracking-widest">{orderData.status}</span>
        </div>
        <div className="space-y-1 md:space-y-4 md:text-right">
          <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Total</p>
          <p className="text-2xl md:text-4xl font-montserrat font-bold text-black tracking-tighter">
            <span className="mr-0.5">৳</span>{orderData.total}
          </p>
        </div>
      </div>
    </div>
  );
}
