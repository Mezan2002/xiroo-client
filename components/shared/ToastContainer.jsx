"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { removeToast } from "@/redux/slices/toastSlice";

/** 
 * Senior Dev Component: ToastContainer
 * Renders global notifications managed by Redux.
 */
export default function ToastContainer() {
  const toasts = useSelector((state) => state.toast.toasts);
  const dispatch = useDispatch();

  return (
    <div className="fixed bottom-0 right-0 z-9999 p-6 flex flex-col gap-3 w-full max-w-[380px] pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={() => dispatch(removeToast(t.id))} />
      ))}
    </div>
  );
}

const ToastItem = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onRemove, 400);
  };

  const Config = {
    success: { icon: CheckCircle2, bg: "bg-emerald-50 text-emerald-600", text: "text-emerald-600", border: "border-emerald-500" },
    error: { icon: AlertCircle, bg: "bg-red-50 text-red-600", text: "text-red-600", border: "border-red-500" },
    info: { icon: Info, bg: "bg-white text-black", text: "text-black", border: "border-gray-200" },
  };

  const { icon: Icon, bg, text, border } = Config[toast.type] || Config.info;

  return (
    <div
      className={`pointer-events-auto flex items-start gap-4 p-5 shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] will-change-transform ${bg} ${text} ${border} ${
        isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-8 opacity-0 scale-95"
      }`}
    >
      <Icon className="w-[18px] h-[18px] shrink-0 mt-[2px] stroke-2" />
      <div className="flex-1 min-w-0 pr-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] leading-[1.6]">
          {toast.message}
        </p>
      </div>
      <button
        onClick={handleClose}
        className="shrink-0 p-1 -m-1 opacity-50 hover:opacity-100 transition-opacity"
        aria-label="Close"
      >
        <X className="w-4 h-4 stroke-[1.5]" />
      </button>
    </div>
  );
};
