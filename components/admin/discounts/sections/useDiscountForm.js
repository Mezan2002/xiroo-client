"use client";
import { useState } from "react";

export const useDiscountForm = (initialData) => {
  const [formData, setFormData] = useState({
    code: initialData.code || "",
    type: initialData.type || "Percentage",
    value: initialData.value || "",
    minRequirement: initialData.minRequirement || "None",
    minAmount: initialData.minAmount || "",
    minQty: initialData.minQty || "",
    usageLimit: initialData.usageLimit || "",
    limitPerCustomer: initialData.limitPerCustomer || false,
    startDate: initialData.startDate || "",
    endDate: initialData.endDate || "",
    status: initialData.status || "Active",
    ...initialData
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleTypeChange = (type) => setFormData(prev => ({ ...prev, type }));

  return { formData, setFormData, handleChange, handleTypeChange };
};
