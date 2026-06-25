"use client";
import { useState } from "react";

export const useNewOrder = () => {
  const [order, setOrder] = useState({
    customer: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    items: [],
    shipping: { address: "", district: "", thana: "", postcode: "" },
    paymentMethod: "cod",
    deliveryMethod: "normal",
    shippingFee: 0
  });

  const addItem = (product, bundleId = null, variant = "Standard", quantity = 1) => {
    const newItem = product ? {
      id: Date.now() + Math.random(),
      product: product._id,
      name: product.title,
      price: product.salePrice || product.price,
      originalPrice: product.salePrice || product.price,
      quantity: quantity,
      variant: variant,
      bundleId: bundleId,
      image: product.images?.[0] || ""
    } : {
      id: Date.now() + Math.random(),
      product: null,
      name: "",
      price: 0,
      originalPrice: 0,
      quantity: 1,
      variant: "Standard",
      bundleId: null,
      image: ""
    };

    setOrder(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (id) => {
    setOrder(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const updateItem = (id, field, value) => {
    setOrder(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const calculateMetrics = () => {
    let rawSubtotal = 0;
    const bundleGroups = {};

    order.items.forEach((item) => {
      const itemSubtotal = item.price * item.quantity;
      rawSubtotal += itemSubtotal;

      if (item.bundleId) {
        if (!bundleGroups[item.bundleId]) {
          bundleGroups[item.bundleId] = { quantity: 0, subtotal: 0 };
        }
        bundleGroups[item.bundleId].quantity += item.quantity;
        bundleGroups[item.bundleId].subtotal += itemSubtotal;
      }
    });

    let autoBundleDiscountAmount = 0;
    let isBundleFreeShipping = false;

    Object.values(bundleGroups).forEach((group) => {
      if (group.quantity >= 2) {
        autoBundleDiscountAmount += group.subtotal * 0.10;
      }
      if (group.quantity >= 3) {
        isBundleFreeShipping = true;
      }
    });

    const subtotal = rawSubtotal - autoBundleDiscountAmount;
    const shipping = isBundleFreeShipping ? 0 : (Number(order.shippingFee) || 0);
    const total = subtotal + shipping;

    return { rawSubtotal, subtotal, autoBundleDiscountAmount, isBundleFreeShipping, shipping, total };
  };

  const metrics = calculateMetrics();

  return { 
    order, 
    setOrder, 
    addItem, 
    removeItem, 
    updateItem, 
    calculateSubtotal: () => metrics.subtotal, 
    calculateTotal: () => metrics.total,
    metrics
  };
};
