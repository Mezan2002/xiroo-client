"use client";
import React from "react";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import { ShoppingBag, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useOrders } from "@/hooks/api/useOrders";
import { useToast } from "@/hooks/useToast";
import CustomerSection from "./sections/CustomerSection";
import ItemsSection from "./sections/ItemsSection";
import LogisticsSection from "./sections/LogisticsSection";
import { useNewOrder } from "./sections/useNewOrder";

export default function NewOrderPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { placeOrder } = useOrders();
  const { order, setOrder, addItem, removeItem, updateItem, calculateSubtotal, calculateTotal } = useNewOrder();

  const handleCreateOrder = async () => {
    // Validation
    if (!order.customer || !order.shipping.address) {
      toast.error("Protocol Error: Customer identity and destination required.");
      return;
    }
    if (order.items.length === 0) {
      toast.error("Protocol Error: Registry is empty.");
      return;
    }

    const payload = {
      guestInfo: {
        firstName: order.customer.split(" ")[0],
        lastName: order.customer.split(" ").slice(1).join(" "),
        email: order.email,
        phone: order.phone
      },
      items: order.items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price
      })),
      totalPrice: calculateTotal(),
      shippingAddress: `${order.shipping.address}, ${order.shipping.area}, ${order.shipping.city}`,
      paymentMethod: order.paymentMethod,
      deliveryMethod: order.deliveryMethod,
      shippingFee: order.shippingFee,
      status: "pending",
      paymentStatus: "pending"
    };

    placeOrder.mutate(payload, {
      onSuccess: () => {
        toast.success("Registry Success: New order established.");
        router.push("/admin/orders");
      },
      onError: (err) => {
        toast.error(err.message || "Fulfillment Error: Order registry failed.");
      }
    });
  };

  const isPending = placeOrder.isPending;

  return (
    <div className="space-y-24 font-montserrat antialiased text-zinc-900 animate-in fade-in duration-700 pb-20">
      <ModuleHeader 
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Orders", href: "/admin/orders" },
          { label: "New Order", active: true }
        ]}
        title="New Order" icon={ShoppingBag}
        primaryAction={{
          label: isPending ? "Processing..." : "Create Order", 
          icon: isPending ? Loader2 : Save,
          onClick: handleCreateOrder,
          disabled: isPending
        }}
      />

      <div className="space-y-32">
        <CustomerSection order={order} setOrder={setOrder} />
        
        <ItemsSection 
          items={order.items} addItem={addItem} 
          removeItem={removeItem} updateItem={updateItem}
          subtotal={calculateSubtotal()}
          shippingFee={order.shippingFee}
          total={calculateTotal()}
          setOrder={setOrder}
        />

        <LogisticsSection order={order} setOrder={setOrder} />

        <section className="pt-32 border-t border-zinc-50 flex justify-end items-center gap-4">
          <Button 
            variant="outline" onClick={() => router.back()}
            disabled={isPending}
            className="h-12 px-8 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 border-zinc-200 hover:text-black hover:border-black rounded-none"
          >
            Discard Order
          </Button>
          <Button 
            className="h-12 px-12 bg-black text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-none transition-all hover:bg-zinc-800 disabled:opacity-50"
            onClick={handleCreateOrder}
            disabled={isPending}
          >
            {isPending ? "Creating..." : "Confirm & Register Order"}
          </Button>
        </section>
      </div>
    </div>
  );
}
