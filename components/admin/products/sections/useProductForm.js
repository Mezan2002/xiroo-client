/* eslint-disable react-hooks/set-state-in-effect */
import { useToast } from "@/hooks/useToast";
import { useEffect, useState } from "react";
import { useVariantHandlers } from "./hooks/useVariantHandlers";
import { useSpecHandlers } from "./hooks/useSpecHandlers";
import { useBundleHandlers } from "./hooks/useBundleHandlers";

export const useProductForm = (initialData, onSubmit) => {
  const { toast } = useToast();
  const [product, setProduct] = useState({
    title: "", description: "", price: "", salePrice: "", saleStartDate: "", saleEndDate: "",
    inventory: "", sku: "", tax: "15", variants: [], specifications: [], bundles: [],
    category: "", subCategory: "", images: [], stockStage: "in-stock", isFeatured: false, badge: "",
    seoTitle: "", seoDescription: "", seoKeywords: "",
  });

  const variantHandlers = useVariantHandlers(setProduct);
  const specHandlers = useSpecHandlers(setProduct);
  const bundleHandlers = useBundleHandlers(setProduct);

  const formatDate = (date) => (date ? new Date(date).toISOString().split("T")[0] : "");

  useEffect(() => {
    if (initialData) {
      setProduct({
        ...initialData,
        price: initialData.price?.toString() || "",
        salePrice: initialData.salePrice?.toString() || "",
        saleStartDate: formatDate(initialData.saleStartDate),
        saleEndDate: formatDate(initialData.saleEndDate),
        inventory: initialData.inventory?.toString() || "",
        tax: initialData.tax?.toString() || "15",
        category: initialData.category?._id || initialData.category || "",
        subCategory: initialData.subCategory?._id || initialData.subCategory || "",
        variants: initialData.variants?.map((v, i) => ({
          ...v, id: v._id || v.id || `v-${i}`,
          values: v.values?.map((val) => typeof val === "string" ? { value: val, price: "" } : val) || [],
        })) || [],
        specifications: initialData.specifications?.map((g, i) => ({
          ...g, id: g.id || `g-${Date.now()}-${i}`,
          items: g.items?.map((it, j) => ({ ...it, id: it.id || `it-${Date.now()}-${j}` })) || [],
        })) || [],
        bundles: initialData.bundles?.map((b, i) => ({ ...b, id: b.id || `b-${Date.now()}-${i}` })) || [],
        seoTitle: initialData.seoTitle || "",
        seoDescription: initialData.seoDescription || "",
        seoKeywords: initialData.seoKeywords || "",
      });
    }
  }, [initialData]);

  const validateAndSave = () => {
    if (!product.title) return toast.error("Product Nomenclature Required.");
    if (!product.price) return toast.error("Monetary Valuation Required.");
    if (!product.category) return toast.error("Category Registry Required.");
    if (!product.sku) return toast.error("Product SKU Required.");
    if (!product.images || product.images.length === 0) return toast.error("At least one image is required.");

    const payload = {
      ...product,
      subCategory: product.subCategory || undefined,
      sku: product.sku.toUpperCase(),
      price: Number(product.price),
      salePrice: product.salePrice ? Number(product.salePrice) : undefined,
      saleStartDate: product.saleStartDate ? new Date(product.saleStartDate) : undefined,
      saleEndDate: product.saleEndDate ? new Date(product.saleEndDate) : undefined,
      inventory: Number(product.inventory || 0),
      tax: Number(product.tax || 15),
      variants: product.variants.map((v) => ({
        name: v.name,
        values: v.values.map((val) => ({ value: val.value, price: val.price ? Number(val.price) : undefined })),
      })),
      specifications: product.specifications.map((g) => ({ group: g.group, items: g.items.map((i) => ({ label: i.label, value: i.value })) })),
      bundles: product.bundles.map((b) => ({ ...b, price: Number(b.price), unitPrice: Number(b.unitPrice) })),
      seoTitle: product.seoTitle || undefined,
      seoDescription: product.seoDescription || undefined,
      seoKeywords: product.seoKeywords || undefined,
    };
    onSubmit(payload);
  };

  return { product, setProduct, validateAndSave, ...variantHandlers, ...specHandlers, ...bundleHandlers };
};
