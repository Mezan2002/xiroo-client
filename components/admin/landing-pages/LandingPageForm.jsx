"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useLandingPages } from "@/hooks/api/useLandingPages";
import { Button } from "@/components/ui/Button";
import { Loader2, Globe, ArrowLeft, Eye, EyeOff, X } from "lucide-react";
import BlockEditor from "./BlockEditor";
import LandingPageRenderer from "@/components/pages/LandingPageRenderer";
import Link from "next/link";

export default function LandingPageForm({ initialData = null, mode = "create" }) {
  const router = useRouter();
  const { createLandingPage, updateLandingPage, useProducts } = useLandingPages();
  const { data: productsResponse } = useProducts();
  const products = productsResponse?.data?.products || productsResponse?.data || [];

  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    product: "",
    blocks: [],
    seo: { title: "", description: "", ogImage: "" },
    isPublished: false,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        slug: initialData.slug || "",
        product: initialData.product?._id || initialData.product || "",
        blocks: initialData.blocks || [],
        seo: initialData.seo || { title: "", description: "", ogImage: "" },
        isPublished: initialData.isPublished || false,
      });
    }
  }, [initialData]);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setForm((prev) => ({
      ...prev,
      title,
      slug: mode === "create" ? generateSlug(title) : prev.slug,
    }));
  };

  const handleSave = async (publish = null) => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        product: form.product || undefined,
        ...(publish !== null && { isPublished: publish }),
      };

      if (mode === "create") {
        const result = await createLandingPage.mutateAsync(payload);
        router.push(`/admin/landing-pages/${result.data._id}`);
      } else {
        await updateLandingPage.mutateAsync({ id: initialData._id, data: payload });
      }
    } catch (err) {
      // Error handled by hook
    } finally {
      setSaving(false);
    }
  };

  const linkedProduct = useMemo(() => {
    if (!form.product) return null;
    return products.find((p) => p._id === form.product) || null;
  }, [form.product, products]);

  const previewBlocks = useMemo(() => {
    return form.blocks.map(({ __id, ...rest }) => rest);
  }, [form.blocks]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/landing-pages"
            className="p-2 text-zinc-400 hover:text-black hover:bg-zinc-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {mode === "create" ? "New Landing Page" : "Edit Landing Page"}
            </h1>
            {form.slug && (
              <p className="text-[12px] text-zinc-400 font-mono mt-1">
                /landing/{form.slug}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPreviewOpen(true)}
          >
            <Eye className="w-4 h-4 mr-1" />
            Preview
          </Button>
          {mode === "edit" && form.slug && (
            <a
              href={`/landing/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm">
                <Globe className="w-4 h-4 mr-2" />
                Live
              </Button>
            </a>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSave(false)}
            disabled={saving || !form.title.trim()}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
            Save Draft
          </Button>
          <Button
            size="sm"
            onClick={() => handleSave(true)}
            disabled={saving || !form.title.trim()}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Globe className="w-4 h-4 mr-2" />}
            {form.isPublished ? "Update" : "Publish"}
          </Button>
        </div>
      </div>

      {/* Form body */}
      <div className="space-y-6">
        {/* Settings row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-zinc-200 p-5 space-y-4">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
              Page Settings
            </h3>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1.5">
                Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={handleTitleChange}
                placeholder="Landing Page Title"
                className="w-full px-3 py-2.5 text-[13px] bg-zinc-50 border border-zinc-200 focus:border-black focus:bg-white outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1.5">
                Slug
              </label>
              <div className="flex items-center">
                <span className="text-[12px] text-zinc-400 mr-1 shrink-0">/landing/</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="page-slug"
                  className="flex-1 px-3 py-2.5 text-[13px] font-mono bg-zinc-50 border border-zinc-200 focus:border-black focus:bg-white outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border border-zinc-200 p-5 space-y-3">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                Linked Product
              </h3>
              <select
                value={form.product}
                onChange={(e) => setForm((prev) => ({ ...prev, product: e.target.value }))}
                className="w-full px-3 py-2.5 text-[13px] bg-zinc-50 border border-zinc-200 focus:border-black focus:bg-white outline-none transition-all"
              >
                <option value="">None</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="border border-zinc-200 p-5 space-y-3">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                SEO
              </h3>
              <input
                type="text"
                value={form.seo.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, seo: { ...prev.seo, title: e.target.value } }))
                }
                placeholder="Meta title (70 chars max)"
                maxLength={70}
                className="w-full px-3 py-2.5 text-[13px] bg-zinc-50 border border-zinc-200 focus:border-black focus:bg-white outline-none transition-all"
              />
              <textarea
                value={form.seo.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, seo: { ...prev.seo, description: e.target.value } }))
                }
                placeholder="Meta description (160 chars max)"
                maxLength={160}
                rows={2}
                className="w-full px-3 py-2.5 text-[13px] bg-zinc-50 border border-zinc-200 focus:border-black focus:bg-white outline-none transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Block Editor */}
        <div className="border border-zinc-200 p-5">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-4">
            Page Content
          </h3>
          <BlockEditor
            blocks={form.blocks}
            onChange={(blocks) => setForm((prev) => ({ ...prev, blocks }))}
          />
        </div>
      </div>

      {/* Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white animate-in fade-in duration-200">
          {/* Modal header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 shrink-0">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-zinc-400" />
              <div>
                <h2 className="text-[13px] font-bold uppercase tracking-widest text-zinc-400">
                  Page Preview
                </h2>
                {form.title && (
                  <p className="text-sm font-medium text-black mt-0.5">{form.title}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {mode === "edit" && form.slug && (
                <a
                  href={`/landing/${form.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm">
                    <Globe className="w-4 h-4 mr-2" />
                    Open Live
                  </Button>
                </a>
              )}
              <button
                onClick={() => setPreviewOpen(false)}
                className="p-2 text-zinc-400 hover:text-black hover:bg-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal body */}
          <div className="flex-1 overflow-y-auto">
            {previewBlocks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 bg-zinc-100 flex items-center justify-center mb-4">
                  <Eye className="w-8 h-8 text-zinc-300" />
                </div>
                <p className="text-[13px] font-medium text-zinc-400 mb-1">
                  No blocks yet
                </p>
                <p className="text-[11px] text-zinc-300">
                  Add some blocks to see a preview of your landing page
                </p>
              </div>
            ) : (
              <LandingPageRenderer
                page={{
                  blocks: previewBlocks,
                  product: linkedProduct,
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
