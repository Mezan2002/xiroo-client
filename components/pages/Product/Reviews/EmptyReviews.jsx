import { Button } from "@/components/ui/Button";
import { MessageSquare } from "lucide-react";

export default function EmptyReviews({ onWriteReview }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-5">
      <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
        <MessageSquare size={24} className="text-gray-300" />
      </div>
      <div>
        <h3 className="text-[17px] font-semibold text-black tracking-tight">
          No reviews yet
        </h3>
        <p className="text-[13px] text-gray-400 mt-1">
          Be the first to share your experience.
        </p>
      </div>
      <Button variant="primary" size="default" onClick={onWriteReview}>
        Write the First Review
      </Button>
    </div>
  );
}
