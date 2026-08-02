"use client";
import { Button } from "@/components/ui/Button";
import { TestTube2, X } from "lucide-react";
import { useState } from "react";

export default function AdminOrderConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}) {
  const [testEventId, setTestEventId] = useState("");

  const handleClose = () => {
    setTestEventId("");
    onClose();
  };

  const handleConfirm = () => {
    const code = testEventId.trim() || null;
    setTestEventId("");
    onConfirm(code);
  };

  const handleSkip = () => {
    setTestEventId("");
    onConfirm(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white border border-black/5 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex justify-end mb-4">
            <button
              onClick={handleClose}
              className="p-2 text-black/20 hover:text-black transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-blue-50 flex items-center justify-center">
              <TestTube2 size={32} className="text-blue-500" strokeWidth={1.5} />
            </div>
          </div>

          <div className="text-center space-y-4 mb-8">
            <h3 className="text-xl font-extrabold tracking-tight text-black uppercase">
              Test Event ID
            </h3>
            <p className="text-sm text-black/40 leading-relaxed font-medium max-w-xs mx-auto">
              Enter your Meta Pixel test event ID so this admin order is not
              counted as a real customer conversion.
            </p>
          </div>

          <div className="mb-8">
            <label className="text-[10px] font-bold text-black/30 uppercase tracking-[0.2em] block mb-2">
              Test Event ID (Optional)
            </label>
            <input
              type="text"
              value={testEventId}
              onChange={(e) => setTestEventId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
              placeholder="e.g. TEST12345"
              className="w-full px-4 py-3.5 text-[13px] bg-gray-50 border border-gray-200 focus:border-black focus:bg-white outline-none transition-all placeholder:text-gray-300 font-medium tracking-wide"
            />
            <p className="text-[10px] text-black/25 mt-2 font-medium">
              You can find this in Meta Events Manager → Test Events.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="h-14 text-[11px] font-bold tracking-widest uppercase text-black/40 hover:text-black"
            >
              Skip
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirm}
              className="h-14 text-[11px] font-bold tracking-[0.2em] uppercase"
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
