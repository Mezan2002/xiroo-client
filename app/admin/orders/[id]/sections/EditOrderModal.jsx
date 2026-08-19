"use client";
import { useState, useEffect, useRef } from "react";
import { X, Loader2, Plus, Trash2, Search, Package, Link2, Unlink } from "lucide-react";
import { useOrders } from "@/hooks/api/useOrders";
import { useProducts } from "@/hooks/api/useProducts";
import { useToast } from "@/hooks/useToast";

const LABEL = "text-[10px] font-bold text-zinc-400 uppercase tracking-[0.15em]";
const INPUT =
  "w-full px-3 py-2.5 bg-white border border-zinc-200 text-[12px] font-medium text-zinc-900 outline-none focus:border-black transition-colors placeholder:text-zinc-300";

function ProductSearchDropdown({ onSelect, onClose }) {
  const [query, setQuery] = useState("");
  const { useSearchProducts, useAllProducts } = useProducts();
  const { data: searchResponse, isLoading: isSearchLoading } =
    useSearchProducts(query);
  const { data: allResponse, isLoading: isAllLoading } = useAllProducts({
    limit: 12,
  });

  const resolveProducts = (resp) => {
    const d = resp?.data;
    if (!d) return [];
    if (Array.isArray(d)) return d;
    if (Array.isArray(d.data)) return d.data;
    return [];
  };
  const products = query
    ? resolveProducts(searchResponse)
    : resolveProducts(allResponse);
  const isLoading = query ? isSearchLoading : isAllLoading;

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 bg-white border border-zinc-200 shadow-2xl z-[100] mt-1"
    >
      <div className="p-3 border-b border-zinc-100 flex items-center gap-2">
        <Search size={13} className="text-zinc-400" />
        <input
          autoFocus
          placeholder="Search product name or SKU..."
          className="flex-1 bg-transparent outline-none text-[12px] font-medium"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {isLoading && (
          <Loader2 size={13} className="animate-spin text-zinc-400" />
        )}
      </div>
      <div className="max-h-[260px] overflow-y-auto">
        {products.length > 0 ? (
          products.map((p) => (
            <button
              key={p._id}
              onClick={() => onSelect(p)}
              className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-zinc-50 transition-colors text-left border-b border-zinc-50 last:border-0"
            >
              <div className="w-9 h-9 bg-zinc-100 shrink-0 overflow-hidden relative">
                {p.images?.[0] ? (
                  <img
                    src={p.images[0]}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={14} className="text-zinc-300" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-zinc-900 truncate">
                  {p.title}
                </p>
                <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">
                  {p.sku}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[12px] font-bold text-zinc-900">
                  &#2547;{p.salePrice || p.price}
                </p>
                <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">
                  {p.inventory} in stock
                </p>
              </div>
            </button>
          ))
        ) : query ? (
          <div className="p-8 text-center text-zinc-400 text-[11px]">
            No products found for &quot;{query}&quot;
          </div>
        ) : (
          <div className="p-8 text-center text-zinc-400 text-[11px]">
            Start typing to search products...
          </div>
        )}
      </div>
    </div>
  );
}

function VariantButtonPicker({ variants, selectedVariant, onSelect, disabled }) {
  const selectedMap = {};
  if (selectedVariant && selectedVariant !== "Standard") {
    const parts = selectedVariant.split(" / ").map((s) => s.trim());
    let i = 0;
    for (const group of variants) {
      if (i < parts.length) {
        selectedMap[group.name] = parts[i];
        i++;
      }
    }
  }

  const handleSelect = (groupName, value) => {
    selectedMap[groupName] = value;
    const combined = variants
      .map((g) => selectedMap[g.name] || "")
      .filter(Boolean)
      .join(" / ");
    onSelect(combined || "Standard");
  };

  return (
    <div className="flex flex-col gap-2.5">
      {variants.map((variant) => (
        <div key={variant.name}>
          <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
            Select {variant.name}
            {!selectedMap[variant.name] && (
              <span className="text-red-400 ml-1">Required</span>
            )}
          </p>
          <div className="flex flex-wrap gap-1">
            {variant.values.map((vObj) => {
              const val = typeof vObj === "string" ? vObj : vObj.value;
              const isSelected = selectedMap[variant.name] === val;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleSelect(variant.name, val)}
                  disabled={disabled}
                  className={`px-2 py-1 text-[10px] font-bold border transition-all ${
                    isSelected
                      ? "bg-black text-white border-black"
                      : "border-zinc-200 text-zinc-500 hover:border-black"
                  } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {val}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function BundleCreator({ items, onBundle, onUnbundle, onClose }) {
  const [selectedIndices, setSelectedIndices] = useState([]);

  // Find items that already share a bundleId
  const bundledItems = items.reduce((acc, item, idx) => {
    if (item.bundleId) {
      if (!acc[item.bundleId]) acc[item.bundleId] = [];
      acc[item.bundleId].push(idx);
    }
    return acc;
  }, {});

  const existingBundles = Object.entries(bundledItems);

  const toggleSelect = (idx) => {
    setSelectedIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleCreateBundle = () => {
    if (selectedIndices.length < 2) return;
    onBundle(selectedIndices);
    onClose();
  };

  const handleRemoveBundle = (bundleId) => {
    const indices = bundledItems[bundleId];
    onUnbundle(indices);
  };

  return (
    <div className="space-y-4">
      {/* Existing Bundles */}
      {existingBundles.length > 0 && (
        <div className="space-y-2">
          <p className={LABEL}>Active Bundles</p>
          {existingBundles.map(([bundleId, indices]) => (
            <div
              key={bundleId}
              className="border border-zinc-200 p-3 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Link2 size={12} className="text-zinc-400" />
                  <span className="text-[11px] font-bold text-zinc-700">
                    Bundle ({indices.length} items)
                  </span>
                  <span className="text-[9px] text-zinc-400 font-mono">
                    {bundleId}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveBundle(bundleId)}
                  className="text-[10px] font-bold text-red-400 hover:text-red-600 uppercase tracking-wider"
                >
                  Unbundle
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {indices.map((idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-zinc-100 text-[10px] font-bold text-zinc-600"
                  >
                    {items[idx].title}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create New Bundle */}
      <div className="space-y-2">
        <p className={LABEL}>Select items to bundle (min 2)</p>
        <p className="text-[10px] text-zinc-400">
          Bundled items get 10% off. 3+ items = free shipping.
        </p>
        <div className="space-y-1">
          {items.map((item, idx) => (
            <label
              key={idx}
              className={`flex items-center gap-3 p-2.5 border cursor-pointer transition-colors ${
                selectedIndices.includes(idx)
                  ? "border-zinc-900 bg-zinc-50"
                  : "border-zinc-100 hover:border-zinc-300"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedIndices.includes(idx)}
                onChange={() => toggleSelect(idx)}
                disabled={!!item.bundleId}
                className="w-3.5 h-3.5 accent-black"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-zinc-900 truncate">
                  {item.title}
                </p>
                {item.bundleId && (
                  <p className="text-[9px] text-zinc-400">Already bundled</p>
                )}
              </div>
              <span className="text-[11px] font-bold text-zinc-500 font-mono">
                &#2547;{item.price}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-100">
        <button
          onClick={onClose}
          className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-700 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleCreateBundle}
          disabled={selectedIndices.length < 2}
          className="px-5 py-2 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Link2 size={11} />
          Create Bundle ({selectedIndices.length})
        </button>
      </div>
    </div>
  );
}

export default function EditOrderModal({ isOpen, onClose, order }) {
  const { toast } = useToast();
  const { updateOrder, updateOrderPrices } = useOrders();

  const [activeTab, setActiveTab] = useState("details");
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [showBundleCreator, setShowBundleCreator] = useState(false);
  const [productVariants, setProductVariants] = useState({});

  const [form, setForm] = useState({
    shippingAddress: "",
    deliveryMethod: "normal",
    shippingFee: 0,
    paymentMethod: "cod",
    paymentStatus: "pending",
    note: "",
    guestFirstName: "",
    guestLastName: "",
    guestEmail: "",
    guestPhone: "",
  });

  const [editedItems, setEditedItems] = useState([]);
  const [productData, setProductData] = useState({});

  const fetchProductVariants = async (productId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products/${productId}`);
      const data = await response.json();
      if (data?.data) {
        setProductVariants((prev) => ({
          ...prev,
          [productId]: data.data.variants || [],
        }));
        setProductData((prev) => ({
          ...prev,
          [productId]: data.data,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch product variants:", error);
    }
  };

  useEffect(() => {
    if (order && isOpen) {
      setForm({
        shippingAddress: order.shippingAddress || "",
        deliveryMethod: order.deliveryMethod || "normal",
        shippingFee: order.shippingFee || 0,
        paymentMethod: order.paymentMethod || "cod",
        paymentStatus: order.paymentStatus || "pending",
        note: order.note || "",
        guestFirstName: order.guestInfo?.firstName || "",
        guestLastName: order.guestInfo?.lastName || "",
        guestEmail: order.guestInfo?.email || "",
        guestPhone: order.guestInfo?.phone || "",
      });
      setEditedItems(
        order.items.map((item) => ({
          productId: item.product?._id || item.product,
          title: item.product?.title || "Product",
          image: item.product?.images?.[0] || "",
          variant: item.variant || "Standard",
          quantity: item.quantity,
          price: item.price,
          originalPrice: item.originalPrice,
          bundleId: item.bundleId || null,
          multiItems: item.multiItems || [],
          isNew: false,
        }))
      );
      setActiveTab("details");
      setShowProductSearch(false);
      setShowBundleCreator(false);
      
      // Fetch full product data for variants
      const productIds = [...new Set(
        order.items
          .map((item) => item.product?._id || item.product)
          .filter(Boolean)
      )];
      productIds.forEach((id) => {
        if (!productVariants[id]) {
          fetchProductVariants(id);
        }
      });
    }
  }, [order, isOpen]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index, field, value) => {
    setEditedItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleAddProduct = (product) => {
    const newItem = {
      productId: product._id,
      title: product.title,
      image: product.images?.[0] || "",
      variant: "Standard",
      quantity: 1,
      price: product.salePrice || product.price,
      originalPrice: product.salePrice || product.price,
      bundleId: null,
      multiItems: [],
      isNew: true,
    };
    setEditedItems((prev) => [...prev, newItem]);
    if (product.variants) {
      setProductVariants((prev) => ({
        ...prev,
        [product._id]: product.variants,
      }));
    }
    setProductData((prev) => ({
      ...prev,
      [product._id]: product,
    }));
    setShowProductSearch(false);
    toast.success(`Added "${product.title}" to order`);
  };

  const handleRemoveItem = (index) => {
    const item = editedItems[index];
    setEditedItems((prev) => prev.filter((_, i) => i !== index));
    toast.success(`Removed "${item.title}" from order`);
  };

  const handleBundleItems = (indices) => {
    const bundleId = `bundle_${Date.now()}`;
    setEditedItems((prev) =>
      prev.map((item, idx) =>
        indices.includes(idx) ? { ...item, bundleId } : item
      )
    );
    toast.success(`Created bundle with ${indices.length} items`);
  };

  const handleUnbundleItems = (indices) => {
    setEditedItems((prev) =>
      prev.map((item, idx) =>
        indices.includes(idx) ? { ...item, bundleId: null } : item
      )
    );
    toast.success("Bundle removed");
  };

  const handleSaveDetails = () => {
    const payload = {
      shippingAddress: form.shippingAddress,
      deliveryMethod: form.deliveryMethod,
      shippingFee: Number(form.shippingFee),
      paymentMethod: form.paymentMethod,
      paymentStatus: form.paymentStatus,
      note: form.note,
    };

    if (!order.user || order.createdByAdmin) {
      payload.guestInfo = {
        firstName: form.guestFirstName,
        lastName: form.guestLastName,
        email: form.guestEmail,
        phone: form.guestPhone,
      };
    }

    updateOrder.mutate(
      { id: order._id, data: payload },
      {
        onSuccess: () => {
          toast.success("Order details updated successfully.");
          onClose();
        },
        onError: (err) => {
          toast.error(err.message || "Failed to update order.");
        },
      }
    );
  };

  const handleSaveItems = () => {
    if (editedItems.length === 0) {
      toast.error("Order must have at least one item.");
      return;
    }

    const items = editedItems.map((item) => {
      const entry = {
        productId: item.productId,
        variant: item.variant,
        quantity: Number(item.quantity),
        price: Number(item.price),
        originalPrice: Number(item.originalPrice || item.price),
      };
      if (item.bundleId) entry.bundleId = item.bundleId;
      if (item.multiItems?.length > 0) entry.multiItems = item.multiItems;
      return entry;
    });

    updateOrderPrices.mutate(
      { id: order._id, items, shippingFee: Number(form.shippingFee) },
      {
        onSuccess: () => {
          toast.success("Order items updated successfully.");
          onClose();
        },
        onError: (err) => {
          toast.error(err.message || "Failed to update items.");
        },
      }
    );
  };

  if (!isOpen || !order) return null;

  const editableStatuses = [
    "pending",
    "processing",
    "given-for-design",
    "ready-to-pack",
    "on-hold",
  ];
  const isEditable = editableStatuses.includes(order.status);

  const itemsSubtotal = editedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = itemsSubtotal + Number(form.shippingFee);

  // Group items by bundleId for display
  const bundleGroups = editedItems.reduce((acc, item, idx) => {
    if (item.bundleId) {
      if (!acc[item.bundleId]) acc[item.bundleId] = [];
      acc[item.bundleId].push(idx);
    }
    return acc;
  }, {});
  const hasBundles = Object.keys(bundleGroups).length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-3xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-900 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">
                #{order.orderId?.slice(-4)}
              </span>
            </div>
            <div>
              <h2 className="text-[13px] font-bold text-zinc-900">
                Edit Order
              </h2>
              <p className="text-[10px] text-zinc-400 font-medium">
                {order.orderId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {!isEditable && (
          <div className="px-6 py-2.5 bg-amber-50 border-b border-amber-100 shrink-0">
            <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">
              This order is in {order.status} status and cannot be edited.
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-zinc-100 shrink-0">
          <button
            onClick={() => setActiveTab("details")}
            className={`flex-1 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${
              activeTab === "details"
                ? "text-zinc-900 border-b-2 border-zinc-900"
                : "text-zinc-400 hover:text-zinc-600"
            }`}
          >
            Order Details
          </button>
          <button
            onClick={() => setActiveTab("items")}
            className={`flex-1 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${
              activeTab === "items"
                ? "text-zinc-900 border-b-2 border-zinc-900"
                : "text-zinc-400 hover:text-zinc-600"
            }`}
          >
            Items ({editedItems.length})
            {hasBundles && (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 bg-zinc-900 text-white text-[8px] font-bold rounded-full">
                {Object.keys(bundleGroups).length}
              </span>
            )}
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "details" ? (
            <div className="p-6 space-y-5">
              {/* Customer Info */}
              {(!order.user || order.createdByAdmin) && (
                <div className="space-y-3">
                  <p className={LABEL}>Customer Info</p>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={form.guestFirstName}
                      onChange={(e) =>
                        handleChange("guestFirstName", e.target.value)
                      }
                      disabled={!isEditable}
                      placeholder="First Name"
                      className={INPUT}
                    />
                    <input
                      type="text"
                      value={form.guestLastName}
                      onChange={(e) =>
                        handleChange("guestLastName", e.target.value)
                      }
                      disabled={!isEditable}
                      placeholder="Last Name"
                      className={INPUT}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="email"
                      value={form.guestEmail}
                      onChange={(e) =>
                        handleChange("guestEmail", e.target.value)
                      }
                      disabled={!isEditable}
                      placeholder="Email"
                      className={INPUT}
                    />
                    <input
                      type="text"
                      value={form.guestPhone}
                      onChange={(e) =>
                        handleChange("guestPhone", e.target.value)
                      }
                      disabled={!isEditable}
                      placeholder="Phone"
                      className={INPUT}
                    />
                  </div>
                </div>
              )}

              {/* Shipping Address */}
              <div className="space-y-3">
                <p className={LABEL}>Shipping Address</p>
                <textarea
                  value={form.shippingAddress}
                  onChange={(e) =>
                    handleChange("shippingAddress", e.target.value)
                  }
                  disabled={!isEditable}
                  rows={3}
                  placeholder="Full shipping address..."
                  className={INPUT + " resize-none"}
                />
              </div>

              {/* Delivery & Payment Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <p className={LABEL}>Delivery</p>
                  <select
                    value={form.deliveryMethod}
                    onChange={(e) =>
                      handleChange("deliveryMethod", e.target.value)
                    }
                    disabled={!isEditable}
                    className={INPUT + " bg-white"}
                  >
                    <option value="normal">Standard Delivery</option>
                    <option value="fast">Fast Delivery</option>
                  </select>
                  <input
                    type="number"
                    min="0"
                    value={form.shippingFee}
                    onChange={(e) => handleChange("shippingFee", e.target.value)}
                    disabled={!isEditable}
                    placeholder="Shipping Fee"
                    className={INPUT + " font-mono"}
                  />
                </div>
                <div className="space-y-3">
                  <p className={LABEL}>Payment</p>
                  <select
                    value={form.paymentMethod}
                    onChange={(e) =>
                      handleChange("paymentMethod", e.target.value)
                    }
                    disabled={!isEditable}
                    className={INPUT + " bg-white"}
                  >
                    <option value="cod">Cash on Delivery</option>
                    <option value="online">Online Payment</option>
                  </select>
                  <select
                    value={form.paymentStatus}
                    onChange={(e) =>
                      handleChange("paymentStatus", e.target.value)
                    }
                    disabled={!isEditable}
                    className={INPUT + " bg-white"}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>

              {/* Note */}
              <div className="space-y-3">
                <p className={LABEL}>Order Note</p>
                <textarea
                  value={form.note}
                  onChange={(e) => handleChange("note", e.target.value)}
                  disabled={!isEditable}
                  rows={2}
                  placeholder="Internal note..."
                  className={INPUT + " resize-none placeholder:text-zinc-300"}
                />
              </div>
            </div>
          ) : (
            /* Items Tab */
            <div className="p-6 space-y-3">
              {/* Bundle Creator Panel */}
              {showBundleCreator && (
                <div className="border border-zinc-900 p-4 mb-4">
                  <BundleCreator
                    items={editedItems}
                    onBundle={handleBundleItems}
                    onUnbundle={handleUnbundleItems}
                    onClose={() => setShowBundleCreator(false)}
                  />
                </div>
              )}

              {editedItems.map((item, idx) => {
                const isInBundle = !!item.bundleId;
                const bundleItems = isInBundle
                  ? bundleGroups[item.bundleId]
                  : [];
                const isFirstInBundle =
                  isInBundle && bundleItems[0] === idx;

                return (
                  <div
                    key={idx}
                    className={`border p-3 flex items-start gap-3 ${
                      isInBundle
                        ? "border-zinc-900 bg-zinc-50"
                        : "border-zinc-200"
                    }`}
                  >
                    {/* Product Image */}
                    <div className="w-12 h-12 bg-zinc-100 shrink-0 overflow-hidden relative">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={16} className="text-zinc-300" />
                        </div>
                      )}
                      {isInBundle && (
                        <div className="absolute top-0 left-0 w-0 h-0 border-t-[16px] border-t-zinc-900 border-r-[16px] border-r-transparent">
                          <Link2
                            size={7}
                            className="text-white absolute top-[-14px] left-[1px]"
                          />
                        </div>
                      )}
                    </div>

                    {/* Product Info + Fields */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[12px] font-bold text-zinc-900 truncate">
                            {item.title}
                          </p>
                          {isInBundle && isFirstInBundle && (
                            <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mt-0.5">
                              Bundle &middot; {bundleItems.length} items &middot; 10%
                              off
                            </p>
                          )}
                          {isInBundle && !isFirstInBundle && (
                            <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mt-0.5">
                              Part of bundle
                            </p>
                          )}
                        </div>
                        {isEditable && (
                          <button
                            onClick={() => handleRemoveItem(idx)}
                            className="p-1 text-zinc-300 hover:text-red-500 transition-colors shrink-0"
                            title="Remove item"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>

                      {(() => {
                        const variants = item.product?.variants || productVariants[item.productId];
                        return variants?.length > 0 ? (
                          <div className="space-y-2">
                            <VariantButtonPicker
                              variants={variants}
                              selectedVariant={item.variant}
                              onSelect={(v) => {
                                handleItemChange(idx, "variant", v);
                                // Update price based on variant selection
                                const pdata = productData[item.productId] || item.product;
                                if (pdata?.variants && v !== "Standard") {
                                  const parts = v.split(" / ").map((s) => s.trim());
                                  let variantPrice = 0;
                                  for (const part of parts) {
                                    for (const group of pdata.variants) {
                                      const match = group.values?.find(
                                        (val) => (typeof val === "string" ? val : val.value) === part
                                      );
                                      if (match?.price && match.price > variantPrice) {
                                        variantPrice = match.price;
                                      }
                                    }
                                  }
                                  if (variantPrice > 0) {
                                    handleItemChange(idx, "price", variantPrice);
                                  }
                                }
                              }}
                              disabled={!isEditable}
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleItemChange(
                                    idx,
                                    "quantity",
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                disabled={!isEditable}
                                className={
                                  INPUT +
                                  " text-[11px] py-1.5 px-2 font-mono text-center"
                                }
                              />
                              <input
                                type="number"
                                min="0"
                                step="1"
                                value={item.price}
                                onChange={(e) =>
                                  handleItemChange(
                                    idx,
                                    "price",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                disabled={!isEditable}
                                className={
                                  INPUT + " text-[11px] py-1.5 px-2 font-mono"
                                }
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="text"
                              value={item.variant}
                              onChange={(e) =>
                                handleItemChange(idx, "variant", e.target.value)
                              }
                              disabled={!isEditable}
                              placeholder="Variant"
                              className={INPUT + " text-[11px] py-1.5 px-2"}
                            />
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                handleItemChange(
                                  idx,
                                  "quantity",
                                  parseInt(e.target.value) || 1
                                )
                              }
                              disabled={!isEditable}
                              className={
                                INPUT +
                                " text-[11px] py-1.5 px-2 font-mono text-center"
                              }
                            />
                            <input
                              type="number"
                              min="0"
                              step="1"
                              value={item.price}
                              onChange={(e) =>
                                handleItemChange(
                                  idx,
                                  "price",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              disabled={!isEditable}
                              className={
                                INPUT + " text-[11px] py-1.5 px-2 font-mono"
                              }
                            />
                          </div>
                        );
                      })()}

                      <div className="flex justify-between text-[10px]">
                        <span className="text-zinc-400">Qty &times; Price</span>
                        <span className="font-bold text-zinc-700 font-mono">
                          &#2547;{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Action Buttons */}
              {isEditable && (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <button
                      onClick={() => {
                        setShowProductSearch(!showProductSearch);
                        setShowBundleCreator(false);
                      }}
                      className="w-full py-2.5 border border-dashed border-zinc-300 text-[11px] font-bold text-zinc-400 hover:border-zinc-500 hover:text-zinc-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus size={13} />
                      Add Product
                    </button>
                    {showProductSearch && (
                      <ProductSearchDropdown
                        onSelect={handleAddProduct}
                        onClose={() => setShowProductSearch(false)}
                      />
                    )}
                  </div>
                  {editedItems.length >= 2 && (
                    <button
                      onClick={() => {
                        setShowBundleCreator(!showBundleCreator);
                        setShowProductSearch(false);
                      }}
                      className={`px-4 py-2.5 border text-[11px] font-bold transition-colors flex items-center gap-2 ${
                        showBundleCreator
                          ? "border-zinc-900 bg-zinc-900 text-white"
                          : "border-dashed border-zinc-300 text-zinc-400 hover:border-zinc-500 hover:text-zinc-600"
                      }`}
                    >
                      <Link2 size={13} />
                      Bundle
                    </button>
                  )}
                </div>
              )}

              {/* Order Total */}
              <div className="bg-zinc-50 border border-zinc-100 p-4 mt-4 space-y-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-500">Items Subtotal</span>
                  <span className="font-bold text-zinc-700 font-mono">
                    &#2547;{itemsSubtotal.toLocaleString()}
                  </span>
                </div>
                {hasBundles && (
                  <div className="flex justify-between text-[11px]">
                    <span className="text-zinc-500">Bundle Discount</span>
                    <span className="font-bold text-green-600 font-mono">
                      -10%
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-500">Shipping</span>
                  <span className="font-bold text-zinc-700 font-mono">
                    &#2547;{Number(form.shippingFee).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[12px] pt-2 border-t border-zinc-200">
                  <span className="font-bold text-zinc-900 uppercase tracking-wider">
                    Total
                  </span>
                  <span className="text-[15px] font-black text-zinc-900 font-mono">
                    &#2547;{total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {isEditable && (
          <div className="border-t border-zinc-100 px-6 py-4 flex items-center justify-end gap-3 shrink-0">
            <button
              onClick={onClose}
              disabled={updateOrder.isPending || updateOrderPrices.isPending}
              className="px-5 py-2 border border-zinc-200 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:border-zinc-400 hover:text-zinc-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={
                activeTab === "details" ? handleSaveDetails : handleSaveItems
              }
              disabled={updateOrder.isPending || updateOrderPrices.isPending}
              className="px-6 py-2 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {(updateOrder.isPending || updateOrderPrices.isPending) && (
                <Loader2 size={10} className="animate-spin" />
              )}
              {updateOrder.isPending || updateOrderPrices.isPending
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
