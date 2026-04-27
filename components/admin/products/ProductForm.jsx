"use client";
import { useAttributes } from "@/hooks/api/useAttributes";
import { useCategories } from "@/hooks/api/useCategories";
import { forwardRef, useImperativeHandle, useMemo } from "react";
import BasicInfo from "./sections/BasicInfo";
import BundleManager from "./sections/BundleManager";
import ClassificationRegistry from "./sections/ClassificationRegistry";
import MediaManager from "./sections/MediaManager";
import SpecManager from "./sections/SpecManager";
import VariantManager from "./sections/VariantManager";
import { useProductForm } from "./sections/useProductForm";

const ProductForm = forwardRef(({ initialData, onSubmit, isPending }, ref) => {
  const { useCategoryTree } = useCategories();
  const { data: categories = [] } = useCategoryTree();
  const { useAttributeRegistry } = useAttributes();
  const { data: attributes = [] } = useAttributeRegistry();

  const {
    product,
    setProduct,
    validateAndSave,
    addVariant,
    removeVariant,
    updateVariantName,
    addVariantValue,
    updateVariantValuePrice,
    removeVariantValue,
    addSpecGroup,
    removeSpecGroup,
    updateSpecGroupName,
    addSpecItem,
    updateSpecItem,
    removeSpecItem,
    addBundle,
    removeBundle,
    updateBundle,
  } = useProductForm(initialData, onSubmit);

  useImperativeHandle(ref, () => ({
    handleSave: () => validateAndSave(),
  }));

  const selectedCategoryData = useMemo(() => {
    const cid = product.subCategory || product.category;
    return categories.find((c) => c._id === cid);
  }, [categories, product.category, product.subCategory]);

  const suggestedAttributes = useMemo(() => {
    if (!selectedCategoryData?.allowedAttributes) return [];
    return attributes.filter((attr) =>
      selectedCategoryData.allowedAttributes.includes(attr._id),
    );
  }, [attributes, selectedCategoryData]);

  const rootCategories = useMemo(
    () =>
      categories
        .filter((c) => !c.parentId)
        .map((c) => ({ value: c._id, label: c.name })),
    [categories],
  );

  const subCategoryOptions = useMemo(() => {
    if (!product.category) return [];
    return categories
      .filter((c) => c.parentId && c.parentId.toString() === product.category)
      .map((c) => ({ value: c._id, label: c.name }));
  }, [categories, product.category]);

  return (
    <div className="space-y-16 md:space-y-32 pb-24">
      <BasicInfo product={product} setProduct={setProduct} />

      <ClassificationRegistry
        product={product}
        setProduct={setProduct}
        rootCategories={rootCategories}
        subCategoryOptions={subCategoryOptions}
      />

      <VariantManager
        product={product}
        suggestedAttributes={suggestedAttributes}
        addVariant={addVariant}
        removeVariant={removeVariant}
        updateVariantName={updateVariantName}
        addVariantValue={addVariantValue}
        updateVariantValuePrice={updateVariantValuePrice}
        removeVariantValue={removeVariantValue}
      />

      <MediaManager product={product} setProduct={setProduct} />

      <SpecManager
        product={product}
        addSpecGroup={addSpecGroup}
        removeSpecGroup={removeSpecGroup}
        updateSpecGroupName={updateSpecGroupName}
        addSpecItem={addSpecItem}
        updateSpecItem={updateSpecItem}
        removeSpecItem={removeSpecItem}
      />

      <BundleManager
        product={product}
        addBundle={addBundle}
        removeBundle={removeBundle}
        updateBundle={updateBundle}
      />
    </div>
  );
});

ProductForm.displayName = "ProductForm";

export default ProductForm;
