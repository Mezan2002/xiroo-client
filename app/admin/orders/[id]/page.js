"use client";
import React, { useState } from "react";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import { 
  ShoppingBag, 
  CheckCircle2, 
  Clock, 
  Truck, 
  CreditCard,
  User,
  MapPin,
  AlertCircle,
  Copy,
  ExternalLink,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useParams, useRouter } from "next/navigation";
import { Select } from "@/components/ui/Select";
import EditAddressModal from "@/components/admin/orders/EditAddressModal";

// --- Sub-components ---
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

const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-zinc-100 text-zinc-600",
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    warning: "bg-amber-50 text-amber-700 border-amber-100",
    danger: "bg-rose-50 text-rose-700 border-rose-100",
    info: "bg-blue-50 text-blue-700 border-blue-100",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-none text-[11px] font-semibold border ${variants[variant]}`}>
      {children}
    </span>
  );
};

const StatusTimelineItem = ({ status, date, current }) => (
  <div className="flex gap-4 pb-8 last:pb-0 relative group">
    <div className="flex flex-col items-center shrink-0">
      <div className={`w-2.5 h-2.5 rounded-none mt-1.5 ${current ? 'bg-black ring-4 ring-zinc-50' : 'bg-zinc-200'}`}></div>
      <div className="w-px h-full bg-zinc-100 absolute top-4 left-[4.5px] group-last:hidden"></div>
    </div>
    <div className="flex-1">
      <p className={`text-[13px] font-bold tracking-tight ${current ? 'text-zinc-900' : 'text-zinc-400'}`}>{status}</p>
      <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest mt-1">{date}</p>
    </div>
  </div>
);

const LabelValue = ({ label, value, className = "" }) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{label}</span>
    <span className="text-[13px] font-bold text-zinc-900 tracking-tight">{value}</span>
  </div>
);

export default function OrderDetailsPage() {
  const params = useParams();
  const [status, setStatus] = useState("Processing");
  const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    address: "House 12, Road 4, Sector 7",
    area: "Uttara",
    city: "Dhaka",
    postcode: "1230",
    country: "Bangladesh"
  });

  const order = {
    id: params.id || "XR-2814",
    date: "March 22, 2024 at 2:45 PM",
    customer: {
      name: "John Doe",
      email: "john@example.com",
      phone: "+880 1712-345678",
      totalOrders: 12,
      joinedDate: "Jan 15, 2023"
    },
    shipping: shippingAddress,
    items: [
      { id: 1, name: "Premium String Lamp", sku: "XR-LT-001", image: "/products/lamp.jpg", price: 1200, qty: 2, total: 2400 },
      { id: 2, name: "Mood Light Base", sku: "XR-LT-009", image: "/products/base.jpg", price: 150, qty: 1, total: 150 },
    ],
    summary: {
      subtotal: 2550,
      shipping: 60,
      discount: 0,
      tax: 0,
      total: 2610
    },
    payment: {
      method: "Cash on Delivery",
      status: "Unpaid",
      transactionId: "TXN-4892-BA"
    }
  };

  const statusOptions = [
    { value: "Processing", label: "Processing", icon: Clock },
    { value: "Shipped", label: "Shipped", icon: Truck },
    { value: "Delivered", label: "Delivered", icon: CheckCircle2 },
    { value: "Cancelled", label: "Cancelled", icon: AlertCircle },
  ];

  const handleSaveAddress = (newAddress) => {
    setShippingAddress(newAddress);
    setIsEditAddressModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 rounded-none">
      <ModuleHeader 
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Orders", href: "/admin/orders" },
          { label: order.id, active: true }
        ]}
        title={`Order #${order.id}`}
        icon={ShoppingBag}
        actions={
          <div className="flex items-center gap-2">
            <Select 
              options={statusOptions}
              value={status}
              onChange={setStatus}
              className="w-40 h-10! text-[12px]! rounded-none"
            />
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Registry */}
        <div className="lg:col-span-2 space-y-8">
          <Card 
            title="Items Registry" 
            action={
              <Badge variant="info">{order.items.length} Items</Badge>
            }
          >
            <div className="overflow-x-auto -mx-6">
              <table className="w-full text-left">
                <thead className="bg-zinc-50/30 border-y border-zinc-100">
                  <tr>
                    <th className="px-6 py-3.5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Product</th>
                    <th className="px-6 py-3.5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">Qty</th>
                    <th className="px-6 py-3.5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Price</th>
                    <th className="px-6 py-3.5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {order.items.map((item) => (
                    <tr key={item.id} className="group hover:bg-zinc-50/30 transition-colors">
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-zinc-50 border border-zinc-100 rounded-none flex items-center justify-center text-zinc-200 overflow-hidden shrink-0">
                            <ShoppingBag size={18} strokeWidth={1} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[14px] font-bold text-zinc-900 tracking-tight leading-none">{item.name}</span>
                            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-2">{item.sku}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center text-[13px] font-bold text-zinc-500 tracking-tight">x{item.qty}</td>
                      <td className="px-6 py-6 text-right text-[13px] font-bold text-zinc-500 tracking-tight">৳{item.price.toLocaleString()}</td>
                      <td className="px-6 py-6 text-right text-[15px] font-extrabold text-zinc-900 tracking-tight">৳{item.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 pt-8 border-t border-zinc-100 flex justify-end">
              <div className="w-full max-w-[280px] space-y-3">
                <div className="flex justify-between text-[13px]">
                  <span className="text-zinc-500">Subtotal</span>
                  <span className="text-zinc-900 font-medium">৳{order.summary.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-zinc-500">Shipping</span>
                  <span className="text-zinc-900 font-medium">৳{order.summary.shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-zinc-500">Discount</span>
                  <span className="text-emerald-600 font-medium">-৳{order.summary.discount.toLocaleString()}</span>
                </div>
                <div className="pt-4 flex justify-between items-baseline border-t border-zinc-200">
                  <span className="text-[14px] font-bold text-zinc-900">Total Charged</span>
                  <span className="text-2xl font-bold text-black tracking-tighter">৳{order.summary.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card title="Payment Information">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-zinc-50 rounded-none flex items-center justify-center text-zinc-400 border border-zinc-100">
                    <CreditCard size={18} strokeWidth={1.5} />
                  </div>
                  <LabelValue label="Method" value={order.payment.method} />
                </div>
                <div className="pt-6 grid grid-cols-2 gap-6 border-t border-zinc-50">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</span>
                    <Badge variant={order.payment.status === "Paid" ? "success" : "warning"}>{order.payment.status}</Badge>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Transaction ID</span>
                    <span className="text-[13px] font-bold text-zinc-900 flex items-center gap-2 group cursor-pointer hover:text-black tracking-tight">
                      {order.payment.transactionId} 
                      <Copy size={12} className="text-zinc-300 group-hover:text-black transition-colors" />
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Fulfillment Matrix">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-zinc-50 rounded-none flex items-center justify-center text-zinc-400 border border-zinc-100">
                    <Truck size={18} strokeWidth={1.5} />
                  </div>
                  <LabelValue label="Courier" value="SA Paribahan" />
                </div>
                <div className="pt-6 space-y-4 border-t border-zinc-50">
                  <LabelValue label="Service" value="Standard Delivery (2-3 days)" />
                  <Button variant="outline" className="w-full h-12 border-zinc-100 text-[11px] font-bold uppercase tracking-widest text-zinc-400 hover:text-black hover:border-black transition-all">
                    Update Registry
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Sidebar: Customer & Stats */}
        <div className="space-y-8">
          <Card title="Customer">
            <div className="space-y-8">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-zinc-900 rounded-none flex items-center justify-center text-white font-light text-2xl border border-black shrink-0 shadow-xl shadow-black/5">
                  {order.customer.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-[16px] font-bold text-zinc-900 tracking-tight leading-none">{order.customer.name}</span>
                  <span className="text-[12px] text-zinc-400 font-medium mt-1.5 uppercase tracking-tight">{order.customer.email}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 py-6 border-y border-zinc-50">
                <LabelValue label="Total Lifecycle" value={`${order.customer.totalOrders} Units`} />
                <LabelValue label="Registry Date" value={order.customer.joinedDate} />
              </div>
              <div className="space-y-6">
                <LabelValue label="Contact Anchor" value={order.customer.phone} />
                <Button variant="ghost" className="w-full h-10 rounded-none text-[11px] text-zinc-400 hover:text-black hover:bg-zinc-50 transition-all font-bold uppercase tracking-widest border border-zinc-50">
                  Full Profile
                </Button>
              </div>
            </div>
          </Card>

          <Card title="Shipping Address">
            <div className="space-y-6">
              <div className="p-5 bg-zinc-50/50 rounded-none border border-zinc-100">
                <div className="flex items-start gap-4">
                  <MapPin size={18} className="text-zinc-400 mt-1 shrink-0" strokeWidth={1.5} />
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[14px] font-bold text-zinc-900 leading-tight tracking-tight">{order.shipping.address}</p>
                    <p className="text-[12px] text-zinc-500 font-medium uppercase tracking-tight">{order.shipping.area}, {order.shipping.city}</p>
                    <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest mt-1">{order.shipping.postcode}, {order.shipping.country}</p>
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => setIsEditAddressModalOpen(true)}
                className="w-full text-zinc-400 hover:text-black transition-all text-[11px] font-bold tracking-widest uppercase rounded-none"
              >
                Edit Address
              </Button>
            </div>
          </Card>

          <Card title="Activity Log">
            <div className="pt-2">
              <StatusTimelineItem status="Order Placed" date="March 22, 2024 at 2:38 PM" />
              <StatusTimelineItem status="Payment Pending" date="March 22, 2024 at 2:40 PM" />
              <StatusTimelineItem status="Awaiting Fulfillment" date="March 22, 2024 at 2:45 PM" current />
            </div>
          </Card>
        </div>
      </div>
      <EditAddressModal 
        key={isEditAddressModalOpen ? 'open' : 'closed'}
        isOpen={isEditAddressModalOpen}
        onClose={() => setIsEditAddressModalOpen(false)}
        onSave={handleSaveAddress}
        initialAddress={shippingAddress}
      />
    </div>
  );
}
