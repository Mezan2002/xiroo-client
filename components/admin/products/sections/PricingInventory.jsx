"use client";
import { Label, SectionHeader } from "./Shared";

const PricingInventory = ({ product, setProduct }) => {
  return (
    <section>
      <SectionHeader
        label="Block 02"
        title="Pricing & Inventory"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-montserrat">
        {/* Base Price */}
        <div className="space-y-3">
          <Label>Regular Price</Label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-bold group-focus-within:text-black transition-colors">
              ৳
            </span>
            <input
              type="number"
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: e.target.value })}
              placeholder="0.00"
              className="w-full bg-white border border-[#EDECE9] px-10 py-4 text-[13px] font-bold outline-none focus:border-black transition-all placeholder:text-zinc-200"
            />
          </div>
        </div>

        {/* Offered Price */}
        <div className="space-y-3">
          <Label>Sale Price</Label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-bold group-focus-within:text-black transition-colors">
              ৳
            </span>
            <input
              type="number"
              value={product.salePrice}
              onChange={(e) => setProduct({ ...product, salePrice: e.target.value })}
              placeholder="0.00"
              className="w-full bg-white border border-[#EDECE9] px-10 py-4 text-[13px] font-bold outline-none focus:border-black transition-all placeholder:text-zinc-200"
            />
          </div>
        </div>

        {/* Inventory */}
        <div className="space-y-3">
          <Label>Stock Quantity</Label>
          <input
            type="number"
            value={product.inventory}
            onChange={(e) => setProduct({ ...product, inventory: e.target.value })}
            placeholder="0"
            className="w-full bg-white border border-[#EDECE9] px-6 py-4 text-[13px] font-bold outline-none focus:border-black transition-all placeholder:text-zinc-200"
          />
        </div>

        {/* SKU */}
        <div className="space-y-3">
          <Label>Product SKU</Label>
          <input
            type="text"
            value={product.sku}
            onChange={(e) => setProduct({ ...product, sku: e.target.value.toUpperCase() })}
            placeholder="E.G. XR-PRO-001"
            className="w-full bg-white border border-[#EDECE9] px-6 py-4 text-[13px] font-bold outline-none focus:border-black transition-all placeholder:text-zinc-200"
          />
        </div>
      </div>
    </section>
  );
};

export default PricingInventory;
