import { CheckCircle2, MoreHorizontal, Star, Trash2, XCircle, ExternalLink, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useReviews } from "@/hooks/api/useReviews";
import DataTable from "@/components/admin/shared/DataTable";
import ReviewDetailsDrawer from "./ReviewDetailsDrawer";

export default function ReviewTable({ reviews }) {
  const { updateStatus, deleteReview } = useReviews();
  const [selectedReview, setSelectedReview] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleViewDetails = (review) => {
    setSelectedReview(review);
    setIsDrawerOpen(true);
  };

  const COLUMNS = useMemo(() => [
    { 
      key: "user", 
      label: "Customer Profile", 
      render: (row) => {
        const fullName = [row.user?.firstName, row.user?.lastName].filter(Boolean).join(" ") || "Customer";
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black text-white shrink-0 flex items-center justify-center font-bold text-[10px] uppercase tracking-widest ring-1 ring-black/5">
              {fullName.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-black">{fullName}</span>
              <span className="text-[10px] text-zinc-400 font-mono tracking-tighter uppercase">{row.user?.role || "Basic"} User</span>
            </div>
          </div>
        );
      }
    },
    { 
      key: "product", 
      label: "Registry Source", 
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-zinc-50 relative shrink-0 overflow-hidden border border-zinc-100 group">
            {(row.images?.[0] || row.image) && (
              <Image 
                src={row.images?.[0] || row.image} 
                alt="" 
                fill
                className="object-cover grayscale group-hover:grayscale-0 transition-opacity duration-500" 
              />
            )}
            {row.images?.length > 1 && (
               <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[8px] font-bold text-white uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                  +{row.images.length - 1}
               </div>
            )}
          </div>
          <span className="text-[12px] font-medium text-zinc-500 line-clamp-1 truncate max-w-[140px] italic tracking-tight">{row.product?.title || "N/A"}</span>
        </div>
      )
    },
    { 
      key: "rating", 
      label: "Metric", 
      render: (row) => (
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              size={9}
              className={i <= row.rating ? "text-black fill-current" : "text-zinc-200"}
            />
          ))}
        </div>
      )
    },
    { 
      key: "status", 
      label: "Protocol State", 
      type: "status" 
    },
    { 
      key: "createdAt", 
      label: "Registry Timestamp", 
      render: (row) => (
        <span className="text-[12px] font-medium text-zinc-400 uppercase tracking-tighter font-mono">
            {new Date(row.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
      )
    },
    { 
      key: "actions", 
      label: "Moderation Hub", 
      align: "right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
           <button
            onClick={() => handleViewDetails(row)}
            className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#37352F] bg-zinc-50 hover:bg-black hover:text-white transition-all border border-zinc-100 ring-1 ring-zinc-50 outline-none"
          >
            Details Protocol
          </button>
        </div>
      )
    }
  ], []);

  if (reviews.length === 0) {
     return (
        <div className="p-16 text-center border-t border-zinc-100 italic text-[13px] text-zinc-300 tracking-widest uppercase">
            Registry Index Empty
        </div>
     );
  }

  return (
    <>
      <DataTable 
        columns={COLUMNS}
        data={reviews}
        loading={false}
      />

      <ReviewDetailsDrawer 
        review={selectedReview}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
}
