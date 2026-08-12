import { Check } from "lucide-react";

export default function ReturnItemSelector({ items, selectedItems, onSelectItems, requestType }) {
  const toggleItem = (item) => {
    const isSelected = selectedItems.some(
      (si) => si.product === item.product._id && si.variant === (item.variant || undefined)
    );

    if (isSelected) {
      onSelectItems(selectedItems.filter(
        (si) => !(si.product === item.product._id && si.variant === (item.variant || undefined))
      ));
    } else {
      onSelectItems([
        ...selectedItems,
        {
          product: item.product._id,
          variant: item.variant || undefined,
          quantity: item.quantity,
          price: item.price,
        },
      ]);
    }
  };

  const updateQuantity = (item, newQty) => {
    const qty = Math.max(1, Math.min(newQty, item.quantity));
    onSelectItems(
      selectedItems.map((si) =>
        si.product === item.product._id && si.variant === (item.variant || undefined)
          ? { ...si, quantity: qty }
          : si
      )
    );
  };

  const updateReplacementDetails = (item, replacementDetails) => {
    onSelectItems(
      selectedItems.map((si) =>
        si.product === item.product._id && si.variant === (item.variant || undefined)
          ? { ...si, replacementDetails }
          : si
      )
    );
  };

  const isSelected = (item) =>
    selectedItems.some(
      (si) => si.product === item.product._id && si.variant === (item.variant || undefined)
    );

  const getSelectedItem = (item) =>
    selectedItems.find(
      (si) => si.product === item.product._id && si.variant === (item.variant || undefined)
    );

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
          {requestType === "return" ? "Select items to return" : "Select items to exchange"}
        </p>
        <p className="text-[10px] text-gray-400">Click on items to select them</p>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => {
          const selected = isSelected(item);
          const selectedItem = getSelectedItem(item);
          const product = item.product;

          return (
            <div
              key={idx}
              onClick={() => toggleItem(item)}
              className={`p-4 border cursor-pointer transition-all ${
                selected
                  ? "border-black bg-gray-50"
                  : "border-gray-200 bg-white hover:border-gray-400"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-5 h-5 flex items-center justify-center border flex-shrink-0 mt-0.5 ${
                    selected ? "bg-black border-black" : "border-gray-300"
                  }`}
                >
                  {selected && <Check className="w-3 h-3 text-white" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[13px] font-bold text-gray-900">{product?.title || "Product"}</p>
                      {item.variant && (
                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">{item.variant}</p>
                      )}
                    </div>
                    <p className="text-[13px] font-bold font-mono text-gray-900 flex-shrink-0">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <p className="text-[10px] text-gray-400">
                      Qty: {item.quantity} × ৳{item.price.toLocaleString()}
                    </p>
                    {selected && (
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                          {requestType === "exchange" ? "Exchange Qty:" : "Return Qty:"}
                        </span>
                        <div className="flex items-center border border-gray-200">
                          <button
                            onClick={() => updateQuantity(item, (selectedItem?.quantity || item.quantity) - 1)}
                            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                          >
                            -
                          </button>
                          <span className="w-8 h-7 flex items-center justify-center text-[11px] font-bold border-x border-gray-200">
                            {selectedItem?.quantity || item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item, (selectedItem?.quantity || item.quantity) + 1)}
                            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {selected && requestType === "exchange" && (
                    <div className="mt-3 pt-3 border-t border-gray-200" onClick={(e) => e.stopPropagation()}>
                      <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1.5">
                        Desired Replacement Item / Size / Color *
                      </label>
                      <input
                        type="text"
                        value={selectedItem?.replacementDetails || ""}
                        onChange={(e) => updateReplacementDetails(item, e.target.value)}
                        placeholder="e.g. Want Size L in Black instead of Size M"
                        className="w-full px-3 py-2 border border-gray-300 text-[12px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black bg-white"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedItems.length > 0 && (
        <div className="p-4 border border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Selected Items</span>
            <span className="text-[13px] font-bold">{selectedItems.length}</span>
          </div>
        </div>
      )}
    </div>
  );
}
