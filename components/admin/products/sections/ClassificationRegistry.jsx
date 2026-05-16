"use client";
import { Select } from "@/components/ui/Select";
import { Label, SectionHeader } from "./Shared";

const ClassificationRegistry = ({
  product,
  setProduct,
  rootCategories,
  subCategoryOptions,
}) => {
  return (
    <section>
      <SectionHeader label="Block 03" title="Category Selection" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20">
        <div className="space-y-6">
          <Label>Main Category</Label>
          <Select
            options={rootCategories}
            value={product.category}
            onChange={(val) =>
              setProduct({ ...product, category: val, subCategory: "" })
            }
            placeholder="Select a category"
          />
          <p className="text-[10px] text-zinc-400 font-medium italic">
            Assign this product to a main category.
          </p>
        </div>
        <div className="space-y-6">
          <Label>Sub Category</Label>
          <Select
            options={subCategoryOptions}
            value={product.subCategory}
            onChange={(val) => setProduct({ ...product, subCategory: val })}
            placeholder={
              product.category
                ? subCategoryOptions.length > 0
                  ? "Select Mapping"
                  : "No Sub-categories Available"
                : "Select Root First"
            }
            disabled={!product.category || subCategoryOptions.length === 0}
          />
          <p className="text-[10px] text-zinc-400 font-medium italic">
            Optionally refine the product category.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ClassificationRegistry;
