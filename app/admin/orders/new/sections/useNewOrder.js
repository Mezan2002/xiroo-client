"use client";
import { useState } from "react";

export const useNewOrder = () => {
  const [order, setOrder] = useState({
    customer: "",
    email: "",
    items: [],
    shipping: { address: "", area: "", city: "Dhaka", postcode: "" },
    paymentMethod: "Cash on Delivery"
  });

  const addItem = () => {
    setOrder(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now(), name: "", price: 0, qty: 1 }]
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

  const calculateSubtotal = () => order.items.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return { order, setOrder, addItem, removeItem, updateItem, calculateSubtotal };
};
