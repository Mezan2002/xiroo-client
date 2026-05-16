"use client";
import React from "react";
import Image from "next/image";
import { MoreHorizontal, Edit, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * Generic DataTable Component
 * @param {Array} columns - [{ key, label, type: 'text' | 'image' | 'status' | 'actions' | 'custom', render: (row) => ... }]
 * @param {Array} data - Array of row objects
 */
export default function DataTable({ columns, data, loading, onEdit, onDelete, onView, className = "" }) {
  const renderCell = (col, row) => {
    if (col.render) return col.render(row);

    switch (col.type) {
      case 'image':
        return (
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-[#F7F7F5] relative shrink-0 rounded-sm overflow-hidden">
              {row[col.key] && <Image src={row[col.key]} alt="Thumb" fill className="object-cover" />}
            </div>
            {col.titleKey && (
              <div className="flex flex-col">
                <span className="text-[13px] font-medium text-[#37352F]">{row[col.titleKey]}</span>
                {col.subTitleKey && <span className="text-[11px] text-[#37352F80]">{row[col.subTitleKey]}</span>}
              </div>
            )}
          </div>
        );
      case 'date':
        const dateValue = row[col.key];
        if (!dateValue) return <span className="text-[13px] text-zinc-400 font-bold uppercase tracking-widest italic">N/A</span>;
        return (
          <span className="text-[13px] text-[#37352F] font-medium">
            {new Date(dateValue).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </span>
        );
      case 'status':
        const status = row[col.key];
        return (
          <span className={`text-[10px] font-bold px-2 py-[2px] rounded-none border uppercase tracking-widest ${
            status?.toLowerCase() === 'active' || status?.toLowerCase() === 'completed' || status?.toLowerCase() === 'paid' || status?.toLowerCase() === 'delivered' || status?.toLowerCase() === 'approved'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
              : status?.toLowerCase() === 'draft' || status?.toLowerCase() === 'processing' || status?.toLowerCase() === 'pending'
              ? 'bg-amber-50 text-amber-700 border-amber-100'
              : 'bg-rose-50 text-rose-700 border-rose-100'
          }`}>
            {status?.toUpperCase()}
          </span>
        );
      case 'currency':
        return (
          <span className="text-[13px] text-[#37352F] font-bold">
            ৳{row[col.key]?.toLocaleString()}
          </span>
        );
      case 'actions':
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
      case 'text':
      default:
        return <span className={`text-[13px] text-[#37352F] ${col.mono ? 'font-mono text-[#37352F80]' : ''}`}>{row[col.key]}</span>;
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
                className={`px-3 py-3 text-[12px] font-medium text-[#37352F80] whitespace-nowrap ${col.align === 'right' ? 'text-right' : ''}`}
                style={col.width ? { width: col.width, minWidth: col.width } : {}}
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
                    style={col.width ? { width: col.width, minWidth: col.width } : {}}
                  >
                    <div className="h-4 bg-gray-50 rounded w-full" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length > 0 ? (
            data.map((row, idx) => (
              <tr key={row.id || idx} className="group hover:bg-[#F7F7F5] transition-colors">
                {columns.map((col) => (
                  <td 
                    key={col.key} 
                    className={`px-3 py-4 ${col.align === 'right' ? 'text-right' : ''}`}
                    style={col.width ? { width: col.width, minWidth: col.width, maxWidth: col.width } : {}}
                  >
                    {renderCell(col, row)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-3 py-16 text-center text-[13px] text-[#37352F80]">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
}
