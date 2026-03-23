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
export default function DataTable({ columns, data, onEdit, onDelete, onView }) {
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
      case 'status':
        const status = row[col.key];
        return (
          <span className={`text-[12px] font-medium px-2 py-[2px] rounded-sm bg-opacity-10 ${
            status === 'Active' || status === 'Completed' || status === 'Paid'
              ? 'bg-green-100 text-[#0E6245] bg-opacity-100'
              : status === 'Draft' || status === 'Processing'
              ? 'bg-blue-100 text-[#0B4A72] bg-opacity-100'
              : 'bg-red-100 text-[#9B2C2C] bg-opacity-100'
          }`}>
            {status}
          </span>
        );
      case 'actions':
        return (
          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
            {onView && (
              <button 
                onClick={() => onView(row)}
                className="p-2 text-[#37352F80] hover:text-[#37352F] transition-colors" 
                title="View Detail"
              >
                <ExternalLink size={14} />
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
    <div className="w-full">
      <table className="w-full text-left border-collapse border-t border-[#EDECE9]">
        <thead>
          <tr className="border-b border-[#EDECE9]">
            {columns.map((col) => (
              <th 
                key={col.key} 
                className={`px-3 py-3 text-[12px] font-medium text-[#37352F80] ${col.align === 'right' ? 'text-right' : ''}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#EDECE9]">
          {data.length > 0 ? (
            data.map((row, idx) => (
              <tr key={row.id || idx} className="group hover:bg-[#F7F7F5] transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className={`px-3 py-4 ${col.align === 'right' ? 'text-right' : ''}`}>
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
  );
}
