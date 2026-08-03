"use client";
import { useState } from "react";
import { useLandingPages } from "@/hooks/api/useLandingPages";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import Link from "next/link";
import { FileText, Globe, Eye, EyeOff, Trash2, ExternalLink, Search } from "lucide-react";
import ConfirmModal from "@/components/ui/ConfirmModal";

const TABS = [
  { id: "all", label: "All" },
  { id: "published", label: "Published" },
  { id: "draft", label: "Drafts" },
];

export default function AdminLandingPagesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  const { useAdminLandingPages, deleteLandingPage } = useLandingPages();
  const isPublishedFilter = activeTab === "published" ? "true" : activeTab === "draft" ? "false" : undefined;
  const { data: response, isLoading } = useAdminLandingPages(page, 20, search, isPublishedFilter);

  const landingPages = response?.data?.result || [];
  const pagination = response?.data?.pagination;

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteLandingPage.mutateAsync(deleteId);
    setDeleteId(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-12 animate-in fade-in duration-700">
        <ModuleHeader
          title="Landing Pages"
          icon={FileText}
          label="Store"
          labelHref="/admin/settings"
          breadcrumbs={[
            { label: "Admin", href: "/admin" },
            { label: "Landing Pages", active: true },
          ]}
        />
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 w-full bg-[#F7F7F5] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <ModuleHeader
        title="Landing Pages"
        icon={FileText}
        label="Store"
        labelHref="/admin/settings"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Landing Pages", active: true },
        ]}
        primaryAction={{
          label: "New Landing Page",
          href: "/admin/landing-pages/new",
        }}
      />

      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-1000">
        {/* Search + Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center p-1 bg-zinc-50 border border-zinc-100">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setPage(1); }}
                  className={`px-6 py-2 text-[11px] font-bold uppercase tracking-widest transition-all ${
                    isActive
                      ? "bg-white text-black shadow-xs ring-1 ring-zinc-200"
                      : "text-zinc-400 hover:text-black hover:bg-white/50"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search pages..."
              className="w-full pl-10 pr-4 py-2.5 text-[13px] bg-zinc-50 border border-zinc-100 focus:border-black focus:bg-white outline-none transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-zinc-100 overflow-hidden">
          {landingPages.length === 0 ? (
            <div className="p-16 text-center">
              <FileText className="w-10 h-10 text-zinc-200 mx-auto mb-4" />
              <p className="text-[13px] font-medium text-zinc-400">No landing pages found</p>
              <Link
                href="/admin/landing-pages/new"
                className="inline-block mt-4 text-[11px] font-bold uppercase tracking-widest text-black hover:underline"
              >
                Create your first landing page
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-100">
                  <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Title
                  </th>
                  <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Slug
                  </th>
                  <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Product
                  </th>
                  <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Status
                  </th>
                  <th className="text-right px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {landingPages.map((lp) => (
                  <tr
                    key={lp._id}
                    className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/landing-pages/${lp._id}`}
                        className="text-[13px] font-medium text-black hover:underline"
                      >
                        {lp.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[12px] font-mono text-zinc-500">
                        /landing/{lp.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {lp.product ? (
                        <span className="text-[12px] text-zinc-600">
                          {lp.product.title}
                        </span>
                      ) : (
                        <span className="text-[12px] text-zinc-300">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {lp.isPublished ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-700">
                          <Globe className="w-3 h-3" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-zinc-100 text-zinc-500">
                          <EyeOff className="w-3 h-3" />
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {lp.isPublished && (
                          <a
                            href={`/landing/${lp.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-zinc-400 hover:text-black hover:bg-zinc-100 transition-colors"
                            title="View live"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <Link
                          href={`/admin/landing-pages/${lp._id}`}
                          className="p-2 text-zinc-400 hover:text-black hover:bg-zinc-100 transition-colors"
                          title="Edit"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteId(lp._id)}
                          className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100">
              <p className="text-[11px] text-zinc-400">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest border border-zinc-200 disabled:opacity-30 hover:bg-zinc-50 transition-colors"
                >
                  Prev
                </button>
                <button
                  onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                  disabled={page === pagination.totalPages}
                  className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest border border-zinc-200 disabled:opacity-30 hover:bg-zinc-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Landing Page?"
        message="This will permanently remove the landing page. This action cannot be undone."
        confirmLabel="Delete"
        isLoading={deleteLandingPage.isPending}
      />
    </div>
  );
}
