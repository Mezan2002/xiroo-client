"use client";
import { useState } from "react";
import { useAttributes } from "@/hooks/api/useAttributes";

export const useCategoryForm = (category, onSave) => {
  const [formData, setFormData] = useState({
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
    image: category?.image || null,
    isActive: category?.isActive !== false,
    isFeatured: category?.isFeatured || false,
    allowedAttributes: category?.allowedAttributes || [],
  });

  const { useAttributeRegistry } = useAttributes();
  const { data: attributesResponse } = useAttributeRegistry();
  const attributes = attributesResponse || [];

  const toggleAttribute = (attrId) => {
    setFormData(prev => {
      const current = prev.allowedAttributes || [];
      const updated = current.includes(attrId) ? current.filter(id => id !== attrId) : [...current, attrId];
      return { ...prev, allowedAttributes: updated };
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "name") {
      const generatedSlug = value.toLowerCase().trim().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
      setFormData(prev => ({ ...prev, name: value, slug: generatedSlug }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    onSave({ id: category._id, ...formData });
  };

  return { formData, setFormData, attributes, toggleAttribute, handleChange, handleSubmit };
};
