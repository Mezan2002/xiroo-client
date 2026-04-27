"use client";
import React from "react";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import { ShoppingBag, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import CustomerSection from "./sections/CustomerSection";
import ItemsSection from "./sections/ItemsSection";
import LogisticsSection from "./sections/LogisticsSection";
import { useNewOrder } from "./sections/useNewOrder";

export default function NewOrderPage() {
  const router = useRouter();
  const { order, setOrder, addItem, removeItem, updateItem, calculateSubtotal } = useNewOrder();

  return (
    <div className="space-y-24 font-montserrat antialiased text-zinc-900 animate-in fade-in duration-700 pb-20">
      <ModuleHeader 
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Orders", href: "/admin/orders" },
          { label: "Draft", active: true }
        ]}
        title="Draft Order" icon={ShoppingBag}
        primaryAction={{
          label: "Create Order", icon: Save,
          onClick: () => console.log("Order Registry:", order)
        }}
      />

      <div className="space-y-32">
        <CustomerSection order={order} setOrder={setOrder} />
        
        <ItemsSection 
          items={order.items} addItem={addItem} 
          removeItem={removeItem} updateItem={updateItem}
          subtotal={calculateSubtotal()}
        />

        <LogisticsSection order={order} setOrder={setOrder} />

        <section className="pt-32 border-t border-zinc-50 flex justify-end items-center gap-4">
          <Button 
            variant="outline" onClick={() => router.back()}
            className="h-12 px-8 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 border-zinc-200 hover:text-black hover:border-black rounded-none"
          >
            Discard Draft
          </Button>
          <Button 
            className="h-12 px-12 bg-black text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-none transition-all hover:bg-zinc-800"
            onClick={() => console.log("Registering fulfillment:", order)}
          >
            Complete Registration
          </Button>
        </section>
      </div>
    </div>
  );
}
