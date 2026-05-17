"use client";
import { useState } from "react";

export const useNewOrder = () => {
  const [order, setOrder] = useState({
    customer: "",
    email: "",
    phone: "",
    items: [],
    shipping: { address: "", area: "", city: "Dhaka", postcode: "" },
    paymentMethod: "cod",
    deliveryMethod: "normal",
    shippingFee: 60
  });

  const addItem = (product) => {
    // If product is provided, use its data, otherwise add a blank item
    const newItem = product ? {
      id: Date.now(),
      product: product._id,
      name: product.title,
      price: product.salePrice || product.price,
      quantity: 1
    } : {
      id: Date.now(),
      product: null,
      name: "",
      price: 0,
      quantity: 1
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

  const calculateSubtotal = () => order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const calculateTotal = () => calculateSubtotal() + (Number(order.shippingFee) || 0);

  return { order, setOrder, addItem, removeItem, updateItem, calculateSubtotal, calculateTotal };
};
