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
      <SectionHeader label="Block 02" title="Registry Classification" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20">
        <div className="space-y-6">
          <Label>Main Category Registry</Label>
          <Select
            options={rootCategories}
            value={product.category}
            onChange={(val) =>
              setProduct({ ...product, category: val, subCategory: "" })
            }
            placeholder="Select Primary Root"
          />
          <p className="text-[10px] text-zinc-400 font-medium italic">
            Assign this product to a top-level architectural branch.
          </p>
        </div>
        <div className="space-y-6">
          <Label>Sub-category Mapping</Label>
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
            Refine the product placement within the selected branch.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ClassificationRegistry;
