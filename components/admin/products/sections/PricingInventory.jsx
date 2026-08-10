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

        {/* Cost Price */}
        <div className="space-y-3">
          <Label>Cost Price</Label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-bold group-focus-within:text-black transition-colors">
              ৳
            </span>
            <input
              type="number"
              value={product.costPrice}
              onChange={(e) => setProduct({ ...product, costPrice: e.target.value })}
              placeholder="0.00"
              className="w-full bg-white border border-[#EDECE9] px-10 py-4 text-[13px] font-bold outline-none focus:border-black transition-all placeholder:text-zinc-200"
            />
          </div>
          <p className="text-[10px] text-zinc-400 font-medium">
            Your supplier cost (for profit calculation)
          </p>
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

      {/* Free Delivery Toggle */}
      <div className="mt-6 flex items-center gap-4 p-4 bg-zinc-50 border border-[#EDECE9]">
        <button
          type="button"
          onClick={() => setProduct({ ...product, isFreeDelivery: !product.isFreeDelivery })}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            product.isFreeDelivery ? "bg-black" : "bg-zinc-200"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              product.isFreeDelivery ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
        <div className="space-y-1">
          <Label>Free Delivery</Label>
          <p className="text-[11px] text-zinc-400 font-medium">
            Enable to offer free shipping on this product
          </p>
        </div>
      </div>

      {/* Multi-Item Package Toggle */}
      <div className="mt-4 p-4 bg-zinc-50 border border-[#EDECE9] space-y-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setProduct({ ...product, isMultiItem: !product.isMultiItem })}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              product.isMultiItem ? "bg-black" : "bg-zinc-200"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                product.isMultiItem ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <div className="space-y-1">
            <Label>Multi-Item Package</Label>
            <p className="text-[11px] text-zinc-400 font-medium">
              Enable if this product is sold as a pack of multiple items
            </p>
          </div>
        </div>

        {product.isMultiItem && (
          <div className="flex items-center gap-4 pl-[60px]">
            <div className="space-y-1">
              <Label>Pack Quantity</Label>
              <input
                type="number"
                min="1"
                value={product.multiItemQuantity || 1}
                onChange={(e) => setProduct({ ...product, multiItemQuantity: Number(e.target.value) })}
                className="w-24 bg-white border border-[#EDECE9] px-4 py-2 text-[13px] font-bold outline-none focus:border-black transition-all"
              />
            </div>
            <p className="text-[11px] text-zinc-400 font-medium pt-6">
              Customer must buy this exact quantity per unit
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PricingInventory;
