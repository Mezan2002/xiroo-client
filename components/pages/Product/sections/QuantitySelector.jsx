"use client";
import { Button } from "@/components/ui/Button";
import { Minus, Plus } from "lucide-react";

export default function QuantitySelector({ quantity, setQuantity }) {
  return (
    <div className="flex items-center justify-between w-full mt-6 pt-6 pb-2 border-t border-gray-200">
      <div className="text-[10px] font-bold tracking-[0.2em] text-black uppercase">
        Quantity
      </div>
      <div className="flex items-center border border-gray-200 bg-white">
        <Button
          variant="ghost"
          size="icon"
          showHoverIcon={false}
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-50 transition-colors"
        >
          <Minus size={12} />
        </Button>
        <div className="w-10 h-10 flex items-center justify-center border-l border-r border-gray-200 text-black text-[11px] font-bold tracking-widest">
          {quantity < 10 ? `0${quantity}` : quantity}
        </div>
        <Button
          variant="ghost"
          size="icon"
          showHoverIcon={false}
          onClick={() => setQuantity(quantity + 1)}
          className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-50 transition-colors"
        >
          <Plus size={12} />
        </Button>
      </div>
    </div>
  );
}
