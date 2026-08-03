"use client";
import { useState, useEffect, useRef } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus,
  GripVertical,
  Trash2,
  ChevronRight,
  Image,
  Video,
  Type,
  ShoppingBag,
  MessageSquare,
  ArrowRight,
  Code,
  PanelTop,
  Check,
} from "lucide-react";
import HeroBlock from "./blocks/HeroBlock";
import GalleryBlock from "./blocks/GalleryBlock";
import ProductDetailsBlock from "./blocks/ProductDetailsBlock";
import RichTextBlock from "./blocks/RichTextBlock";
import ImageBlock from "./blocks/ImageBlock";
import VideoBlock from "./blocks/VideoBlock";
import FaqBlock from "./blocks/FaqBlock";
import CtaBlock from "./blocks/CtaBlock";
import CustomHtmlBlock from "./blocks/CustomHtmlBlock";

// ─── Constants ──────────────────────────────────────────────────────────────

const BLOCK_TYPES = [
  { type: "hero", label: "Hero Section", icon: PanelTop },
  { type: "gallery", label: "Image Gallery", icon: Image },
  { type: "product-details", label: "Product Details", icon: ShoppingBag },
  { type: "rich-text", label: "Rich Text", icon: Type },
  { type: "image", label: "Image", icon: Image },
  { type: "video", label: "Video", icon: Video },
  { type: "faq", label: "FAQ", icon: MessageSquare },
  { type: "cta", label: "Call to Action", icon: ArrowRight },
  { type: "custom-html", label: "Custom HTML", icon: Code },
];

const BLOCK_LABELS = {
  hero: "Hero Section",
  gallery: "Image Gallery",
  "product-details": "Product Details",
  "rich-text": "Rich Text",
  image: "Image",
  video: "Video",
  faq: "FAQ",
  cta: "Call to Action",
  "custom-html": "Custom HTML",
};

const BLOCK_ICONS = {
  hero: PanelTop,
  gallery: Image,
  "product-details": ShoppingBag,
  "rich-text": Type,
  image: Image,
  video: Video,
  faq: MessageSquare,
  cta: ArrowRight,
  "custom-html": Code,
};

function createDefaultBlock(type) {
  const defaults = {
    hero: {
      type: "hero",
      heading: "",
      subheading: "",
      backgroundImage: "",
      ctaLabel: "",
      ctaLink: "",
    },
    gallery: {
      type: "gallery",
      images: [],
      layout: "grid",
    },
    "product-details": {
      type: "product-details",
      showPrice: true,
      showSpecs: true,
      showVariants: true,
      showDescription: true,
    },
    "rich-text": {
      type: "rich-text",
      content: "",
    },
    image: {
      type: "image",
      url: "",
      alt: "",
      caption: "",
    },
    video: {
      type: "video",
      url: "",
      poster: "",
    },
    faq: {
      type: "faq",
      heading: "Frequently Asked Questions",
      items: [{ question: "", answer: "" }],
    },
    cta: {
      type: "cta",
      heading: "",
      subheading: "",
      buttonLabel: "",
      buttonLink: "",
    },
    "custom-html": {
      type: "custom-html",
      content: "",
    },
  };
  return { ...defaults[type], type };
}

const BLOCK_COMPONENTS = {
  hero: HeroBlock,
  gallery: GalleryBlock,
  "product-details": ProductDetailsBlock,
  "rich-text": RichTextBlock,
  image: ImageBlock,
  video: VideoBlock,
  faq: FaqBlock,
  cta: CtaBlock,
  "custom-html": CustomHtmlBlock,
};

// ─── Sortable Block ─────────────────────────────────────────────────────────

function SortableBlock({ block, index, isExpanded, onToggle, onUpdate, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.__id });

  const [showApplied, setShowApplied] = useState(false);
  const timerRef = useRef(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 0,
    position: "relative",
  };

  const Icon = BLOCK_ICONS[block.type] || Type;
  const BlockComponent = BLOCK_COMPONENTS[block.type];

  const handleUpdate = (updates) => {
    onUpdate(updates);
    setShowApplied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShowApplied(false), 1500);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border bg-white overflow-hidden transition-shadow ${
        isDragging ? "shadow-xl border-zinc-300" : "border-zinc-200"
      }`}
    >
      {/* Block header */}
      <div
        className="flex items-center gap-3 px-4 py-3 bg-zinc-50 cursor-pointer select-none"
        onClick={onToggle}
      >
        <button
          className="cursor-grab active:cursor-grabbing text-zinc-300 hover:text-zinc-500 shrink-0 touch-none"
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <Icon className="w-4 h-4 text-zinc-500 shrink-0" />
        <span className="text-[12px] font-bold uppercase tracking-wider text-zinc-600 flex-1">
          {BLOCK_LABELS[block.type]}
        </span>

        {showApplied && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-widest animate-in fade-in duration-200">
            <Check className="w-3 h-3" />
            Applied
          </span>
        )}

        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="p-1 text-zinc-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <ChevronRight
            className={`w-4 h-4 text-zinc-300 transition-transform ${
              isExpanded ? "rotate-90" : ""
            }`}
          />
        </div>
      </div>

      {/* Block editor */}
      {isExpanded && BlockComponent && (
        <div className="p-5 border-t border-zinc-100">
          <BlockComponent
            block={block}
            onChange={handleUpdate}
          />
        </div>
      )}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function BlockEditor({ blocks = [], onChange }) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Ensure every block has a stable __id for dnd-kit
  const blocksWithId = blocks.map((b, i) => {
    if (!b.__id) {
      return { ...b, __id: `block_${i}_${Math.random().toString(36).slice(2, 9)}` };
    }
    return b;
  });

  const addBlock = (type) => {
    const newBlock = { ...createDefaultBlock(type), __id: `block_${Date.now()}_${Math.random().toString(36).slice(2, 9)}` };
    onChange([...blocks, newBlock]);
    setShowAddMenu(false);
    setExpandedIndex(blocks.length);
  };

  const updateBlock = (index, updates) => {
    const updated = [...blocks];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const removeBlock = (index) => {
    const updated = blocks.filter((_, i) => i !== index);
    onChange(updated);
    if (expandedIndex === index) setExpandedIndex(null);
    else if (expandedIndex > index) setExpandedIndex(expandedIndex - 1);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = blocksWithId.findIndex((b) => b.__id === active.id);
    const newIndex = blocksWithId.findIndex((b) => b.__id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(blocks, oldIndex, newIndex);
    onChange(reordered);

    // Track expanded index after reorder
    if (expandedIndex === oldIndex) {
      setExpandedIndex(newIndex);
    } else if (
      expandedIndex !== null &&
      oldIndex < expandedIndex &&
      newIndex >= expandedIndex
    ) {
      setExpandedIndex(expandedIndex - 1);
    } else if (
      expandedIndex !== null &&
      oldIndex > expandedIndex &&
      newIndex <= expandedIndex
    ) {
      setExpandedIndex(expandedIndex + 1);
    }
  };

  return (
    <div className="space-y-3">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocksWithId.map((b) => b.__id)}
          strategy={verticalListSortingStrategy}
        >
          {blocksWithId.map((block, index) => (
            <SortableBlock
              key={block.__id}
              block={block}
              index={index}
              isExpanded={expandedIndex === index}
              onToggle={() => setExpandedIndex(expandedIndex === index ? null : index)}
              onUpdate={(updates) => updateBlock(index, updates)}
              onRemove={() => removeBlock(index)}
            />
          ))}
        </SortableContext>
      </DndContext>

      {/* Add block */}
      <div className="relative">
        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="w-full py-3 border-2 border-dashed border-zinc-200 text-[11px] font-bold uppercase tracking-widest text-zinc-400 hover:border-black hover:text-black transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Block
        </button>

        {showAddMenu && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-209 shadow-lg z-50 p-2 grid grid-cols-3 gap-1">
            {BLOCK_TYPES.map((bt) => {
              const BIcon = bt.icon;
              return (
                <button
                  key={bt.type}
                  onClick={() => addBlock(bt.type)}
                  className="flex flex-col items-center gap-1.5 p-3 text-zinc-500 hover:bg-zinc-50 hover:text-black transition-colors"
                >
                  <BIcon className="w-5 h-5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {bt.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
