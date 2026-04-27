"use client";
import { Plus, Trash2 } from "lucide-react";
import { SectionHeader } from "./Shared";

const SpecManager = ({
  product,
  addSpecGroup,
  removeSpecGroup,
  updateSpecGroupName,
  addSpecItem,
  updateSpecItem,
  removeSpecItem,
}) => {
  return (
    <section>
      <SectionHeader
        label="Block 05"
        title="Technical Registry"
        action={
          <button
            onClick={addSpecGroup}
            className="text-[11px] font-bold text-zinc-400 hover:text-black uppercase tracking-widest transition-colors"
          >
            + Add Parameters
          </button>
        }
      />
      {product.specifications.length === 0 ? (
        <div className="bg-zinc-50 border border-zinc-200 p-10 md:p-20 text-center">
          <p className="text-[11px] md:text-[12px] font-bold text-zinc-400 uppercase tracking-widest italic opacity-60">
            Define metric constants for engineering verification.
          </p>
        </div>
      ) : (
        <div className="space-y-20">
          {product.specifications.map((group) => (
            <div
              key={group.id}
              className="space-y-8 md:space-y-12 border-l-2 md:border-l-4 border-zinc-900 pl-6 md:pl-12 pt-2"
            >
              <div className="flex items-center justify-between">
                <input
                  className="bg-transparent text-[14px] font-bold text-black uppercase tracking-widest outline-none border-b border-transparent focus:border-black/10"
                  value={group.group}
                  onChange={(e) =>
                    updateSpecGroupName(group.id, e.target.value)
                  }
                />
                <div className="flex gap-8">
                  <button
                    onClick={() => addSpecItem(group.id)}
                    className="text-zinc-300 hover:text-black transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                  <button
                    onClick={() => removeSpecGroup(group.id)}
                    className="text-zinc-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-8 md:gap-x-20 gap-y-6 md:gap-y-10">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-6 items-center border-b border-zinc-100 pb-4 group"
                  >
                    <input
                      className="bg-transparent text-[10px] font-bold text-zinc-500 uppercase tracking-widest w-[40%] outline-none focus:text-black transition-colors"
                      value={item.label}
                      onChange={(e) =>
                        updateSpecItem(
                          group.id,
                          item.id,
                          "label",
                          e.target.value,
                        )
                      }
                      placeholder="Label"
                    />
                    <input
                      className="bg-transparent text-[14px] font-medium text-black flex-1 text-right outline-none"
                      value={item.value}
                      onChange={(e) =>
                        updateSpecItem(
                          group.id,
                          item.id,
                          "value",
                          e.target.value,
                        )
                      }
                      placeholder="Value"
                    />
                    <button
                      onClick={() => removeSpecItem(group.id, item.id)}
                      className="text-zinc-200 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default SpecManager;
