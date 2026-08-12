"use client";
import { Edit, ExternalLink, Trash2 } from "lucide-react";
import Image from "next/image";

/**
 * Generic DataTable Component
 * @param {Array} columns - [{ key, label, type: 'text' | 'image' | 'status' | 'actions' | 'custom', render: (row) => ... }]
 * @param {Array} data - Array of row objects
 */
export default function DataTable({
  columns,
  data,
  loading,
  onEdit,
  onDelete,
  onView,
  pagination,
  className = "",
}) {
  const renderCell = (col, row) => {
    if (col.render) return col.render(row);

    switch (col.type) {
      case "image":
        return (
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-[#F7F7F5] relative shrink-0 rounded-sm overflow-hidden">
              {row[col.key] && (
                <Image
                  src={row[col.key]}
                  alt="Thumb"
                  fill
                  className="object-cover"
                />
              )}
            </div>
            {col.titleKey && (
              <div className="flex flex-col">
                <span className="text-[13px] font-medium text-[#37352F]">
                  {row[col.titleKey]}
                </span>
                {col.subTitleKey && (
                  <span className="text-[11px] text-[#37352F80]">
                    {row[col.subTitleKey]}
                  </span>
                )}
              </div>
            )}
          </div>
        );
      case "date":
        const dateValue = row[col.key];
        if (!dateValue)
          return (
            <span className="text-[13px] text-zinc-400 font-bold uppercase tracking-widest italic">
              N/A
            </span>
          );
        return (
          <span className="text-[11px] sm:text-[13px] text-[#37352F] font-medium whitespace-nowrap">
            {new Date(dateValue).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        );
      case "status":
        const status = row[col.key];
        const getStatusStyle = (s) => {
          const val = s?.toLowerCase();
          switch (val) {
            case "pending":
              return "bg-zinc-100 text-zinc-600 border-zinc-200";
            case "processing":
              return "bg-blue-50 text-blue-600 border-blue-200";
            case "given-for-design":
              return "bg-purple-50 text-purple-600 border-purple-200";
            case "ready-to-pack":
              return "bg-amber-50 text-amber-600 border-amber-200";
            case "packed-for-delivery":
              return "bg-orange-50 text-orange-600 border-orange-200";
            case "shipped":
              return "bg-blue-50 text-blue-600 border-blue-200";
            case "at-last-hub":
              return "bg-cyan-50 text-cyan-600 border-cyan-200";
            case "assigned-for-delivery":
              return "bg-indigo-50 text-indigo-600 border-indigo-200";
            case "delivered":
              return "bg-emerald-50 text-emerald-600 border-emerald-200";
            case "returned":
              return "bg-rose-50 text-rose-600 border-rose-200";
            case "return-received":
              return "bg-rose-50 text-rose-600 border-rose-200";
            case "on-hold":
              return "bg-amber-50 text-amber-600 border-amber-200";
            case "cancelled":
            case "failed":
            case "refused":
              return "bg-rose-50 text-rose-600 border-rose-200";
            case "exchange-requested":
              return "bg-violet-50 text-violet-600 border-violet-200";
            case "exchange-accepted":
              return "bg-blue-50 text-blue-600 border-blue-200";
            case "exchange-shipped":
              return "bg-cyan-50 text-cyan-600 border-cyan-200";
            case "exchange-delivered":
              return "bg-emerald-50 text-emerald-600 border-emerald-200";
            case "active":
            case "completed":
            case "paid":
            case "approved":
              return "bg-emerald-50 text-emerald-600 border-emerald-200";
            case "draft":
              return "bg-amber-50 text-amber-600 border-amber-200";
            default:
              return "bg-zinc-50 text-zinc-600 border-zinc-200";
          }
        };
        return (
          <span
            className={`text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-[2px] rounded-none border uppercase tracking-wider sm:tracking-widest whitespace-nowrap ${getStatusStyle(status)}`}
          >
            {status?.toUpperCase()?.replace(/-/g, " ")}
          </span>
        );
      case "currency":
        return (
          <span className="text-[11px] sm:text-[13px] text-[#37352F] font-bold whitespace-nowrap">
            ৳{row[col.key]?.toLocaleString()}
          </span>
        );
      case "actions":
        return (
          <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            {onView && (
              <button
                onClick={() => onView(row)}
                className="p-2 text-[#37352F80] hover:text-[#37352F] transition-colors"
                title="View Detail"
              >
                <ExternalLink size={14} />
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(row)}
                className="p-2 text-[#37352F80] hover:text-[#37352F] transition-colors"
                title="Edit"
              >
                <Edit size={14} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(row)}
                className="p-2 text-[#37352F80] hover:text-red-600 transition-colors"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        );
      case "text":
      default:
        return (
          <span
            className={`text-[13px] text-[#37352F] ${col.mono ? "font-mono text-[#37352F80]" : ""}`}
          >
            {row[col.key]}
          </span>
        );
    }
  };

  return (
    <div className={`w-full -mx-4 sm:mx-0 overflow-x-auto ${className}`}>
      <div className="min-w-[600px] sm:min-w-0">
        <table className="w-full text-left border-collapse border-t border-[#EDECE9]">
          <thead>
            <tr className="border-b border-[#EDECE9]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-3 py-3 text-[12px] font-medium text-[#37352F80] whitespace-nowrap ${col.align === "right" ? "text-right" : ""}`}
                  style={
                    col.width ? { width: col.width, minWidth: col.width } : {}
                  }
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EDECE9]">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((col, j) => (
                    <td
                      key={j}
                      className="px-3 py-4"
                      style={
                        col.width
                          ? { width: col.width, minWidth: col.width }
                          : {}
                      }
                    >
                      <div className="h-4 bg-gray-50 rounded w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length > 0 ? (
              data.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  className="group hover:bg-[#F7F7F5] transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-3 py-4 ${col.align === "right" ? "text-right" : ""}`}
                      style={
                        col.width
                          ? {
                              width: col.width,
                              minWidth: col.width,
                              maxWidth: col.width,
                            }
                          : {}
                      }
                    >
                      {renderCell(col, row)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-3 py-16 text-center text-[13px] text-[#37352F80]"
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-[#EDECE9] mt-2 shrink-0">
          <span className="text-[12px] text-[#37352F80] whitespace-nowrap">
            Showing {(pagination.currentPage - 1) * pagination.limit + 1}–
            {Math.min(
              pagination.currentPage * pagination.limit,
              pagination.total,
            )}{" "}
            of {pagination.total} products
          </span>
          <div className="flex items-center gap-1 shrink-0">
            {/* Prev */}
            <button
              onClick={() =>
                pagination.onPageChange(pagination.currentPage - 1)
              }
              disabled={pagination.currentPage <= 1}
              className="px-3 py-1.5 text-[12px] font-medium text-[#37352F] border border-[#EDECE9] rounded-sm hover:bg-[#F7F7F5] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>

            {/* Page numbers */}
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 ||
                  p === pagination.totalPages ||
                  Math.abs(p - pagination.currentPage) <= 1,
              )
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, idx) =>
                p === "..." ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-2 text-[12px] text-[#37352F80]"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => pagination.onPageChange(p)}
                    className={`w-8 h-8 text-[12px] font-medium rounded-sm border transition-colors ${
                      p === pagination.currentPage
                        ? "bg-[#37352F] text-white border-[#37352F]"
                        : "text-[#37352F] border-[#EDECE9] hover:bg-[#F7F7F5]"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}

            {/* Next */}
            <button
              onClick={() =>
                pagination.onPageChange(pagination.currentPage + 1)
              }
              disabled={pagination.currentPage >= pagination.totalPages}
              className="px-3 py-1.5 text-[12px] font-medium text-[#37352F] border border-[#EDECE9] rounded-sm hover:bg-[#F7F7F5] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
