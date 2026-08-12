import { AlertCircle, MessageSquare, Upload, X, Image as ImageIcon } from "lucide-react";
import { ImageUploader } from "@/components/shared/ImageUploader";

const REASONS = {
  return: [
    "Wrong size or fit",
    "Product not as described",
    "Defective or damaged",
    "Changed my mind",
    "Better price elsewhere",
    "Quality not as expected",
    "Other",
  ],
  exchange: [
    "Need different size",
    "Want different color",
    "Want different variant",
    "Defective - need replacement",
    "Wrong item received",
    "Other",
  ],
};

export default function ReasonForm({
  reason,
  onReasonChange,
  note,
  onNoteChange,
  requestType,
  attachments = [],
  onAttachmentsChange,
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
          Reason for {requestType === "return" ? "Return" : "Exchange"}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {REASONS[requestType].map((r) => (
            <button
              key={r}
              onClick={() => onReasonChange(r)}
              className={`p-3 border text-left text-[11px] transition-all ${
                reason === r
                  ? "border-black bg-black text-white"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-400"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {reason === "Other" && (
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
            Please specify
          </label>
          <textarea
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder="Tell us more about your reason..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 resize-none"
          />
        </div>
      )}

      {/* Image Attachments Upload Section */}
      <div className="p-4 border border-gray-200 bg-gray-50/50">
        <div className="flex items-start gap-3">
          <ImageIcon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
              Attach Photos (Optional)
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5 mb-3">
              Upload photos showing the product issue, defect, or tag (PNG, JPG, WEBP)
            </p>

            {/* Uploaded Thumbnails */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2.5 mb-3">
                {attachments.map((att, idx) => (
                  <div key={idx} className="relative w-16 h-16 border border-gray-200 bg-white rounded overflow-hidden group shadow-sm">
                    <img src={att.url} alt={`Attachment ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() =>
                        onAttachmentsChange &&
                        onAttachmentsChange(attachments.filter((_, i) => i !== idx))
                      }
                      className="absolute top-1 right-1 p-0.5 bg-black/70 text-white rounded-full opacity-90 hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <ImageUploader
              multiple={true}
              onUploadSuccess={(url) => {
                if (onAttachmentsChange) {
                  onAttachmentsChange((prev) => [...prev, { url, type: "image" }]);
                }
              }}
              onUploadError={(err) => console.error("Upload error:", err)}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 bg-white text-[10px] font-bold uppercase tracking-wider text-gray-700 hover:border-gray-500 hover:text-black transition-all">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Photos</span>
              </div>
            </ImageUploader>
          </div>
        </div>
      </div>

      <div className="p-4 border border-gray-200 bg-gray-50">
        <div className="flex items-start gap-3">
          <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Additional Notes (Optional)</p>
            <textarea
              value={note}
              onChange={(e) => onNoteChange(e.target.value)}
              placeholder="Any additional information you'd like to provide..."
              rows={3}
              className="w-full mt-2 px-4 py-3 border border-gray-200 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 resize-none bg-white"
            />
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 border border-gray-200">
        <AlertCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Important</p>
          <ul className="mt-2 space-y-1">
            <li className="text-[10px] text-gray-400">• Returns must be initiated within 7 days of delivery</li>
            <li className="text-[10px] text-gray-400">• Items must be unused and in original packaging</li>
            <li className="text-[10px] text-gray-400">• Exchange is subject to product availability</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
