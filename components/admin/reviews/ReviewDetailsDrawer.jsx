"use client";
import { 
  X, 
  Star, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  ExternalLink, 
  Calendar, 
  ShieldCheck,
  User as UserIcon,
  Package
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useReviews } from "@/hooks/api/useReviews";
import ConfirmationModal from "@/components/admin/ConfirmationModal";

export default function ReviewDetailsDrawer({ review, isOpen, onClose }) {
  const { updateStatus, deleteReview } = useReviews();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (!review) return null;

  const user = review.user;
  const product = review.product;
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Customer Identity Unknown";

  const handleAction = (status) => {
    updateStatus.mutate({ id: review._id, status }, {
        onSuccess: () => {
             // We keep drawer open for feedback or close it? Let's close on success for "flow"
             onClose();
        }
    });
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    deleteReview.mutate(review._id, {
        onSuccess: () => onClose()
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-10000 bg-black/10 backdrop-blur-[2px] transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Slide-over Drawer */}
      <div className={`fixed top-0 right-0 h-screen w-full md:w-[500px] bg-white shadow-2xl z-10001 transform transition-transform duration-700 ease-out flex flex-col font-montserrat ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        {/* Header Strip */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-[#F1F1EF]">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                 <ShieldCheck size={14} className="text-zinc-400" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#37352F]">Review Protocol</span>
           </div>
           <button onClick={onClose} className="p-2 text-zinc-400 hover:text-black transition-colors outline-none cursor-pointer">
              <X size={20} />
           </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
           {/* Product Header Context */}
           {product && (
                <div className="px-8 py-10 bg-white border-b border-[#F1F1EF] group relative">
                   <div className="flex items-center gap-6">
                       <div className="w-20 h-20 bg-[#F7F7F5] border border-[#EDECE9] shrink-0 overflow-hidden relative">
                           {product.images?.[0] && (
                               <Image 
                                 src={product.images[0]} 
                                 alt={product.title} 
                                 fill 
                                 className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                               />
                           )}
                       </div>
                       <div className="flex flex-col gap-2 min-w-0 flex-1">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                                  <Package size={10} />
                                  <span>Origin Product</span>
                              </div>
                              <Link 
                                href={`/product/${product.slug || product._id}`} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] font-bold text-zinc-300 hover:text-black transition-colors flex items-center gap-1 uppercase tracking-tighter"
                              >
                                View Live <ExternalLink size={10} />
                              </Link>
                           </div>
                           <h2 className="text-[17px] font-medium text-black line-clamp-2 leading-tight tracking-tight italic">
                               {product.title}
                           </h2>
                           <div className="flex items-center gap-3 mt-1">
                              <span className="text-[10px] text-zinc-400 font-mono bg-zinc-50 px-1.5 py-0.5 border border-zinc-100">
                                  REGISTRY ID: {String(product._id).slice(-8).toUpperCase()}
                              </span>
                              {product.slug && (
                                 <span className="text-[9px] text-zinc-300 font-medium uppercase tracking-widest">
                                    Slug: {product.slug}
                                 </span>
                              )}
                           </div>
                       </div>
                   </div>
                </div>
           )}

           {/* Review Body */}
           <div className="p-10 space-y-12">
               {/* Core Content */}
               <section className="space-y-6">
                   <div className="flex flex-col gap-4">
                       <div className="flex gap-1">
                           {[1, 2, 3, 4, 5].map((i) => (
                               <Star 
                                 key={i} 
                                 size={14} 
                                 className={i <= review.rating ? "text-black fill-current" : "text-zinc-200"} 
                               />
                           ))}
                       </div>
                       <h3 className="text-[26px] font-light leading-[1.3] text-black tracking-tight italic">
                           &ldquo;{review.title}&rdquo;
                       </h3>
                   </div>
                   
                   <p className="text-[14px] leading-loose text-[#37352F80] font-medium whitespace-pre-wrap">
                       {review.body}
                   </p>

                   {(review.images?.length > 0 || review.image) && (
                       <div className="mt-8 grid grid-cols-2 gap-2">
                           {(review.images || [review.image]).filter(Boolean).map((img, i) => (
                               <div key={i} className="relative aspect-square bg-zinc-50 border border-zinc-100 overflow-hidden group/large cursor-zoom-in">
                                   <Image 
                                     src={img} 
                                     alt="Attachment" 
                                     fill 
                                     className="object-cover grayscale group-hover/large:grayscale-0 transition-all duration-1000 scale-[0.98] group-hover/large:scale-100" 
                                   />
                               </div>
                           ))}
                       </div>
                   )}
               </section>

               {/* Separator Line */}
               <div className="h-px bg-[#F1F1EF] w-12" />

               {/* Meta Context Wrapper */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   {/* Reporter Details */}
                   <div className="space-y-4">
                       <h4 className="text-[10px] font-bold text-black uppercase tracking-[0.2em]">Reporter Profile</h4>
                       <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-black text-white shrink-0 flex items-center justify-center font-bold text-[12px] uppercase">
                               {fullName.charAt(0)}
                           </div>
                           <div className="flex flex-col min-w-0">
                               <span className="text-[13px] font-bold text-black truncate">{fullName}</span>
                               <span className="text-[11px] text-zinc-400 truncate font-mono tracking-tighter">{user?.email || "No Email Provided"}</span>
                           </div>
                       </div>
                       {review.verified && (
                          <div className="flex items-center gap-1.5 text-emerald-600">
                             <CheckCircle2 size={12} />
                             <span className="text-[10px] font-bold uppercase tracking-widest">Verified Purchase</span>
                          </div>
                       )}
                   </div>

                   {/* Registry Metadata */}
                   <div className="space-y-4">
                       <h4 className="text-[10px] font-bold text-black uppercase tracking-[0.2em]">Metadata Index</h4>
                       <div className="space-y-3">
                           <div className="flex items-center gap-3 text-[12px] text-zinc-500">
                               <Calendar size={14} className="text-zinc-300" />
                               <span>Registry Date: {new Date(review.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                           </div>
                           <div className="flex items-center gap-3 text-[12px] text-zinc-500">
                               <div className={`w-2 h-2 rounded-full ${review.status === 'approved' ? 'bg-emerald-500' : review.status === 'rejected' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                               <span className="capitalize">Status: {review.status?.toUpperCase()} protocol</span>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
        </div>

        {/* Footer Actions Panel */}
        <div className="p-8 border-t border-[#F1F1EF] bg-zinc-50/30 flex items-center gap-3">
            {review.status !== "approved" && (
                <Button 
                  onClick={() => handleAction("approved")}
                  variant="primary" 
                  className="flex-1 h-14 bg-black hover:bg-zinc-800 text-white text-[11px] font-bold uppercase tracking-[0.3em]"
                >
                    Activate Review
                </Button>
            )}
            {review.status !== "rejected" && (
                <Button 
                  onClick={() => handleAction("rejected")}
                  variant="outline" 
                  className="flex-1 h-14 border-[#EDECE9] hover:border-black text-[11px] font-bold uppercase tracking-[0.3em] bg-white"
                >
                    Flag Protocol
                </Button>
            )}
            <button 
              onClick={handleDelete}
              className="w-14 h-14 bg-white border border-[#EDECE9] text-zinc-400 hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50 transition-all flex items-center justify-center shrink-0"
              title="Terminate Entry"
            >
                <Trash2 size={18} />
            </button>
        </div>
      </div>

      <ConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Excision"
        message="Are you certain you wish to permanently expunge this review protocol? Product rating metrics will be synchronized immediately."
        confirmText="Terminate Entry"
        type="danger"
      />
    </>
  );
}
